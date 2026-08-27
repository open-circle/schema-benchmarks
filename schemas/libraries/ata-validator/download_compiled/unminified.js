//#region \0rolldown/runtime.js
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJSMin = (cb, mod) => () => (mod || (cb((mod = { exports: {} }).exports, mod), cb = null), mod.exports);
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
		key = keys[i];
		if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: ((k) => from[k]).bind(null, key),
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule || !__hasOwnProp.call(mod, "default") ? __defProp(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));
//#endregion
//#region ../node_modules/.pnpm/@ata-project+keywords@0.1.14_ata-validator@1.7.4_yaml@2.9.0_/node_modules/@ata-project/keywords/index.js
var require_keywords = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const CONSTRUCTORS = {
		Object,
		Array,
		Function,
		Number,
		String,
		Date,
		RegExp,
		Promise,
		Map,
		Set,
		WeakMap,
		WeakSet,
		Buffer: typeof Buffer !== "undefined" ? Buffer : void 0,
		Uint8Array,
		ArrayBuffer
	};
	function compileNode(schema) {
		const ops = [];
		if (!schema || typeof schema !== "object") return ops;
		if (schema.instanceof) {
			const types = Array.isArray(schema.instanceof) ? schema.instanceof : [schema.instanceof];
			const ctors = types.map((t) => CONSTRUCTORS[t]).filter(Boolean);
			if (ctors.length > 0) ops.push({
				type: "instanceof",
				ctors,
				types
			});
		}
		if (schema.typeof) {
			const types = Array.isArray(schema.typeof) ? schema.typeof : [schema.typeof];
			ops.push({
				type: "typeof",
				types
			});
		}
		if (schema.properties) for (const [key, prop] of Object.entries(schema.properties)) {
			const child = compileNode(prop);
			if (child.length > 0) ops.push({
				type: "prop",
				key,
				ops: child
			});
		}
		if (schema.items && typeof schema.items === "object" && !Array.isArray(schema.items)) {
			const item = compileNode(schema.items);
			if (item.length > 0) ops.push({
				type: "items",
				ops: item
			});
		}
		if (Array.isArray(schema.prefixItems)) {
			const tuple = schema.prefixItems.map(compileNode);
			if (tuple.some((o) => o.length > 0)) ops.push({
				type: "prefixItems",
				tuple
			});
		}
		return ops;
	}
	function makeError(keyword, path, types) {
		const expected = types.join(" | ");
		return {
			keyword,
			instancePath: path,
			schemaPath: "",
			params: { expected },
			message: "expected " + keyword + " " + expected
		};
	}
	function runOps(value, ops, path, errors) {
		for (let i = 0; i < ops.length; i++) {
			const op = ops[i];
			if (op.type === "instanceof") {
				let match = false;
				for (let j = 0; j < op.ctors.length; j++) if (value instanceof op.ctors[j]) {
					match = true;
					break;
				}
				if (!match) errors.push(makeError("instanceof", path, op.types));
			} else if (op.type === "typeof") {
				let match = false;
				for (let j = 0; j < op.types.length; j++) if (typeof value === op.types[j]) {
					match = true;
					break;
				}
				if (!match) errors.push(makeError("typeof", path, op.types));
			} else if (op.type === "prop") {
				if (value && typeof value === "object") {
					const v = value[op.key];
					if (v !== void 0) runOps(v, op.ops, path + "/" + op.key, errors);
				}
			} else if (op.type === "items") {
				if (Array.isArray(value)) for (let k = 0; k < value.length; k++) runOps(value[k], op.ops, path + "/" + k, errors);
			} else if (op.type === "prefixItems") {
				if (Array.isArray(value)) {
					const n = op.tuple.length < value.length ? op.tuple.length : value.length;
					for (let k = 0; k < n; k++) if (op.tuple[k].length > 0) runOps(value[k], op.tuple[k], path + "/" + k, errors);
				}
			}
		}
	}
	function withKeywords(validator) {
		const schema = validator._schemaObj;
		const ops = compileNode(schema);
		if (ops.length === 0) return validator;
		const inner = {};
		for (const name of [
			"validate",
			"isValidObject",
			"validateJSON",
			"isValidJSON",
			"validateAndParse"
		]) {
			if (typeof validator[name] !== "function") continue;
			try {
				validator[name](name === "validate" || name === "isValidObject" ? {} : "{}");
			} catch {
				continue;
			}
			inner[name] = validator[name];
		}
		function keywordErrors(data) {
			if (data === null || typeof data !== "object") return null;
			const errors = [];
			runOps(data, ops, "", errors);
			return errors.length > 0 ? errors : null;
		}
		validator.validate = function(data) {
			const errors = keywordErrors(data);
			if (errors) return {
				valid: false,
				errors
			};
			return inner.validate(data);
		};
		if (inner.isValidObject) validator.isValidObject = function(data) {
			if (keywordErrors(data)) return false;
			return inner.isValidObject(data);
		};
		if (inner.validateJSON) validator.validateJSON = function(jsonStr) {
			const res = inner.validateJSON(jsonStr);
			if (!res.valid) return res;
			let data;
			try {
				data = JSON.parse(jsonStr);
			} catch {
				return res;
			}
			const errors = keywordErrors(data);
			return errors ? {
				valid: false,
				errors
			} : res;
		};
		if (inner.isValidJSON) validator.isValidJSON = function(jsonStr) {
			if (!inner.isValidJSON(jsonStr)) return false;
			let data;
			try {
				data = JSON.parse(jsonStr);
			} catch {
				return true;
			}
			return !keywordErrors(data);
		};
		if (inner.validateAndParse) validator.validateAndParse = function(jsonStr) {
			const res = inner.validateAndParse(jsonStr);
			if (!res.valid) return res;
			const errors = keywordErrors(res.value);
			return errors ? {
				valid: false,
				value: res.value,
				errors
			} : res;
		};
		return validator;
	}
	withKeywords.CONSTRUCTORS = CONSTRUCTORS;
	module.exports = {
		withKeywords,
		CONSTRUCTORS
	};
}));
//#endregion
//#region ../node_modules/.pnpm/ata-validator@1.7.4_yaml@2.9.0/node_modules/ata-validator/lib/native-load.browser.js
var require_native_load_browser = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = function loadNative() {
		return null;
	};
}));
//#endregion
//#region ../node_modules/.pnpm/ata-validator@1.7.4_yaml@2.9.0/node_modules/ata-validator/lib/error-codes.js
var require_error_codes = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const CODES = Object.freeze({
		ATA1001: {
			keyword: "type",
			category: "type",
			headline: "value has wrong type"
		},
		ATA1002: {
			keyword: "type",
			category: "type",
			headline: "value is not an object"
		},
		ATA2001: {
			keyword: "minLength",
			category: "constraint",
			headline: "string shorter than minLength"
		},
		ATA2002: {
			keyword: "maxLength",
			category: "constraint",
			headline: "string longer than maxLength"
		},
		ATA2003: {
			keyword: "minimum",
			category: "constraint",
			headline: "number below minimum"
		},
		ATA2004: {
			keyword: "maximum",
			category: "constraint",
			headline: "number above maximum"
		},
		ATA2005: {
			keyword: "exclusiveMinimum",
			category: "constraint",
			headline: "number not above exclusiveMinimum"
		},
		ATA2006: {
			keyword: "exclusiveMaximum",
			category: "constraint",
			headline: "number not below exclusiveMaximum"
		},
		ATA2007: {
			keyword: "multipleOf",
			category: "constraint",
			headline: "number not a multiple of expected divisor"
		},
		ATA2008: {
			keyword: "minItems",
			category: "constraint",
			headline: "array shorter than minItems"
		},
		ATA2009: {
			keyword: "maxItems",
			category: "constraint",
			headline: "array longer than maxItems"
		},
		ATA2010: {
			keyword: "minProperties",
			category: "constraint",
			headline: "object has fewer than minProperties"
		},
		ATA2011: {
			keyword: "maxProperties",
			category: "constraint",
			headline: "object has more than maxProperties"
		},
		ATA2012: {
			keyword: "uniqueItems",
			category: "constraint",
			headline: "array has duplicate items"
		},
		ATA2013: {
			keyword: "pattern",
			category: "constraint",
			headline: "string does not match pattern"
		},
		ATA3001: {
			keyword: "format",
			format: "email",
			category: "format",
			headline: "value does not match format \"email\""
		},
		ATA3002: {
			keyword: "format",
			format: "date",
			category: "format",
			headline: "value does not match format \"date\""
		},
		ATA3003: {
			keyword: "format",
			format: "date-time",
			category: "format",
			headline: "value does not match format \"date-time\""
		},
		ATA3004: {
			keyword: "format",
			format: "time",
			category: "format",
			headline: "value does not match format \"time\""
		},
		ATA3005: {
			keyword: "format",
			format: "uri",
			category: "format",
			headline: "value does not match format \"uri\""
		},
		ATA3006: {
			keyword: "format",
			format: "uri-reference",
			category: "format",
			headline: "value does not match format \"uri-reference\""
		},
		ATA3007: {
			keyword: "format",
			format: "ipv4",
			category: "format",
			headline: "value does not match format \"ipv4\""
		},
		ATA3008: {
			keyword: "format",
			format: "ipv6",
			category: "format",
			headline: "value does not match format \"ipv6\""
		},
		ATA3009: {
			keyword: "format",
			format: "uuid",
			category: "format",
			headline: "value does not match format \"uuid\""
		},
		ATA3010: {
			keyword: "format",
			format: "hostname",
			category: "format",
			headline: "value does not match format \"hostname\""
		},
		ATA3099: {
			keyword: "format",
			category: "format",
			headline: "value does not match user-defined format"
		},
		ATA4001: {
			keyword: "oneOf",
			category: "composition",
			headline: "value matched 0 of N oneOf variants"
		},
		ATA4002: {
			keyword: "oneOf",
			category: "composition",
			headline: "value matched more than one oneOf variant"
		},
		ATA4003: {
			keyword: "anyOf",
			category: "composition",
			headline: "value matched none of the anyOf variants"
		},
		ATA4004: {
			keyword: "allOf",
			category: "composition",
			headline: "value failed one or more allOf branches"
		},
		ATA4005: {
			keyword: "not",
			category: "composition",
			headline: "value matched a forbidden schema"
		},
		ATA4006: {
			keyword: "if",
			category: "composition",
			headline: "value violated then/else branch"
		},
		ATA5001: {
			keyword: "$ref",
			category: "ref",
			headline: "$ref could not be resolved"
		},
		ATA5002: {
			keyword: "$ref",
			category: "ref",
			headline: "recursive $ref cycle detected at validate time"
		},
		ATA6001: {
			keyword: "enum",
			category: "enum",
			headline: "value is not one of the allowed enum values"
		},
		ATA6002: {
			keyword: "const",
			category: "enum",
			headline: "value does not equal const"
		},
		ATA7001: {
			keyword: "required",
			category: "shape",
			headline: "object missing required property"
		},
		ATA7002: {
			keyword: "additionalProperties",
			category: "shape",
			headline: "object has property not allowed by schema"
		},
		ATA7003: {
			keyword: "unevaluatedProperties",
			category: "shape",
			headline: "object has unevaluated property"
		},
		ATA7004: {
			keyword: "unevaluatedItems",
			category: "shape",
			headline: "array has unevaluated items"
		},
		ATA7005: {
			keyword: "dependentRequired",
			category: "shape",
			headline: "dependentRequired property missing"
		},
		ATA7006: {
			keyword: "propertyNames",
			category: "shape",
			headline: "property name violates schema"
		},
		ATA7007: {
			keyword: "contains",
			category: "shape",
			headline: "array does not contain a matching item"
		},
		ATA9000: {
			keyword: "__abort_early__",
			category: "system",
			headline: "validation failed (abortEarly)"
		},
		ATA9001: {
			keyword: "__parse__",
			category: "system",
			headline: "input is not valid JSON"
		},
		ATA9002: {
			keyword: "__compile__",
			category: "system",
			headline: "schema failed to compile"
		}
	});
	function get(code) {
		return CODES[code];
	}
	function all() {
		return Object.keys(CODES).sort();
	}
	const BY_KEYWORD = /* @__PURE__ */ new Map();
	const BY_FORMAT = /* @__PURE__ */ new Map();
	for (const c of Object.keys(CODES).sort()) {
		const meta = CODES[c];
		if (!BY_KEYWORD.has(meta.keyword)) BY_KEYWORD.set(meta.keyword, c);
		if (meta.keyword === "format" && meta.format && !BY_FORMAT.has(meta.format)) BY_FORMAT.set(meta.format, c);
	}
	function codeFor(keyword, format) {
		if (keyword === "format" && format) {
			const hit = BY_FORMAT.get(format);
			return hit === void 0 ? "ATA3099" : hit;
		}
		const hit = BY_KEYWORD.get(keyword);
		return hit === void 0 ? null : hit;
	}
	module.exports = {
		CODES,
		get,
		all,
		codeFor
	};
}));
//#endregion
//#region ../node_modules/.pnpm/ata-validator@1.7.4_yaml@2.9.0/node_modules/ata-validator/lib/safe-regex.js
var require_safe_regex = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const WS = [
		[9, 13],
		[32, 32],
		[160, 160]
	];
	const DIGIT = [[48, 57]];
	const WORD = [
		[48, 57],
		[65, 90],
		[97, 122],
		[95, 95]
	];
	function parse(src) {
		let i = 0;
		const len = src.length;
		const peek = () => src[i];
		const eof = () => i >= len;
		function parseAlt() {
			const opts = [parseConcat()];
			while (!eof() && peek() === "|") {
				i++;
				opts.push(parseConcat());
			}
			return opts.length === 1 ? opts[0] : {
				t: "alt",
				opts
			};
		}
		function parseConcat() {
			const parts = [];
			while (!eof() && peek() !== "|" && peek() !== ")") parts.push(parseRepeat());
			if (parts.length === 0) return { t: "empty" };
			return parts.length === 1 ? parts[0] : {
				t: "concat",
				parts
			};
		}
		function parseRepeat() {
			let node = parseAtom();
			while (!eof()) {
				const ch = peek();
				if (ch === "*") {
					i++;
					node = {
						t: "star",
						child: node
					};
				} else if (ch === "+") {
					i++;
					node = {
						t: "plus",
						child: node
					};
				} else if (ch === "?") {
					i++;
					node = {
						t: "quest",
						child: node
					};
				} else if (ch === "{") {
					const saved = i;
					const q = tryQuantifier();
					if (!q) {
						i = saved;
						break;
					}
					node = {
						t: "repeat",
						child: node,
						min: q.min,
						max: q.max
					};
				} else break;
				if (!eof() && peek() === "?") i++;
			}
			return node;
		}
		function tryQuantifier() {
			i++;
			let min = "";
			while (!eof() && /[0-9]/.test(peek())) {
				min += peek();
				i++;
			}
			if (min === "") return null;
			let max;
			if (peek() === "}") {
				i++;
				return {
					min: +min,
					max: +min
				};
			}
			if (peek() === ",") {
				i++;
				let m = "";
				while (!eof() && /[0-9]/.test(peek())) {
					m += peek();
					i++;
				}
				if (peek() !== "}") return null;
				i++;
				max = m === "" ? Infinity : +m;
				return {
					min: +min,
					max
				};
			}
			return null;
		}
		function parseAtom() {
			const ch = peek();
			if (ch === "(") {
				i++;
				if (src[i] === "?") {
					if (src[i + 1] === ":") i += 2;
					else throw new Error("unsupported group (lookaround/named) in pattern");
				}
				const child = parseAlt();
				if (peek() !== ")") throw new Error("unbalanced ( in pattern");
				i++;
				return {
					t: "group",
					child
				};
			}
			if (ch === "[") return parseClass();
			if (ch === ".") {
				i++;
				return { t: "any" };
			}
			if (ch === "^") {
				i++;
				return { t: "bol" };
			}
			if (ch === "$") {
				i++;
				return { t: "eol" };
			}
			if (ch === "\\") return parseEscape(false);
			if (ch === ")" || ch === "|") return { t: "empty" };
			i++;
			return {
				t: "char",
				c: ch.charCodeAt(0)
			};
		}
		function parseClass() {
			i++;
			let neg = false;
			if (peek() === "^") {
				neg = true;
				i++;
			}
			const ranges = [];
			while (!eof() && peek() !== "]") {
				let lo;
				if (peek() === "\\") {
					const esc = parseEscape(true);
					if (esc.t === "classpart") {
						for (const r of esc.ranges) ranges.push(r);
						continue;
					}
					lo = esc.c;
				} else {
					lo = peek().charCodeAt(0);
					i++;
				}
				if (peek() === "-" && src[i + 1] !== "]" && i + 1 < len) {
					i++;
					let hi;
					if (peek() === "\\") hi = parseEscape(true).c;
					else {
						hi = peek().charCodeAt(0);
						i++;
					}
					ranges.push([lo, hi]);
				} else ranges.push([lo, lo]);
			}
			if (peek() !== "]") throw new Error("unbalanced [ in pattern");
			i++;
			return {
				t: "class",
				neg,
				ranges
			};
		}
		function parseEscape(inClass) {
			i++;
			if (eof()) throw new Error("trailing backslash in pattern");
			const ch = peek();
			i++;
			switch (ch) {
				case "d": return inClass ? {
					t: "classpart",
					ranges: DIGIT
				} : {
					t: "class",
					neg: false,
					ranges: DIGIT
				};
				case "w": return inClass ? {
					t: "classpart",
					ranges: WORD
				} : {
					t: "class",
					neg: false,
					ranges: WORD
				};
				case "s": return inClass ? {
					t: "classpart",
					ranges: WS
				} : {
					t: "class",
					neg: false,
					ranges: WS
				};
				case "D":
					if (inClass) throw new Error("\\D inside a class is not supported");
					return {
						t: "class",
						neg: true,
						ranges: DIGIT
					};
				case "W":
					if (inClass) throw new Error("\\W inside a class is not supported");
					return {
						t: "class",
						neg: true,
						ranges: WORD
					};
				case "S":
					if (inClass) throw new Error("\\S inside a class is not supported");
					return {
						t: "class",
						neg: true,
						ranges: WS
					};
				case "n": return {
					t: "char",
					c: 10
				};
				case "r": return {
					t: "char",
					c: 13
				};
				case "t": return {
					t: "char",
					c: 9
				};
				case "f": return {
					t: "char",
					c: 12
				};
				case "v": return {
					t: "char",
					c: 11
				};
				case "0": return {
					t: "char",
					c: 0
				};
				case "x": {
					const h = src.slice(i, i + 2);
					i += 2;
					return {
						t: "char",
						c: parseInt(h, 16)
					};
				}
				case "u": {
					const h = src.slice(i, i + 4);
					i += 4;
					return {
						t: "char",
						c: parseInt(h, 16)
					};
				}
				case "b":
					if (inClass) return {
						t: "char",
						c: 8
					};
					throw new Error("\\b word boundary is not supported");
				default:
					if (/[1-9]/.test(ch)) throw new Error("backreferences are not supported in pattern");
					return {
						t: "char",
						c: ch.charCodeAt(0)
					};
			}
		}
		const ast = parseAlt();
		if (!eof()) throw new Error("unexpected \"" + peek() + "\" in pattern");
		return ast;
	}
	function compileProg(ast) {
		const prog = [];
		const emit = (op, extra) => {
			const idx = prog.length;
			prog.push(Object.assign({ op }, extra));
			return idx;
		};
		function rec(n) {
			switch (n.t) {
				case "empty": break;
				case "char":
					emit("char", { c: n.c });
					break;
				case "any":
					emit("any");
					break;
				case "class":
					emit("class", {
						neg: n.neg,
						ranges: n.ranges
					});
					break;
				case "bol":
					emit("bol");
					break;
				case "eol":
					emit("eol");
					break;
				case "group":
					rec(n.child);
					break;
				case "concat":
					for (const p of n.parts) rec(p);
					break;
				case "alt": {
					const jmps = [];
					for (let k = 0; k < n.opts.length; k++) if (k < n.opts.length - 1) {
						const sp = emit("split", {
							x: 0,
							y: 0
						});
						prog[sp].x = prog.length;
						rec(n.opts[k]);
						jmps.push(emit("jmp", { x: 0 }));
						prog[sp].y = prog.length;
					} else rec(n.opts[k]);
					for (const j of jmps) prog[j].x = prog.length;
					break;
				}
				case "star": {
					const sp = emit("split", {
						x: 0,
						y: 0
					});
					prog[sp].x = prog.length;
					rec(n.child);
					emit("jmp", { x: sp });
					prog[sp].y = prog.length;
					break;
				}
				case "plus": {
					const start = prog.length;
					rec(n.child);
					const sp = emit("split", {
						x: start,
						y: 0
					});
					prog[sp].y = prog.length;
					break;
				}
				case "quest": {
					const sp = emit("split", {
						x: 0,
						y: 0
					});
					prog[sp].x = prog.length;
					rec(n.child);
					prog[sp].y = prog.length;
					break;
				}
				case "repeat":
					for (let k = 0; k < n.min; k++) rec(n.child);
					if (n.max === Infinity) {
						if (n.min === 0) rec({
							t: "star",
							child: n.child
						});
						else rec({
							t: "star",
							child: n.child
						});
					} else for (let k = 0; k < n.max - n.min; k++) rec({
						t: "quest",
						child: n.child
					});
			}
		}
		rec(ast);
		emit("match");
		return prog;
	}
	const OP_CHAR = 0;
	const OP_ANY = 1;
	const OP_CLASS = 2;
	const OP_SPLIT = 3;
	const OP_JMP = 4;
	const OP_BOL = 5;
	const OP_EOL = 6;
	const OP_MATCH = 7;
	function classMatcher(instr) {
		const bits = /* @__PURE__ */ new Uint8Array(128);
		const r = instr.ranges;
		for (let k = 0; k < r.length; k++) {
			const hi = Math.min(r[k][1], 127);
			for (let c = r[k][0]; c <= hi; c++) bits[c] = 1;
		}
		return {
			bits,
			ranges: r,
			neg: instr.neg
		};
	}
	function matchClass(cls, c) {
		let inside;
		if (c < 128) inside = cls.bits[c] === 1;
		else {
			inside = false;
			const r = cls.ranges;
			for (let k = 0; k < r.length; k++) if (c >= r[k][0] && c <= r[k][1]) {
				inside = true;
				break;
			}
		}
		return cls.neg ? !inside : inside;
	}
	function makeRunner(prog) {
		const n = prog.length;
		const ops = new Uint8Array(n);
		const xs = new Int32Array(n);
		const ys = new Int32Array(n);
		const cs = new Int32Array(n);
		const classes = new Array(n);
		for (let i = 0; i < n; i++) {
			const I = prog[i];
			switch (I.op) {
				case "char":
					ops[i] = OP_CHAR;
					cs[i] = I.c;
					break;
				case "any":
					ops[i] = OP_ANY;
					break;
				case "class":
					ops[i] = OP_CLASS;
					classes[i] = classMatcher(I);
					break;
				case "split":
					ops[i] = OP_SPLIT;
					xs[i] = I.x;
					ys[i] = I.y;
					break;
				case "jmp":
					ops[i] = OP_JMP;
					xs[i] = I.x;
					break;
				case "bol":
					ops[i] = OP_BOL;
					break;
				case "eol":
					ops[i] = OP_EOL;
					break;
				case "match": ops[i] = OP_MATCH;
			}
		}
		const lastGen = new Int32Array(n).fill(-1);
		let gen = 0;
		const stack = new Int32Array(2 * n + 2);
		let clist = new Int32Array(n);
		let nlist = new Int32Array(n);
		let clen = 0;
		let nlen = 0;
		function addThread(list, len0, pc, pos, len) {
			if (ops[pc] <= OP_CLASS || ops[pc] === OP_MATCH) {
				if (lastGen[pc] === gen) return len0;
				lastGen[pc] = gen;
				list[len0] = pc;
				return len0 + 1;
			}
			let sp = 0;
			stack[sp++] = pc;
			let count = len0;
			while (sp > 0) {
				const p = stack[--sp];
				if (lastGen[p] === gen) continue;
				lastGen[p] = gen;
				switch (ops[p]) {
					case OP_JMP:
						stack[sp++] = xs[p];
						break;
					case OP_SPLIT:
						stack[sp++] = ys[p];
						stack[sp++] = xs[p];
						break;
					case OP_BOL:
						if (pos === 0) stack[sp++] = p + 1;
						break;
					case OP_EOL:
						if (pos === len) stack[sp++] = p + 1;
						break;
					default: list[count++] = p;
				}
			}
			return count;
		}
		gen++;
		const anchored = addThread(nlist, 0, 0, 1, 1) === 0;
		function testNFA(s) {
			const len = s.length;
			gen++;
			clen = addThread(clist, 0, 0, 0, len);
			for (let pos = 0; pos <= len; pos++) {
				const c = pos < len ? s.charCodeAt(pos) : -1;
				gen++;
				nlen = 0;
				for (let k = 0; k < clen; k++) {
					const pc = clist[k];
					switch (ops[pc]) {
						case OP_MATCH: return true;
						case OP_CHAR:
							if (c === cs[pc]) nlen = addThread(nlist, nlen, pc + 1, pos + 1, len);
							break;
						case OP_ANY:
							if (c !== -1 && c !== 10) nlen = addThread(nlist, nlen, pc + 1, pos + 1, len);
							break;
						case OP_CLASS: if (c !== -1 && matchClass(classes[pc], c)) nlen = addThread(nlist, nlen, pc + 1, pos + 1, len);
					}
				}
				if (pos < len) {
					if (!anchored) nlen = addThread(nlist, nlen, 0, pos + 1, len);
					else if (nlen === 0) return false;
				}
				const tmp = clist;
				clist = nlist;
				nlist = tmp;
				clen = nlen;
			}
			return false;
		}
		const MAX_STATES = 256;
		const states = [];
		const stateIds = /* @__PURE__ */ new Map();
		let overflow = false;
		function closure(list, count, pc, atStart, atEnd) {
			let sp = 0;
			stack[sp++] = pc;
			while (sp > 0) {
				const p = stack[--sp];
				if (lastGen[p] === gen) continue;
				lastGen[p] = gen;
				switch (ops[p]) {
					case OP_JMP:
						stack[sp++] = xs[p];
						break;
					case OP_SPLIT:
						stack[sp++] = ys[p];
						stack[sp++] = xs[p];
						break;
					case OP_BOL:
						if (atStart) stack[sp++] = p + 1;
						break;
					case OP_EOL:
						if (atEnd) stack[sp++] = p + 1;
						break;
					default: list[count++] = p;
				}
			}
			return count;
		}
		function internState(list, count) {
			const pcs = Array.from(list.subarray(0, count)).sort((a, b) => a - b);
			const key = pcs.join(",");
			let id = stateIds.get(key);
			if (id !== void 0) return id;
			if (states.length >= MAX_STATES) {
				overflow = true;
				return -1;
			}
			id = states.length;
			let isMatch = false;
			for (let k = 0; k < pcs.length; k++) if (ops[pcs[k]] === OP_MATCH) {
				isMatch = true;
				break;
			}
			states.push({
				pcs: Int32Array.from(pcs),
				isMatch,
				next: (/* @__PURE__ */ new Int32Array(128)).fill(-2),
				nextEnd: (/* @__PURE__ */ new Int32Array(128)).fill(-2)
			});
			stateIds.set(key, id);
			return id;
		}
		function step(state, c, atEnd) {
			gen++;
			let count = 0;
			const pcs = state.pcs;
			for (let k = 0; k < pcs.length; k++) {
				const pc = pcs[k];
				switch (ops[pc]) {
					case OP_CHAR:
						if (c === cs[pc]) count = closure(nlist, count, pc + 1, false, atEnd);
						break;
					case OP_ANY:
						if (c !== 10) count = closure(nlist, count, pc + 1, false, atEnd);
						break;
					case OP_CLASS: if (matchClass(classes[pc], c)) count = closure(nlist, count, pc + 1, false, atEnd);
				}
			}
			if (!anchored) count = closure(nlist, count, 0, false, atEnd);
			return internState(nlist, count);
		}
		let startEmpty = -2;
		let startNonEmpty = -2;
		function startState(atEnd) {
			gen++;
			const count = closure(nlist, 0, 0, true, atEnd);
			return internState(nlist, count);
		}
		function testDFA(s) {
			const len = s.length;
			let id;
			if (len === 0) {
				if (startEmpty === -2) startEmpty = startState(true);
				id = startEmpty;
			} else {
				if (startNonEmpty === -2) startNonEmpty = startState(false);
				id = startNonEmpty;
			}
			if (id < 0) return testNFA(s);
			let state = states[id];
			for (let pos = 0; pos < len; pos++) {
				if (state.isMatch) return true;
				const c = s.charCodeAt(pos);
				const atEnd = pos + 1 === len;
				let nid;
				if (c < 128) {
					const table = atEnd ? state.nextEnd : state.next;
					nid = table[c];
					if (nid === -2) {
						nid = step(state, c, atEnd);
						table[c] = nid;
					}
				} else nid = step(state, c, atEnd);
				if (nid < 0) return testNFA(s);
				state = states[nid];
				if (anchored && state.pcs.length === 0) return false;
			}
			return state.isMatch;
		}
		return function test(s) {
			return overflow ? testNFA(s) : testDFA(s);
		};
	}
	function compileSafe(pattern) {
		return {
			test: makeRunner(compileProg(parse(pattern))),
			source: pattern,
			__ataSafe: true
		};
	}
	function patternIsSafe(src) {
		try {
			compileSafe(src);
			return true;
		} catch {
			return false;
		}
	}
	module.exports = {
		compileSafe,
		patternIsSafe
	};
}));
//#endregion
//#region ../node_modules/.pnpm/ata-validator@1.7.4_yaml@2.9.0/node_modules/ata-validator/lib/js-compiler.js
var require_js_compiler = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const DEQ_HELPER = "function _deq(a,b){if(a===b)return true;if(a===null||b===null||typeof a!=='object'||typeof b!=='object')return false;var aa=Array.isArray(a);if(aa!==Array.isArray(b))return false;var i;if(aa){if(a.length!==b.length)return false;for(i=0;i<a.length;i++)if(!_deq(a[i],b[i]))return false;return true}var ka=Object.keys(a);if(ka.length!==Object.keys(b).length)return false;for(i=0;i<ka.length;i++){var k=ka[i];if(!Object.prototype.hasOwnProperty.call(b,k)||!_deq(a[k],b[k]))return false}return true}";
	const UQ_HELPERS = "function _cn(x){if(x===null||typeof x!=='object')return typeof x+':'+x;if(Array.isArray(x))return'['+x.map(_cn).join(',')+']';return'{'+Object.keys(x).sort().map(function(k){return JSON.stringify(k)+':'+_cn(x[k])}).join(',')+'}'}function _uq(a){var n=a.length,i,k;if(n<2)return true;if(n<=12){for(i=1;i<n;i++)for(k=0;k<i;k++)if(_deq(a[i],a[k]))return false;return true}var s=new Set();for(i=0;i<n;i++){var x=a[i];if(x!==null&&typeof x==='object')break;if(s.has(x))return false;s.add(x)}if(i===n)return true;s=new Set();for(i=0;i<n;i++){var c=_cn(a[i]);if(s.has(c))return false;s.add(c)}return true}";
	function hoistOnce(ctx, key, code) {
		if (ctx[key]) return;
		ctx[key] = true;
		if (ctx.preamble) ctx.preamble.push(code);
		else if (ctx.helperCode) ctx.helperCode.push(code);
	}
	function emitDeq(ctx) {
		hoistOnce(ctx, "_deqHoisted", DEQ_HELPER);
		return "_deq";
	}
	function emitUq(ctx) {
		emitDeq(ctx);
		hoistOnce(ctx, "_uqHoisted", UQ_HELPERS);
		return "_uq";
	}
	function emitConstant(ctx, value) {
		if (!ctx._constPool) ctx._constPool = /* @__PURE__ */ new Map();
		const json = JSON.stringify(value);
		let name = ctx._constPool.get(json);
		if (name === void 0) {
			name = "_kv" + ctx._constPool.size;
			ctx._constPool.set(json, name);
			const decl = `const ${name}=JSON.parse(${JSON.stringify(json)})`;
			if (ctx.preamble) ctx.preamble.push(decl);
			else if (ctx.helperCode) ctx.helperCode.push(decl);
		}
		return name;
	}
	function enumCondition(ctx, vals, v) {
		const parts = [];
		const prims = vals.filter((x) => x === null || typeof x !== "object");
		const objs = vals.filter((x) => x !== null && typeof x === "object");
		if (prims.length) parts.push(prims.map((x) => `${v}===${JSON.stringify(x)}`).join("||"));
		if (objs.length) {
			const deq = emitDeq(ctx);
			parts.push(objs.map((o) => `${deq}(${v},${emitConstant(ctx, o)})`).join("||"));
		}
		return parts.filter(Boolean).join("||") || "false";
	}
	const { codeFor } = require_error_codes();
	const { compileSafe, patternIsSafe } = require_safe_regex();
	function safeReClosure(ctx, src) {
		if (patternIsSafe(src)) {
			ctx.usesSafeRe = true;
			return compileSafe(src);
		}
		return new RegExp(src);
	}
	const DOC_BASE = "https://ata-validator.com/e/";
	function buildErrorLiteral(opts) {
		const { keyword, format, schemaPath, sourceMap } = opts;
		let code = keyword === "format" && format ? codeFor("format", format) : codeFor(keyword);
		if (!code) code = "ATA9001";
		const docUrl = DOC_BASE + code;
		let frame = "";
		if (sourceMap && sourceMap.file && sourceMap.map) {
			const ptr = schemaPath && schemaPath.charAt(0) === "#" ? schemaPath.slice(1) : schemaPath || "";
			let hit = sourceMap.map[ptr + "#key"];
			if (!hit) hit = sourceMap.map[ptr];
			if (hit) {
				const line = Array.isArray(hit) ? hit[0] : hit.line;
				const col = Array.isArray(hit) ? hit[1] : hit.col;
				const text = Array.isArray(hit) ? hit[2] : hit.text;
				frame = ",schemaSource:Object.freeze({file:" + JSON.stringify(sourceMap.file) + ",line:" + line + ",col:" + col + ",text:" + JSON.stringify(text) + "})";
			}
		}
		return {
			codeStr: code,
			docUrl,
			frame
		};
	}
	function _cpLen(s) {
		const len = s.length;
		for (let i = 0; i < len; i++) if (s.charCodeAt(i) - 55296 >>> 0 < 1024) {
			let n = 0;
			for (const _ of s) n++;
			return n;
		}
		return len;
	}
	const AJV_MESSAGES = {
		type: (p) => `must be ${p.type}`,
		required: (p) => `must have required property '${p.missingProperty}'`,
		additionalProperties: () => "must NOT have additional properties",
		enum: () => "must be equal to one of the allowed values",
		const: () => "must be equal to constant",
		minimum: (p) => `must be >= ${p.limit}`,
		maximum: (p) => `must be <= ${p.limit}`,
		exclusiveMinimum: (p) => `must be > ${p.limit}`,
		exclusiveMaximum: (p) => `must be < ${p.limit}`,
		minLength: (p) => `must NOT have fewer than ${p.limit} characters`,
		maxLength: (p) => `must NOT have more than ${p.limit} characters`,
		pattern: (p) => `must match pattern "${p.pattern}"`,
		format: (p) => `must match format "${p.format}"`,
		minItems: (p) => `must NOT have fewer than ${p.limit} items`,
		maxItems: (p) => `must NOT have more than ${p.limit} items`,
		uniqueItems: (p) => `must NOT have duplicate items (items ## ${p.j} and ${p.i} are identical)`,
		minProperties: (p) => `must NOT have fewer than ${p.limit} properties`,
		maxProperties: (p) => `must NOT have more than ${p.limit} properties`,
		multipleOf: (p) => `must be multiple of ${p.multipleOf}`,
		oneOf: () => "must match exactly one schema in oneOf",
		anyOf: () => "must match a schema in anyOf",
		allOf: () => "must match all schemas in allOf",
		not: () => "must NOT be valid",
		if: (p) => `must match "${p.failingKeyword}" schema`
	};
	function compileToJS(schema, defs, schemaMap) {
		if (typeof schema === "boolean") return schema ? () => true : () => false;
		if (typeof schema !== "object" || schema === null) return null;
		if (!defs && !codegenSafe(schema, schemaMap)) {
			const str = JSON.stringify(schema);
			const hasDynamic = str.includes("\"$dynamicRef\"") || str.includes("\"$dynamicAnchor\"");
			if (!hasDynamic && !str.includes("\"$anchor\"")) return null;
			if (!hasDynamic && hasNestedIdScope(schema)) return null;
		}
		if (!defs && needsBaseTracking(schema, schemaMap, /* @__PURE__ */ new Set())) return null;
		if (!defs && externalDocsNeedInterpreter(schema, schemaMap)) return null;
		if (!defs) {
			const str = JSON.stringify(schema);
			if (str.includes("\"unevaluatedProperties\"") || str.includes("\"unevaluatedItems\"")) return null;
		}
		const rootDefs = defs || collectDefs(schema);
		if (schema.patternProperties || schema.dependentSchemas || schema.propertyDependencies || schema.propertyNames) return null;
		const checks = [];
		if (schema.$ref) {
			const refFn = resolveRef(schema.$ref, rootDefs, schemaMap);
			if (!refFn) return null;
			checks.push(refFn);
		}
		if (schema.$dynamicRef) {
			const ref = schema.$dynamicRef;
			const anchorName = ref.startsWith("#") ? ref : "#" + ref;
			if (rootDefs && rootDefs[anchorName]) {
				const entry = rootDefs[anchorName];
				checks.push((d) => {
					const fn = entry.fn;
					return fn ? fn(d) : true;
				});
			} else {
				const m = ref.match(/^#\/(?:\$defs|definitions)\/(.+)$/);
				if (m && rootDefs && rootDefs[m[1]]) {
					const entry = rootDefs[m[1]];
					checks.push((d) => {
						const fn = entry.fn;
						return fn ? fn(d) : true;
					});
				}
			}
		}
		if (schema.type) {
			const types = Array.isArray(schema.type) ? schema.type : [schema.type];
			checks.push(buildTypeCheck(types));
		}
		if (schema.enum) {
			const vals = schema.enum;
			const primitives = vals.filter((v) => v === null || typeof v !== "object");
			const objects = vals.filter((v) => v !== null && typeof v === "object");
			const primSet = new Set(primitives.map((v) => v === null ? "null" : typeof v === "string" ? "s:" + v : "n:" + v));
			const objStrs = objects.map((v) => _canonical(v));
			checks.push((d) => {
				const key = d === null ? "null" : typeof d === "string" ? "s:" + d : typeof d === "number" || typeof d === "boolean" ? "n:" + d : null;
				if (key !== null && primSet.has(key)) return true;
				const ds = _canonical(d);
				for (let i = 0; i < objStrs.length; i++) if (ds === objStrs[i]) return true;
				for (let i = 0; i < primitives.length; i++) if (d === primitives[i]) return true;
				return false;
			});
		}
		if (schema.const !== void 0) {
			const cv = schema.const;
			if (cv === null || typeof cv !== "object") checks.push((d) => d === cv);
			else {
				const cs = _canonical(cv);
				checks.push((d) => _canonical(d) === cs);
			}
		}
		if (schema.required && Array.isArray(schema.required)) for (const key of schema.required) checks.push((d) => typeof d !== "object" || d === null || Array.isArray(d) || d[key] !== void 0);
		if (schema.properties) for (const [key, prop] of Object.entries(schema.properties)) {
			const propCheck = compileToJS(prop, rootDefs);
			if (!propCheck) return null;
			checks.push((d) => {
				if (typeof d !== "object" || d === null || !(key in d)) return true;
				return propCheck(d[key]);
			});
		}
		if (schema.additionalProperties !== void 0) {
			if (schema.additionalProperties === false) {
				const allowed = new Set(Object.keys(schema.properties || {}));
				checks.push((d) => {
					if (typeof d !== "object" || d === null || Array.isArray(d)) return true;
					const keys = Object.keys(d);
					for (let i = 0; i < keys.length; i++) if (!allowed.has(keys[i])) return false;
					return true;
				});
			} else if (typeof schema.additionalProperties === "object") {
				const apCheck = compileToJS(schema.additionalProperties, rootDefs);
				if (!apCheck) return null;
				const known = new Set(Object.keys(schema.properties || {}));
				checks.push((d) => {
					if (typeof d !== "object" || d === null || Array.isArray(d)) return true;
					const keys = Object.keys(d);
					for (let i = 0; i < keys.length; i++) if (!known.has(keys[i]) && !apCheck(d[keys[i]])) return false;
					return true;
				});
			}
		}
		if (schema.dependentRequired) for (const [key, deps] of Object.entries(schema.dependentRequired)) checks.push((d) => {
			if (typeof d !== "object" || d === null || !(key in d)) return true;
			for (let i = 0; i < deps.length; i++) if (!(deps[i] in d)) return false;
			return true;
		});
		if (schema.items) {
			const itemCheck = compileToJS(schema.items, rootDefs);
			if (!itemCheck) return null;
			const start = Array.isArray(schema.prefixItems) ? schema.prefixItems.length : 0;
			checks.push((d) => {
				if (!Array.isArray(d)) return true;
				for (let i = start; i < d.length; i++) if (!itemCheck(d[i])) return false;
				return true;
			});
		}
		if (schema.prefixItems) {
			const prefixChecks = [];
			for (const ps of schema.prefixItems) {
				const pc = compileToJS(ps, rootDefs);
				if (!pc) return null;
				prefixChecks.push(pc);
			}
			checks.push((d) => {
				if (!Array.isArray(d)) return true;
				for (let i = 0; i < prefixChecks.length && i < d.length; i++) if (!prefixChecks[i](d[i])) return false;
				return true;
			});
		}
		if (schema.contains) {
			const containsCheck = compileToJS(schema.contains, rootDefs);
			if (!containsCheck) return null;
			const minC = schema.minContains !== void 0 ? schema.minContains : 1;
			const maxC = schema.maxContains !== void 0 ? schema.maxContains : Infinity;
			checks.push((d) => {
				if (!Array.isArray(d)) return true;
				let count = 0;
				for (let i = 0; i < d.length; i++) if (containsCheck(d[i])) count++;
				return count >= minC && count <= maxC;
			});
		}
		if (schema.uniqueItems) {
			const canonical = (x) => {
				if (x === null || typeof x !== "object") return typeof x + ":" + x;
				if (Array.isArray(x)) return "[" + x.map(canonical).join(",") + "]";
				return "{" + Object.keys(x).sort().map((k) => JSON.stringify(k) + ":" + canonical(x[k])).join(",") + "}";
			};
			checks.push((d) => {
				if (!Array.isArray(d)) return true;
				const seen = /* @__PURE__ */ new Set();
				for (let i = 0; i < d.length; i++) {
					const key = canonical(d[i]);
					if (seen.has(key)) return false;
					seen.add(key);
				}
				return true;
			});
		}
		if (schema.minimum !== void 0) {
			const min = schema.minimum;
			checks.push((d) => typeof d !== "number" || d >= min);
		}
		if (schema.maximum !== void 0) {
			const max = schema.maximum;
			checks.push((d) => typeof d !== "number" || d <= max);
		}
		if (schema.exclusiveMinimum !== void 0) {
			const min = schema.exclusiveMinimum;
			checks.push((d) => typeof d !== "number" || d > min);
		}
		if (schema.exclusiveMaximum !== void 0) {
			const max = schema.exclusiveMaximum;
			checks.push((d) => typeof d !== "number" || d < max);
		}
		if (schema.multipleOf !== void 0) {
			const div = schema.multipleOf;
			checks.push((d) => {
				if (typeof d !== "number") return true;
				const r = d % div;
				return Math.abs(r) <= 1e-8 || Math.abs(r - div) <= 1e-8;
			});
		}
		if (schema.minLength !== void 0) {
			const min = schema.minLength;
			const min2 = min * 2;
			checks.push((d) => typeof d !== "string" || d.length >= min2 || d.length >= min && _cpLen(d) >= min);
		}
		if (schema.maxLength !== void 0) {
			const max = schema.maxLength;
			checks.push((d) => typeof d !== "string" || d.length <= max || d.length <= 2 * max + 1 && _cpLen(d) <= max);
		}
		if (schema.pattern) try {
			const re = patternIsSafe(schema.pattern) ? compileSafe(schema.pattern) : new RegExp(schema.pattern);
			checks.push((d) => typeof d !== "string" || re.test(d));
		} catch {
			return null;
		}
		if (schema.format) {
			const fc = FORMAT_CHECKS[schema.format];
			if (fc) checks.push((d) => typeof d !== "string" || fc(d));
			else if (FORMAT_CODEGEN[schema.format]) return null;
		}
		if (schema.minItems !== void 0) {
			const min = schema.minItems;
			checks.push((d) => !Array.isArray(d) || d.length >= min);
		}
		if (schema.maxItems !== void 0) {
			const max = schema.maxItems;
			checks.push((d) => !Array.isArray(d) || d.length <= max);
		}
		if (schema.minProperties !== void 0) {
			const min = schema.minProperties;
			checks.push((d) => typeof d !== "object" || d === null || Array.isArray(d) || Object.keys(d).length >= min);
		}
		if (schema.maxProperties !== void 0) {
			const max = schema.maxProperties;
			checks.push((d) => typeof d !== "object" || d === null || Array.isArray(d) || Object.keys(d).length <= max);
		}
		if (schema.allOf) {
			const subs = [];
			for (const s of schema.allOf) {
				const fn = compileToJS(s, rootDefs);
				if (!fn) return null;
				subs.push(fn);
			}
			checks.push((d) => {
				for (let i = 0; i < subs.length; i++) if (!subs[i](d)) return false;
				return true;
			});
		}
		if (schema.anyOf) {
			const subs = [];
			for (const s of schema.anyOf) {
				const fn = compileToJS(s, rootDefs);
				if (!fn) return null;
				subs.push(fn);
			}
			checks.push((d) => {
				for (let i = 0; i < subs.length; i++) if (subs[i](d)) return true;
				return false;
			});
		}
		if (schema.oneOf) {
			const subs = [];
			for (const s of schema.oneOf) {
				const fn = compileToJS(s, rootDefs);
				if (!fn) return null;
				subs.push(fn);
			}
			checks.push((d) => {
				let count = 0;
				for (let i = 0; i < subs.length; i++) {
					if (subs[i](d)) count++;
					if (count > 1) return false;
				}
				return count === 1;
			});
		}
		if (schema.not) {
			const notFn = compileToJS(schema.not, rootDefs);
			if (!notFn) return null;
			checks.push((d) => !notFn(d));
		}
		if (schema.if) {
			const ifFn = compileToJS(schema.if, rootDefs);
			if (!ifFn) return null;
			const thenFn = schema.then ? compileToJS(schema.then, rootDefs) : null;
			const elseFn = schema.else ? compileToJS(schema.else, rootDefs) : null;
			if (schema.then && !thenFn) return null;
			if (schema.else && !elseFn) return null;
			checks.push((d) => {
				if (ifFn(d)) return thenFn ? thenFn(d) : true;
				else return elseFn ? elseFn(d) : true;
			});
		}
		if (checks.length === 0) return () => true;
		if (checks.length === 1) return checks[0];
		return (data) => {
			for (let i = 0; i < checks.length; i++) if (!checks[i](data)) return false;
			return true;
		};
	}
	function collectDefs(schema) {
		const defs = {};
		const raw = schema.$defs || schema.definitions;
		if (raw && typeof raw === "object") for (const [name, def] of Object.entries(raw)) {
			let cached = void 0;
			defs[name] = {
				get fn() {
					if (cached === void 0) {
						cached = null;
						cached = compileToJS(def, defs);
					}
					return cached || (() => true);
				},
				raw: def
			};
			if (def && typeof def === "object") {
				if (def.$anchor) {
					const anchorDef = def;
					let anchorCached = void 0;
					defs["#" + def.$anchor] = {
						get fn() {
							if (anchorCached === void 0) {
								anchorCached = null;
								anchorCached = compileToJS(anchorDef, defs);
							}
							return anchorCached || (() => true);
						},
						raw: anchorDef
					};
				}
				if (def.$dynamicAnchor) {
					const daDef = def;
					let daCached = void 0;
					defs["#" + def.$dynamicAnchor] = {
						get fn() {
							if (daCached === void 0) {
								daCached = null;
								daCached = compileToJS(daDef, defs);
							}
							return daCached || (() => true);
						},
						raw: daDef
					};
				}
			}
		}
		if (schema.$anchor && !defs["#" + schema.$anchor]) {
			const rootAnchorSchema = schema;
			let rootACached = void 0;
			defs["#" + schema.$anchor] = {
				get fn() {
					if (rootACached === void 0) {
						rootACached = null;
						rootACached = compileToJS(rootAnchorSchema, defs);
					}
					return rootACached || (() => true);
				},
				raw: rootAnchorSchema
			};
		}
		if (schema.$dynamicAnchor && !defs["#" + schema.$dynamicAnchor]) {
			const rootDASchema = schema;
			let rootDACached = void 0;
			defs["#" + schema.$dynamicAnchor] = {
				get fn() {
					if (rootDACached === void 0) {
						rootDACached = null;
						rootDACached = compileToJS(rootDASchema, defs);
					}
					return rootDACached || (() => true);
				},
				raw: rootDASchema
			};
		}
		return defs;
	}
	function walkJsonPointer(root, fragment) {
		if (!fragment || fragment === "/" || fragment === "#") return root;
		const path = fragment.startsWith("#") ? fragment.slice(1) : fragment;
		if (!path.startsWith("/")) return null;
		const parts = path.split("/").slice(1).map((s) => s.replace(/~1/g, "/").replace(/~0/g, "~"));
		let target = root;
		for (const p of parts) {
			if (target == null || typeof target !== "object") return null;
			if (!(p in target)) {
				const alt = p === "definitions" ? "$defs" : p === "$defs" ? "definitions" : p === "items" && Array.isArray(target.prefixItems) ? "prefixItems" : null;
				if (alt !== null && alt in target) {
					target = target[alt];
					continue;
				}
				return null;
			}
			target = target[p];
		}
		return target == null ? null : target;
	}
	function resolveCrossSchemaRef(ref, schemaMap) {
		if (!schemaMap) return null;
		const hashIdx = ref.indexOf("#");
		const baseId = hashIdx >= 0 ? ref.slice(0, hashIdx) : ref;
		const fragment = hashIdx >= 0 ? ref.slice(hashIdx) : "";
		if (!baseId) return null;
		let baseSchema = null;
		let fullId = null;
		if (schemaMap.has(baseId)) {
			baseSchema = schemaMap.get(baseId);
			fullId = baseId;
		} else if (!ref.includes("://")) {
			for (const [id] of schemaMap) if (id.endsWith("/" + baseId)) {
				baseSchema = schemaMap.get(id);
				fullId = id;
				break;
			}
		}
		if (!baseSchema) return null;
		const target = fragment ? walkJsonPointer(baseSchema, fragment) : baseSchema;
		if (target == null) return null;
		return {
			schema: target,
			fullId
		};
	}
	function resolveRef(ref, defs, schemaMap) {
		if (ref === "#") return null;
		if (defs) {
			const m = ref.match(/^#\/(?:\$defs|definitions)\/(.+)$/);
			if (m) {
				const entry = defs[m[1]];
				if (entry) return (d) => {
					const fn = entry.fn;
					return fn ? fn(d) : true;
				};
			}
			if (ref.startsWith("#") && !ref.startsWith("#/")) {
				const entry = defs[ref];
				if (entry) return (d) => {
					const fn = entry.fn;
					return fn ? fn(d) : true;
				};
			}
		}
		if (schemaMap && schemaMap.has(ref)) return compileToJS(schemaMap.get(ref), null, schemaMap);
		if (schemaMap && ref.includes("#")) {
			const r = resolveCrossSchemaRef(ref, schemaMap);
			if (r) return compileToJS(r.schema, null, schemaMap);
		}
		if (schemaMap && !ref.includes("://") && !ref.startsWith("#")) {
			for (const [id] of schemaMap) if (id.endsWith("/" + ref)) return compileToJS(schemaMap.get(id), null, schemaMap);
		}
		return null;
	}
	function buildTypeCheck(types) {
		if (types.length === 1) return TYPE_CHECKS[types[0]] || (() => true);
		const fns = types.map((t) => TYPE_CHECKS[t]).filter(Boolean);
		return (d) => {
			for (let i = 0; i < fns.length; i++) if (fns[i](d)) return true;
			return false;
		};
	}
	const TYPE_CHECKS = {
		string: (d) => typeof d === "string",
		number: (d) => typeof d === "number" && isFinite(d),
		integer: (d) => Number.isInteger(d),
		boolean: (d) => typeof d === "boolean",
		null: (d) => d === null,
		array: (d) => Array.isArray(d),
		object: (d) => typeof d === "object" && d !== null && !Array.isArray(d)
	};
	function _canonical(x) {
		if (x === null || typeof x !== "object") return JSON.stringify(x);
		if (Array.isArray(x)) return "[" + x.map(_canonical).join(",") + "]";
		return "{" + Object.keys(x).sort().map((k) => JSON.stringify(k) + ":" + _canonical(x[k])).join(",") + "}";
	}
	const FORMAT_CHECKS = {
		email: (s) => {
			const at = s.indexOf("@");
			return at > 0 && at < s.length - 1 && s.indexOf(".", at) > at + 1;
		},
		date: (s) => {
			if (s.length !== 10 || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
			const m = +s.slice(5, 7), d = +s.slice(8, 10);
			return m >= 1 && m <= 12 && d >= 1 && d <= 31;
		},
		uuid: (s) => s.length === 36 && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s),
		ipv4: (s) => {
			const p = s.split(".");
			return p.length === 4 && p.every((n) => {
				const v = +n;
				return v >= 0 && v <= 255 && String(v) === n;
			});
		},
		hostname: (s) => s.length > 0 && s.length <= 253 && /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i.test(s)
	};
	const UNSAFE_KEYS = /* @__PURE__ */ new Set([
		"__proto__",
		"constructor",
		"toString",
		"valueOf",
		"hasOwnProperty",
		"isPrototypeOf",
		"propertyIsEnumerable",
		"toLocaleString"
	]);
	function canResolveDynamicRefs(target, callingSchema, schemaMap) {
		const anchors = /* @__PURE__ */ new Set();
		if (callingSchema.$dynamicAnchor) anchors.add(callingSchema.$dynamicAnchor);
		const defs = callingSchema.$defs || callingSchema.definitions;
		if (defs) {
			for (const def of Object.values(defs)) if (def && typeof def === "object" && def.$dynamicAnchor) anchors.add(def.$dynamicAnchor);
		}
		if (schemaMap) {
			for (const ext of schemaMap.values()) if (ext && typeof ext === "object" && ext.$dynamicAnchor) anchors.add(ext.$dynamicAnchor);
		}
		const refs = [];
		const findDynRefs = (s) => {
			if (typeof s !== "object" || s === null) return;
			if (s.$dynamicRef) {
				const name = s.$dynamicRef.startsWith("#") ? s.$dynamicRef.slice(1) : s.$dynamicRef;
				refs.push(name);
			}
			for (const v of Object.values(s)) if (Array.isArray(v)) v.forEach(findDynRefs);
			else if (typeof v === "object" && v !== null) findDynRefs(v);
		};
		findDynRefs(target);
		return refs.every((r) => anchors.has(r));
	}
	function hasNestedIdScope(node, isRoot = true) {
		if (typeof node !== "object" || node === null) return false;
		if (!isRoot && typeof node.$id === "string" && !node.$id.startsWith("#")) return true;
		for (const val of Object.values(node)) {
			if (typeof val !== "object" || val === null) continue;
			if (Array.isArray(val)) {
				for (const item of val) if (hasNestedIdScope(item, false)) return true;
			} else if (hasNestedIdScope(val, false)) return true;
		}
		return false;
	}
	function codegenSafe(schema, schemaMap) {
		if (typeof schema === "boolean") return true;
		if (typeof schema !== "object" || schema === null) return true;
		if (schema.propertyDependencies !== void 0) return false;
		if (schema.$dynamicRef && !schema.$dynamicRef.startsWith("#")) return false;
		if (schema.items === false) return false;
		if (schema.items === true && !schema.unevaluatedItems) return false;
		if (schema.additionalProperties === true) return true;
		if (schema.properties) for (const v of Object.values(schema.properties)) {
			if (v === false) return false;
			if (v === true) continue;
			if (!codegenSafe(v, schemaMap)) return false;
		}
		if (schema.required) {
			for (const k of schema.required) if (UNSAFE_KEYS.has(k)) return false;
		}
		if (schema.properties) for (const k of Object.keys(schema.properties)) {
			if (UNSAFE_KEYS.has(k)) return false;
			if (k === "$ref") return false;
		}
		if (schema.pattern && /\\[pP]\{/.test(schema.pattern)) return false;
		if (schema.$ref) {
			if (schema.$ref === "#") return true;
			const isLocal = /^#\/(?:\$defs|definitions)\/[^/]+$/.test(schema.$ref);
			let isResolvable = !isLocal && schemaMap && schemaMap.has(schema.$ref);
			let resolvedTarget = null;
			if (!isLocal && !isResolvable && schemaMap && !schema.$ref.includes("://") && !schema.$ref.startsWith("#")) {
				for (const [id] of schemaMap) if (id.endsWith("/" + schema.$ref)) {
					isResolvable = true;
					resolvedTarget = schemaMap.get(id);
					break;
				}
			}
			if (!isLocal && !isResolvable && schemaMap && schema.$ref.includes("#") && !schema.$ref.startsWith("#")) {
				const r = resolveCrossSchemaRef(schema.$ref, schemaMap);
				if (r) {
					isResolvable = true;
					resolvedTarget = r.schema;
				}
			}
			const isAnchorRef = !isLocal && !isResolvable && schema.$ref.length > 1 && schema.$ref.startsWith("#") && !schema.$ref.startsWith("#/");
			if (!isLocal && !isResolvable && !isAnchorRef) return false;
			if (!resolvedTarget && isResolvable) resolvedTarget = schemaMap.get(schema.$ref);
			if (resolvedTarget && JSON.stringify(resolvedTarget).includes("\"$dynamicRef\"")) {
				if (!(canResolveDynamicRefs(resolvedTarget, schema, schemaMap) && resolvedTarget.additionalProperties === void 0 && !resolvedTarget.patternProperties && !resolvedTarget.dependentSchemas && !resolvedTarget.propertyNames) && schema.unevaluatedProperties === void 0 && schema.unevaluatedItems === void 0) return false;
			}
			const SCHEMA_ORG_KEYS = /* @__PURE__ */ new Set([
				"$ref",
				"$defs",
				"definitions",
				"$schema",
				"$id",
				"$dynamicAnchor",
				"$anchor"
			]);
			if (Object.keys(schema).filter((k) => !SCHEMA_ORG_KEYS.has(k)).length > 0 && schema.unevaluatedProperties === void 0 && schema.unevaluatedItems === void 0) return false;
		}
		if (typeof schema.additionalProperties === "object" && schema.additionalProperties !== null) {
			if (schema.allOf || schema.oneOf || schema.anyOf) return false;
			if (schema.patternProperties) return false;
			if (!codegenSafe(schema.additionalProperties, schemaMap)) return false;
		}
		if (schema.additionalProperties === false && !schema.properties) return false;
		if (schema.propertyNames === false) return false;
		if (schema.unevaluatedProperties !== void 0) {
			if (typeof schema.unevaluatedProperties === "object" && schema.unevaluatedProperties !== null) {
				if (!codegenSafe(schema.unevaluatedProperties, schemaMap)) return false;
			}
			if (schema.unevaluatedProperties === false || typeof schema.unevaluatedProperties === "object" && schema.unevaluatedProperties !== null) {
				const evalResult = collectEvaluated(schema, schemaMap);
				if (evalResult.dynamic && evalResult.allProps) return false;
			}
		}
		if (schema.unevaluatedItems !== void 0) {
			if (JSON.stringify(schema).includes("\"contains\"")) return false;
			if (typeof schema.unevaluatedItems === "object" && schema.unevaluatedItems !== null) {
				if (!codegenSafe(schema.unevaluatedItems, schemaMap)) return false;
			}
		}
		const defs = schema.$defs || schema.definitions;
		if (defs) {
			const defNames = new Set(Object.keys(defs));
			const defRefs = {};
			for (const [name, def] of Object.entries(defs)) {
				defRefs[name] = [];
				if (typeof def === "object" && def !== null) {
					const refs = [];
					const seen = /* @__PURE__ */ new WeakSet();
					const collectRefs = (node) => {
						if (typeof node !== "object" || node === null) return;
						if (seen.has(node)) return;
						seen.add(node);
						if (node.$ref) {
							const m = /^#\/(?:\$defs|definitions)\/([^/]+)$/.exec(node.$ref);
							if (m && defNames.has(m[1])) refs.push(m[1]);
						}
						for (const val of Object.values(node)) if (typeof val === "object" && val !== null) {
							if (Array.isArray(val)) for (const item of val) collectRefs(item);
							else collectRefs(val);
						}
					};
					collectRefs(def);
					defRefs[name] = refs;
				}
			}
			if ((() => {
				const visited = /* @__PURE__ */ new Set();
				const inStack = /* @__PURE__ */ new Set();
				const dfs = (node) => {
					if (inStack.has(node)) return true;
					if (visited.has(node)) return false;
					visited.add(node);
					inStack.add(node);
					for (const neighbor of defRefs[node] || []) if (dfs(neighbor)) return true;
					inStack.delete(node);
					return false;
				};
				return Object.keys(defRefs).some(dfs);
			})()) return false;
			for (const [name, def] of Object.entries(defs)) {
				if (/[~/"']/.test(name)) return false;
				if (typeof def === "boolean") return false;
				if (typeof def === "object" && def !== null) {
					if (def.$id && !def.$id.startsWith("#")) return false;
					if (def.$ref) return false;
					if (!codegenSafe(def, schemaMap)) return false;
				}
			}
		}
		const subs = [
			schema.items,
			schema.contains,
			schema.not,
			schema.if,
			schema.then,
			schema.else,
			...schema.prefixItems || [],
			...schema.allOf || [],
			...schema.anyOf || [],
			...schema.oneOf || []
		];
		if (typeof schema.additionalProperties === "object") subs.push(schema.additionalProperties);
		for (const s of subs) {
			if (s === void 0 || s === null) continue;
			if (s === false) return false;
			if (s === true) continue;
			if (!codegenSafe(s, schemaMap)) return false;
		}
		return true;
	}
	function hasAdditionalPropertiesSchema(schema) {
		if (typeof schema !== "object" || schema === null) return false;
		if (typeof schema.additionalProperties === "object" && schema.additionalProperties !== null) return true;
		for (const key of [
			"properties",
			"patternProperties",
			"$defs",
			"definitions",
			"dependentSchemas"
		]) if (schema[key] && typeof schema[key] === "object") {
			for (const v of Object.values(schema[key])) if (hasAdditionalPropertiesSchema(v)) return true;
		}
		for (const key of [
			"allOf",
			"anyOf",
			"oneOf",
			"prefixItems"
		]) if (Array.isArray(schema[key])) {
			for (const s of schema[key]) if (hasAdditionalPropertiesSchema(s)) return true;
		}
		for (const key of [
			"items",
			"contains",
			"not",
			"if",
			"then",
			"else",
			"propertyNames"
		]) if (typeof schema[key] === "object" && schema[key] !== null) {
			if (hasAdditionalPropertiesSchema(schema[key])) return true;
		}
		return false;
	}
	const SUBSCHEMA_MAPS = [
		"properties",
		"patternProperties",
		"$defs",
		"definitions",
		"dependentSchemas"
	];
	const SUBSCHEMA_LISTS = [
		"allOf",
		"anyOf",
		"oneOf",
		"prefixItems"
	];
	const SUBSCHEMA_SINGLES = [
		"items",
		"additionalItems",
		"contains",
		"not",
		"if",
		"then",
		"else",
		"additionalProperties",
		"propertyNames",
		"unevaluatedItems",
		"unevaluatedProperties",
		"contentSchema"
	];
	function refResolves(ref, rootDefs, anchors, schemaMap) {
		if (ref === "#") return true;
		const local = ref.match(/^#\/(?:\$defs|definitions)\/(.+)$/);
		if (local) return !!(rootDefs && rootDefs[local[1]]);
		if (ref.startsWith("#") && !ref.startsWith("#/")) {
			const entry = rootDefs && rootDefs[ref];
			return !!(entry && entry.raw || anchors && anchors[ref]);
		}
		if (ref.startsWith("#")) return false;
		if (!schemaMap) return false;
		if (schemaMap.has(ref)) return true;
		if (!ref.includes("://")) {
			for (const [id] of schemaMap) if (id.endsWith("/" + ref)) return true;
		}
		if (ref.includes("#")) return !!resolveCrossSchemaRef(ref, schemaMap);
		return false;
	}
	function crossDocTarget(ref, schemaMap) {
		if (!schemaMap || ref.startsWith("#")) return null;
		if (schemaMap.has(ref)) return schemaMap.get(ref);
		if (!ref.includes("://")) {
			for (const [id, s] of schemaMap) if (id.endsWith("/" + ref)) return s;
		}
		if (ref.includes("#")) {
			const r = resolveCrossSchemaRef(ref, schemaMap);
			if (r) return r.schema;
		}
		return null;
	}
	function subtreeHasLocalRef(node, seen) {
		if (typeof node !== "object" || node === null || Array.isArray(node)) return false;
		if (seen.has(node)) return false;
		seen.add(node);
		if (typeof node.$ref === "string" && node.$ref.startsWith("#")) return true;
		for (const key of SUBSCHEMA_MAPS) {
			const group = node[key];
			if (group && typeof group === "object" && !Array.isArray(group)) {
				for (const sub of Object.values(group)) if (subtreeHasLocalRef(sub, seen)) return true;
			}
		}
		for (const key of SUBSCHEMA_LISTS) if (Array.isArray(node[key])) {
			for (const sub of node[key]) if (subtreeHasLocalRef(sub, seen)) return true;
		}
		for (const key of SUBSCHEMA_SINGLES) if (Array.isArray(node[key])) {
			for (const sub of node[key]) if (subtreeHasLocalRef(sub, seen)) return true;
		} else if (subtreeHasLocalRef(node[key], seen)) return true;
		return false;
	}
	function needsBaseTracking(schema, schemaMap, seen) {
		if (!schemaMap || schemaMap.size === 0) return false;
		if (hasNestedIdScope(schema)) return true;
		return refsAreScopeSensitive(schema, schemaMap, seen);
	}
	function refsAreScopeSensitive(node, schemaMap, seen) {
		if (typeof node !== "object" || node === null || Array.isArray(node)) return false;
		if (seen.has(node)) return false;
		seen.add(node);
		const ref = node.$ref;
		if (typeof ref === "string" && !ref.startsWith("#")) {
			const key = ref.split("#")[0];
			if (!schemaMap.has(key) && !ref.includes("://")) return true;
			const target = crossDocTarget(ref, schemaMap);
			if (target && typeof target === "object") {
				if (typeof target.$id === "string" && target.$id !== key) return true;
				if (subtreeHasLocalRef(target, /* @__PURE__ */ new Set()) && refsAreScopeSensitive(target, schemaMap, seen)) return true;
			}
		}
		for (const key of SUBSCHEMA_MAPS) {
			const group = node[key];
			if (group && typeof group === "object" && !Array.isArray(group)) {
				for (const sub of Object.values(group)) if (refsAreScopeSensitive(sub, schemaMap, seen)) return true;
			}
		}
		for (const key of SUBSCHEMA_LISTS) if (Array.isArray(node[key])) {
			for (const sub of node[key]) if (refsAreScopeSensitive(sub, schemaMap, seen)) return true;
		}
		for (const key of SUBSCHEMA_SINGLES) if (Array.isArray(node[key])) {
			for (const sub of node[key]) if (refsAreScopeSensitive(sub, schemaMap, seen)) return true;
		} else if (refsAreScopeSensitive(node[key], schemaMap, seen)) return true;
		return false;
	}
	function hasUnresolvableRef(node, rootDefs, anchors, schemaMap, seen) {
		if (typeof node !== "object" || node === null || Array.isArray(node)) return false;
		if (seen.has(node)) return false;
		seen.add(node);
		if (typeof node.$ref === "string") {
			if (!refResolves(node.$ref, rootDefs, anchors, schemaMap)) return true;
			const target = crossDocTarget(node.$ref, schemaMap);
			if (target && subtreeHasLocalRef(target, /* @__PURE__ */ new Set())) return true;
		}
		for (const key of SUBSCHEMA_MAPS) {
			const group = node[key];
			if (group && typeof group === "object" && !Array.isArray(group)) {
				for (const sub of Object.values(group)) if (hasUnresolvableRef(sub, rootDefs, anchors, schemaMap, seen)) return true;
			}
		}
		for (const key of SUBSCHEMA_LISTS) if (Array.isArray(node[key])) {
			for (const sub of node[key]) if (hasUnresolvableRef(sub, rootDefs, anchors, schemaMap, seen)) return true;
		}
		for (const key of SUBSCHEMA_SINGLES) if (Array.isArray(node[key])) {
			for (const sub of node[key]) if (hasUnresolvableRef(sub, rootDefs, anchors, schemaMap, seen)) return true;
		} else if (hasUnresolvableRef(node[key], rootDefs, anchors, schemaMap, seen)) return true;
		return false;
	}
	function collectExternalRefKeys(node, out, seen) {
		if (typeof node !== "object" || node === null) return;
		if (seen.has(node)) return;
		seen.add(node);
		if (Array.isArray(node)) {
			for (const n of node) collectExternalRefKeys(n, out, seen);
			return;
		}
		for (const key of Object.keys(node)) {
			const v = node[key];
			if ((key === "$ref" || key === "$dynamicRef") && typeof v === "string" && !v.startsWith("#")) out.add(v.split("#")[0]);
			else if (typeof v === "object" && v !== null && key !== "enum" && key !== "const" && key !== "default" && key !== "examples") collectExternalRefKeys(v, out, seen);
		}
	}
	function lookupExternal(key, schemaMap) {
		if (schemaMap.has(key)) return schemaMap.get(key);
		if (!key.includes("://")) {
			for (const [id, doc] of schemaMap) if (id.endsWith("/" + key)) return doc;
		}
		return null;
	}
	function reachableExternalDocs(schema, schemaMap) {
		const docs = /* @__PURE__ */ new Set();
		if (!schemaMap || schemaMap.size === 0) return docs;
		const queue = [schema];
		const seenDocs = /* @__PURE__ */ new Set([schema]);
		while (queue.length) {
			const doc = queue.shift();
			const keys = /* @__PURE__ */ new Set();
			collectExternalRefKeys(doc, keys, /* @__PURE__ */ new Set());
			for (const key of keys) {
				const target = lookupExternal(key, schemaMap);
				if (target && !seenDocs.has(target)) {
					seenDocs.add(target);
					docs.add(target);
					queue.push(target);
				}
			}
		}
		return docs;
	}
	function externalDocsNeedInterpreter(schema, schemaMap) {
		for (const doc of reachableExternalDocs(schema, schemaMap)) {
			const str = JSON.stringify(doc);
			if (str.includes("\"$dynamicRef\"") || str.includes("\"$dynamicAnchor\"") || str.includes("\"unevaluatedProperties\"") || str.includes("\"unevaluatedItems\"")) return true;
			if (typeof doc === "object" && doc !== null && hasNestedIdScope(doc)) return true;
		}
		return false;
	}
	function sharedCodegenGate(schema, schemaMap) {
		if (typeof schema !== "object" || schema === null) return true;
		if (!codegenSafe(schema, schemaMap)) return false;
		if (needsBaseTracking(schema, schemaMap, /* @__PURE__ */ new Set())) return false;
		if (externalDocsNeedInterpreter(schema, schemaMap)) return false;
		return true;
	}
	function compileToJSCodegen(schema, schemaMap, userFormats) {
		if (typeof schema === "boolean") return schema ? () => true : () => false;
		if (typeof schema !== "object" || schema === null) return null;
		if (!sharedCodegenGate(schema, schemaMap)) return null;
		const rootDefs = schema.$defs || schema.definitions || null;
		if (schema.patternProperties) for (const [pat, sub] of Object.entries(schema.patternProperties)) {
			if (typeof sub === "boolean") return null;
			if (/\\[pP]\{/.test(pat)) return null;
			if (typeof sub === "object" && sub !== null && !codegenSafe(sub, schemaMap)) return null;
		}
		if (schema.dependentSchemas) for (const sub of Object.values(schema.dependentSchemas)) {
			if (typeof sub === "boolean") return null;
			if (typeof sub === "object" && sub !== null && !codegenSafe(sub, schemaMap)) return null;
		}
		if (schema.propertyNames) {
			if (typeof schema.propertyNames === "boolean") return null;
			const pn = schema.propertyNames;
			const supported = [
				"maxLength",
				"minLength",
				"pattern",
				"const",
				"enum"
			];
			if (Object.keys(pn).filter((k) => k !== "$schema").some((k) => !supported.includes(k))) return null;
		}
		const anchors = {};
		if (schema.$dynamicAnchor) anchors["#" + schema.$dynamicAnchor] = schema;
		if (schema.$anchor) anchors["#" + schema.$anchor] = schema;
		if (typeof schema.$id === "string" && schema.$id.startsWith("#")) anchors[schema.$id] = schema;
		if (rootDefs) {
			for (const def of Object.values(rootDefs)) if (def && typeof def === "object") {
				if (def.$dynamicAnchor) anchors["#" + def.$dynamicAnchor] = def;
				if (def.$anchor) anchors["#" + def.$anchor] = def;
				if (typeof def.$id === "string" && def.$id.startsWith("#")) anchors[def.$id] = def;
			}
		}
		if (schemaMap) {
			for (const ext of schemaMap.values()) if (ext && typeof ext === "object") {
				if (ext.$dynamicAnchor && !anchors["#" + ext.$dynamicAnchor]) anchors["#" + ext.$dynamicAnchor] = ext;
				if (ext.$anchor && !anchors["#" + ext.$anchor]) anchors["#" + ext.$anchor] = ext;
				if (typeof ext.$id === "string" && ext.$id.startsWith("#") && !anchors[ext.$id]) anchors[ext.$id] = ext;
			}
		}
		if (hasUnresolvableRef(schema, rootDefs, anchors, schemaMap, /* @__PURE__ */ new Set())) return null;
		if (needsBaseTracking(schema, schemaMap, /* @__PURE__ */ new Set())) return null;
		const ctx = {
			varCounter: 0,
			helpers: [],
			helperCode: [],
			preamble: [],
			closureVars: ["_cpLen"],
			closureVals: [_cpLen],
			rootDefs,
			refStack: /* @__PURE__ */ new Set(),
			schemaMap: schemaMap || null,
			anchors,
			rootSchema: schema,
			userFormats: userFormats || null
		};
		const lines = [];
		genCode(schema, "d", lines, ctx);
		if (ctx.deferredChecks) for (const dc of ctx.deferredChecks) lines.push(dc);
		if (lines.length === 0) return () => true;
		const checkStr = lines.join("\n  ");
		const closureNames = ctx.closureVars;
		const closureValues = ctx.closureVals;
		for (const code of ctx.helperCode) {
			const safeMatch = code.match(/^const (_re\d+)=__ataSafeRe\((.+)\)$/);
			if (safeMatch) {
				closureNames.push(safeMatch[1]);
				closureValues.push(compileSafe(JSON.parse(safeMatch[2])));
				continue;
			}
			const match = code.match(/^const (_re\d+)=new RegExp\((.+)\)$/);
			if (match) {
				closureNames.push(match[1]);
				closureValues.push(new RegExp(JSON.parse(match[2])));
			}
		}
		let body, hybridBody;
		if (ctx.usesRecursion) {
			body = `function _validate(d){\n  ${checkStr}\n  return true\n  }\n  return _validate(d)`;
			hybridBody = `function _validate(d){\n  ${checkStr}\n  return true\n  }\n  return _validate(d)?R:E(d)`;
		} else {
			body = checkStr + "\n  return true";
			hybridBody = replaceTopLevel(checkStr + "\n  return R");
		}
		const preambleStr = ctx.preamble && ctx.preamble.length ? ctx.preamble.join("\n  ") + "\n  " : "";
		try {
			let boolFn;
			if (closureNames.length > 0) boolFn = new Function(...closureNames, `${preambleStr}return function(d){${body}}`)(...closureValues);
			else if (preambleStr) boolFn = new Function(`${preambleStr}return function(d){${body}}`)();
			else boolFn = new Function("d", body);
			try {
				const hybridFactory = new Function(...closureNames, "R", "E", `${preambleStr}return function(d){${hybridBody}}`);
				boolFn._hybridFactory = (R, E) => hybridFactory(...closureValues, R, E);
			} catch {}
			const helperStr = ctx.helperCode.length ? ctx.helperCode.join("\n  ") + "\n  " : "";
			boolFn._source = helperStr + body;
			boolFn._preambleSource = preambleStr;
			boolFn._hybridSource = helperStr + hybridBody;
			boolFn._usesSafeRe = !!ctx.usesSafeRe;
			if (ctx.userFormats) {
				const fmtEntries = [];
				for (let i = 0; i < closureNames.length; i++) if (closureNames[i].startsWith("_uf_")) {
					let format = null;
					for (const key of Object.keys(ctx.userFormats)) if (ctx.userFormats[key] === closureValues[i]) {
						format = key;
						break;
					}
					fmtEntries.push({
						name: closureNames[i],
						fn: closureValues[i],
						format
					});
				}
				if (fmtEntries.length) boolFn._formatClosures = fmtEntries;
			}
			{
				const entries = [];
				for (let i = 0; i < closureNames.length; i++) {
					const name = closureNames[i];
					if (name === "_cpLen" || name.startsWith("_uf_")) continue;
					entries.push({
						name,
						val: closureValues[i]
					});
				}
				if (entries.length) boolFn._closures = entries;
			}
			return boolFn;
		} catch {
			return null;
		}
	}
	function replaceTopLevel(code) {
		let result = "", i = 0;
		while (i < code.length) if (code.startsWith("function", i) && (i === 0 || /[^a-zA-Z_$]/.test(code[i - 1]))) {
			let j = i + 8;
			while (j < code.length && code[j] !== "{") j++;
			result += code.slice(i, j + 1);
			i = j + 1;
			let braceDepth = 1;
			while (i < code.length && braceDepth > 0) {
				if (code[i] === "{") braceDepth++;
				else if (code[i] === "}") braceDepth--;
				if (braceDepth > 0) result += code[i];
				else result += "}";
				i++;
			}
		} else if (code.startsWith("return false", i)) {
			result += "return E(d)";
			i += 12;
		} else if (code.startsWith("return true", i) && (i + 11 >= code.length || !/[a-zA-Z_$]/.test(code[i + 11]))) {
			result += "return R";
			i += 11;
		} else {
			result += code[i];
			i++;
		}
		return result;
	}
	function needsLocal(schema) {
		if (typeof schema !== "object" || schema === null) return false;
		if (schema.$ref || schema.allOf || schema.anyOf || schema.oneOf || schema.if) return false;
		if (schema.properties || schema.items || schema.prefixItems) return false;
		const types = schema.type ? Array.isArray(schema.type) ? schema.type : [schema.type] : null;
		if (!types || types.length !== 1) return false;
		const t = types[0];
		let checkCount = 1;
		if (t === "string") {
			if (schema.minLength !== void 0) checkCount++;
			if (schema.maxLength !== void 0) checkCount++;
			if (schema.pattern) checkCount++;
			if (schema.format) checkCount++;
		} else if (t === "integer" || t === "number") {
			if (schema.minimum !== void 0) checkCount++;
			if (schema.maximum !== void 0) checkCount++;
			if (schema.exclusiveMinimum !== void 0) checkCount++;
			if (schema.exclusiveMaximum !== void 0) checkCount++;
			if (schema.multipleOf !== void 0) checkCount++;
		}
		return checkCount >= 2;
	}
	function tryGenCombined(schema, access, ctx) {
		if (typeof schema !== "object" || schema === null) return null;
		if (schema.$ref || schema.allOf || schema.anyOf || schema.oneOf || schema.if) return null;
		if (schema.properties || schema.items || schema.prefixItems || schema.patternProperties) return null;
		if (schema.enum || schema.const !== void 0) return null;
		if (schema.not || schema.dependentRequired || schema.dependentSchemas) return null;
		const types = schema.type ? Array.isArray(schema.type) ? schema.type : [schema.type] : null;
		if (!types || types.length !== 1) return null;
		const t = types[0];
		const isIdent = /^_[a-zA-Z]\w*$/.test(access);
		const bind = (conds) => isIdent ? `if(${conds.join("||").replace(/\b_v\b/g, access)})return false` : `{const _v=${access};if(${conds.join("||")})return false}`;
		if (t === "string") {
			if (schema.pattern || schema.format) return null;
			if (schema.minLength !== void 0 && schema.maxLength !== void 0) {
				const M = schema.minLength;
				const X = schema.maxLength;
				const v2 = isIdent ? access : "_v";
				return `{${isIdent ? "" : `const _v=${access};`}if(typeof ${v2}!=='string')return false;const _lv=${v2}.length;if(_lv<${M}||_lv>${X * 2})return false;if(_lv<${M * 2}||_lv>${X}){const _cp=_cpLen(${v2});if(_cp<${M}||_cp>${X})return false}}`;
			}
			const conds = [`typeof _v!=='string'`];
			if (schema.minLength !== void 0 && schema.minLength > 0) {
				const M = schema.minLength;
				conds.push(`_v.length<${M}`);
				if (M > 1) conds.push(`_v.length<${M * 2}&&_cpLen(_v)<${M}`);
			}
			if (schema.maxLength !== void 0) {
				const X = schema.maxLength;
				if (X === 0) conds.push(`_v.length>0`);
				else {
					conds.push(`_v.length>${X * 2}`);
					conds.push(`_v.length>${X}&&_cpLen(_v)>${X}`);
				}
			}
			if (conds.length < 2) return null;
			return bind(conds);
		}
		if (t === "integer") {
			const conds = [`!Number.isInteger(_v)`];
			if (schema.minimum !== void 0) conds.push(`_v<${schema.minimum}`);
			if (schema.maximum !== void 0) conds.push(`_v>${schema.maximum}`);
			if (schema.exclusiveMinimum !== void 0) conds.push(`_v<=${schema.exclusiveMinimum}`);
			if (schema.exclusiveMaximum !== void 0) conds.push(`_v>=${schema.exclusiveMaximum}`);
			if (schema.multipleOf !== void 0) conds.push(`(Math.abs(_v%${schema.multipleOf})>1e-8&&Math.abs(_v%${schema.multipleOf}-${schema.multipleOf})>1e-8)`);
			if (conds.length < 2) return null;
			return bind(conds);
		}
		if (t === "number") {
			const conds = [`typeof _v!=='number'||!isFinite(_v)`];
			if (schema.minimum !== void 0) conds.push(`_v<${schema.minimum}`);
			if (schema.maximum !== void 0) conds.push(`_v>${schema.maximum}`);
			if (schema.exclusiveMinimum !== void 0) conds.push(`_v<=${schema.exclusiveMinimum}`);
			if (schema.exclusiveMaximum !== void 0) conds.push(`_v>=${schema.exclusiveMaximum}`);
			if (schema.multipleOf !== void 0) conds.push(`(Math.abs(_v%${schema.multipleOf})>1e-8&&Math.abs(_v%${schema.multipleOf}-${schema.multipleOf})>1e-8)`);
			if (conds.length < 2) return null;
			return bind(conds);
		}
		return null;
	}
	function _deferOrInline(ctx, lines, v, check) {
		if (v === "d" && !ctx.condDepth) {
			if (!ctx.deferredChecks) ctx.deferredChecks = [];
			ctx.deferredChecks.push(check);
		} else lines.push(check);
	}
	function genCode(schema, v, lines, ctx, knownType) {
		if (typeof schema !== "object" || schema === null) return;
		if (!ctx.regExpMap) ctx.regExpMap = /* @__PURE__ */ new Map();
		const hasSiblings = schema.$ref && (schema.unevaluatedProperties !== void 0 || schema.unevaluatedItems !== void 0);
		if (schema.$ref) {
			if (schema.$ref === "#") {
				ctx.usesRecursion = true;
				lines.push(`if(!_validate(${v}))return false`);
				if (!hasSiblings) return;
			}
			const m = schema.$ref !== "#" && schema.$ref.match(/^#\/(?:\$defs|definitions)\/(.+)$/);
			if (m && ctx.rootDefs && ctx.rootDefs[m[1]]) {
				if (ctx.refStack.has(schema.$ref)) {
					if (!hasSiblings) return;
				} else {
					ctx.refStack.add(schema.$ref);
					genCode(ctx.rootDefs[m[1]], v, lines, ctx, knownType);
					ctx.refStack.delete(schema.$ref);
					if (!hasSiblings) return;
				}
			} else if (schema.$ref !== "#" && !m && schema.$ref.startsWith("#") && !schema.$ref.startsWith("#/")) {
				const entry = ctx.rootDefs && ctx.rootDefs[schema.$ref];
				const anchorTarget = entry && entry.raw ? entry.raw : ctx.anchors && ctx.anchors[schema.$ref];
				if (anchorTarget) {
					if (ctx.refStack.has(schema.$ref)) {
						if (!hasSiblings) return;
					} else {
						ctx.refStack.add(schema.$ref);
						genCode(anchorTarget, v, lines, ctx, knownType);
						ctx.refStack.delete(schema.$ref);
						if (!hasSiblings) return;
					}
				}
			} else if (schema.$ref !== "#" && ctx.schemaMap) {
				let resolved = ctx.schemaMap.get(schema.$ref);
				if (!resolved && !schema.$ref.includes("://") && !schema.$ref.startsWith("#")) {
					for (const [id, s] of ctx.schemaMap) if (id.endsWith("/" + schema.$ref)) {
						resolved = s;
						break;
					}
				}
				if (!resolved && schema.$ref.includes("#") && !schema.$ref.startsWith("#")) {
					const r = resolveCrossSchemaRef(schema.$ref, ctx.schemaMap);
					if (r) resolved = r.schema;
				}
				if (resolved) {
					if (ctx.refStack.has(schema.$ref)) {
						if (!hasSiblings) return;
					} else {
						ctx.refStack.add(schema.$ref);
						genCode(resolved, v, lines, ctx, knownType);
						ctx.refStack.delete(schema.$ref);
						if (!hasSiblings) return;
					}
				} else if (!hasSiblings) return;
			} else if (!hasSiblings) return;
		}
		if (schema.$dynamicRef) {
			const anchorKey = schema.$dynamicRef.startsWith("#") ? schema.$dynamicRef : "#" + schema.$dynamicRef;
			if (ctx.anchors && ctx.anchors[anchorKey]) {
				const target = ctx.anchors[anchorKey];
				if (target === ctx.rootSchema) {
					ctx.usesRecursion = true;
					lines.push(`if(!_validate(${v}))return false`);
				} else {
					const refKey = "$dynamicRef:" + anchorKey;
					if (!ctx.refStack.has(refKey)) {
						ctx.refStack.add(refKey);
						genCode(target, v, lines, ctx, knownType);
						ctx.refStack.delete(refKey);
					}
				}
			}
		}
		const types = schema.type ? Array.isArray(schema.type) ? schema.type : [schema.type] : null;
		let effectiveType = knownType;
		if (types) {
			if (!knownType) {
				if (types.length === 1) switch (types[0]) {
					case "object":
						lines.push(`if(typeof ${v}!=='object'||${v}===null||Array.isArray(${v}))return false`);
						break;
					case "array":
						lines.push(`if(!Array.isArray(${v}))return false`);
						break;
					case "string":
						lines.push(`if(typeof ${v}!=='string')return false`);
						break;
					case "number":
						lines.push(`if(typeof ${v}!=='number'||!isFinite(${v}))return false`);
						break;
					case "integer":
						lines.push(`if(!Number.isInteger(${v}))return false`);
						break;
					case "boolean":
						lines.push(`if(typeof ${v}!=='boolean')return false`);
						break;
					case "null": lines.push(`if(${v}!==null)return false`);
				}
				else {
					const conds = types.map((t) => {
						switch (t) {
							case "object": return `(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v}))`;
							case "array": return `Array.isArray(${v})`;
							case "string": return `typeof ${v}==='string'`;
							case "number": return `(typeof ${v}==='number'&&isFinite(${v}))`;
							case "integer": return `Number.isInteger(${v})`;
							case "boolean": return `typeof ${v}==='boolean'`;
							case "null": return `${v}===null`;
							default: return "true";
						}
					});
					lines.push(`if(!(${conds.join("||")}))return false`);
				}
			}
			if (types.length === 1) effectiveType = types[0];
		}
		const isObj = effectiveType === "object";
		const isArr = effectiveType === "array";
		const isStr = effectiveType === "string";
		const isNum = effectiveType === "number" || effectiveType === "integer";
		const objGuard = isObj ? "" : `typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v})&&`;
		isObj || `${v}${v}`;
		if (schema.enum) lines.push(`if(!(${enumCondition(ctx, schema.enum, v)}))return false`);
		if (schema.const !== void 0) {
			const cv = schema.const;
			if (cv === null || typeof cv !== "object") lines.push(`if(${v}!==${JSON.stringify(cv)})return false`);
			else lines.push(`if(!${emitDeq(ctx)}(${v},${emitConstant(ctx, cv)}))return false`);
		}
		const requiredSet = new Set(schema.required || []);
		const hoisted = {};
		if (schema.required && schema.properties && isObj) {
			const reqChecks = [];
			for (const key of schema.required) {
				hoisted[key] = `${v}[${JSON.stringify(key)}]`;
				const prop = schema.properties[key];
				if (!(prop && (prop.type || prop.enum || prop.const !== void 0))) reqChecks.push(`${v}[${JSON.stringify(key)}]===undefined`);
			}
			if (reqChecks.length > 0) lines.push(`if(${reqChecks.join("||")})return false`);
		} else if (schema.required && schema.required.length > 0) {
			if (isObj) {
				const checks = schema.required.map((key) => `${v}[${JSON.stringify(key)}]===undefined`);
				lines.push(`if(${checks.join("||")})return false`);
			} else {
				const checks = schema.required.map((key) => `${v}[${JSON.stringify(key)}]===undefined`);
				lines.push(`if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v})&&(${checks.join("||")}))return false`);
			}
		}
		if (schema.unevaluatedProperties === false && schema.properties && schema.required && isObj) {
			const evalResult = collectEvaluated(schema, ctx.schemaMap, ctx.rootDefs);
			if (!evalResult.dynamic && !evalResult.allProps) {
				const knownKeys = evalResult.props;
				const propCount = knownKeys.length;
				if (schema.required.length >= propCount && knownKeys.every((k) => schema.required.includes(k)) && propCount > 0) {
					if (propCount <= 15) lines.push(`var _n=0;for(var _k in ${v})_n++;if(_n!==${propCount})return false`);
					else lines.push(`if(Object.keys(${v}).length!==${propCount})return false`);
					ctx._earlyKeyCount = true;
				}
			}
		}
		if (schema.minimum !== void 0) lines.push(isNum ? `if(${v}<${schema.minimum})return false` : `if(typeof ${v}==='number'&&${v}<${schema.minimum})return false`);
		if (schema.maximum !== void 0) lines.push(isNum ? `if(${v}>${schema.maximum})return false` : `if(typeof ${v}==='number'&&${v}>${schema.maximum})return false`);
		if (schema.exclusiveMinimum !== void 0) lines.push(isNum ? `if(${v}<=${schema.exclusiveMinimum})return false` : `if(typeof ${v}==='number'&&${v}<=${schema.exclusiveMinimum})return false`);
		if (schema.exclusiveMaximum !== void 0) lines.push(isNum ? `if(${v}>=${schema.exclusiveMaximum})return false` : `if(typeof ${v}==='number'&&${v}>=${schema.exclusiveMaximum})return false`);
		if (schema.multipleOf !== void 0) {
			const m = schema.multipleOf;
			const bad = `(Math.abs(${v}%${m})>1e-8&&Math.abs(${v}%${m}-${m})>1e-8)`;
			lines.push(isNum ? `if${bad}return false` : `if(typeof ${v}==='number'&&${bad})return false`);
		}
		if (schema.minLength !== void 0 && schema.maxLength !== void 0) {
			const M = schema.minLength;
			const X = schema.maxLength;
			const lv = `_l${ctx.varCounter++}`;
			const body = `{const ${lv}=${v}.length;if(${lv}<${M}||${lv}>${X * 2})return false;if(${lv}<${M * 2}||${lv}>${X}){const _cp=_cpLen(${v});if(_cp<${M}||_cp>${X})return false}}`;
			lines.push(isStr ? body : `if(typeof ${v}==='string')${body}`);
		} else {
			if (schema.minLength !== void 0 && schema.minLength > 0) {
				const M = schema.minLength;
				const body = M === 1 ? `if(${v}.length<1)return false` : `if(${v}.length<${M})return false;if(${v}.length<${M * 2}&&_cpLen(${v})<${M})return false`;
				lines.push(isStr ? body : `if(typeof ${v}==='string'){${body}}`);
			}
			if (schema.maxLength !== void 0) {
				const X = schema.maxLength;
				const body = X === 0 ? `if(${v}.length>0)return false` : `if(${v}.length>${X * 2})return false;if(${v}.length>${X}&&_cpLen(${v})>${X})return false`;
				lines.push(isStr ? body : `if(typeof ${v}==='string'){${body}}`);
			}
		}
		if (schema.minItems !== void 0) lines.push(isArr ? `if(${v}.length<${schema.minItems})return false` : `if(Array.isArray(${v})&&${v}.length<${schema.minItems})return false`);
		if (schema.maxItems !== void 0) lines.push(isArr ? `if(${v}.length>${schema.maxItems})return false` : `if(Array.isArray(${v})&&${v}.length>${schema.maxItems})return false`);
		if (schema.minProperties !== void 0) lines.push(`if(${objGuard}Object.keys(${v}).length<${schema.minProperties})return false`);
		if (schema.maxProperties !== void 0) lines.push(`if(${objGuard}Object.keys(${v}).length>${schema.maxProperties})return false`);
		if (schema.pattern) {
			const inlineCheck = compilePatternInline(schema.pattern, v);
			if (inlineCheck) lines.push(isStr ? `if(!(${inlineCheck}))return false` : `if(typeof ${v}==='string'&&!(${inlineCheck}))return false`);
			else {
				const pattern = JSON.stringify(schema.pattern);
				if (!ctx.regExpMap.has(pattern)) {
					const ri = ctx.varCounter++;
					ctx.regExpMap.set(pattern, ri);
					if (patternIsSafe(schema.pattern)) {
						ctx.helperCode.push(`const _re${ri}=__ataSafeRe(${pattern})`);
						ctx.usesSafeRe = true;
					} else ctx.helperCode.push(`const _re${ri}=new RegExp(${pattern})`);
				}
				const ri = ctx.regExpMap.get(pattern);
				lines.push(isStr ? `if(!_re${ri}.test(${v}))return false` : `if(typeof ${v}==='string'&&!_re${ri}.test(${v}))return false`);
			}
		}
		if (schema.format) {
			const fc = FORMAT_CODEGEN[schema.format];
			if (fc) lines.push(fc(v, isStr));
			else if (ctx.userFormats && typeof ctx.userFormats[schema.format] === "function") {
				const closureName = `_uf_${schema.format.replace(/[^a-zA-Z0-9_]/g, "_")}`;
				if (!ctx.closureVars.includes(closureName)) {
					ctx.closureVars.push(closureName);
					ctx.closureVals.push(ctx.userFormats[schema.format]);
				}
				const guard = isStr ? "" : `typeof ${v}==='string'&&`;
				lines.push(`if(${guard}!${closureName}(${v}))return false`);
			}
		}
		if (schema.uniqueItems) {
			const si = ctx.varCounter++;
			const itemType = schema.items && typeof schema.items === "object" && schema.items.type;
			const isPrimItems = itemType === "string" || itemType === "number" || itemType === "integer";
			const maxItems = schema.maxItems;
			let inner;
			if (isPrimItems && maxItems && maxItems <= 16) inner = `for(let _i=1;_i<${v}.length;_i++){for(let _k=0;_k<_i;_k++){if(${v}[_i]===${v}[_k])return false}}`;
			else if (isPrimItems) inner = `const _s${si}=new Set();for(let _i=0;_i<${v}.length;_i++){if(_s${si}.has(${v}[_i]))return false;_s${si}.add(${v}[_i])}`;
			else if (ctx.preamble) inner = `if(!${emitUq(ctx)}(${v}))return false`;
			else inner = `const _cn${si}=function(x){if(x===null||typeof x!=='object')return typeof x+':'+x;if(Array.isArray(x))return'['+x.map(_cn${si}).join(',')+']';return'{'+Object.keys(x).sort().map(function(k){return JSON.stringify(k)+':'+_cn${si}(x[k])}).join(',')+'}'};const _s${si}=new Set();for(let _i=0;_i<${v}.length;_i++){const _k=_cn${si}(${v}[_i]);if(_s${si}.has(_k))return false;_s${si}.add(_k)}`;
			lines.push(isArr ? `{${inner}}` : `if(Array.isArray(${v})){${inner}}`);
		}
		if (schema.additionalProperties === false && schema.properties && !schema.patternProperties) {
			const propCount = Object.keys(schema.properties).length;
			const inner = schema.required && schema.required.length === propCount ? propCount <= 15 ? `var _n=0;for(var _k in ${v})_n++;if(_n!==${propCount})return false` : `if(Object.keys(${v}).length!==${propCount})return false` : `for(var _k in ${v})if(${Object.keys(schema.properties).map((k) => `_k!==${JSON.stringify(k)}`).join("&&")})return false`;
			_deferOrInline(ctx, lines, v, isObj ? inner : `if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v})){${inner}}`);
		}
		if (typeof schema.additionalProperties === "object" && schema.additionalProperties !== null && !schema.patternProperties) {
			const declared = schema.properties ? Object.keys(schema.properties) : [];
			const skipCheck = declared.length === 0 ? null : declared.map((k) => `_k===${JSON.stringify(k)}`).join("||");
			const subLines = [];
			genCode(schema.additionalProperties, "_av", subLines, ctx);
			if (subLines.length > 0) {
				const body = subLines.join(";");
				const loop = skipCheck ? `for(var _k in ${v}){if(${skipCheck})continue;const _av=${v}[_k];${body}}` : `for(var _k in ${v}){const _av=${v}[_k];${body}}`;
				_deferOrInline(ctx, lines, v, isObj ? loop : `if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v})){${loop}}`);
			}
		}
		if (schema.dependentRequired) for (const [key, deps] of Object.entries(schema.dependentRequired)) {
			const depChecks = deps.map((d) => `!('${esc(d)}' in ${v})`).join("||");
			lines.push(`if(${objGuard}'${esc(key)}' in ${v}&&(${depChecks}))return false`);
		}
		if (schema.patternProperties) {
			const ppEntries = Object.entries(schema.patternProperties);
			const pn = schema.propertyNames && typeof schema.propertyNames === "object" ? schema.propertyNames : null;
			const pi = ctx.varCounter++;
			const kVar = `_ppk${pi}`;
			const matchers = [];
			for (const [pat] of ppEntries) {
				const fast = fastPrefixCheck(pat, kVar);
				if (fast) matchers.push({ check: fast });
				else {
					const ri = ctx.varCounter++;
					ctx.closureVars.push(`_re${ri}`);
					ctx.closureVals.push(safeReClosure(ctx, pat));
					matchers.push({ check: `_re${ri}.test(${kVar})` });
				}
			}
			for (let i = 0; i < ppEntries.length; i++) {
				const [, sub] = ppEntries[i];
				const subLines = [];
				genCode(sub, `_ppv`, subLines, ctx);
				const fnBody = subLines.length === 0 ? `return true` : `${subLines.join(";")};return true`;
				const fnVar = `_ppf${pi}_${i}`;
				ctx.closureVars.push(fnVar);
				ctx.closureVals.push(new Function("_ppv", fnBody));
			}
			const guard = isObj ? "" : `if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v}))`;
			if (schema.additionalProperties === false && schema.properties) {
				ctx._ppHandledAdditional = true;
				ctx._ppHandledPropertyNames = !!pn;
				const propKeys = Object.keys(schema.properties);
				lines.push(`${guard}{for(const ${kVar} in ${v}){`);
				if (pn) {
					if (pn.minLength !== void 0) lines.push(`if(${kVar}.length<${pn.minLength})return false`);
					if (pn.maxLength !== void 0) lines.push(`if(${kVar}.length>${pn.maxLength})return false`);
					if (pn.pattern) {
						const fast = fastPrefixCheck(pn.pattern, kVar);
						if (fast) lines.push(`if(!(${fast}))return false`);
						else {
							const ri = ctx.varCounter++;
							ctx.closureVars.push(`_re${ri}`);
							ctx.closureVals.push(safeReClosure(ctx, pn.pattern));
							lines.push(`if(!_re${ri}.test(${kVar}))return false`);
						}
					}
					if (pn.const !== void 0) lines.push(`if(${kVar}!==${JSON.stringify(pn.const)})return false`);
					if (pn.enum) {
						const ei = ctx.varCounter++;
						ctx.closureVars.push(`_es${ei}`);
						ctx.closureVals.push(new Set(pn.enum));
						lines.push(`if(!_es${ei}.has(${kVar}))return false`);
					}
				}
				const switchCases = propKeys.map((k) => `case ${JSON.stringify(k)}:`).join("");
				lines.push(`switch(${kVar}){${switchCases}break;default:`);
				let patternChecks = [];
				for (let i = 0; i < ppEntries.length; i++) patternChecks.push(`if(${matchers[i].check}){if(!_ppf${pi}_${i}(${v}[${kVar}]))return false}else{return false}`);
				if (patternChecks.length > 0) lines.push(patternChecks.join(""));
				else lines.push(`return false`);
				lines.push(`}`);
				lines.push(`}}`);
			} else {
				ctx._ppHandledPropertyNames = !!pn;
				lines.push(`${guard}{for(const ${kVar} in ${v}){`);
				if (pn) {
					if (pn.minLength !== void 0) lines.push(`if(${kVar}.length<${pn.minLength})return false`);
					if (pn.maxLength !== void 0) lines.push(`if(${kVar}.length>${pn.maxLength})return false`);
					if (pn.pattern) {
						const fast = fastPrefixCheck(pn.pattern, kVar);
						if (fast) lines.push(`if(!(${fast}))return false`);
						else {
							const ri = ctx.varCounter++;
							ctx.closureVars.push(`_re${ri}`);
							ctx.closureVals.push(safeReClosure(ctx, pn.pattern));
							lines.push(`if(!_re${ri}.test(${kVar}))return false`);
						}
					}
					if (pn.const !== void 0) lines.push(`if(${kVar}!==${JSON.stringify(pn.const)})return false`);
					if (pn.enum) {
						const ei = ctx.varCounter++;
						ctx.closureVars.push(`_es${ei}`);
						ctx.closureVals.push(new Set(pn.enum));
						lines.push(`if(!_es${ei}.has(${kVar}))return false`);
					}
				}
				for (let i = 0; i < ppEntries.length; i++) lines.push(`if(${matchers[i].check}&&!_ppf${pi}_${i}(${v}[${kVar}]))return false`);
				lines.push(`}}`);
			}
		}
		if (schema.dependentSchemas) for (const [key, depSchema] of Object.entries(schema.dependentSchemas)) {
			const guard = isObj ? "" : `typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v})&&`;
			lines.push(`if(${guard}${JSON.stringify(key)} in ${v}){`);
			ctx.condDepth = (ctx.condDepth || 0) + 1;
			genCode(depSchema, v, lines, ctx, effectiveType);
			ctx.condDepth--;
			lines.push(`}`);
		}
		if (schema.propertyNames && typeof schema.propertyNames === "object" && !ctx._ppHandledPropertyNames) {
			const pn = schema.propertyNames;
			const ki = ctx.varCounter++;
			const guard = isObj ? "" : `if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v}))`;
			lines.push(`${guard}{for(const _k${ki} in ${v}){`);
			if (pn.minLength !== void 0) lines.push(`if(_k${ki}.length<${pn.minLength})return false`);
			if (pn.maxLength !== void 0) lines.push(`if(_k${ki}.length>${pn.maxLength})return false`);
			if (pn.pattern) {
				const fast = fastPrefixCheck(pn.pattern, `_k${ki}`);
				if (fast) lines.push(`if(!(${fast}))return false`);
				else {
					const ri = ctx.varCounter++;
					ctx.closureVars.push(`_re${ri}`);
					ctx.closureVals.push(safeReClosure(ctx, pn.pattern));
					lines.push(`if(!_re${ri}.test(_k${ki}))return false`);
				}
			}
			if (pn.const !== void 0) lines.push(`if(_k${ki}!==${JSON.stringify(pn.const)})return false`);
			if (pn.enum) {
				const ei = ctx.varCounter++;
				ctx.closureVars.push(`_es${ei}`);
				ctx.closureVals.push(new Set(pn.enum));
				lines.push(`if(!_es${ei}.has(_k${ki}))return false`);
			}
			lines.push(`}}`);
		}
		if (schema.properties) for (const [key, prop] of Object.entries(schema.properties)) if (requiredSet.has(key) && isObj) {
			const access = hoisted[key] || `${v}[${JSON.stringify(key)}]`;
			const combined = tryGenCombined(prop, access, ctx);
			if (combined) lines.push(combined);
			else if (needsLocal(prop)) {
				const local = `_r${ctx.varCounter++}`;
				lines.push(`{const ${local}=${access}`);
				genCode(prop, local, lines, ctx);
				lines.push(`}`);
			} else genCode(prop, access, lines, ctx);
		} else if (isObj) {
			const local = `_o${ctx.varCounter++}`;
			lines.push(`{const ${local}=${v}[${JSON.stringify(key)}];if(${local}!==undefined){`);
			const combined = tryGenCombined(prop, local, ctx);
			if (combined) lines.push(combined);
			else genCode(prop, local, lines, ctx);
			lines.push(`}}`);
		} else {
			lines.push(`if(typeof ${v}==='object'&&${v}!==null&&${JSON.stringify(key)} in ${v}){`);
			genCode(prop, `${v}[${JSON.stringify(key)}]`, lines, ctx);
			lines.push(`}`);
		}
		if (schema.items) {
			const idx = `_j${ctx.varCounter}`;
			const elem = `_e${ctx.varCounter}`;
			ctx.varCounter++;
			const start = Array.isArray(schema.prefixItems) ? schema.prefixItems.length : 0;
			lines.push(isArr ? `for(let ${idx}=${start};${idx}<${v}.length;${idx}++){const ${elem}=${v}[${idx}]` : `if(Array.isArray(${v})){for(let ${idx}=${start};${idx}<${v}.length;${idx}++){const ${elem}=${v}[${idx}]`);
			genCode(schema.items, elem, lines, ctx);
			lines.push(isArr ? `}` : `}}`);
		}
		if (schema.prefixItems) {
			const pfxVar = ctx.varCounter++;
			for (let i = 0; i < schema.prefixItems.length; i++) {
				const elem = `_p${pfxVar}_${i}`;
				lines.push(isArr ? `if(${v}.length>${i}){const ${elem}=${v}[${i}]` : `if(Array.isArray(${v})&&${v}.length>${i}){const ${elem}=${v}[${i}]`);
				genCode(schema.prefixItems[i], elem, lines, ctx);
				lines.push(`}`);
			}
		}
		if (schema.contains) {
			const ci = ctx.varCounter++;
			const minC = schema.minContains !== void 0 ? schema.minContains : 1;
			const maxC = schema.maxContains !== void 0 ? schema.maxContains : Infinity;
			const subLines = [];
			genCode(schema.contains, `_cv`, subLines, ctx);
			const fnBody = subLines.length === 0 ? `return true` : `${subLines.join(";")};return true`;
			const guard = isArr ? "" : `if(!Array.isArray(${v})){}else `;
			lines.push(`${guard}{const _cf${ci}=function(_cv){${fnBody}};let _cc${ci}=0`);
			lines.push(`for(let _ci${ci}=0;_ci${ci}<${v}.length;_ci${ci}++){if(_cf${ci}(${v}[_ci${ci}]))_cc${ci}++}`);
			if (maxC === Infinity) lines.push(`if(_cc${ci}<${minC})return false}`);
			else lines.push(`if(_cc${ci}<${minC}||_cc${ci}>${maxC})return false}`);
		}
		if (schema.allOf) for (const sub of schema.allOf) genCode(sub, v, lines, ctx, effectiveType);
		if (schema.anyOf && schema.unevaluatedProperties === void 0) {
			const fi = ctx.varCounter++;
			const branchBodies = [];
			let canHoist = !!ctx.preamble;
			for (let i = 0; i < schema.anyOf.length; i++) {
				const subLines = [];
				genCode(schema.anyOf[i], "_av", subLines, ctx);
				const body = subLines.length === 0 ? "return true" : `${subLines.join(";")};return true`;
				if (/\b_validate\b/.test(body)) canHoist = false;
				branchBodies.push(body);
			}
			if (canHoist) {
				const checks = branchBodies.map((body, i) => {
					const name = `_af${fi}_b${i}`;
					ctx.preamble.push(`function ${name}(_av){${body}}`);
					return name;
				}).map((n) => `${n}(${v})`).join("||");
				lines.push(`if(!(${checks}))return false`);
			} else {
				const fns = branchBodies.map((body) => `function(_av){${body}}`);
				lines.push(`{const _af${fi}=[${fns.join(",")}];let _am${fi}=false;for(let _ai=0;_ai<_af${fi}.length;_ai++){if(_af${fi}[_ai](${v})){_am${fi}=true;break}}if(!_am${fi})return false}`);
			}
		}
		if (schema.oneOf) {
			const fi = ctx.varCounter++;
			const branchBodies = [];
			let canHoist = !!ctx.preamble;
			for (let i = 0; i < schema.oneOf.length; i++) {
				const subLines = [];
				genCode(schema.oneOf[i], "_ov", subLines, ctx);
				const body = subLines.length === 0 ? "return true" : `${subLines.join(";")};return true`;
				if (/\b_validate\b/.test(body)) canHoist = false;
				branchBodies.push(body);
			}
			if (canHoist) {
				const calls = branchBodies.map((body, i) => {
					const name = `_of${fi}_b${i}`;
					ctx.preamble.push(`function ${name}(_ov){${body}}`);
					return name;
				}).map((n) => `if(${n}(${v})){_oc${fi}++;if(_oc${fi}>1)return false}`).join(";");
				lines.push(`{let _oc${fi}=0;${calls};if(_oc${fi}!==1)return false}`);
			} else {
				const fns = branchBodies.map((body) => `function(_ov){${body}}`);
				lines.push(`{const _of${fi}=[${fns.join(",")}];let _oc${fi}=0;for(let _oi=0;_oi<_of${fi}.length;_oi++){if(_of${fi}[_oi](${v}))_oc${fi}++;if(_oc${fi}>1)return false}if(_oc${fi}!==1)return false}`);
			}
		}
		if (schema.not) {
			const subLines = [];
			genCode(schema.not, "_nv", subLines, ctx);
			if (subLines.length === 0) lines.push(`return false`);
			else {
				const fi = ctx.varCounter++;
				lines.push(`{const _nf${fi}=(function(_nv){${subLines.join(";")};return true});if(_nf${fi}(${v}))return false}`);
			}
		}
		if (schema.if) {
			const ifLines = [];
			genCode(schema.if, "_iv", ifLines, ctx);
			const fi = ctx.varCounter++;
			const ifFn = ifLines.length === 0 ? `function(_iv){return true}` : `function(_iv){${ifLines.join(";")};return true}`;
			let thenFn = "null", elseFn = "null";
			if (schema.then) {
				const thenLines = [];
				genCode(schema.then, "_tv", thenLines, ctx);
				thenFn = thenLines.length === 0 ? `function(_tv){return true}` : `function(_tv){${thenLines.join(";")};return true}`;
			}
			if (schema.else) {
				const elseLines = [];
				genCode(schema.else, "_ev", elseLines, ctx);
				elseFn = elseLines.length === 0 ? `function(_ev){return true}` : `function(_ev){${elseLines.join(";")};return true}`;
			}
			lines.push(`{const _if${fi}=${ifFn};const _th${fi}=${thenFn};const _el${fi}=${elseFn}`);
			lines.push(`if(_if${fi}(${v})){if(_th${fi}&&!_th${fi}(${v}))return false}else{if(_el${fi}&&!_el${fi}(${v}))return false}}`);
		}
		if (schema.unevaluatedProperties !== void 0) {
			const evalResult = collectEvaluated(schema, ctx.schemaMap, ctx.rootDefs);
			if (evalResult.allProps || schema.unevaluatedProperties === true) {} else if (!evalResult.dynamic) {
				const knownKeys = evalResult.props;
				const propCount = knownKeys.length;
				if (schema.unevaluatedProperties === false) {
					const allRequired = schema.required && schema.required.length >= propCount && knownKeys.every((k) => schema.required.includes(k));
					let inner;
					if (allRequired && propCount > 0) {
						if (!ctx._earlyKeyCount) {
							inner = propCount <= 15 ? `var _n=0;for(var _k in ${v})_n++;if(_n!==${propCount})return false` : `if(Object.keys(${v}).length!==${propCount})return false`;
							_deferOrInline(ctx, lines, v, isObj ? inner : `if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v})){${inner}}`);
						}
					} else if (propCount > 0) {
						inner = genCharCodeSwitch(knownKeys, v);
						_deferOrInline(ctx, lines, v, isObj ? inner : `if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v})){${inner}}`);
					} else {
						inner = `for(var _k in ${v})return false`;
						_deferOrInline(ctx, lines, v, isObj ? inner : `if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v})){${inner}}`);
					}
				} else if (typeof schema.unevaluatedProperties === "object") {
					const ukVar = `_uk${ctx.varCounter++}`;
					const subLines = [];
					genCode(schema.unevaluatedProperties, `${v}[${ukVar}]`, subLines, ctx);
					if (subLines.length > 0) {
						const check = subLines.join(";");
						const keyChecks = knownKeys.map((k) => `${ukVar}===${JSON.stringify(k)}`).join("||");
						const inner = `for(var ${ukVar} in ${v}){${knownKeys.length > 0 ? `if(${keyChecks})continue;` : ""}${check}}`;
						_deferOrInline(ctx, lines, v, isObj ? inner : `if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v})){${inner}}`);
					}
				}
			} else {
				const baseResult = {
					props: [],
					items: null,
					allProps: false,
					allItems: false,
					dynamic: false
				};
				if (schema.properties) {
					for (const k of Object.keys(schema.properties)) if (!baseResult.props.includes(k)) baseResult.props.push(k);
				}
				if (schema.allOf) for (const sub of schema.allOf) {
					const subR = collectEvaluated(sub, ctx.schemaMap, ctx.rootDefs);
					if (!subR.dynamic && subR.props) {
						for (const k of subR.props) if (!baseResult.props.includes(k)) baseResult.props.push(k);
					}
				}
				const baseProps = baseResult.props;
				const branchKeyword = schema.anyOf ? "anyOf" : schema.oneOf ? "oneOf" : null;
				if (schema.unevaluatedProperties === false) {
					if (schema.if && (schema.then || schema.else) && !branchKeyword && !schema.patternProperties && !schema.dependentSchemas) {
						const ifLines2 = [];
						genCode(schema.if, "_iv2", ifLines2, ctx);
						const ufi = ctx.varCounter++;
						const ifFn2 = ifLines2.length === 0 ? `function(_iv2){return true}` : `function(_iv2){${ifLines2.join(";")};return true}`;
						const ifProps = [];
						if (schema.if && schema.if.properties) ifProps.push(...Object.keys(schema.if.properties));
						const thenEval = schema.then ? collectEvaluated(schema.then, ctx.schemaMap, ctx.rootDefs) : { props: [] };
						const elseEval = schema.else ? collectEvaluated(schema.else, ctx.schemaMap, ctx.rootDefs) : { props: [] };
						const uniqueThen = [.../* @__PURE__ */ new Set([
							...baseProps,
							...ifProps,
							...thenEval.props || []
						])];
						const uniqueElse = [.../* @__PURE__ */ new Set([...baseProps, ...elseEval.props || []])];
						const thenCheck = genCharCodeSwitch(uniqueThen, v);
						const elseCheck = genCharCodeSwitch(uniqueElse, v);
						const guard = isObj ? "" : `if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v}))`;
						lines.push(`${guard}{const _uif${ufi}=${ifFn2};if(_uif${ufi}(${v})){${thenCheck}}else{${elseCheck}}}`);
					} else if (branchKeyword) {
						const branches = schema[branchKeyword];
						const branchProps = [];
						for (const sub of branches) {
							const subResult = collectEvaluated(sub, ctx.schemaMap, ctx.rootDefs);
							branchProps.push(subResult.props || []);
						}
						const dynamicOnly = [...new Set(branchProps.flat())].filter((k) => !baseProps.includes(k));
						if (dynamicOnly.length > 0 && dynamicOnly.length <= 32) {
							const evVar = `_ev${ctx.varCounter++}`;
							const bitMap = /* @__PURE__ */ new Map();
							dynamicOnly.forEach((k, i) => bitMap.set(k, i));
							const branchMasks = branchProps.map((props) => {
								let mask = 0;
								for (const p of props) if (bitMap.has(p)) mask |= 1 << bitMap.get(p);
								return mask;
							});
							const bfi = ctx.varCounter++;
							lines.push(`{let ${evVar}=0`);
							const fnVars = [];
							for (let i = 0; i < branches.length; i++) {
								const subLines2 = [];
								genCode(branches[i], "_bv", subLines2, ctx);
								const fnVar = `_bf${bfi}_${i}`;
								fnVars.push(fnVar);
								const fnBody = subLines2.length === 0 ? `function(_bv){return true}` : `function(_bv){${subLines2.join(";")};return true}`;
								lines.push(`const ${fnVar}=${fnBody}`);
							}
							if (branchKeyword === "oneOf") {
								lines.push(`let _oc${bfi}=0`);
								for (let i = 0; i < branches.length; i++) lines.push(`if(${fnVars[i]}(${v})){_oc${bfi}++;${evVar}=${branchMasks[i]};if(_oc${bfi}>1)return false}`);
								lines.push(`if(_oc${bfi}!==1)return false`);
							} else {
								lines.push(`let _am${bfi}=false`);
								for (let i = 0; i < branches.length; i++) lines.push(`if(${fnVars[i]}(${v})){_am${bfi}=true;${evVar}|=${branchMasks[i]}}`);
								lines.push(`if(!_am${bfi})return false`);
							}
							const staticCheck = baseProps.length > 0 ? baseProps.map((k) => `_k===${JSON.stringify(k)}`).join("||") : "";
							const groups = /* @__PURE__ */ new Map();
							for (const k of dynamicOnly) {
								const cc = k.charCodeAt(0);
								if (!groups.has(cc)) groups.set(cc, []);
								groups.get(cc).push(k);
							}
							let switchCases = "";
							for (const [cc, groupKeys] of groups) {
								const cond = groupKeys.map((k) => `_k===${JSON.stringify(k)}&&(${evVar}&${1 << bitMap.get(k)})`).join("||");
								switchCases += `case ${cc}:if(${cond})continue;break;`;
							}
							const dynamicCheck = `switch(_k.charCodeAt(0)){${switchCases}default:break}`;
							const inner = staticCheck ? `for(var _k in ${v}){if(${staticCheck})continue;${dynamicCheck}return false}` : `for(var _k in ${v}){${dynamicCheck}return false}`;
							_deferOrInline(ctx, lines, v, isObj ? inner + "}" : `if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v})){${inner}}}`);
						} else {
							const evVar = `_ev${ctx.varCounter++}`;
							const fns = [];
							for (let i = 0; i < branches.length; i++) {
								const subLines2 = [];
								genCode(branches[i], "_bv", subLines2, ctx);
								fns.push(subLines2.length === 0 ? `function(_bv){return true}` : `function(_bv){${subLines2.join(";")};return true}`);
							}
							const bfi = ctx.varCounter++;
							ctx.closureVars.push(`_bk${bfi}`);
							ctx.closureVals.push(branchProps);
							lines.push(`{const ${evVar}={}`);
							for (const k of baseProps) lines.push(`${evVar}[${JSON.stringify(k)}]=1`);
							lines.push(`const _bf${bfi}=[${fns.join(",")}]`);
							if (branchKeyword === "oneOf") lines.push(`let _oc${bfi}=0;for(let _bi=0;_bi<_bf${bfi}.length;_bi++){if(_bf${bfi}[_bi](${v})){_oc${bfi}++;for(const _p of _bk${bfi}[_bi])${evVar}[_p]=1;if(_oc${bfi}>1)return false}}if(_oc${bfi}!==1)return false`);
							else lines.push(`let _am${bfi}=false;for(let _bi=0;_bi<_bf${bfi}.length;_bi++){if(_bf${bfi}[_bi](${v})){_am${bfi}=true;for(const _p of _bk${bfi}[_bi])${evVar}[_p]=1}}if(!_am${bfi})return false`);
							const inner = `for(var _k in ${v}){if(!${evVar}[_k])return false}`;
							_deferOrInline(ctx, lines, v, isObj ? inner + "}" : `if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v})){${inner}}}`);
						}
					} else if (schema.dependentSchemas) {
						const evVar = `_ev${ctx.varCounter++}`;
						lines.push(`{const ${evVar}={}`);
						for (const k of baseProps) lines.push(`${evVar}[${JSON.stringify(k)}]=1`);
						for (const [trigger, depSchema] of Object.entries(schema.dependentSchemas)) {
							const depResult = collectEvaluated(depSchema, ctx.schemaMap, ctx.rootDefs);
							if (depResult.props && depResult.props.length > 0) lines.push(`if(${JSON.stringify(trigger)} in ${v}){${depResult.props.map((k) => `${evVar}[${JSON.stringify(k)}]=1`).join(";")}}`);
						}
						const inner = `for(var _k in ${v}){if(!${evVar}[_k])return false}`;
						_deferOrInline(ctx, lines, v, isObj ? inner + "}" : `if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v})){${inner}}}`);
					} else {
						const allPatterns = [];
						if (schema.patternProperties) allPatterns.push(...Object.keys(schema.patternProperties));
						if (schema.allOf) {
							for (const sub of schema.allOf) if (sub && sub.patternProperties) allPatterns.push(...Object.keys(sub.patternProperties));
						}
						if (schema.if && !schema.then && !schema.else && schema.if.patternProperties) allPatterns.push(...Object.keys(schema.if.patternProperties));
						if (allPatterns.length > 0) {
							const evVar = `_ev${ctx.varCounter++}`;
							lines.push(`{const ${evVar}={}`);
							for (const k of baseProps) lines.push(`${evVar}[${JSON.stringify(k)}]=1`);
							const reVars = [];
							for (const pat of allPatterns) {
								const ri = ctx.varCounter++;
								ctx.closureVars.push(`_ure${ri}`);
								ctx.closureVals.push(safeReClosure(ctx, pat));
								reVars.push(`_ure${ri}`);
							}
							if (schema.if && !schema.then && !schema.else) {
								const ifLines2 = [];
								genCode(schema.if, "_iv2", ifLines2, ctx);
								const ufi = ctx.varCounter++;
								const ifFn = ifLines2.length === 0 ? `function(_iv2){return true}` : `function(_iv2){${ifLines2.join(";")};return true}`;
								const ifPatterns = schema.if.patternProperties ? Object.keys(schema.if.patternProperties) : [];
								const ifReVars = [];
								for (const pat of ifPatterns) {
									const ri = ctx.varCounter++;
									ctx.closureVars.push(`_ure${ri}`);
									ctx.closureVals.push(safeReClosure(ctx, pat));
									ifReVars.push(`_ure${ri}`);
								}
								const rootReVars = [];
								if (schema.patternProperties) for (const pat of Object.keys(schema.patternProperties)) {
									const ri = ctx.varCounter++;
									ctx.closureVars.push(`_ure${ri}`);
									ctx.closureVals.push(safeReClosure(ctx, pat));
									rootReVars.push(`_ure${ri}`);
								}
								const rootPatCheck = rootReVars.map((rv) => `if(${rv}.test(_k))continue;`).join("");
								const inner = `const _uif${ufi}=${ifFn};if(_uif${ufi}(${v})){for(var _k in ${v}){if(${evVar}[_k])continue;${rootPatCheck}${ifReVars.map((rv) => `if(${rv}.test(_k))continue;`).join("")}return false}}else{for(var _k in ${v}){if(${evVar}[_k])continue;${rootPatCheck}return false}}`;
								_deferOrInline(ctx, lines, v, isObj ? inner + "}" : `if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v})){${inner}}}`);
							} else {
								const inner = `for(var _k in ${v}){if(${evVar}[_k])continue;${reVars.map((rv) => `if(${rv}.test(_k)){${evVar}[_k]=1;continue}`).join("")}return false}`;
								_deferOrInline(ctx, lines, v, isObj ? inner + "}" : `if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v})){${inner}}}`);
							}
						}
					}
				} else if (typeof schema.unevaluatedProperties === "object") {
					const ei = ctx.varCounter++;
					const evVar = `_ev${ei}`;
					const ukVar = `_uk${ei}`;
					lines.push(`{const ${evVar}={}`);
					for (const k of baseProps) lines.push(`${evVar}[${JSON.stringify(k)}]=1`);
					if (branchKeyword) {
						const branches = schema[branchKeyword];
						const branchProps = [];
						for (const sub of branches) {
							const subResult = collectEvaluated(sub, ctx.schemaMap, ctx.rootDefs);
							branchProps.push(subResult.props || []);
						}
						const fns = [];
						for (let i = 0; i < branches.length; i++) {
							const subLines2 = [];
							genCode(branches[i], "_bv", subLines2, ctx);
							fns.push(subLines2.length === 0 ? `function(_bv){return true}` : `function(_bv){${subLines2.join(";")};return true}`);
						}
						const bfi = ctx.varCounter++;
						ctx.closureVars.push(`_bk${bfi}`);
						ctx.closureVals.push(branchProps);
						lines.push(`const _bf${bfi}=[${fns.join(",")}]`);
						if (branchKeyword === "oneOf") lines.push(`for(let _bi=0;_bi<_bf${bfi}.length;_bi++){if(_bf${bfi}[_bi](${v})){for(const _p of _bk${bfi}[_bi])${evVar}[_p]=1;break}}`);
						else lines.push(`for(let _bi=0;_bi<_bf${bfi}.length;_bi++){if(_bf${bfi}[_bi](${v})){for(const _p of _bk${bfi}[_bi])${evVar}[_p]=1}}`);
					}
					const subLines2 = [];
					genCode(schema.unevaluatedProperties, `${v}[${ukVar}]`, subLines2, ctx);
					if (subLines2.length > 0) {
						const inner = `for(var ${ukVar} in ${v}){if(${evVar}[${ukVar}])continue;${subLines2.join(";")}}`;
						_deferOrInline(ctx, lines, v, isObj ? inner + "}" : `if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v})){${inner}}}`);
					} else lines.push("}");
				}
			}
		}
		if (schema.unevaluatedItems !== void 0) {
			const evalResult = collectEvaluated(schema, ctx.schemaMap, ctx.rootDefs);
			const branchKw = schema.anyOf ? "anyOf" : schema.oneOf ? "oneOf" : null;
			const hasConditionalItems = evalResult.allItems && evalResult.dynamic && branchKw && schema[branchKw].some((sub) => sub && typeof sub === "object" && (sub.items && typeof sub.items === "object" || sub.items === true));
			if (schema.unevaluatedItems === true || evalResult.allItems && !hasConditionalItems) {} else if (!evalResult.dynamic) {
				if (schema.unevaluatedItems === false) {
					const inner = `if(${v}.length>${evalResult.items || 0})return false`;
					_deferOrInline(ctx, lines, v, isArr ? inner : `if(Array.isArray(${v})){${inner}}`);
				} else if (typeof schema.unevaluatedItems === "object") {
					const maxIdx = evalResult.items || 0;
					const ui = ctx.varCounter++;
					const elemVar = `_ue${ui}`;
					const idxVar = `_ui${ui}`;
					const subLines = [];
					genCode(schema.unevaluatedItems, elemVar, subLines, ctx);
					if (subLines.length > 0) {
						const inner = `for(let ${idxVar}=${maxIdx};${idxVar}<${v}.length;${idxVar}++){const ${elemVar}=${v}[${idxVar}];${subLines.join(";")}}`;
						_deferOrInline(ctx, lines, v, isArr ? inner : `if(Array.isArray(${v})){${inner}}`);
					}
				}
			} else {
				let baseIdx = 0;
				if (schema.prefixItems) baseIdx = Math.max(baseIdx, schema.prefixItems.length);
				if (schema.items && typeof schema.items === "object") baseIdx = Infinity;
				if (schema.allOf) for (const sub of schema.allOf) {
					const subR = collectEvaluated(sub, ctx.schemaMap, ctx.rootDefs);
					if (subR.items !== null) baseIdx = Math.max(baseIdx, subR.items);
					if (subR.allItems) baseIdx = Infinity;
				}
				if (baseIdx === Infinity) baseIdx = 0;
				const branchKeyword = schema.anyOf ? "anyOf" : schema.oneOf ? "oneOf" : null;
				if (branchKeyword && (schema.unevaluatedItems === false || typeof schema.unevaluatedItems === "object")) {
					const branches = schema[branchKeyword];
					const branchMaxIdx = [];
					const branchAllItems = [];
					for (const sub of branches) {
						const subR = collectEvaluated(sub, ctx.schemaMap, ctx.rootDefs);
						branchMaxIdx.push(subR.items || 0);
						branchAllItems.push(subR.allItems);
					}
					const fns = [];
					for (let i = 0; i < branches.length; i++) {
						const subLines2 = [];
						genCode(branches[i], "_bv", subLines2, ctx);
						fns.push(subLines2.length === 0 ? `function(_bv){return true}` : `function(_bv){${subLines2.join(";")};return true}`);
					}
					const bfi = ctx.varCounter++;
					const evVar = `_eidx${ctx.varCounter++}`;
					lines.push(`{let ${evVar}=${baseIdx}`);
					lines.push(`const _bf${bfi}=[${fns.join(",")}]`);
					const maxExprs = branchMaxIdx.map((m, i) => {
						if (branchAllItems[i]) return `_bi===${i}?${v}.length`;
						return `_bi===${i}?${Math.max(m, baseIdx)}`;
					}).join(":") + `:${baseIdx}`;
					if (branchKeyword === "oneOf") lines.push(`for(let _bi=0;_bi<_bf${bfi}.length;_bi++){if(_bf${bfi}[_bi](${v})){${evVar}=${maxExprs};break}}`);
					else lines.push(`for(let _bi=0;_bi<_bf${bfi}.length;_bi++){if(_bf${bfi}[_bi](${v})){const _m=${maxExprs};if(_m>${evVar})${evVar}=_m}}`);
					if (schema.unevaluatedItems === false) {
						const inner = `if(${v}.length>${evVar})return false`;
						_deferOrInline(ctx, lines, v, isArr ? inner + "}" : `if(Array.isArray(${v})){${inner}}}`);
					} else {
						const ui = ctx.varCounter++;
						const elemVar = `_ue${ui}`;
						const idxVar = `_ui${ui}`;
						const subLines = [];
						genCode(schema.unevaluatedItems, elemVar, subLines, ctx);
						if (subLines.length > 0) {
							const inner = `for(let ${idxVar}=${evVar};${idxVar}<${v}.length;${idxVar}++){const ${elemVar}=${v}[${idxVar}];${subLines.join(";")}}`;
							_deferOrInline(ctx, lines, v, isArr ? inner + "}" : `if(Array.isArray(${v})){${inner}}}`);
						} else lines.push("}");
					}
				} else if (schema.if && (schema.unevaluatedItems === false || typeof schema.unevaluatedItems === "object")) {
					const ifEval = collectEvaluated(schema.if, ctx.schemaMap, ctx.rootDefs);
					const thenEval = schema.then ? collectEvaluated(schema.then, ctx.schemaMap, ctx.rootDefs) : { items: null };
					const elseEval = schema.else ? collectEvaluated(schema.else, ctx.schemaMap, ctx.rootDefs) : { items: null };
					const ifIdx = ifEval.items || 0;
					const thenIdx = Math.max(baseIdx, ifIdx, thenEval.items || 0);
					const elseIdx = Math.max(baseIdx, elseEval.items || 0);
					const ifLines2 = [];
					genCode(schema.if, "_iv3", ifLines2, ctx);
					const ufi = ctx.varCounter++;
					const ifFn3 = ifLines2.length === 0 ? `function(_iv3){return true}` : `function(_iv3){${ifLines2.join(";")};return true}`;
					if (schema.unevaluatedItems === false) {
						const guard = isArr ? "" : `if(Array.isArray(${v}))`;
						lines.push(`${guard}{const _uif${ufi}=${ifFn3};if(_uif${ufi}(${v})){if(${v}.length>${thenIdx})return false}else{if(${v}.length>${elseIdx})return false}}`);
					}
				} else if ((schema.contains || schema.allOf && schema.allOf.some((s) => s && s.contains)) && (schema.unevaluatedItems === false || typeof schema.unevaluatedItems === "object")) {
					const allContains = [];
					if (schema.contains) allContains.push(schema.contains);
					if (schema.allOf) {
						for (const sub of schema.allOf) if (sub && sub.contains) allContains.push(sub.contains);
					}
					const ci = ctx.varCounter++;
					const evArr = `_cev${ci}`;
					const containsFns = [];
					for (const c of allContains) {
						const cLines = [];
						genCode(c, "_cv", cLines, ctx);
						containsFns.push(cLines.length === 0 ? `function(_cv){return true}` : `function(_cv){${cLines.join(";")};return true}`);
					}
					const cfnArr = `_cfn${ci}`;
					lines.push(`{const ${cfnArr}=[${containsFns.join(",")}]`);
					lines.push(`const ${evArr}=[]`);
					if (baseIdx > 0) lines.push(`for(let _i=0;_i<${Math.min(baseIdx, 1e3)};_i++)${evArr}[_i]=true`);
					lines.push(`if(Array.isArray(${v})){for(let _ci=0;_ci<${v}.length;_ci++){for(let _cj=0;_cj<${cfnArr}.length;_cj++){if(${cfnArr}[_cj](${v}[_ci])){${evArr}[_ci]=true;break}}}}`);
					if (schema.unevaluatedItems === false) _deferOrInline(ctx, lines, v, `if(Array.isArray(${v})){for(let _ci=0;_ci<${v}.length;_ci++){if(!${evArr}[_ci])return false}}}`);
					else {
						const elemVar = `_ue${ctx.varCounter++}`;
						const subLines = [];
						genCode(schema.unevaluatedItems, elemVar, subLines, ctx);
						if (subLines.length > 0) _deferOrInline(ctx, lines, v, `if(Array.isArray(${v})){for(let _ci=0;_ci<${v}.length;_ci++){if(!${evArr}[_ci]){const ${elemVar}=${v}[_ci];${subLines.join(";")}}}}}`);
						else lines.push("}");
					}
				} else if (schema.unevaluatedItems === false) {
					const inner = `if(${v}.length>${evalResult.items || 0})return false`;
					_deferOrInline(ctx, lines, v, isArr ? inner : `if(Array.isArray(${v})){${inner}}`);
				}
			}
		}
	}
	const FORMAT_CODEGEN = {
		email: (v, isStr) => {
			isStr || `${v}`;
			return isStr ? `{const _at=${v}.indexOf('@');if(_at<=0||_at>=${v}.length-1||${v}.indexOf('.',_at)<=_at+1)return false}` : `if(typeof ${v}==='string'){const _at=${v}.indexOf('@');if(_at<=0||_at>=${v}.length-1||${v}.indexOf('.',_at)<=_at+1)return false}`;
		},
		date: (v, isStr) => isStr ? `{if(${v}.length!==10||!/^\\d{4}-\\d{2}-\\d{2}$/.test(${v}))return false;const _dm=+${v}.slice(5,7),_dd=+${v}.slice(8,10);if(_dm<1||_dm>12||_dd<1||_dd>31)return false}` : `if(typeof ${v}==='string'){if(${v}.length!==10||!/^\\d{4}-\\d{2}-\\d{2}$/.test(${v}))return false;const _dm=+${v}.slice(5,7),_dd=+${v}.slice(8,10);if(_dm<1||_dm>12||_dd<1||_dd>31)return false}`,
		uuid: (v, isStr) => isStr ? `if(${v}.length!==36||!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(${v}))return false` : `if(typeof ${v}==='string'&&(${v}.length!==36||!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(${v})))return false`,
		"date-time": (v, isStr) => isStr ? `if(!/^\\d{4}-\\d{2}-\\d{2}[Tt]\\d{2}:\\d{2}:\\d{2}(\\.\\d+)?([Zz]|[+-]\\d{2}:\\d{2})$/.test(${v})||isNaN(Date.parse(${v})))return false` : `if(typeof ${v}==='string'&&(!/^\\d{4}-\\d{2}-\\d{2}[Tt]\\d{2}:\\d{2}:\\d{2}(\\.\\d+)?([Zz]|[+-]\\d{2}:\\d{2})$/.test(${v})||isNaN(Date.parse(${v}))))return false`,
		time: (v, isStr) => isStr ? `if(!/^([01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d(\\.\\d+)?(Z|[+-]\\d{2}:\\d{2})?$/.test(${v}))return false` : `if(typeof ${v}==='string'&&!/^([01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d(\\.\\d+)?(Z|[+-]\\d{2}:\\d{2})?$/.test(${v}))return false`,
		duration: (v, isStr) => isStr ? `if(!/^P(?:\\d+Y)?(?:\\d+M)?(?:\\d+W)?(?:\\d+D)?(?:T(?:\\d+H)?(?:\\d+M)?(?:\\d+(?:\\.\\d+)?S)?)?$/.test(${v})||${v}==='P'||${v}.endsWith('T'))return false` : `if(typeof ${v}==='string'&&(!/^P(?:\\d+Y)?(?:\\d+M)?(?:\\d+W)?(?:\\d+D)?(?:T(?:\\d+H)?(?:\\d+M)?(?:\\d+(?:\\.\\d+)?S)?)?$/.test(${v})||${v}==='P'||${v}.endsWith('T')))return false`,
		uri: (v, isStr) => isStr ? `if(!/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(${v})||/[\\s\\u0000-\\u001f\\u007f]/.test(${v}))return false` : `if(typeof ${v}==='string'&&(!/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(${v})||/[\\s\\u0000-\\u001f\\u007f]/.test(${v})))return false`,
		"uri-reference": (v, isStr) => isStr ? `if(/[\\s\\u0000-\\u001f\\u007f]/.test(${v}))return false` : `if(typeof ${v}==='string'&&/[\\s\\u0000-\\u001f\\u007f]/.test(${v}))return false`,
		ipv4: (v, isStr) => isStr ? `{const _p=${v}.split('.');if(_p.length!==4||!_p.every(function(n){var x=+n;return x>=0&&x<=255&&String(x)===n}))return false}` : `if(typeof ${v}==='string'){const _p=${v}.split('.');if(_p.length!==4||!_p.every(function(n){var x=+n;return x>=0&&x<=255&&String(x)===n}))return false}`,
		ipv6: (v, isStr) => isStr ? `{const _s=${v};if(_s===''||!/^[0-9a-fA-F:]+$/.test(_s)||_s.split(':').length<3||_s.split(':').length>8)return false}` : `if(typeof ${v}==='string'){const _s=${v};if(_s===''||!/^[0-9a-fA-F:]+$/.test(_s)||_s.split(':').length<3||_s.split(':').length>8)return false}`,
		hostname: (v, isStr) => isStr ? `if(!/^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(${v}))return false` : `if(typeof ${v}==='string'&&!/^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(${v}))return false`
	};
	function esc(s) {
		return JSON.stringify(s).slice(1, -1);
	}
	function ptrSeg(s) {
		return s.replace(/~/g, "~0").replace(/\//g, "~1").replace(/\\/g, "\\\\").replace(/'/g, "\\'");
	}
	function childPathExpr(parentExpr, suffix) {
		if (!parentExpr) return `'/${suffix}'`;
		if (parentExpr.startsWith("'") && !parentExpr.includes("+")) return `'${parentExpr.slice(1, -1)}/${suffix}'`;
		return `${parentExpr}+'/${suffix}'`;
	}
	function compilePatternInline(pattern, varName) {
		let m = pattern.match(/^\^(\[[\w\-]+\])\{(\d+)\}\$$/);
		if (m) {
			const len = parseInt(m[2]);
			if (len <= 16) {
				const checks = [];
				for (let i = 0; i < len; i++) {
					const ck = charClassToCheck(m[1], `${varName}.charCodeAt(${i})`);
					if (!ck) return null;
					checks.push(ck);
				}
				return `${varName}.length===${len}&&${checks.join("&&")}`;
			}
			const rangeCheck = charClassToCheck(m[1], `${varName}.charCodeAt(_pi)`);
			if (!rangeCheck) return null;
			return `${varName}.length===${len}&&(()=>{for(let _pi=0;_pi<${len};_pi++){if(!(${rangeCheck}))return false}return true})()`;
		}
		m = pattern.match(/^\^(\[[\w\-]+\])\+\$$/);
		if (m) {
			const rangeCheck = charClassToCheck(m[1], `${varName}.charCodeAt(_pi)`);
			if (!rangeCheck) return null;
			return `${varName}.length>0&&(()=>{for(let _pi=0;_pi<${varName}.length;_pi++){if(!(${rangeCheck}))return false}return true})()`;
		}
		m = pattern.match(/^\^(\[[\w\-]+\])\{(\d+),(\d+)\}\$$/);
		if (m) {
			const rangeCheck = charClassToCheck(m[1], `${varName}.charCodeAt(_pi)`);
			if (!rangeCheck) return null;
			return `${varName}.length>=${parseInt(m[2])}&&${varName}.length<=${parseInt(m[3])}&&(()=>{for(let _pi=0;_pi<${varName}.length;_pi++){if(!(${rangeCheck}))return false}return true})()`;
		}
		return null;
	}
	function charClassToCheck(charClass, codeExpr) {
		const inner = charClass.slice(1, -1);
		const ranges = [];
		let i = 0;
		while (i < inner.length) if (i + 2 < inner.length && inner[i + 1] === "-") {
			ranges.push([inner.charCodeAt(i), inner.charCodeAt(i + 2)]);
			i += 3;
		} else {
			ranges.push([inner.charCodeAt(i), inner.charCodeAt(i)]);
			i++;
		}
		if (ranges.length === 0) return null;
		return ranges.map(([lo, hi]) => lo === hi ? `${codeExpr}===${lo}` : `(${codeExpr}>=${lo}&&${codeExpr}<=${hi})`).join("||");
	}
	function childPathDynExpr(parentExpr, indexExpr) {
		if (!parentExpr) return `'/'+${indexExpr}`;
		return `${parentExpr}+'/'+${indexExpr}`;
	}
	function fastPrefixCheck(pattern, keyVar) {
		const m = pattern.match(/^\^([a-zA-Z0-9_\-./]+)$/);
		if (!m) return null;
		const prefix = m[1];
		if (prefix.length === 0 || prefix.length > 8) return null;
		if (prefix.length === 1) return `${keyVar}.charCodeAt(0)===${prefix.charCodeAt(0)}`;
		if (prefix.length === 2) return `${keyVar}.charCodeAt(0)===${prefix.charCodeAt(0)}&&${keyVar}.charCodeAt(1)===${prefix.charCodeAt(1)}`;
		return `${keyVar}.startsWith(${JSON.stringify(prefix)})`;
	}
	function genCharCodeSwitch(keys, v) {
		if (keys.length === 0) return `for(var _k in ${v})return false`;
		if (keys.length <= 3) return `for(var _k in ${v})if(${keys.map((k) => `_k!==${JSON.stringify(k)}`).join("&&")})return false`;
		const groups = /* @__PURE__ */ new Map();
		for (const k of keys) {
			const cc = k.charCodeAt(0);
			if (!groups.has(cc)) groups.set(cc, []);
			groups.get(cc).push(k);
		}
		let cases = "";
		for (const [cc, groupKeys] of groups) {
			const cond = groupKeys.map((k) => `_k===${JSON.stringify(k)}`).join("||");
			cases += `case ${cc}:if(${cond})continue;break;`;
		}
		return `for(var _k in ${v}){switch(_k.charCodeAt(0)){${cases}default:break}return false}`;
	}
	function compileToJSCodegenWithErrors(schema, schemaMap, userFormats, sourceOpts) {
		if (typeof schema === "object" && schema !== null) {
			const s = JSON.stringify(schema);
			if (s.includes("unevaluatedProperties") || s.includes("unevaluatedItems")) return null;
			if (s.includes("\"$ref\":\"#\"")) return null;
		}
		if (typeof schema === "boolean") return schema ? () => ({
			valid: true,
			errors: []
		}) : () => ({
			valid: false,
			errors: [{
				keyword: "false schema",
				instancePath: "",
				schemaPath: "#",
				params: {},
				message: "boolean schema is false"
			}]
		});
		if (typeof schema !== "object" || schema === null) return null;
		if (!sharedCodegenGate(schema, schemaMap)) return null;
		if (schema.patternProperties) for (const [pat, sub] of Object.entries(schema.patternProperties)) {
			if (typeof sub === "boolean") return null;
			if (/\\[pP]\{/.test(pat)) return null;
			if (typeof sub === "object" && sub !== null && !codegenSafe(sub, schemaMap)) return null;
		}
		if (schema.dependentSchemas) for (const sub of Object.values(schema.dependentSchemas)) {
			if (typeof sub === "boolean") return null;
			if (typeof sub === "object" && sub !== null && !codegenSafe(sub, schemaMap)) return null;
		}
		if (schema.propertyNames) {
			if (typeof schema.propertyNames === "boolean") return null;
			const pn = schema.propertyNames;
			const supported = [
				"maxLength",
				"minLength",
				"pattern",
				"const",
				"enum"
			];
			if (Object.keys(pn).filter((k) => k !== "$schema").some((k) => !supported.includes(k))) return null;
		}
		const eRootDefs = schema.$defs || schema.definitions || null;
		const eAnchors = {};
		if (schema.$dynamicAnchor) eAnchors["#" + schema.$dynamicAnchor] = schema;
		if (schema.$anchor) eAnchors["#" + schema.$anchor] = schema;
		if (typeof schema.$id === "string" && schema.$id.startsWith("#")) eAnchors[schema.$id] = schema;
		if (eRootDefs) {
			for (const def of Object.values(eRootDefs)) if (def && typeof def === "object") {
				if (def.$dynamicAnchor) eAnchors["#" + def.$dynamicAnchor] = def;
				if (def.$anchor) eAnchors["#" + def.$anchor] = def;
				if (typeof def.$id === "string" && def.$id.startsWith("#")) eAnchors[def.$id] = def;
			}
		}
		if (schemaMap) {
			for (const ext of schemaMap.values()) if (ext && typeof ext === "object") {
				if (ext.$dynamicAnchor && !eAnchors["#" + ext.$dynamicAnchor]) eAnchors["#" + ext.$dynamicAnchor] = ext;
				if (ext.$anchor && !eAnchors["#" + ext.$anchor]) eAnchors["#" + ext.$anchor] = ext;
				if (typeof ext.$id === "string" && ext.$id.startsWith("#") && !eAnchors[ext.$id]) eAnchors[ext.$id] = ext;
			}
		}
		if (hasUnresolvableRef(schema, eRootDefs, eAnchors, schemaMap, /* @__PURE__ */ new Set())) return null;
		if (needsBaseTracking(schema, schemaMap, /* @__PURE__ */ new Set())) return null;
		const ctx = {
			varCounter: 0,
			helperCode: [],
			rootDefs: eRootDefs,
			refStack: /* @__PURE__ */ new Set(),
			schemaMap: schemaMap || null,
			anchors: eAnchors,
			rootSchema: schema,
			userFormats: userFormats || null,
			sourceMap: sourceOpts && sourceOpts.sourceMap && sourceOpts.schemaFile ? {
				file: sourceOpts.schemaFile,
				map: sourceOpts.sourceMap
			} : null
		};
		ctx.helperCode.push("const _cpLen=s=>{let n=0;for(const _ of s)n++;return n}");
		const lines = [];
		genCodeE(schema, "d", "", lines, ctx, "#");
		if (ctx.usesBranchCollapse) ctx.helperCode.push("const __ATA_SEVERITY={type:10,const:8,enum:8,required:5,format:3,minLength:3,maxLength:3,minimum:3,maximum:3,pattern:3,additionalProperties:2,unevaluatedProperties:2,unevaluatedItems:2};function __ataScore(errs){if(!errs||!errs.length)return 0;let s=0;for(const e of errs)s+=__ATA_SEVERITY[e.keyword]||4;return errs.length*100+s}function __ataCollapse(kw,br,pp,sp){const pass=br.filter(b=>b.valid);if(kw==='oneOf'){if(pass.length===1)return null;if(pass.length>1)return{code:'ATA4002',keyword:'oneOf',instancePath:pp||'',path:pp||'',schemaPath:sp,message:'value matched '+pass.length+' of '+br.length+' oneOf variants, expected exactly one',params:{matched:pass.length,total:br.length}}}else{if(pass.length>=1)return null}let bi=0,bs=Infinity;for(let i=0;i<br.length;i++){const s=__ataScore(br[i].errors);if(s<bs){bs=s;bi=i}}const code=kw==='oneOf'?'ATA4001':'ATA4003';const best=br[bi];return{code,keyword:kw,instancePath:pp||'',path:pp||'',schemaPath:sp,message:'value matched 0 of '+br.length+' '+kw+' variants',params:{variants:br.length,closest:bi,closestName:best.title||('variant '+(bi+1))},branchErrors:best.errors}}");
		if (lines.length === 0) return (d) => ({
			valid: true,
			errors: []
		});
		const checkStr = lines.join("\n  ");
		let body;
		if (ctx.usesRecursion) body = `const _e=[];\n  ` + (ctx.helperCode.length ? ctx.helperCode.join("\n  ") + "\n  " : "") + `function _validateE(d,_all,_e){\n  ${checkStr}\n  }\n  _validateE(d,_all,_e);\n  return{valid:_e.length===0,errors:_e}`;
		else body = `const _e=[];\n  ` + (ctx.helperCode.length ? ctx.helperCode.join("\n  ") + "\n  " : "") + checkStr + `\n  return{valid:_e.length===0,errors:_e}`;
		try {
			let fn;
			if (ctx.usesSafeRe) {
				const built = new Function("__ataSafeRe", "d", "_all", body);
				fn = (d, _all) => built(compileSafe, d, _all);
			} else fn = new Function("d", "_all", body);
			fn._errSource = body;
			fn._usesSafeRe = !!ctx.usesSafeRe;
			return fn;
		} catch {
			return null;
		}
	}
	function emitBranchCollapse(branches, keyword, v, pathExpr, lines, ctx, schemaPrefix) {
		ctx.usesBranchCollapse = true;
		const fi = ctx.varCounter++;
		const branchKw = keyword;
		const branchSp = schemaPrefix + "/" + branchKw;
		const fns = [];
		const titles = [];
		for (let i = 0; i < branches.length; i++) {
			const sub = branches[i];
			const subLines = [];
			const subSp = branchSp + "/" + i;
			if (typeof sub === "object" && sub !== null) genCodeE(sub, "_bv", pathExpr, subLines, ctx, subSp);
			const title = sub && typeof sub === "object" && typeof sub.title === "string" ? sub.title : "";
			titles.push(title);
			const body = subLines.length === 0 ? `function(_bv){return{valid:true,errors:[]}}` : `function(_bv){const _e=[];${subLines.join(";")};return{valid:_e.length===0,errors:_e}}`;
			fns.push(body);
		}
		const fnArr = `_brf${fi}`;
		const resArr = `_brr${fi}`;
		const titleArr = JSON.stringify(titles);
		const collapsed = `_brc${fi}`;
		const pp = pathExpr || "\"\"";
		lines.push(`{const ${fnArr}=[${fns.join(",")}];const _bt${fi}=${titleArr};const ${resArr}=[];for(let _bi=0;_bi<${fnArr}.length;_bi++){const _br=${fnArr}[_bi](${v});${resArr}.push({valid:_br.valid,errors:_br.errors,title:_bt${fi}[_bi]})}const ${collapsed}=__ataCollapse('${branchKw}',${resArr},${pp},'${branchSp}');if(${collapsed}){_e.push(${collapsed});if(!_all)return{valid:false,errors:_e}}}`);
	}
	function genCodeE(schema, v, pathExpr, lines, ctx, schemaPrefix) {
		if (!schemaPrefix) schemaPrefix = "#";
		if (typeof schema !== "object" || schema === null) return;
		if (!ctx.regExpMap) ctx.regExpMap = /* @__PURE__ */ new Map();
		if (schema.$ref) {
			if (schema.$ref === "#") return;
			const m = schema.$ref.match(/^#\/(?:\$defs|definitions)\/(.+)$/);
			if (m && ctx.rootDefs && ctx.rootDefs[m[1]]) {
				if (ctx.refStack.has(schema.$ref)) return;
				ctx.refStack.add(schema.$ref);
				genCodeE(ctx.rootDefs[m[1]], v, pathExpr, lines, ctx, schemaPrefix);
				ctx.refStack.delete(schema.$ref);
				return;
			}
			if (!m && schema.$ref.startsWith("#") && !schema.$ref.startsWith("#/")) {
				const entry = ctx.rootDefs && ctx.rootDefs[schema.$ref];
				const anchorTarget = entry && entry.raw ? entry.raw : ctx.anchors && ctx.anchors[schema.$ref];
				if (anchorTarget) {
					if (ctx.refStack.has(schema.$ref)) return;
					ctx.refStack.add(schema.$ref);
					genCodeE(anchorTarget, v, pathExpr, lines, ctx, schemaPrefix);
					ctx.refStack.delete(schema.$ref);
					return;
				}
			}
			if (ctx.schemaMap && ctx.schemaMap.has(schema.$ref)) {
				if (ctx.refStack.has(schema.$ref)) return;
				ctx.refStack.add(schema.$ref);
				genCodeE(ctx.schemaMap.get(schema.$ref), v, pathExpr, lines, ctx, schemaPrefix);
				ctx.refStack.delete(schema.$ref);
				return;
			}
			if (ctx.schemaMap && schema.$ref.includes("#") && !schema.$ref.startsWith("#")) {
				const r = resolveCrossSchemaRef(schema.$ref, ctx.schemaMap);
				if (r) {
					if (ctx.refStack.has(schema.$ref)) return;
					ctx.refStack.add(schema.$ref);
					genCodeE(r.schema, v, pathExpr, lines, ctx, schemaPrefix);
					ctx.refStack.delete(schema.$ref);
					return;
				}
			}
		}
		if (schema.$dynamicRef) {
			const anchorKey = schema.$dynamicRef.startsWith("#") ? schema.$dynamicRef : "#" + schema.$dynamicRef;
			if (ctx.anchors && ctx.anchors[anchorKey]) {
				const target = ctx.anchors[anchorKey];
				if (target === ctx.rootSchema) {
					ctx.usesRecursion = true;
					lines.push(`_validateE(${v},_all,_e)`);
				} else {
					const refKey = "$dynamicRef:" + anchorKey;
					if (!ctx.refStack.has(refKey)) {
						ctx.refStack.add(refKey);
						genCodeE(target, v, pathExpr, lines, ctx, schemaPrefix);
						ctx.refStack.delete(refKey);
					}
				}
			}
		}
		const types = schema.type ? Array.isArray(schema.type) ? schema.type : [schema.type] : null;
		if (types) {
			const conds = types.map((t) => {
				switch (t) {
					case "object": return `(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v}))`;
					case "array": return `Array.isArray(${v})`;
					case "string": return `typeof ${v}==='string'`;
					case "number": return `(typeof ${v}==='number'&&isFinite(${v}))`;
					case "integer": return `Number.isInteger(${v})`;
					case "boolean": return `typeof ${v}==='boolean'`;
					case "null": return `${v}===null`;
					default: return "true";
				}
			});
			const expected = types.join(", ");
			{
				const typeSp = `${schemaPrefix}/type`;
				const lit = buildErrorLiteral({
					keyword: "type",
					schemaPath: typeSp,
					sourceMap: ctx.sourceMap
				});
				lines.push(`if(!(${conds.join("||")})){_e.push({code:'${lit.codeStr}',keyword:'type',instancePath:${pathExpr || "\"\""},schemaPath:'${typeSp}',params:{type:'${expected}'},message:'must be ${expected}',docUrl:'${lit.docUrl}'${lit.frame}});if(!_all)return{valid:false,errors:_e}}`);
			}
		}
		const isStr = false;
		const fail = (keyword, schemaSuffix, paramsCode, msgCode, fmt) => {
			const sp = schemaPrefix + "/" + schemaSuffix;
			const lit = buildErrorLiteral({
				keyword,
				format: fmt,
				schemaPath: sp,
				sourceMap: ctx.sourceMap
			});
			return `_e.push({code:'${lit.codeStr}',keyword:'${keyword}',instancePath:${pathExpr || "\"\""},schemaPath:'${sp}',params:${paramsCode},message:${msgCode},docUrl:'${lit.docUrl}'${lit.frame}});if(!_all)return{valid:false,errors:_e}`;
		};
		if (schema.enum) lines.push(`if(!(${enumCondition(ctx, schema.enum, v)})){${fail("enum", "enum", `{allowedValues:${JSON.stringify(schema.enum)}}`, "'must be equal to one of the allowed values'")}}`);
		if (schema.const !== void 0) {
			const cv = schema.const;
			if (cv === null || typeof cv !== "object") lines.push(`if(${v}!==${JSON.stringify(cv)}){${fail("const", "const", `{allowedValue:${JSON.stringify(schema.const)}}`, "'must be equal to constant'")}}`);
			else lines.push(`if(!${emitDeq(ctx)}(${v},${emitConstant(ctx, cv)})){${fail("const", "const", `{allowedValue:JSON.parse(${JSON.stringify(JSON.stringify(schema.const))})}`, "'must be equal to constant'")}}`);
		}
		new Set(schema.required || []);
		if (schema.required) {
			const reqSp = `${schemaPrefix}/required`;
			const reqLit = buildErrorLiteral({
				keyword: "required",
				schemaPath: reqSp,
				sourceMap: ctx.sourceMap
			});
			for (const key of schema.required) lines.push(`if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v})&&!(${JSON.stringify(key)} in ${v})){_e.push({code:'${reqLit.codeStr}',keyword:'required',instancePath:${pathExpr || "\"\""},schemaPath:'${reqSp}',params:{missingProperty:'${esc(key)}'},message:"must have required property '${esc(key)}'",docUrl:'${reqLit.docUrl}'${reqLit.frame}});if(!_all)return{valid:false,errors:_e}}`);
		}
		if (schema.minimum !== void 0) {
			const c = `typeof ${v}==='number'&&${v}<${schema.minimum}`;
			lines.push(`if(${c}){${fail("minimum", "minimum", `{comparison:'>=',limit:${schema.minimum}}`, `'must be >= ${schema.minimum}'`)}}`);
		}
		if (schema.maximum !== void 0) {
			const c = `typeof ${v}==='number'&&${v}>${schema.maximum}`;
			lines.push(`if(${c}){${fail("maximum", "maximum", `{comparison:'<=',limit:${schema.maximum}}`, `'must be <= ${schema.maximum}'`)}}`);
		}
		if (schema.exclusiveMinimum !== void 0) {
			const c = `typeof ${v}==='number'&&${v}<=${schema.exclusiveMinimum}`;
			lines.push(`if(${c}){${fail("exclusiveMinimum", "exclusiveMinimum", `{comparison:'>',limit:${schema.exclusiveMinimum}}`, `'must be > ${schema.exclusiveMinimum}'`)}}`);
		}
		if (schema.exclusiveMaximum !== void 0) {
			const c = `typeof ${v}==='number'&&${v}>=${schema.exclusiveMaximum}`;
			lines.push(`if(${c}){${fail("exclusiveMaximum", "exclusiveMaximum", `{comparison:'<',limit:${schema.exclusiveMaximum}}`, `'must be < ${schema.exclusiveMaximum}'`)}}`);
		}
		if (schema.multipleOf !== void 0) {
			const m = schema.multipleOf;
			const ci = ctx.varCounter++;
			lines.push(`{const _r${ci}=typeof ${v}==='number'?${v}%${m}:NaN;if(typeof ${v}==='number'&&Math.abs(_r${ci})>1e-8&&Math.abs(_r${ci}-${m})>1e-8){${fail("multipleOf", "multipleOf", `{multipleOf:${m}}`, `'must be multiple of ${m}'`)}}}`);
		}
		if (schema.minLength !== void 0) {
			const M = schema.minLength;
			const c = `typeof ${v}==='string'&&(${`${v}.length<${M}||(${v}.length<${M * 2}&&_cpLen(${v})<${M})`})`;
			lines.push(`if(${c}){${fail("minLength", "minLength", `{limit:${M}}`, `'must NOT have fewer than ${M} characters'`)}}`);
		}
		if (schema.maxLength !== void 0) {
			const X = schema.maxLength;
			const c = `typeof ${v}==='string'&&(${`${v}.length>${X * 2}||(${v}.length>${X}&&_cpLen(${v})>${X})`})`;
			lines.push(`if(${c}){${fail("maxLength", "maxLength", `{limit:${X}}`, `'must NOT have more than ${X} characters'`)}}`);
		}
		if (schema.pattern) {
			const inlineCheck = compilePatternInline(schema.pattern, v);
			if (inlineCheck) {
				const c = `typeof ${v}==='string'&&!(${inlineCheck})`;
				lines.push(`if(${c}){${fail("pattern", "pattern", `{pattern:${JSON.stringify(schema.pattern)}}`, `'must match pattern "${schema.pattern}"'`)}}`);
			} else {
				const pattern = JSON.stringify(schema.pattern);
				if (!ctx.regExpMap.has(pattern)) {
					const ri = ctx.varCounter++;
					ctx.regExpMap.set(pattern, ri);
					if (patternIsSafe(schema.pattern)) {
						ctx.helperCode.push(`const _re${ri}=__ataSafeRe(${pattern})`);
						ctx.usesSafeRe = true;
					} else ctx.helperCode.push(`const _re${ri}=new RegExp(${pattern})`);
				}
				const c = `typeof ${v}==='string'&&!_re${ctx.regExpMap.get(pattern)}.test(${v})`;
				lines.push(`if(${c}){${fail("pattern", "pattern", `{pattern:${JSON.stringify(schema.pattern)}}`, `'must match pattern "${schema.pattern}"'`)}}`);
			}
		}
		if (schema.format) {
			const fc = FORMAT_CODEGEN[schema.format];
			const fmtSp = `${schemaPrefix}/format`;
			const fmtLit = buildErrorLiteral({
				keyword: "format",
				format: schema.format,
				schemaPath: fmtSp,
				sourceMap: ctx.sourceMap
			});
			const failPush = `_e.push({code:'${fmtLit.codeStr}',keyword:'format',instancePath:${pathExpr || "\"\""},schemaPath:'${fmtSp}',params:{format:'${esc(schema.format)}'},message:'must match format "${esc(schema.format)}"',docUrl:'${fmtLit.docUrl}'${fmtLit.frame}});if(!_all)return{valid:false,errors:_e}`;
			if (fc) {
				ctx.varCounter++;
				const boolLines = [];
				boolLines.push(fc(v, isStr));
				const fmtCode = boolLines.join(";").replace(/return false/g, `{${failPush}}`);
				lines.push(fmtCode);
			} else if (ctx.userFormats && typeof ctx.userFormats[schema.format] === "function") {
				const closureName = `_uf_${schema.format.replace(/[^a-zA-Z0-9_]/g, "_")}`;
				const guard = `typeof ${v}==='string'&&`;
				lines.push(`if(${guard}!${closureName}(${v})){${failPush}}`);
			}
		}
		if (schema.minItems !== void 0) {
			const c = `Array.isArray(${v})&&${v}.length<${schema.minItems}`;
			lines.push(`if(${c}){${fail("minItems", "minItems", `{limit:${schema.minItems}}`, `'must NOT have fewer than ${schema.minItems} items'`)}}`);
		}
		if (schema.maxItems !== void 0) {
			const c = `Array.isArray(${v})&&${v}.length>${schema.maxItems}`;
			lines.push(`if(${c}){${fail("maxItems", "maxItems", `{limit:${schema.maxItems}}`, `'must NOT have more than ${schema.maxItems} items'`)}}`);
		}
		if (schema.uniqueItems) {
			const si = ctx.varCounter++;
			const itemType = schema.items && typeof schema.items === "object" && schema.items.type;
			const isPrim = itemType === "string" || itemType === "number" || itemType === "integer";
			const maxItems = schema.maxItems;
			const failExpr = (iVar, jVar) => fail("uniqueItems", "uniqueItems", `{i:${iVar},j:${jVar}}`, `'must NOT have duplicate items (items ## '+${jVar}+' and '+${iVar}+' are identical)'`);
			let inner;
			if (isPrim && maxItems && maxItems <= 16) inner = `for(let _i=1;_i<${v}.length;_i++){for(let _k=0;_k<_i;_k++){if(${v}[_i]===${v}[_k]){${failExpr("_k", "_i")};break}}}`;
			else if (isPrim) inner = `const _s${si}=new Map();for(let _i=0;_i<${v}.length;_i++){const _prev=_s${si}.get(${v}[_i]);if(_prev!==undefined){${failExpr("_prev", "_i")};break};_s${si}.set(${v}[_i],_i)}`;
			else inner = `const _cn${si}=function(x){if(x===null||typeof x!=='object')return typeof x+':'+x;if(Array.isArray(x))return'['+x.map(_cn${si}).join(',')+']';return'{'+Object.keys(x).sort().map(function(k){return JSON.stringify(k)+':'+_cn${si}(x[k])}).join(',')+'}'};const _s${si}=new Map();for(let _i=0;_i<${v}.length;_i++){const _k=_cn${si}(${v}[_i]);const _prev=_s${si}.get(_k);if(_prev!==undefined){${failExpr("_prev", "_i")};break};_s${si}.set(_k,_i)}`;
			lines.push(`if(Array.isArray(${v})){${inner}}`);
		}
		if (schema.minProperties !== void 0) lines.push(`if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v})&&Object.keys(${v}).length<${schema.minProperties}){${fail("minProperties", "minProperties", `{limit:${schema.minProperties}}`, `'must NOT have fewer than ${schema.minProperties} properties'`)}}`);
		if (schema.maxProperties !== void 0) lines.push(`if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v})&&Object.keys(${v}).length>${schema.maxProperties}){${fail("maxProperties", "maxProperties", `{limit:${schema.maxProperties}}`, `'must NOT have more than ${schema.maxProperties} properties'`)}}`);
		if (schema.additionalProperties === false && (schema.properties || schema.patternProperties)) {
			const allowed = Object.keys(schema.properties || {}).map((k) => `${JSON.stringify(k)}`).join(",");
			const ci = ctx.varCounter++;
			const apSp = `${schemaPrefix}/additionalProperties`;
			const apLit = buildErrorLiteral({
				keyword: "additionalProperties",
				schemaPath: apSp,
				sourceMap: ctx.sourceMap
			});
			const patChecks = [];
			for (const pat of Object.keys(schema.patternProperties || {})) {
				const pattern = JSON.stringify(pat);
				if (!ctx.regExpMap.has(pattern)) {
					const ri = ctx.varCounter++;
					ctx.regExpMap.set(pattern, ri);
					if (patternIsSafe(pat)) {
						ctx.helperCode.push(`const _re${ri}=__ataSafeRe(${pattern})`);
						ctx.usesSafeRe = true;
					} else ctx.helperCode.push(`const _re${ri}=new RegExp(${pattern})`);
				}
				patChecks.push(`_re${ctx.regExpMap.get(pattern)}.test(_k${ci}[_i])`);
			}
			const inner = `const _k${ci}=Object.keys(${v});const _a${ci}=new Set([${allowed}]);for(let _i=0;_i<_k${ci}.length;_i++){if(${patChecks.length ? `!_a${ci}.has(_k${ci}[_i])&&!(${patChecks.join("||")})` : `!_a${ci}.has(_k${ci}[_i])`}){_e.push({code:'${apLit.codeStr}',keyword:'additionalProperties',instancePath:${pathExpr || "\"\""},schemaPath:'${apSp}',params:{additionalProperty:_k${ci}[_i]},message:'must NOT have additional properties',docUrl:'${apLit.docUrl}'${apLit.frame}});if(!_all)return{valid:false,errors:_e}}}`;
			lines.push(`if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v})){${inner}}`);
		}
		if (schema.dependentRequired) {
			const drSp = `${schemaPrefix}/dependentRequired`;
			const drLit = buildErrorLiteral({
				keyword: "dependentRequired",
				schemaPath: drSp,
				sourceMap: ctx.sourceMap
			});
			for (const [key, deps] of Object.entries(schema.dependentRequired)) for (const dep of deps) lines.push(`if(typeof ${v}==='object'&&${v}!==null&&${JSON.stringify(key)} in ${v}&&!(${JSON.stringify(dep)} in ${v})){_e.push({code:'${drLit.codeStr}',keyword:'required',instancePath:${pathExpr || "\"\""},schemaPath:'${drSp}',params:{missingProperty:'${esc(dep)}'},message:"must have required property '${esc(dep)}'",docUrl:'${drLit.docUrl}'${drLit.frame}});if(!_all)return{valid:false,errors:_e}}`);
		}
		if (schema.properties) for (const [key, prop] of Object.entries(schema.properties)) {
			const childPath = childPathExpr(pathExpr, esc(key));
			lines.push(`if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v})&&${JSON.stringify(key)} in ${v}){`);
			genCodeE(prop, `${v}[${JSON.stringify(key)}]`, childPath, lines, ctx, schemaPrefix + "/properties/" + key);
			lines.push(`}`);
		}
		if (schema.patternProperties) for (const [pat, sub] of Object.entries(schema.patternProperties)) {
			const pattern = JSON.stringify(pat);
			if (!ctx.regExpMap.has(pattern)) {
				const ri = ctx.varCounter++;
				ctx.regExpMap.set(pattern, ri);
				if (patternIsSafe(pat)) {
					ctx.helperCode.push(`const _re${ri}=__ataSafeRe(${pattern})`);
					ctx.usesSafeRe = true;
				} else ctx.helperCode.push(`const _re${ri}=new RegExp(${pattern})`);
			}
			const ri = ctx.regExpMap.get(pattern);
			const ki = ctx.varCounter++;
			lines.push(`if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v})){for(const _k${ki} in ${v}){if(_re${ri}.test(_k${ki})){`);
			const p = pathExpr ? `${pathExpr}+'/'+_k${ki}` : `'/'+_k${ki}`;
			genCodeE(sub, `${v}[_k${ki}]`, p, lines, ctx, schemaPrefix + "/patternProperties/" + pat.replace(/~/g, "~0").replace(/\//g, "~1"));
			lines.push(`}}}`);
		}
		if (typeof schema.additionalProperties === "object" && schema.additionalProperties !== null) {
			const ki = ctx.varCounter++;
			const known = Object.keys(schema.properties || {});
			const guard = known.length ? `const _ak${ki}=new Set([${known.map((k) => JSON.stringify(k)).join(",")}]);` : "";
			const keep = known.length ? `if(!_ak${ki}.has(_k${ki})){` : `{`;
			lines.push(`if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v})){${guard}for(const _k${ki} in ${v}){${keep}`);
			const p = pathExpr ? `${pathExpr}+'/'+_k${ki}` : `'/'+_k${ki}`;
			genCodeE(schema.additionalProperties, `${v}[_k${ki}]`, p, lines, ctx, schemaPrefix + "/additionalProperties");
			lines.push(`}}}`);
		}
		if (schema.dependentSchemas) for (const [key, depSchema] of Object.entries(schema.dependentSchemas)) {
			lines.push(`if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v})&&${JSON.stringify(key)} in ${v}){`);
			genCodeE(depSchema, v, pathExpr, lines, ctx, schemaPrefix + "/dependentSchemas/" + key);
			lines.push(`}`);
		}
		if (schema.propertyNames && typeof schema.propertyNames === "object") {
			const pn = schema.propertyNames;
			const ki = ctx.varCounter++;
			lines.push(`if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v})){for(const _k${ki} in ${v}){`);
			if (pn.minLength !== void 0) lines.push(`if(_k${ki}.length<${pn.minLength}){${fail("minLength", "propertyNames/minLength", `{limit:${pn.minLength}}`, `'must NOT have fewer than ${pn.minLength} characters'`)}}`);
			if (pn.maxLength !== void 0) lines.push(`if(_k${ki}.length>${pn.maxLength}){${fail("maxLength", "propertyNames/maxLength", `{limit:${pn.maxLength}}`, `'must NOT have more than ${pn.maxLength} characters'`)}}`);
			if (pn.pattern) {
				const pattern = JSON.stringify(pn.pattern);
				if (!ctx.regExpMap.has(pattern)) {
					const ri = ctx.varCounter++;
					ctx.regExpMap.set(pattern, ri);
					if (patternIsSafe(pn.pattern)) {
						ctx.helperCode.push(`const _re${ri}=__ataSafeRe(${pattern})`);
						ctx.usesSafeRe = true;
					} else ctx.helperCode.push(`const _re${ri}=new RegExp(${pattern})`);
				}
				const ri = ctx.regExpMap.get(pattern);
				lines.push(`if(!_re${ri}.test(_k${ki})){${fail("pattern", "propertyNames/pattern", `{pattern:${JSON.stringify(pn.pattern)}}`, `'must match pattern "${pn.pattern}"'`)}}`);
			}
			if (pn.const !== void 0) lines.push(`if(_k${ki}!==${JSON.stringify(pn.const)}){${fail("const", "propertyNames/const", `{allowedValue:${JSON.stringify(pn.const)}}`, "'must be equal to constant'")}}`);
			if (pn.enum) {
				const ei = ctx.varCounter++;
				ctx.helperCode.push(`const _es${ei}=new Set(${JSON.stringify(pn.enum)})`);
				lines.push(`if(!_es${ei}.has(_k${ki})){${fail("enum", "propertyNames/enum", `{allowedValues:${JSON.stringify(pn.enum)}}`, "'must be equal to one of the allowed values'")}}`);
			}
			lines.push(`}}`);
		}
		if (schema.items) {
			const startIdx = schema.prefixItems ? schema.prefixItems.length : 0;
			const idx = `_j${ctx.varCounter}`;
			const elem = `_ei${ctx.varCounter}`;
			ctx.varCounter++;
			const childPath = childPathDynExpr(pathExpr, idx);
			lines.push(`if(Array.isArray(${v})){for(let ${idx}=${startIdx};${idx}<${v}.length;${idx}++){const ${elem}=${v}[${idx}]`);
			genCodeE(schema.items, elem, childPath, lines, ctx, schemaPrefix + "/items");
			lines.push(`}}`);
		}
		if (schema.prefixItems) for (let i = 0; i < schema.prefixItems.length; i++) {
			const childPath = childPathExpr(pathExpr, String(i));
			lines.push(`if(Array.isArray(${v})&&${v}.length>${i}){`);
			genCodeE(schema.prefixItems[i], `${v}[${i}]`, childPath, lines, ctx, schemaPrefix + "/prefixItems/" + i);
			lines.push(`}`);
		}
		if (schema.contains) {
			const ci = ctx.varCounter++;
			const subLines = [];
			genCode(schema.contains, `_cv`, subLines, ctx);
			const fnBody = subLines.length === 0 ? `return true` : `${subLines.join(";")};return true`;
			const minC = schema.minContains !== void 0 ? schema.minContains : 1;
			const maxC = schema.maxContains;
			lines.push(`if(Array.isArray(${v})){const _cf${ci}=function(_cv){${fnBody}};let _cc${ci}=0;for(let _ci${ci}=0;_ci${ci}<${v}.length;_ci${ci}++){if(_cf${ci}(${v}[_ci${ci}]))_cc${ci}++}`);
			lines.push(`if(_cc${ci}<${minC}){${fail("contains", "contains", `{limit:${minC}}`, `'contains: need at least ${minC} match(es)'`)}}`);
			if (maxC !== void 0) lines.push(`if(_cc${ci}>${maxC}){${fail("contains", "contains", `{limit:${maxC}}`, `'contains: at most ${maxC} match(es)'`)}}`);
			lines.push(`}`);
		}
		if (schema.allOf) for (let _ai = 0; _ai < schema.allOf.length; _ai++) genCodeE(schema.allOf[_ai], v, pathExpr, lines, ctx, schemaPrefix + "/allOf/" + _ai);
		if (schema.anyOf) emitBranchCollapse(schema.anyOf, "anyOf", v, pathExpr, lines, ctx, schemaPrefix);
		if (schema.oneOf) emitBranchCollapse(schema.oneOf, "oneOf", v, pathExpr, lines, ctx, schemaPrefix);
		if (schema.not) {
			const subLines = [];
			genCode(schema.not, "_nv", subLines, ctx);
			const nfn = subLines.length === 0 ? `function(_nv){return true}` : `function(_nv){${subLines.join(";")};return true}`;
			const fi = ctx.varCounter++;
			lines.push(`{const _nf${fi}=${nfn};if(_nf${fi}(${v})){${fail("not", "not", "{}", "'must NOT be valid'")}}}`);
		}
		if (schema.if) {
			const ifLines = [];
			genCode(schema.if, "_iv", ifLines, ctx);
			const fi = ctx.varCounter++;
			const ifFn = ifLines.length === 0 ? `function(_iv){return true}` : `function(_iv){${ifLines.join(";")};return true}`;
			lines.push(`{const _if${fi}=${ifFn}`);
			if (schema.then) {
				lines.push(`if(_if${fi}(${v})){`);
				genCodeE(schema.then, v, pathExpr, lines, ctx, schemaPrefix + "/then");
				lines.push(`}`);
			}
			if (schema.else) {
				lines.push(`${schema.then ? "else" : `if(!_if${fi}(${v}))`}{`);
				genCodeE(schema.else, v, pathExpr, lines, ctx, schemaPrefix + "/else");
				lines.push(`}`);
			}
			lines.push(`}`);
		}
	}
	function compileToJSCombined(schema, VALID_RESULT, schemaMap, userFormats) {
		if (typeof schema === "object" && schema !== null) {
			const s = JSON.stringify(schema);
			if (s.includes("unevaluatedProperties") || s.includes("unevaluatedItems")) return null;
			if (s.includes("\"$ref\":\"#\"")) return null;
			if (hasAdditionalPropertiesSchema(schema)) return null;
			if (s.includes("\"oneOf\"") || s.includes("\"anyOf\"")) return null;
		}
		if (typeof schema === "boolean") return schema ? () => VALID_RESULT : () => ({
			valid: false,
			errors: [{
				keyword: "false schema",
				instancePath: "",
				schemaPath: "#",
				params: {},
				message: "boolean schema is false"
			}]
		});
		if (typeof schema !== "object" || schema === null) return null;
		if (!sharedCodegenGate(schema, schemaMap)) return null;
		if (schema.patternProperties) for (const [pat, sub] of Object.entries(schema.patternProperties)) {
			if (typeof sub === "boolean") return null;
			if (/\\[pP]\{/.test(pat)) return null;
			if (typeof sub === "object" && sub !== null && !codegenSafe(sub, schemaMap)) return null;
		}
		if (schema.dependentSchemas) for (const sub of Object.values(schema.dependentSchemas)) {
			if (typeof sub === "boolean") return null;
			if (typeof sub === "object" && sub !== null && !codegenSafe(sub, schemaMap)) return null;
		}
		if (schema.propertyNames) {
			if (typeof schema.propertyNames === "boolean") return null;
			const pn = schema.propertyNames;
			const supported = [
				"maxLength",
				"minLength",
				"pattern",
				"const",
				"enum"
			];
			if (Object.keys(pn).filter((k) => k !== "$schema").some((k) => !supported.includes(k))) return null;
		}
		const cRootDefs = schema.$defs || schema.definitions || null;
		const cAnchors = {};
		if (schema.$dynamicAnchor) cAnchors["#" + schema.$dynamicAnchor] = schema;
		if (schema.$anchor) cAnchors["#" + schema.$anchor] = schema;
		if (typeof schema.$id === "string" && schema.$id.startsWith("#")) cAnchors[schema.$id] = schema;
		if (cRootDefs) {
			for (const def of Object.values(cRootDefs)) if (def && typeof def === "object") {
				if (def.$dynamicAnchor) cAnchors["#" + def.$dynamicAnchor] = def;
				if (def.$anchor) cAnchors["#" + def.$anchor] = def;
				if (typeof def.$id === "string" && def.$id.startsWith("#")) cAnchors[def.$id] = def;
			}
		}
		if (schemaMap) {
			for (const ext of schemaMap.values()) if (ext && typeof ext === "object") {
				if (ext.$dynamicAnchor && !cAnchors["#" + ext.$dynamicAnchor]) cAnchors["#" + ext.$dynamicAnchor] = ext;
				if (ext.$anchor && !cAnchors["#" + ext.$anchor]) cAnchors["#" + ext.$anchor] = ext;
				if (typeof ext.$id === "string" && ext.$id.startsWith("#") && !cAnchors[ext.$id]) cAnchors[ext.$id] = ext;
			}
		}
		if (hasUnresolvableRef(schema, cRootDefs, cAnchors, schemaMap, /* @__PURE__ */ new Set())) return null;
		if (needsBaseTracking(schema, schemaMap, /* @__PURE__ */ new Set())) return null;
		const ctx = {
			varCounter: 0,
			helperCode: [],
			closureVars: ["_cpLen"],
			closureVals: [_cpLen],
			rootDefs: cRootDefs,
			refStack: /* @__PURE__ */ new Set(),
			schemaMap: schemaMap || null,
			anchors: cAnchors,
			rootSchema: schema,
			userFormats: userFormats || null
		};
		const lines = [];
		genCodeC(schema, "d", "", lines, ctx, "#");
		if (lines.length === 0) return () => VALID_RESULT;
		const closureParams = ctx.closureVars.join(",");
		const inner = `let _e;\n  ` + (ctx.helperCode.length ? ctx.helperCode.join("\n  ") + "\n  " : "") + lines.join("\n  ") + `\n  return _e?{valid:false,errors:_e}:R`;
		try {
			if (typeof process !== "undefined" && process.env && process.env.ATA_DUMP_CODEGEN) console.log("=== COMBINED CODEGEN ===\n" + inner + "\n=== CLOSURE VARS: " + ctx.closureVars.length + " ===");
			return new Function("R" + (closureParams ? "," + closureParams : ""), `return function(d){${inner}}`)(VALID_RESULT, ...ctx.closureVals);
		} catch (e) {
			if (typeof process !== "undefined" && process.env && process.env.ATA_DEBUG) console.error("compileToJSCombined error:", e.message, "\n", inner.slice(0, 500));
			return null;
		}
	}
	function genCodeC(schema, v, pathExpr, lines, ctx, schemaPrefix) {
		if (!schemaPrefix) schemaPrefix = "#";
		if (typeof schema !== "object" || schema === null) return;
		if (schema.$ref) {
			if (schema.$ref === "#") return;
			const m = schema.$ref.match(/^#\/(?:\$defs|definitions)\/(.+)$/);
			if (m && ctx.rootDefs && ctx.rootDefs[m[1]]) {
				if (ctx.refStack.has(schema.$ref)) return;
				ctx.refStack.add(schema.$ref);
				genCodeC(ctx.rootDefs[m[1]], v, pathExpr, lines, ctx, schemaPrefix);
				ctx.refStack.delete(schema.$ref);
				return;
			}
			if (!m && schema.$ref.startsWith("#") && !schema.$ref.startsWith("#/")) {
				const entry = ctx.rootDefs && ctx.rootDefs[schema.$ref];
				const anchorTarget = entry && entry.raw ? entry.raw : ctx.anchors && ctx.anchors[schema.$ref];
				if (anchorTarget) {
					if (ctx.refStack.has(schema.$ref)) return;
					ctx.refStack.add(schema.$ref);
					genCodeC(anchorTarget, v, pathExpr, lines, ctx, schemaPrefix);
					ctx.refStack.delete(schema.$ref);
					return;
				}
			}
			if (ctx.schemaMap && ctx.schemaMap.has(schema.$ref)) {
				if (ctx.refStack.has(schema.$ref)) return;
				ctx.refStack.add(schema.$ref);
				genCodeC(ctx.schemaMap.get(schema.$ref), v, pathExpr, lines, ctx, schemaPrefix);
				ctx.refStack.delete(schema.$ref);
				return;
			}
			if (ctx.schemaMap && schema.$ref.includes("#") && !schema.$ref.startsWith("#")) {
				const r = resolveCrossSchemaRef(schema.$ref, ctx.schemaMap);
				if (r) {
					if (ctx.refStack.has(schema.$ref)) return;
					ctx.refStack.add(schema.$ref);
					genCodeC(r.schema, v, pathExpr, lines, ctx, schemaPrefix);
					ctx.refStack.delete(schema.$ref);
					return;
				}
			}
		}
		if (schema.$dynamicRef) {
			const anchorKey = schema.$dynamicRef.startsWith("#") ? schema.$dynamicRef : "#" + schema.$dynamicRef;
			if (ctx.anchors && ctx.anchors[anchorKey]) {
				const target = ctx.anchors[anchorKey];
				if (target === ctx.rootSchema) {} else {
					const refKey = "$dynamicRef:" + anchorKey;
					if (!ctx.refStack.has(refKey)) {
						ctx.refStack.add(refKey);
						genCodeC(target, v, pathExpr, lines, ctx, schemaPrefix);
						ctx.refStack.delete(refKey);
					}
				}
			}
		}
		const types = schema.type ? Array.isArray(schema.type) ? schema.type : [schema.type] : null;
		let isObj = false, isArr = false, isStr = false, isNum = false;
		const isStaticPath = !pathExpr || pathExpr.startsWith("'") && !pathExpr.includes("+");
		const fail = (keyword, schemaSuffix, paramsCode, msgCode) => {
			const sp = schemaPrefix + "/" + schemaSuffix;
			if (isStaticPath && msgCode.startsWith("'") && !msgCode.includes("+")) {
				let paramsVal;
				try {
					paramsVal = Function("return " + paramsCode)();
				} catch {}
				if (paramsVal !== void 0) {
					const errVar = `_E${ctx.varCounter++}`;
					const pathVal = pathExpr ? pathExpr.slice(1, -1) : "";
					const msgVal = msgCode.slice(1, -1);
					ctx.closureVars.push(errVar);
					ctx.closureVals.push(Object.freeze({
						keyword,
						instancePath: pathVal,
						schemaPath: sp,
						params: Object.freeze(paramsVal),
						message: msgVal
					}));
					return `(_e||(_e=[])).push(${errVar})`;
				}
			}
			return `(_e||(_e=[])).push({keyword:'${keyword}',instancePath:${pathExpr || "\"\""},schemaPath:'${sp}',params:${paramsCode},message:${msgCode}})`;
		};
		if (types) {
			const conds = types.map((t) => {
				switch (t) {
					case "object": return `(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v}))`;
					case "array": return `Array.isArray(${v})`;
					case "string": return `typeof ${v}==='string'`;
					case "number": return `(typeof ${v}==='number'&&isFinite(${v}))`;
					case "integer": return `Number.isInteger(${v})`;
					case "boolean": return `typeof ${v}==='boolean'`;
					case "null": return `${v}===null`;
					default: return "true";
				}
			});
			const expected = types.join(", ");
			const typeOk = `_tok${ctx.varCounter++}`;
			lines.push(`const ${typeOk}=${conds.join("||")}`);
			lines.push(`if(!${typeOk}){${fail("type", "type", `{type:'${expected}'}`, `'must be ${expected}'`)}}`);
			if (types.length === 1) {
				isObj = types[0] === "object";
				isArr = types[0] === "array";
				isStr = types[0] === "string";
				isNum = types[0] === "number" || types[0] === "integer";
			}
			lines.push(`if(${typeOk}){`);
		}
		if (schema.enum) lines.push(`if(!(${enumCondition(ctx, schema.enum, v)})){${fail("enum", "enum", `{allowedValues:${JSON.stringify(schema.enum)}}`, "'must be equal to one of the allowed values'")}}`);
		if (schema.const !== void 0) {
			const cv = schema.const;
			if (cv === null || typeof cv !== "object") lines.push(`if(${v}!==${JSON.stringify(cv)}){${fail("const", "const", `{allowedValue:${JSON.stringify(schema.const)}}`, "'must be equal to constant'")}}`);
			else lines.push(`if(!${emitDeq(ctx)}(${v},${emitConstant(ctx, cv)})){${fail("const", "const", `{allowedValue:JSON.parse(${JSON.stringify(JSON.stringify(schema.const))})}`, "'must be equal to constant'")}}`);
		}
		const requiredSet = new Set(schema.required || []);
		const hoisted = {};
		if (schema.required && schema.properties && isObj) {
			const destructKeys = [];
			for (const key of schema.required) if (schema.properties[key]) {
				const lv = `_h${ctx.varCounter++}`;
				hoisted[key] = lv;
				destructKeys.push(`${JSON.stringify(key)}:${lv}`);
			}
			if (destructKeys.length > 0) lines.push(`const{${destructKeys.join(",")}}=${v}`);
			for (const key of schema.required) {
				const check = hoisted[key] ? `${hoisted[key]}===undefined` : `${v}[${JSON.stringify(key)}]===undefined`;
				if (isStaticPath) {
					const errVar = `_E${ctx.varCounter++}`;
					const pathVal = pathExpr ? pathExpr.slice(1, -1) : "";
					ctx.closureVars.push(errVar);
					ctx.closureVals.push(Object.freeze({
						keyword: "required",
						instancePath: pathVal,
						schemaPath: `${schemaPrefix}/required`,
						params: Object.freeze({ missingProperty: key }),
						message: `must have required property '${key}'`
					}));
					lines.push(`if(${check}){(_e||(_e=[])).push(${errVar})}`);
				} else lines.push(`if(${check}){(_e||(_e=[])).push({keyword:'required',instancePath:${pathExpr || "\"\""},schemaPath:'${schemaPrefix}/required',params:{missingProperty:'${esc(key)}'},message:"must have required property '${esc(key)}'"})}`);
			}
		} else if (schema.required) for (const key of schema.required) if (!pathExpr || pathExpr.startsWith("'") && !pathExpr.includes("+")) {
			const errVar = `_E${ctx.varCounter++}`;
			const pathVal = pathExpr ? pathExpr.slice(1, -1) : "";
			ctx.closureVars.push(errVar);
			ctx.closureVals.push(Object.freeze({
				keyword: "required",
				instancePath: pathVal,
				schemaPath: `${schemaPrefix}/required`,
				params: Object.freeze({ missingProperty: key }),
				message: `must have required property '${key}'`
			}));
			lines.push(`if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v})&&!(${JSON.stringify(key)} in ${v})){(_e||(_e=[])).push(${errVar})}`);
		} else lines.push(`if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v})&&!(${JSON.stringify(key)} in ${v})){(_e||(_e=[])).push({keyword:'required',instancePath:${pathExpr || "\"\""},schemaPath:'${schemaPrefix}/required',params:{missingProperty:'${esc(key)}'},message:"must have required property '${esc(key)}'"})}`);
		if (schema.minimum !== void 0) {
			const c = isNum ? `${v}<${schema.minimum}` : `typeof ${v}==='number'&&${v}<${schema.minimum}`;
			lines.push(`if(${c}){${fail("minimum", "minimum", `{comparison:'>=',limit:${schema.minimum}}`, `'must be >= ${schema.minimum}'`)}}`);
		}
		if (schema.maximum !== void 0) {
			const c = isNum ? `${v}>${schema.maximum}` : `typeof ${v}==='number'&&${v}>${schema.maximum}`;
			lines.push(`if(${c}){${fail("maximum", "maximum", `{comparison:'<=',limit:${schema.maximum}}`, `'must be <= ${schema.maximum}'`)}}`);
		}
		if (schema.exclusiveMinimum !== void 0) {
			const c = isNum ? `${v}<=${schema.exclusiveMinimum}` : `typeof ${v}==='number'&&${v}<=${schema.exclusiveMinimum}`;
			lines.push(`if(${c}){${fail("exclusiveMinimum", "exclusiveMinimum", `{comparison:'>',limit:${schema.exclusiveMinimum}}`, `'must be > ${schema.exclusiveMinimum}'`)}}`);
		}
		if (schema.exclusiveMaximum !== void 0) {
			const c = isNum ? `${v}>=${schema.exclusiveMaximum}` : `typeof ${v}==='number'&&${v}>=${schema.exclusiveMaximum}`;
			lines.push(`if(${c}){${fail("exclusiveMaximum", "exclusiveMaximum", `{comparison:'<',limit:${schema.exclusiveMaximum}}`, `'must be < ${schema.exclusiveMaximum}'`)}}`);
		}
		if (schema.multipleOf !== void 0) {
			const m = schema.multipleOf;
			const ci = ctx.varCounter++;
			lines.push(`{const _r${ci}=typeof ${v}==='number'?${v}%${m}:NaN;if(typeof ${v}==='number'&&Math.abs(_r${ci})>1e-8&&Math.abs(_r${ci}-${m})>1e-8){${fail("multipleOf", "multipleOf", `{multipleOf:${m}}`, `'must be multiple of ${m}'`)}}}`);
		}
		if (schema.minLength !== void 0) {
			const M = schema.minLength;
			const inner = `${v}.length<${M}||(${v}.length<${M * 2}&&_cpLen(${v})<${M})`;
			const c = isStr ? inner : `typeof ${v}==='string'&&(${inner})`;
			lines.push(`if(${c}){${fail("minLength", "minLength", `{limit:${M}}`, `'must NOT have fewer than ${M} characters'`)}}`);
		}
		if (schema.maxLength !== void 0) {
			const X = schema.maxLength;
			const inner = `${v}.length>${X * 2}||(${v}.length>${X}&&_cpLen(${v})>${X})`;
			const c = isStr ? inner : `typeof ${v}==='string'&&(${inner})`;
			lines.push(`if(${c}){${fail("maxLength", "maxLength", `{limit:${X}}`, `'must NOT have more than ${X} characters'`)}}`);
		}
		if (schema.pattern) {
			const inlineCheck = compilePatternInline(schema.pattern, v);
			if (inlineCheck) {
				const c = isStr ? `!(${inlineCheck})` : `typeof ${v}==='string'&&!(${inlineCheck})`;
				lines.push(`if(${c}){${fail("pattern", "pattern", `{pattern:${JSON.stringify(schema.pattern)}}`, `'must match pattern "${schema.pattern}"'`)}}`);
			} else {
				const reVar = `_re${ctx.varCounter++}`;
				ctx.closureVars.push(reVar);
				ctx.closureVals.push(patternIsSafe(schema.pattern) ? compileSafe(schema.pattern) : new RegExp(schema.pattern));
				const c = isStr ? `!${reVar}.test(${v})` : `typeof ${v}==='string'&&!${reVar}.test(${v})`;
				lines.push(`if(${c}){${fail("pattern", "pattern", `{pattern:${JSON.stringify(schema.pattern)}}`, `'must match pattern "${schema.pattern}"'`)}}`);
			}
		}
		if (schema.format) {
			const fc = FORMAT_CODEGEN[schema.format];
			if (fc) {
				const code = fc(v, isStr).replace(/return false/g, `{${fail("format", "format", `{format:'${esc(schema.format)}'}`, `'must match format "${esc(schema.format)}"'`)}}`);
				lines.push(code);
			} else if (ctx.userFormats && typeof ctx.userFormats[schema.format] === "function") {
				const closureName = `_uf_${schema.format.replace(/[^a-zA-Z0-9_]/g, "_")}`;
				if (!ctx.closureVars.includes(closureName)) {
					ctx.closureVars.push(closureName);
					ctx.closureVals.push(ctx.userFormats[schema.format]);
				}
				const guard = isStr ? "" : `typeof ${v}==='string'&&`;
				lines.push(`if(${guard}!${closureName}(${v})){${fail("format", "format", `{format:'${esc(schema.format)}'}`, `'must match format "${esc(schema.format)}"'`)}}`);
			}
		}
		if (schema.minItems !== void 0) {
			const c = isArr ? `${v}.length<${schema.minItems}` : `Array.isArray(${v})&&${v}.length<${schema.minItems}`;
			lines.push(`if(${c}){${fail("minItems", "minItems", `{limit:${schema.minItems}}`, `'must NOT have fewer than ${schema.minItems} items'`)}}`);
		}
		if (schema.maxItems !== void 0) {
			const c = isArr ? `${v}.length>${schema.maxItems}` : `Array.isArray(${v})&&${v}.length>${schema.maxItems}`;
			lines.push(`if(${c}){${fail("maxItems", "maxItems", `{limit:${schema.maxItems}}`, `'must NOT have more than ${schema.maxItems} items'`)}}`);
		}
		if (schema.uniqueItems) {
			const si = ctx.varCounter++;
			const itemType = schema.items && typeof schema.items === "object" && schema.items.type;
			const isPrim = itemType === "string" || itemType === "number" || itemType === "integer";
			const maxItems = schema.maxItems;
			const failExpr = (iVar, jVar) => fail("uniqueItems", "uniqueItems", `{i:${iVar},j:${jVar}}`, `'must NOT have duplicate items (items ## '+${jVar}+' and '+${iVar}+' are identical)'`);
			let inner;
			if (isPrim && maxItems && maxItems <= 16) inner = `for(let _i=1;_i<${v}.length;_i++){for(let _k=0;_k<_i;_k++){if(${v}[_i]===${v}[_k]){${failExpr("_k", "_i")};break}}}`;
			else if (isPrim) inner = `const _s${si}=new Map();for(let _i=0;_i<${v}.length;_i++){const _prev=_s${si}.get(${v}[_i]);if(_prev!==undefined){${failExpr("_prev", "_i")};break};_s${si}.set(${v}[_i],_i)}`;
			else inner = `const _cn${si}=function(x){if(x===null||typeof x!=='object')return typeof x+':'+x;if(Array.isArray(x))return'['+x.map(_cn${si}).join(',')+']';return'{'+Object.keys(x).sort().map(function(k){return JSON.stringify(k)+':'+_cn${si}(x[k])}).join(',')+'}'};const _s${si}=new Map();for(let _i=0;_i<${v}.length;_i++){const _k=_cn${si}(${v}[_i]);const _prev=_s${si}.get(_k);if(_prev!==undefined){${failExpr("_prev", "_i")};break};_s${si}.set(_k,_i)}`;
			lines.push(isArr ? `{${inner}}` : `if(Array.isArray(${v})){${inner}}`);
		}
		if (schema.minProperties !== void 0) lines.push(`if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v})&&Object.keys(${v}).length<${schema.minProperties}){${fail("minProperties", "minProperties", `{limit:${schema.minProperties}}`, `'must NOT have fewer than ${schema.minProperties} properties'`)}}`);
		if (schema.maxProperties !== void 0) lines.push(`if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v})&&Object.keys(${v}).length>${schema.maxProperties}){${fail("maxProperties", "maxProperties", `{limit:${schema.maxProperties}}`, `'must NOT have more than ${schema.maxProperties} properties'`)}}`);
		if (schema.additionalProperties === false && schema.properties && !schema.patternProperties) {
			const propKeys = Object.keys(schema.properties);
			const ci = ctx.varCounter++;
			if (propKeys.length <= 8) {
				const checks = propKeys.map((k) => `_k${ci}[_i]!==${JSON.stringify(k)}`).join("&&");
				lines.push(isObj ? `{const _k${ci}=Object.keys(${v});for(let _i=0;_i<_k${ci}.length;_i++)if(${checks}){${fail("additionalProperties", "additionalProperties", `{additionalProperty:_k${ci}[_i]}`, "'must NOT have additional properties'")}}}` : `if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v})){const _k${ci}=Object.keys(${v});for(let _i=0;_i<_k${ci}.length;_i++)if(${checks}){${fail("additionalProperties", "additionalProperties", `{additionalProperty:_k${ci}[_i]}`, "'must NOT have additional properties'")}}}`);
			} else {
				const allowed = propKeys.map((k) => JSON.stringify(k)).join(",");
				lines.push(isObj ? `{const _k${ci}=Object.keys(${v});const _a${ci}=new Set([${allowed}]);for(let _i=0;_i<_k${ci}.length;_i++)if(!_a${ci}.has(_k${ci}[_i])){${fail("additionalProperties", "additionalProperties", `{additionalProperty:_k${ci}[_i]}`, "'must NOT have additional properties'")}}}` : `if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v})){const _k${ci}=Object.keys(${v});const _a${ci}=new Set([${allowed}]);for(let _i=0;_i<_k${ci}.length;_i++)if(!_a${ci}.has(_k${ci}[_i])){${fail("additionalProperties", "additionalProperties", `{additionalProperty:_k${ci}[_i]}`, "'must NOT have additional properties'")}}}`);
			}
		}
		if (schema.dependentRequired) for (const [key, deps] of Object.entries(schema.dependentRequired)) for (const dep of deps) if (!pathExpr || pathExpr.startsWith("'") && !pathExpr.includes("+")) {
			const errVar = `_E${ctx.varCounter++}`;
			const pathVal = pathExpr ? pathExpr.slice(1, -1) : "";
			ctx.closureVars.push(errVar);
			ctx.closureVals.push(Object.freeze({
				keyword: "required",
				instancePath: pathVal,
				schemaPath: `${schemaPrefix}/dependentRequired`,
				params: Object.freeze({ missingProperty: dep }),
				message: `must have required property '${dep}'`
			}));
			lines.push(`if(typeof ${v}==='object'&&${v}!==null&&${JSON.stringify(key)} in ${v}&&!(${JSON.stringify(dep)} in ${v})){(_e||(_e=[])).push(${errVar})}`);
		} else lines.push(`if(typeof ${v}==='object'&&${v}!==null&&${JSON.stringify(key)} in ${v}&&!(${JSON.stringify(dep)} in ${v})){(_e||(_e=[])).push({keyword:'required',instancePath:${pathExpr || "\"\""},schemaPath:'${schemaPrefix}/dependentRequired',params:{missingProperty:'${esc(dep)}'},message:"must have required property '${esc(dep)}'"})}`);
		if (schema.properties) for (const [key, prop] of Object.entries(schema.properties)) {
			const pv = hoisted[key] || `${v}[${JSON.stringify(key)}]`;
			const childPath = childPathExpr(pathExpr, esc(key));
			if (requiredSet.has(key) && isObj) {
				lines.push(`if(${pv}!==undefined){`);
				genCodeC(prop, pv, childPath, lines, ctx, schemaPrefix + "/properties/" + key);
				lines.push(`}`);
			} else if (isObj) {
				const oi = ctx.varCounter++;
				lines.push(`{const _o${oi}=${v}[${JSON.stringify(key)}];if(_o${oi}!==undefined){`);
				genCodeC(prop, `_o${oi}`, childPath, lines, ctx, schemaPrefix + "/properties/" + key);
				lines.push(`}}`);
			} else {
				lines.push(`if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v})&&${JSON.stringify(key)} in ${v}){`);
				genCodeC(prop, `${v}[${JSON.stringify(key)}]`, childPath, lines, ctx, schemaPrefix + "/properties/" + key);
				lines.push(`}`);
			}
		}
		if (schema.patternProperties) {
			const ppEntries = Object.entries(schema.patternProperties);
			const pn = schema.propertyNames && typeof schema.propertyNames === "object" ? schema.propertyNames : null;
			const pi = ctx.varCounter++;
			const matchers = [];
			for (const [pat] of ppEntries) {
				const fast = fastPrefixCheck(pat, `_k${pi}`);
				if (fast) matchers.push({ check: fast });
				else {
					const ri = ctx.varCounter++;
					ctx.closureVars.push(`_re${ri}`);
					ctx.closureVals.push(safeReClosure(ctx, pat));
					matchers.push({ check: `_re${ri}.test(_k${pi})` });
				}
			}
			const guard = isObj ? "" : `if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v}))`;
			const kVar = `_k${pi}`;
			if (schema.additionalProperties === false && schema.properties) {
				ctx._ppHandledPropertyNamesC = !!pn;
				const propKeys = Object.keys(schema.properties);
				const keyCheck = propKeys.length <= 8 ? propKeys.map((k) => `${kVar}===${JSON.stringify(k)}`).join("||") : null;
				if (!keyCheck) {
					const allowedSet = `_as${pi}`;
					ctx.closureVars.push(allowedSet);
					ctx.closureVals.push(new Set(propKeys));
				}
				lines.push(`${guard}{for(const ${kVar} in ${v}){`);
				if (pn) {
					if (pn.minLength !== void 0) lines.push(`if(${kVar}.length<${pn.minLength}){${fail("minLength", "propertyNames/minLength", `{limit:${pn.minLength}}`, `'must NOT have fewer than ${pn.minLength} characters'`)}}`);
					if (pn.maxLength !== void 0) lines.push(`if(${kVar}.length>${pn.maxLength}){${fail("maxLength", "propertyNames/maxLength", `{limit:${pn.maxLength}}`, `'must NOT have more than ${pn.maxLength} characters'`)}}`);
					if (pn.pattern) {
						const fast = fastPrefixCheck(pn.pattern, kVar);
						if (fast) lines.push(`if(!(${fast})){${fail("pattern", "propertyNames/pattern", `{pattern:${JSON.stringify(pn.pattern)}}`, `'must match pattern "${pn.pattern}"'`)}}`);
						else {
							const ri = ctx.varCounter++;
							ctx.closureVars.push(`_re${ri}`);
							ctx.closureVals.push(safeReClosure(ctx, pn.pattern));
							lines.push(`if(!_re${ri}.test(${kVar})){${fail("pattern", "propertyNames/pattern", `{pattern:${JSON.stringify(pn.pattern)}}`, `'must match pattern "${pn.pattern}"'`)}}`);
						}
					}
					if (pn.const !== void 0) lines.push(`if(${kVar}!==${JSON.stringify(pn.const)}){${fail("const", "propertyNames/const", `{allowedValue:${JSON.stringify(pn.const)}}`, "'must be equal to constant'")}}`);
					if (pn.enum) {
						const ei = ctx.varCounter++;
						ctx.closureVars.push(`_es${ei}`);
						ctx.closureVals.push(new Set(pn.enum));
						lines.push(`if(!_es${ei}.has(${kVar})){${fail("enum", "propertyNames/enum", `{allowedValues:${JSON.stringify(pn.enum)}}`, "'must be equal to one of the allowed values'")}}`);
					}
				}
				const matchExpr = keyCheck || `_as${pi}.has(${kVar})`;
				lines.push(`let _m${pi}=${matchExpr}`);
				for (let i = 0; i < ppEntries.length; i++) {
					lines.push(`if(${matchers[i].check}){_m${pi}=true;{const _ppv${pi}_${i}=${v}[${kVar}]`);
					genCodeC(ppEntries[i][1], `_ppv${pi}_${i}`, childPathDynExpr(pathExpr, kVar), lines, ctx, schemaPrefix + "/patternProperties/" + ptrSeg(ppEntries[i][0]));
					lines.push(`}}`);
				}
				lines.push(`if(!_m${pi}){${fail("additionalProperties", "additionalProperties", `{additionalProperty:${kVar}}`, "'must NOT have additional properties'")}}`);
				lines.push(`}}`);
			} else {
				ctx._ppHandledPropertyNamesC = !!pn;
				lines.push(`${guard}{for(const ${kVar} in ${v}){`);
				if (pn) {
					if (pn.minLength !== void 0) lines.push(`if(${kVar}.length<${pn.minLength}){${fail("minLength", "propertyNames/minLength", `{limit:${pn.minLength}}`, `'must NOT have fewer than ${pn.minLength} characters'`)}}`);
					if (pn.maxLength !== void 0) lines.push(`if(${kVar}.length>${pn.maxLength}){${fail("maxLength", "propertyNames/maxLength", `{limit:${pn.maxLength}}`, `'must NOT have more than ${pn.maxLength} characters'`)}}`);
					if (pn.pattern) {
						const fast = fastPrefixCheck(pn.pattern, kVar);
						if (fast) lines.push(`if(!(${fast})){${fail("pattern", "propertyNames/pattern", `{pattern:${JSON.stringify(pn.pattern)}}`, `'must match pattern "${pn.pattern}"'`)}}`);
						else {
							const ri = ctx.varCounter++;
							ctx.closureVars.push(`_re${ri}`);
							ctx.closureVals.push(safeReClosure(ctx, pn.pattern));
							lines.push(`if(!_re${ri}.test(${kVar})){${fail("pattern", "propertyNames/pattern", `{pattern:${JSON.stringify(pn.pattern)}}`, `'must match pattern "${pn.pattern}"'`)}}`);
						}
					}
					if (pn.const !== void 0) lines.push(`if(${kVar}!==${JSON.stringify(pn.const)}){${fail("const", "propertyNames/const", `{allowedValue:${JSON.stringify(pn.const)}}`, "'must be equal to constant'")}}`);
					if (pn.enum) {
						const ei = ctx.varCounter++;
						ctx.closureVars.push(`_es${ei}`);
						ctx.closureVals.push(new Set(pn.enum));
						lines.push(`if(!_es${ei}.has(${kVar})){${fail("enum", "propertyNames/enum", `{allowedValues:${JSON.stringify(pn.enum)}}`, "'must be equal to one of the allowed values'")}}`);
					}
				}
				for (let i = 0; i < ppEntries.length; i++) {
					lines.push(`if(${matchers[i].check}){const _ppv${pi}_${i}=${v}[${kVar}]`);
					genCodeC(ppEntries[i][1], `_ppv${pi}_${i}`, childPathDynExpr(pathExpr, kVar), lines, ctx, schemaPrefix + "/patternProperties/" + ptrSeg(ppEntries[i][0]));
					lines.push(`}`);
				}
				lines.push(`}}`);
			}
		}
		if (schema.dependentSchemas) for (const [key, depSchema] of Object.entries(schema.dependentSchemas)) {
			lines.push(`if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v})&&${JSON.stringify(key)} in ${v}){`);
			genCodeC(depSchema, v, pathExpr, lines, ctx, schemaPrefix + "/dependentSchemas/" + key);
			lines.push(`}`);
		}
		if (schema.propertyNames && typeof schema.propertyNames === "object" && !ctx._ppHandledPropertyNamesC) {
			const pn = schema.propertyNames;
			const ki = ctx.varCounter++;
			lines.push(`if(typeof ${v}==='object'&&${v}!==null&&!Array.isArray(${v})){for(const _k${ki} in ${v}){`);
			if (pn.minLength !== void 0) lines.push(`if(_k${ki}.length<${pn.minLength}){${fail("minLength", "propertyNames/minLength", `{limit:${pn.minLength}}`, `'must NOT have fewer than ${pn.minLength} characters'`)}}`);
			if (pn.maxLength !== void 0) lines.push(`if(_k${ki}.length>${pn.maxLength}){${fail("maxLength", "propertyNames/maxLength", `{limit:${pn.maxLength}}`, `'must NOT have more than ${pn.maxLength} characters'`)}}`);
			if (pn.pattern) {
				const ri = ctx.varCounter++;
				ctx.closureVars.push(`_re${ri}`);
				ctx.closureVals.push(safeReClosure(ctx, pn.pattern));
				lines.push(`if(!_re${ri}.test(_k${ki})){${fail("pattern", "propertyNames/pattern", `{pattern:${JSON.stringify(pn.pattern)}}`, `'must match pattern "${pn.pattern}"'`)}}`);
			}
			if (pn.const !== void 0) lines.push(`if(_k${ki}!==${JSON.stringify(pn.const)}){${fail("const", "propertyNames/const", `{allowedValue:${JSON.stringify(pn.const)}}`, "'must be equal to constant'")}}`);
			if (pn.enum) {
				const ei = ctx.varCounter++;
				ctx.closureVars.push(`_es${ei}`);
				ctx.closureVals.push(new Set(pn.enum));
				lines.push(`if(!_es${ei}.has(_k${ki})){${fail("enum", "propertyNames/enum", `{allowedValues:${JSON.stringify(pn.enum)}}`, "'must be equal to one of the allowed values'")}}`);
			}
			lines.push(`}}`);
		}
		if (schema.items) {
			const startIdx = schema.prefixItems ? schema.prefixItems.length : 0;
			const idx = `_j${ctx.varCounter}`, elem = `_ei${ctx.varCounter}`;
			ctx.varCounter++;
			const childPath = childPathDynExpr(pathExpr, idx);
			lines.push(`if(Array.isArray(${v})){for(let ${idx}=${startIdx};${idx}<${v}.length;${idx}++){const ${elem}=${v}[${idx}]`);
			genCodeC(schema.items, elem, childPath, lines, ctx, schemaPrefix + "/items");
			lines.push(`}}`);
		}
		if (schema.prefixItems) for (let i = 0; i < schema.prefixItems.length; i++) {
			const childPath = childPathExpr(pathExpr, String(i));
			lines.push(`if(Array.isArray(${v})&&${v}.length>${i}){`);
			genCodeC(schema.prefixItems[i], `${v}[${i}]`, childPath, lines, ctx, schemaPrefix + "/prefixItems/" + i);
			lines.push(`}`);
		}
		if (schema.contains) {
			const ci = ctx.varCounter++;
			const subLines = [];
			genCode(schema.contains, `_cv`, subLines, ctx);
			const fnBody = subLines.length === 0 ? `return true` : `${subLines.join(";")};return true`;
			const minC = schema.minContains !== void 0 ? schema.minContains : 1;
			const maxC = schema.maxContains;
			lines.push(`if(Array.isArray(${v})){const _cf${ci}=function(_cv){${fnBody}};let _cc${ci}=0;for(let _ci${ci}=0;_ci${ci}<${v}.length;_ci${ci}++){if(_cf${ci}(${v}[_ci${ci}]))_cc${ci}++}`);
			lines.push(`if(_cc${ci}<${minC}){${fail("contains", "contains", `{limit:${minC}}`, `'contains: need at least ${minC} match(es)'`)}}`);
			if (maxC !== void 0) lines.push(`if(_cc${ci}>${maxC}){${fail("contains", "contains", `{limit:${maxC}}`, `'contains: at most ${maxC} match(es)'`)}}`);
			lines.push(`}`);
		}
		if (schema.allOf) for (let _ai = 0; _ai < schema.allOf.length; _ai++) genCodeC(schema.allOf[_ai], v, pathExpr, lines, ctx, schemaPrefix + "/allOf/" + _ai);
		if (schema.anyOf) {
			const fi = ctx.varCounter++;
			const fns = schema.anyOf.map((sub) => {
				const sl = [];
				genCode(sub, "_av", sl, ctx);
				return sl.length === 0 ? `function(_av){return true}` : `function(_av){${sl.join(";")};return true}`;
			});
			lines.push(`{const _af${fi}=[${fns.join(",")}];let _am=false;for(let _ai=0;_ai<_af${fi}.length;_ai++){if(_af${fi}[_ai](${v})){_am=true;break}}if(!_am){${fail("anyOf", "anyOf", "{}", "'must match a schema in anyOf'")}}}`);
		}
		if (schema.oneOf) {
			const fi = ctx.varCounter++;
			const fns = schema.oneOf.map((sub) => {
				const sl = [];
				genCode(sub, "_ov", sl, ctx);
				return sl.length === 0 ? `function(_ov){return true}` : `function(_ov){${sl.join(";")};return true}`;
			});
			lines.push(`{const _of${fi}=[${fns.join(",")}];let _oc=0;for(let _oi=0;_oi<_of${fi}.length;_oi++){if(_of${fi}[_oi](${v}))_oc++;if(_oc>1)break}if(_oc!==1){${fail("oneOf", "oneOf", "{}", "'must match exactly one schema in oneOf'")}}}`);
		}
		if (schema.not) {
			const sl = [];
			genCode(schema.not, "_nv", sl, ctx);
			const nfn = sl.length === 0 ? `function(_nv){return true}` : `function(_nv){${sl.join(";")};return true}`;
			const fi = ctx.varCounter++;
			lines.push(`{const _nf${fi}=${nfn};if(_nf${fi}(${v})){${fail("not", "not", "{}", "'must NOT be valid'")}}}`);
		}
		if (schema.if) {
			const sl = [];
			genCode(schema.if, "_iv", sl, ctx);
			const fi = ctx.varCounter++;
			const ifFn = sl.length === 0 ? `function(_iv){return true}` : `function(_iv){${sl.join(";")};return true}`;
			lines.push(`{const _if${fi}=${ifFn}`);
			if (schema.then) {
				lines.push(`if(_if${fi}(${v})){`);
				genCodeC(schema.then, v, pathExpr, lines, ctx, schemaPrefix + "/then");
				lines.push(`}`);
			}
			if (schema.else) {
				lines.push(`${schema.then ? "else" : `if(!_if${fi}(${v}))`}{`);
				genCodeC(schema.else, v, pathExpr, lines, ctx, schemaPrefix + "/else");
				lines.push(`}`);
			}
			lines.push(`}`);
		}
		if (types) lines.push(`}`);
	}
	function collectEvaluated(schema, schemaMap, rootDefs) {
		if (typeof schema !== "object" || schema === null) return {
			props: [],
			items: null,
			allProps: false,
			allItems: false,
			dynamic: false
		};
		const defs = rootDefs || schema.$defs || schema.definitions || null;
		const result = {
			props: [],
			items: null,
			allProps: false,
			allItems: false,
			dynamic: false
		};
		_collectEval(schema, result, defs, schemaMap, /* @__PURE__ */ new Set(), true);
		return result;
	}
	function _collectEval(schema, result, defs, schemaMap, refStack, isRoot) {
		if (typeof schema !== "object" || schema === null) return;
		if (result.allProps && result.allItems) return;
		if (schema.$ref) {
			const m = schema.$ref.match(/^#\/(?:\$defs|definitions)\/(.+)$/);
			if (m && defs && defs[m[1]]) {
				if (refStack.has(schema.$ref)) {
					result.dynamic = true;
					return;
				}
				refStack.add(schema.$ref);
				_collectEval(defs[m[1]], result, defs, schemaMap, refStack);
				refStack.delete(schema.$ref);
			} else if (schemaMap && typeof schemaMap.get === "function") {
				let resolved = schemaMap.has(schema.$ref) ? schemaMap.get(schema.$ref) : null;
				if (!resolved && !schema.$ref.includes("://") && !schema.$ref.startsWith("#")) {
					for (const [id, s] of schemaMap) if (id.endsWith("/" + schema.$ref)) {
						resolved = s;
						break;
					}
				}
				if (resolved) {
					if (refStack.has(schema.$ref)) {
						result.dynamic = true;
						return;
					}
					refStack.add(schema.$ref);
					_collectEval(resolved, result, defs, schemaMap, refStack);
					refStack.delete(schema.$ref);
				}
			}
			if (!Object.keys(schema).some((k) => k !== "$ref" && k !== "$defs" && k !== "definitions" && k !== "$schema" && k !== "$id")) return;
		}
		if (schema.properties) {
			for (const k of Object.keys(schema.properties)) if (!result.props.includes(k)) result.props.push(k);
		}
		if (schema.additionalProperties !== void 0 && schema.additionalProperties !== false) result.allProps = true;
		if (schema.patternProperties) result.dynamic = true;
		if (schema.prefixItems) {
			const count = schema.prefixItems.length;
			result.items = result.items === null ? count : Math.max(result.items, count);
		}
		if (schema.items && typeof schema.items === "object") result.allItems = true;
		if (schema.items === true) result.allItems = true;
		if (schema.contains) result.dynamic = true;
		if (!isRoot && (schema.unevaluatedProperties === true || typeof schema.unevaluatedProperties === "object" && schema.unevaluatedProperties !== null)) result.allProps = true;
		if (!isRoot && (schema.unevaluatedItems === true || typeof schema.unevaluatedItems === "object" && schema.unevaluatedItems !== null)) result.allItems = true;
		if (schema.allOf) for (const sub of schema.allOf) _collectEval(sub, result, defs, schemaMap, refStack);
		if (schema.anyOf || schema.oneOf) {
			result.dynamic = true;
			const branches = schema.anyOf || schema.oneOf;
			for (const sub of branches) _collectEval(sub, result, defs, schemaMap, refStack);
		}
		if (schema.if && (schema.then || schema.else)) {
			result.dynamic = true;
			_collectEval(schema.if, result, defs, schemaMap, refStack);
			if (schema.then) _collectEval(schema.then, result, defs, schemaMap, refStack);
			if (schema.else) _collectEval(schema.else, result, defs, schemaMap, refStack);
		} else if (schema.if) {
			result.dynamic = true;
			if (schema.if.properties) {
				for (const k of Object.keys(schema.if.properties)) if (!result.props.includes(k)) result.props.push(k);
			}
			if (schema.if.patternProperties) {}
		}
		if (schema.dependentSchemas) {
			result.dynamic = true;
			for (const sub of Object.values(schema.dependentSchemas)) _collectEval(sub, result, defs, schemaMap, refStack);
		}
	}
	module.exports = {
		compileToJS,
		compileToJSCodegen,
		compileToJSCodegenWithErrors,
		compileToJSCombined,
		collectEvaluated,
		AJV_MESSAGES
	};
}));
//#endregion
//#region ../node_modules/.pnpm/ata-validator@1.7.4_yaml@2.9.0/node_modules/ata-validator/lib/draft7.js
var require_draft7 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const DRAFT7_SCHEMAS = /* @__PURE__ */ new Set(["http://json-schema.org/draft-07/schema#", "http://json-schema.org/draft-07/schema"]);
	function isDraft7(schema) {
		return !!(schema && schema.$schema && DRAFT7_SCHEMAS.has(schema.$schema));
	}
	function normalizeDraft7(schema, force) {
		if (!force && !isDraft7(schema)) return schema;
		_normalize(schema);
		return schema;
	}
	const REF_SIBLINGS_KEPT = /* @__PURE__ */ new Set([
		"$ref",
		"$defs",
		"definitions",
		"$schema",
		"$comment",
		"title",
		"description",
		"examples",
		"default",
		"readOnly",
		"writeOnly"
	]);
	function _normalize(schema) {
		if (typeof schema !== "object" || schema === null) return;
		if (typeof schema.$ref === "string") {
			for (const key of Object.keys(schema)) if (!REF_SIBLINGS_KEPT.has(key)) delete schema[key];
		}
		if (typeof schema.$id === "string" && /^#[A-Za-z][A-Za-z0-9_.:-]*$/.test(schema.$id)) {
			if (schema.$anchor === void 0) schema.$anchor = schema.$id.slice(1);
			delete schema.$id;
		}
		if (schema.definitions && !schema.$defs) {
			schema.$defs = schema.definitions;
			delete schema.definitions;
		}
		if (schema.dependencies) {
			for (const [key, value] of Object.entries(schema.dependencies)) if (Array.isArray(value)) {
				if (!schema.dependentRequired) schema.dependentRequired = {};
				schema.dependentRequired[key] = value;
			} else {
				if (!schema.dependentSchemas) schema.dependentSchemas = {};
				schema.dependentSchemas[key] = value;
			}
			delete schema.dependencies;
		}
		if (Array.isArray(schema.items)) {
			schema.prefixItems = schema.items;
			if (schema.additionalItems !== void 0) {
				schema.items = schema.additionalItems;
				delete schema.additionalItems;
			} else delete schema.items;
		}
		for (const key of [
			"properties",
			"patternProperties",
			"$defs",
			"definitions",
			"dependentSchemas"
		]) if (schema[key] && typeof schema[key] === "object") {
			for (const v of Object.values(schema[key])) if (typeof v === "object" && v !== null) _normalize(v);
		}
		for (const key of [
			"allOf",
			"anyOf",
			"oneOf",
			"prefixItems"
		]) if (Array.isArray(schema[key])) {
			for (const s of schema[key]) if (typeof s === "object" && s !== null) _normalize(s);
		}
		for (const key of [
			"items",
			"contains",
			"not",
			"if",
			"then",
			"else",
			"additionalProperties",
			"propertyNames"
		]) if (typeof schema[key] === "object" && schema[key] !== null) _normalize(schema[key]);
	}
	function normalizeNullable(schema) {
		if (typeof schema !== "object" || schema === null) return schema;
		_normalizeNullable(schema);
		return schema;
	}
	function _normalizeNullable(schema) {
		if (typeof schema !== "object" || schema === null) return;
		if (schema.nullable === true && schema.type !== void 0) {
			if (Array.isArray(schema.type)) {
				if (!schema.type.includes("null")) schema.type = schema.type.concat("null");
			} else schema.type = [schema.type, "null"];
		}
		if ("nullable" in schema) delete schema.nullable;
		for (const key of [
			"properties",
			"patternProperties",
			"$defs",
			"definitions",
			"dependentSchemas"
		]) if (schema[key] && typeof schema[key] === "object") {
			for (const v of Object.values(schema[key])) if (typeof v === "object" && v !== null) _normalizeNullable(v);
		}
		for (const key of [
			"allOf",
			"anyOf",
			"oneOf",
			"prefixItems"
		]) if (Array.isArray(schema[key])) {
			for (const s of schema[key]) if (typeof s === "object" && s !== null) _normalizeNullable(s);
		}
		for (const key of [
			"items",
			"contains",
			"not",
			"if",
			"then",
			"else",
			"additionalProperties",
			"propertyNames",
			"unevaluatedItems",
			"unevaluatedProperties"
		]) if (typeof schema[key] === "object" && schema[key] !== null) _normalizeNullable(schema[key]);
	}
	function stripFormatAssertions(schema) {
		if (typeof schema !== "object" || schema === null) return schema;
		_stripFormat(schema, /* @__PURE__ */ new Set());
		return schema;
	}
	function _stripFormat(schema, seen) {
		if (typeof schema !== "object" || schema === null || Array.isArray(schema)) return;
		if (seen.has(schema)) return;
		seen.add(schema);
		if (typeof schema.format === "string") delete schema.format;
		for (const key of [
			"properties",
			"patternProperties",
			"$defs",
			"definitions",
			"dependentSchemas"
		]) if (schema[key] && typeof schema[key] === "object" && !Array.isArray(schema[key])) for (const v of Object.values(schema[key])) _stripFormat(v, seen);
		for (const key of [
			"allOf",
			"anyOf",
			"oneOf",
			"prefixItems"
		]) if (Array.isArray(schema[key])) for (const s of schema[key]) _stripFormat(s, seen);
		for (const key of [
			"items",
			"additionalItems",
			"contains",
			"not",
			"if",
			"then",
			"else",
			"additionalProperties",
			"propertyNames",
			"unevaluatedItems",
			"unevaluatedProperties",
			"contentSchema"
		]) if (Array.isArray(schema[key])) for (const s of schema[key]) _stripFormat(s, seen);
		else _stripFormat(schema[key], seen);
	}
	module.exports = {
		isDraft7,
		normalizeDraft7,
		normalizeNullable,
		stripFormatAssertions
	};
}));
//#endregion
//#region ../node_modules/.pnpm/ata-validator@1.7.4_yaml@2.9.0/node_modules/ata-validator/lib/dialect.js
var require_dialect = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const V1_DIALECTS = /* @__PURE__ */ new Set([
		"https://json-schema.org/v1",
		"https://json-schema.org/v1/schema",
		"https://json-schema.org/v1/2026",
		"https://json-schema.org/draft/next/schema"
	]);
	function isV1Dialect(schema) {
		if (typeof schema !== "object" || schema === null) return false;
		if (typeof schema.$schema !== "string") return false;
		const uri = schema.$schema.endsWith("#") ? schema.$schema.slice(0, -1) : schema.$schema;
		return V1_DIALECTS.has(uri);
	}
	module.exports = {
		isV1Dialect,
		V1_DIALECTS
	};
}));
//#endregion
//#region ../node_modules/.pnpm/ata-validator@1.7.4_yaml@2.9.0/node_modules/ata-validator/lib/shape-classifier.js
var require_shape_classifier = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const PRIMITIVE_TYPES = /* @__PURE__ */ new Set([
		"string",
		"number",
		"integer",
		"boolean"
	]);
	const META_KEYS = /* @__PURE__ */ new Set([
		"$schema",
		"$id",
		"$comment",
		"title",
		"description",
		"default",
		"examples",
		"deprecated",
		"readOnly",
		"writeOnly"
	]);
	const TIER0_OBJECT_ALLOWED = /* @__PURE__ */ new Set([
		"type",
		"properties",
		"required",
		"additionalProperties",
		...META_KEYS
	]);
	const TIER0_PRIMITIVE_ALLOWED = /* @__PURE__ */ new Set([
		"type",
		"enum",
		"const",
		"minLength",
		"maxLength",
		"minimum",
		"maximum",
		"exclusiveMinimum",
		"exclusiveMaximum",
		"multipleOf",
		...META_KEYS
	]);
	const MAX_TIER0_PROPS = 10;
	const MAX_TIER0_ENUM = 256;
	function isPrimitiveType(t) {
		return typeof t === "string" && PRIMITIVE_TYPES.has(t);
	}
	function isPrimitiveEnumValue(v) {
		const t = typeof v;
		return v === null || t === "string" || t === "number" || t === "boolean";
	}
	function isTier0Primitive(schema) {
		if (typeof schema !== "object" || schema === null || Array.isArray(schema)) return false;
		if (!isPrimitiveType(schema.type)) return false;
		for (const k of Object.keys(schema)) if (!TIER0_PRIMITIVE_ALLOWED.has(k)) return false;
		if (schema.enum !== void 0) {
			if (!Array.isArray(schema.enum)) return false;
			if (schema.enum.length === 0 || schema.enum.length > MAX_TIER0_ENUM) return false;
			for (const v of schema.enum) if (!isPrimitiveEnumValue(v)) return false;
		}
		if (schema.const !== void 0 && !isPrimitiveEnumValue(schema.const)) return false;
		return true;
	}
	function isTier0Object(schema) {
		if (schema.type !== "object") return false;
		for (const k of Object.keys(schema)) if (!TIER0_OBJECT_ALLOWED.has(k)) return false;
		const ap = schema.additionalProperties;
		if (ap !== void 0 && ap !== true && ap !== false) return false;
		if (schema.required !== void 0) {
			if (!Array.isArray(schema.required)) return false;
			for (const r of schema.required) if (typeof r !== "string") return false;
		}
		const props = schema.properties;
		if (props === void 0) return true;
		if (typeof props !== "object" || props === null || Array.isArray(props)) return false;
		const keys = Object.keys(props);
		if (keys.length > MAX_TIER0_PROPS) return false;
		for (const k of keys) if (!isTier0Primitive(props[k])) return false;
		return true;
	}
	function classify(schema) {
		if (typeof schema !== "object" || schema === null || Array.isArray(schema)) return {
			tier: 2,
			plan: null
		};
		if (isTier0Primitive(schema)) return {
			tier: 0,
			plan: null
		};
		if (isTier0Object(schema)) return {
			tier: 0,
			plan: null
		};
		return {
			tier: 2,
			plan: null
		};
	}
	module.exports = {
		classify,
		MAX_TIER0_PROPS,
		MAX_TIER0_ENUM,
		PRIMITIVE_TYPES
	};
}));
//#endregion
//#region ../node_modules/.pnpm/ata-validator@1.7.4_yaml@2.9.0/node_modules/ata-validator/lib/tier0.js
var require_tier0 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const TYPE_MASK = {
		string: 1,
		number: 2,
		integer: 4,
		boolean: 8
	};
	const T_STRING = TYPE_MASK.string;
	const T_NUMBER = TYPE_MASK.number;
	const T_INTEGER = TYPE_MASK.integer;
	const T_BOOLEAN = TYPE_MASK.boolean;
	function codePointLength(s) {
		const len = s.length;
		for (let i = 0; i < len; i++) if (s.charCodeAt(i) >= 55296 && s.charCodeAt(i) <= 56319) {
			let n = 0;
			for (const _ of s) n++;
			return n;
		}
		return len;
	}
	const F_MIN = 1;
	const F_MAX = 2;
	const F_EXCL_MIN = 4;
	const F_EXCL_MAX = 8;
	const F_MULT = 16;
	function primConstraint(key, propSchema) {
		const t = propSchema.type;
		const hasEnum = Array.isArray(propSchema.enum);
		const hasConst = propSchema.const !== void 0;
		let numFlags = 0;
		if (typeof propSchema.minimum === "number") numFlags |= F_MIN;
		if (typeof propSchema.maximum === "number") numFlags |= F_MAX;
		if (typeof propSchema.exclusiveMinimum === "number") numFlags |= F_EXCL_MIN;
		if (typeof propSchema.exclusiveMaximum === "number") numFlags |= F_EXCL_MAX;
		if (typeof propSchema.multipleOf === "number") numFlags |= F_MULT;
		return {
			key,
			typeMask: TYPE_MASK[t] | 0,
			numFlags,
			hasEnum,
			hasConst,
			enumSet: hasEnum ? new Set(propSchema.enum) : null,
			constVal: hasConst ? propSchema.const : void 0,
			minLen: typeof propSchema.minLength === "number" ? propSchema.minLength : -1,
			maxLen: typeof propSchema.maxLength === "number" ? propSchema.maxLength : -1,
			min: typeof propSchema.minimum === "number" ? propSchema.minimum : 0,
			max: typeof propSchema.maximum === "number" ? propSchema.maximum : 0,
			exclMin: typeof propSchema.exclusiveMinimum === "number" ? propSchema.exclusiveMinimum : 0,
			exclMax: typeof propSchema.exclusiveMaximum === "number" ? propSchema.exclusiveMaximum : 0,
			multipleOf: typeof propSchema.multipleOf === "number" ? propSchema.multipleOf : 0
		};
	}
	function buildTier0Plan(schema) {
		if (schema.type !== "object") return {
			isPrimitive: true,
			constraints: [primConstraint("__root__", schema)],
			requiredMask: 0,
			additionalAllowed: true,
			knownKeys: null
		};
		const props = schema.properties || {};
		const keys = Object.keys(props);
		const required = schema.required ? new Set(schema.required) : null;
		const constraints = new Array(keys.length);
		const knownKeys = /* @__PURE__ */ new Set();
		let requiredMask = 0;
		for (let i = 0; i < keys.length; i++) {
			const k = keys[i];
			constraints[i] = primConstraint(k, props[k]);
			knownKeys.add(k);
			if (required && required.has(k)) requiredMask |= 1 << i;
		}
		return {
			isPrimitive: false,
			constraints,
			requiredMask,
			additionalAllowed: schema.additionalProperties !== false,
			knownKeys
		};
	}
	function checkPrimitive(c, v) {
		const m = c.typeMask;
		if (m === T_STRING) {
			if (typeof v !== "string") return false;
			const minLen = c.minLen;
			const maxLen = c.maxLen;
			if (minLen >= 0) {
				const l = v.length;
				if (l < minLen) return false;
				if (l < minLen * 2 && codePointLength(v) < minLen) return false;
			}
			if (maxLen >= 0) {
				if (v.length > maxLen && codePointLength(v) > maxLen) return false;
			}
		} else if (m === T_INTEGER) {
			if (typeof v !== "number" || !Number.isInteger(v)) return false;
			const f = c.numFlags;
			if (f !== 0) {
				if (f & F_MIN && v < c.min) return false;
				if (f & F_MAX && v > c.max) return false;
				if (f & F_EXCL_MIN && v <= c.exclMin) return false;
				if (f & F_EXCL_MAX && v >= c.exclMax) return false;
				if (f & F_MULT && v % c.multipleOf !== 0) return false;
			}
		} else if (m === T_NUMBER) {
			if (typeof v !== "number") return false;
			const f = c.numFlags;
			if (f !== 0) {
				if (f & F_MIN && v < c.min) return false;
				if (f & F_MAX && v > c.max) return false;
				if (f & F_EXCL_MIN && v <= c.exclMin) return false;
				if (f & F_EXCL_MAX && v >= c.exclMax) return false;
				if (f & F_MULT && v % c.multipleOf !== 0) return false;
			}
		} else if (m === T_BOOLEAN) {
			if (typeof v !== "boolean") return false;
		} else return false;
		if (c.hasEnum && !c.enumSet.has(v)) return false;
		if (c.hasConst && v !== c.constVal) return false;
		return true;
	}
	function tier0ValidateObject(plan, data) {
		if (typeof data !== "object" || data === null || Array.isArray(data)) return false;
		const cs = plan.constraints;
		const n = cs.length;
		const reqMask = plan.requiredMask;
		let seenMask = 0;
		for (let i = 0; i < n; i++) {
			const c = cs[i];
			const v = data[c.key];
			if (v === void 0) {
				if (reqMask & 1 << i) return false;
				continue;
			}
			seenMask |= 1 << i;
			const m = c.typeMask;
			if (m === T_STRING) {
				if (typeof v !== "string") return false;
				const minLen = c.minLen;
				const maxLen = c.maxLen;
				if (minLen >= 0) {
					const l = v.length;
					if (l < minLen) return false;
					if (l < minLen * 2 && codePointLength(v) < minLen) return false;
				}
				if (maxLen >= 0) {
					if (v.length > maxLen && codePointLength(v) > maxLen) return false;
				}
			} else if (m === T_INTEGER) {
				if (typeof v !== "number" || !Number.isInteger(v)) return false;
				const f = c.numFlags;
				if (f !== 0) {
					if (f & F_MIN && v < c.min) return false;
					if (f & F_MAX && v > c.max) return false;
					if (f & F_EXCL_MIN && v <= c.exclMin) return false;
					if (f & F_EXCL_MAX && v >= c.exclMax) return false;
					if (f & F_MULT && v % c.multipleOf !== 0) return false;
				}
			} else if (m === T_NUMBER) {
				if (typeof v !== "number") return false;
				const f = c.numFlags;
				if (f !== 0) {
					if (f & F_MIN && v < c.min) return false;
					if (f & F_MAX && v > c.max) return false;
					if (f & F_EXCL_MIN && v <= c.exclMin) return false;
					if (f & F_EXCL_MAX && v >= c.exclMax) return false;
					if (f & F_MULT && v % c.multipleOf !== 0) return false;
				}
			} else if (m === T_BOOLEAN) {
				if (typeof v !== "boolean") return false;
			} else return false;
			if (c.hasEnum && !c.enumSet.has(v)) return false;
			if (c.hasConst && v !== c.constVal) return false;
		}
		if ((seenMask & reqMask) !== reqMask) return false;
		if (!plan.additionalAllowed) {
			const known = plan.knownKeys;
			for (const k in data) {
				if (!Object.prototype.hasOwnProperty.call(data, k)) continue;
				if (!known.has(k)) return false;
			}
		}
		return true;
	}
	function tier0Validate(plan, data) {
		if (plan.isPrimitive) return checkPrimitive(plan.constraints[0], data);
		return tier0ValidateObject(plan, data);
	}
	module.exports = {
		buildTier0Plan,
		tier0Validate,
		tier0ValidateObject,
		checkPrimitive,
		TYPE_MASK
	};
}));
//#endregion
//#region ../node_modules/.pnpm/ata-validator@1.7.4_yaml@2.9.0/node_modules/ata-validator/lib/source-positions.js
var require_source_positions = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Build a map of JSON pointer → { line, col, text } by scanning JSON text.
	*
	* Approach: use JSON.parse for correctness, then do one structural scan
	* tracking bracket depth and key positions. This avoids hand-rolling a
	* full JSON parser while delivering keyword-level positions sufficient
	* for source frames.
	*
	* Limitations (acceptable for source frames):
	*  - Duplicate keys: last wins.
	*  - Whitespace inside string values does not affect tracking (strings
	*    are skipped over wholesale).
	*  - Comments / trailing commas: JSON only, no JSON5.
	*/
	function escapePtr(s) {
		return s.replace(/~/g, "~0").replace(/\//g, "~1");
	}
	function buildPositionMap(text) {
		const map = Object.create(null);
		const lines = text.split("\n");
		const lineStart = new Array(lines.length + 1);
		lineStart[0] = 0;
		for (let i = 0; i < lines.length; i++) lineStart[i + 1] = lineStart[i] + lines[i].length + 1;
		function offsetToLineCol(off) {
			let lo = 0, hi = lineStart.length - 1;
			while (lo < hi) {
				const mid = lo + hi + 1 >> 1;
				if (lineStart[mid] <= off) lo = mid;
				else hi = mid - 1;
			}
			return {
				line: lo + 1,
				col: off - lineStart[lo] + 1,
				text: lines[lo] || ""
			};
		}
		let i = 0;
		const n = text.length;
		function skipWs() {
			while (i < n) {
				const ch = text.charCodeAt(i);
				if (ch === 32 || ch === 9 || ch === 10 || ch === 13) i++;
				else break;
			}
		}
		function readString() {
			const start = i;
			i++;
			while (i < n) {
				const ch = text.charCodeAt(i);
				if (ch === 92) {
					i += 2;
					continue;
				}
				if (ch === 34) {
					i++;
					return JSON.parse(text.slice(start, i));
				}
				i++;
			}
			throw new Error("unterminated string at offset " + start);
		}
		function skipValue() {
			skipWs();
			if (i >= n) return;
			const ch = text.charCodeAt(i);
			if (ch === 34) {
				readString();
				return;
			}
			if (ch === 123 || ch === 91) {
				const open = ch;
				const close = open === 123 ? 125 : 93;
				let depth = 1;
				i++;
				while (i < n && depth > 0) {
					const c = text.charCodeAt(i);
					if (c === 34) {
						readString();
						continue;
					}
					if (c === open) depth++;
					else if (c === close) depth--;
					i++;
				}
				return;
			}
			while (i < n) {
				const c = text.charCodeAt(i);
				if (c === 44 || c === 125 || c === 93 || c === 32 || c === 9 || c === 10 || c === 13) return;
				i++;
			}
		}
		function pointerOf(path) {
			if (path.length === 0) return "";
			return "/" + path.map(escapePtr).join("/");
		}
		function walk(path) {
			skipWs();
			if (i >= n) return;
			const pos = offsetToLineCol(i);
			map[pointerOf(path)] = pos;
			const ch = text.charCodeAt(i);
			if (ch === 123) {
				i++;
				while (true) {
					skipWs();
					if (text.charCodeAt(i) === 125) {
						i++;
						return;
					}
					if (text.charCodeAt(i) === 44) {
						i++;
						continue;
					}
					skipWs();
					const keyStart = i;
					const key = readString();
					const keyPos = offsetToLineCol(keyStart);
					skipWs();
					if (text.charCodeAt(i) !== 58) throw new Error("expected \":\" at offset " + i);
					i++;
					const childPath = path.concat([key]);
					map[pointerOf(childPath) + "#key"] = keyPos;
					walk(childPath);
				}
			} else if (ch === 91) {
				i++;
				let idx = 0;
				while (true) {
					skipWs();
					if (text.charCodeAt(i) === 93) {
						i++;
						return;
					}
					if (text.charCodeAt(i) === 44) {
						i++;
						continue;
					}
					walk(path.concat([String(idx)]));
					idx++;
				}
			} else skipValue();
		}
		if (text.charCodeAt(0) === 65279) i = 1;
		walk([]);
		return map;
	}
	module.exports = {
		buildPositionMap,
		escapePtr
	};
}));
//#endregion
//#region ../node_modules/.pnpm/ata-validator@1.7.4_yaml@2.9.0/node_modules/ata-validator/lib/data-positions.js
var require_data_positions = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Build pointer → { byteOffset, length, line, col, text } from a JSON
	* input buffer. Called only when validation fails AND richErrors is on
	* AND abortEarly is off. Zero cost on the valid path.
	*/
	const { escapePtr } = require_source_positions();
	function buildDataPositionMap(input) {
		const text = Buffer.isBuffer(input) ? input.toString("utf8") : String(input);
		const map = Object.create(null);
		const lines = text.split("\n");
		const lineStart = new Array(lines.length + 1);
		lineStart[0] = 0;
		for (let i = 0; i < lines.length; i++) lineStart[i + 1] = lineStart[i] + lines[i].length + 1;
		function offsetToLineCol(off) {
			let lo = 0, hi = lineStart.length - 1;
			while (lo < hi) {
				const mid = lo + hi + 1 >> 1;
				if (lineStart[mid] <= off) lo = mid;
				else hi = mid - 1;
			}
			return {
				line: lo + 1,
				col: off - lineStart[lo] + 1,
				text: lines[lo] || ""
			};
		}
		let i = 0;
		const n = text.length;
		function skipWs() {
			while (i < n) {
				const ch = text.charCodeAt(i);
				if (ch === 32 || ch === 9 || ch === 10 || ch === 13) i++;
				else break;
			}
		}
		function readString() {
			const start = i;
			i++;
			while (i < n) {
				const ch = text.charCodeAt(i);
				if (ch === 92) {
					i += 2;
					continue;
				}
				if (ch === 34) {
					i++;
					return JSON.parse(text.slice(start, i));
				}
				i++;
			}
			throw new Error("unterminated string at offset " + start);
		}
		function pointerOf(path) {
			if (path.length === 0) return "";
			return "/" + path.map(escapePtr).join("/");
		}
		function walk(path) {
			skipWs();
			if (i >= n) return;
			const start = i;
			const pos = offsetToLineCol(start);
			const ch = text.charCodeAt(i);
			if (ch === 123) {
				i++;
				while (true) {
					skipWs();
					if (text.charCodeAt(i) === 125) {
						i++;
						break;
					}
					if (text.charCodeAt(i) === 44) {
						i++;
						continue;
					}
					skipWs();
					const key = readString();
					skipWs();
					if (text.charCodeAt(i) !== 58) throw new Error("expected \":\" at offset " + i);
					i++;
					walk(path.concat([key]));
				}
			} else if (ch === 91) {
				i++;
				let idx = 0;
				while (true) {
					skipWs();
					if (text.charCodeAt(i) === 93) {
						i++;
						break;
					}
					if (text.charCodeAt(i) === 44) {
						i++;
						continue;
					}
					walk(path.concat([String(idx)]));
					idx++;
				}
			} else if (ch === 34) readString();
			else while (i < n) {
				const c = text.charCodeAt(i);
				if (c === 44 || c === 125 || c === 93 || c === 32 || c === 9 || c === 10 || c === 13) break;
				i++;
			}
			const length = i - start;
			map[pointerOf(path)] = {
				byteOffset: start,
				length,
				line: pos.line,
				col: pos.col,
				text: pos.text
			};
		}
		if (text.charCodeAt(0) === 65279) i = 1;
		walk([]);
		return map;
	}
	module.exports = { buildDataPositionMap };
}));
//#endregion
//#region ../node_modules/.pnpm/ata-validator@1.7.4_yaml@2.9.0/node_modules/ata-validator/lib/data-position-cache.js
var require_data_position_cache = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const { buildDataPositionMap } = require_data_positions();
	/**
	* Memoize the position map for the duration of a single validate() call.
	* Caller passes the original buffer/string. Identity-keyed: same reference
	* == same map. No global state, caller holds the cache instance.
	*/
	function createCache() {
		const wm = /* @__PURE__ */ new WeakMap();
		const sm = /* @__PURE__ */ new Map();
		return {
			get(input) {
				if (input == null) return null;
				if (typeof input === "string") {
					if (sm.has(input)) return sm.get(input);
					try {
						const m = buildDataPositionMap(input);
						sm.set(input, m);
						return m;
					} catch {
						return null;
					}
				}
				if (Buffer.isBuffer(input)) {
					if (wm.has(input)) return wm.get(input);
					try {
						const m = buildDataPositionMap(input);
						wm.set(input, m);
						return m;
					} catch {
						return null;
					}
				}
				return null;
			},
			reset() {
				sm.clear();
			}
		};
	}
	module.exports = { createCache };
}));
//#endregion
//#region ../node_modules/.pnpm/ata-validator@1.7.4_yaml@2.9.0/node_modules/ata-validator/lib/metaschemas.js
var require_metaschemas = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = { METASCHEMAS: /* @__PURE__ */ new Map([
		["https://json-schema.org/draft/2020-12/schema", {
			"$schema": "https://json-schema.org/draft/2020-12/schema",
			"$id": "https://json-schema.org/draft/2020-12/schema",
			"$vocabulary": {
				"https://json-schema.org/draft/2020-12/vocab/core": true,
				"https://json-schema.org/draft/2020-12/vocab/applicator": true,
				"https://json-schema.org/draft/2020-12/vocab/unevaluated": true,
				"https://json-schema.org/draft/2020-12/vocab/validation": true,
				"https://json-schema.org/draft/2020-12/vocab/meta-data": true,
				"https://json-schema.org/draft/2020-12/vocab/format-annotation": true,
				"https://json-schema.org/draft/2020-12/vocab/content": true
			},
			"$dynamicAnchor": "meta",
			"title": "Core and Validation specifications meta-schema",
			"allOf": [
				{ "$ref": "meta/core" },
				{ "$ref": "meta/applicator" },
				{ "$ref": "meta/unevaluated" },
				{ "$ref": "meta/validation" },
				{ "$ref": "meta/meta-data" },
				{ "$ref": "meta/format-annotation" },
				{ "$ref": "meta/content" }
			],
			"type": ["object", "boolean"],
			"$comment": "This meta-schema also defines keywords that have appeared in previous drafts in order to prevent incompatible extensions as they remain in common use.",
			"properties": {
				"definitions": {
					"$comment": "\"definitions\" has been replaced by \"$defs\".",
					"type": "object",
					"additionalProperties": { "$dynamicRef": "#meta" },
					"deprecated": true,
					"default": {}
				},
				"dependencies": {
					"$comment": "\"dependencies\" has been split and replaced by \"dependentSchemas\" and \"dependentRequired\" in order to serve their differing semantics.",
					"type": "object",
					"additionalProperties": { "anyOf": [{ "$dynamicRef": "#meta" }, { "$ref": "meta/validation#/$defs/stringArray" }] },
					"deprecated": true,
					"default": {}
				},
				"$recursiveAnchor": {
					"$comment": "\"$recursiveAnchor\" has been replaced by \"$dynamicAnchor\".",
					"$ref": "meta/core#/$defs/anchorString",
					"deprecated": true
				},
				"$recursiveRef": {
					"$comment": "\"$recursiveRef\" has been replaced by \"$dynamicRef\".",
					"$ref": "meta/core#/$defs/uriReferenceString",
					"deprecated": true
				}
			}
		}],
		["https://json-schema.org/draft/2020-12/meta/core", {
			"$schema": "https://json-schema.org/draft/2020-12/schema",
			"$id": "https://json-schema.org/draft/2020-12/meta/core",
			"$dynamicAnchor": "meta",
			"title": "Core vocabulary meta-schema",
			"type": ["object", "boolean"],
			"properties": {
				"$id": {
					"$ref": "#/$defs/uriReferenceString",
					"$comment": "Non-empty fragments not allowed.",
					"pattern": "^[^#]*#?$"
				},
				"$schema": { "$ref": "#/$defs/uriString" },
				"$ref": { "$ref": "#/$defs/uriReferenceString" },
				"$anchor": { "$ref": "#/$defs/anchorString" },
				"$dynamicRef": { "$ref": "#/$defs/uriReferenceString" },
				"$dynamicAnchor": { "$ref": "#/$defs/anchorString" },
				"$vocabulary": {
					"type": "object",
					"propertyNames": { "$ref": "#/$defs/uriString" },
					"additionalProperties": { "type": "boolean" }
				},
				"$comment": { "type": "string" },
				"$defs": {
					"type": "object",
					"additionalProperties": { "$dynamicRef": "#meta" }
				}
			},
			"$defs": {
				"anchorString": {
					"type": "string",
					"pattern": "^[A-Za-z_][-A-Za-z0-9._]*$"
				},
				"uriString": {
					"type": "string",
					"format": "uri"
				},
				"uriReferenceString": {
					"type": "string",
					"format": "uri-reference"
				}
			}
		}],
		["https://json-schema.org/draft/2020-12/meta/applicator", {
			"$schema": "https://json-schema.org/draft/2020-12/schema",
			"$id": "https://json-schema.org/draft/2020-12/meta/applicator",
			"$dynamicAnchor": "meta",
			"title": "Applicator vocabulary meta-schema",
			"type": ["object", "boolean"],
			"properties": {
				"prefixItems": { "$ref": "#/$defs/schemaArray" },
				"items": { "$dynamicRef": "#meta" },
				"contains": { "$dynamicRef": "#meta" },
				"additionalProperties": { "$dynamicRef": "#meta" },
				"properties": {
					"type": "object",
					"additionalProperties": { "$dynamicRef": "#meta" },
					"default": {}
				},
				"patternProperties": {
					"type": "object",
					"additionalProperties": { "$dynamicRef": "#meta" },
					"propertyNames": { "format": "regex" },
					"default": {}
				},
				"dependentSchemas": {
					"type": "object",
					"additionalProperties": { "$dynamicRef": "#meta" },
					"default": {}
				},
				"propertyNames": { "$dynamicRef": "#meta" },
				"if": { "$dynamicRef": "#meta" },
				"then": { "$dynamicRef": "#meta" },
				"else": { "$dynamicRef": "#meta" },
				"allOf": { "$ref": "#/$defs/schemaArray" },
				"anyOf": { "$ref": "#/$defs/schemaArray" },
				"oneOf": { "$ref": "#/$defs/schemaArray" },
				"not": { "$dynamicRef": "#meta" }
			},
			"$defs": { "schemaArray": {
				"type": "array",
				"minItems": 1,
				"items": { "$dynamicRef": "#meta" }
			} }
		}],
		["https://json-schema.org/draft/2020-12/meta/validation", {
			"$schema": "https://json-schema.org/draft/2020-12/schema",
			"$id": "https://json-schema.org/draft/2020-12/meta/validation",
			"$dynamicAnchor": "meta",
			"title": "Validation vocabulary meta-schema",
			"type": ["object", "boolean"],
			"properties": {
				"type": { "anyOf": [{ "$ref": "#/$defs/simpleTypes" }, {
					"type": "array",
					"items": { "$ref": "#/$defs/simpleTypes" },
					"minItems": 1,
					"uniqueItems": true
				}] },
				"const": true,
				"enum": {
					"type": "array",
					"items": true
				},
				"multipleOf": {
					"type": "number",
					"exclusiveMinimum": 0
				},
				"maximum": { "type": "number" },
				"exclusiveMaximum": { "type": "number" },
				"minimum": { "type": "number" },
				"exclusiveMinimum": { "type": "number" },
				"maxLength": { "$ref": "#/$defs/nonNegativeInteger" },
				"minLength": { "$ref": "#/$defs/nonNegativeIntegerDefault0" },
				"pattern": {
					"type": "string",
					"format": "regex"
				},
				"maxItems": { "$ref": "#/$defs/nonNegativeInteger" },
				"minItems": { "$ref": "#/$defs/nonNegativeIntegerDefault0" },
				"uniqueItems": {
					"type": "boolean",
					"default": false
				},
				"maxContains": { "$ref": "#/$defs/nonNegativeInteger" },
				"minContains": {
					"$ref": "#/$defs/nonNegativeInteger",
					"default": 1
				},
				"maxProperties": { "$ref": "#/$defs/nonNegativeInteger" },
				"minProperties": { "$ref": "#/$defs/nonNegativeIntegerDefault0" },
				"required": { "$ref": "#/$defs/stringArray" },
				"dependentRequired": {
					"type": "object",
					"additionalProperties": { "$ref": "#/$defs/stringArray" }
				}
			},
			"$defs": {
				"nonNegativeInteger": {
					"type": "integer",
					"minimum": 0
				},
				"nonNegativeIntegerDefault0": {
					"$ref": "#/$defs/nonNegativeInteger",
					"default": 0
				},
				"simpleTypes": { "enum": [
					"array",
					"boolean",
					"integer",
					"null",
					"number",
					"object",
					"string"
				] },
				"stringArray": {
					"type": "array",
					"items": { "type": "string" },
					"uniqueItems": true,
					"default": []
				}
			}
		}],
		["https://json-schema.org/draft/2020-12/meta/meta-data", {
			"$schema": "https://json-schema.org/draft/2020-12/schema",
			"$id": "https://json-schema.org/draft/2020-12/meta/meta-data",
			"$dynamicAnchor": "meta",
			"title": "Meta-data vocabulary meta-schema",
			"type": ["object", "boolean"],
			"properties": {
				"title": { "type": "string" },
				"description": { "type": "string" },
				"default": true,
				"deprecated": {
					"type": "boolean",
					"default": false
				},
				"readOnly": {
					"type": "boolean",
					"default": false
				},
				"writeOnly": {
					"type": "boolean",
					"default": false
				},
				"examples": {
					"type": "array",
					"items": true
				}
			}
		}],
		["https://json-schema.org/draft/2020-12/meta/format-annotation", {
			"$schema": "https://json-schema.org/draft/2020-12/schema",
			"$id": "https://json-schema.org/draft/2020-12/meta/format-annotation",
			"$dynamicAnchor": "meta",
			"title": "Format vocabulary meta-schema for annotation results",
			"type": ["object", "boolean"],
			"properties": { "format": { "type": "string" } }
		}],
		["https://json-schema.org/draft/2020-12/meta/content", {
			"$schema": "https://json-schema.org/draft/2020-12/schema",
			"$id": "https://json-schema.org/draft/2020-12/meta/content",
			"$dynamicAnchor": "meta",
			"title": "Content vocabulary meta-schema",
			"type": ["object", "boolean"],
			"properties": {
				"contentEncoding": { "type": "string" },
				"contentMediaType": { "type": "string" },
				"contentSchema": { "$dynamicRef": "#meta" }
			}
		}],
		["https://json-schema.org/draft/2020-12/meta/unevaluated", {
			"$schema": "https://json-schema.org/draft/2020-12/schema",
			"$id": "https://json-schema.org/draft/2020-12/meta/unevaluated",
			"$dynamicAnchor": "meta",
			"title": "Unevaluated applicator vocabulary meta-schema",
			"type": ["object", "boolean"],
			"properties": {
				"unevaluatedItems": { "$dynamicRef": "#meta" },
				"unevaluatedProperties": { "$dynamicRef": "#meta" }
			}
		}],
		["http://json-schema.org/draft-07/schema#", {
			"$schema": "http://json-schema.org/draft-07/schema#",
			"$id": "http://json-schema.org/draft-07/schema#",
			"title": "Core schema meta-schema",
			"definitions": {
				"schemaArray": {
					"type": "array",
					"minItems": 1,
					"items": { "$ref": "#" }
				},
				"nonNegativeInteger": {
					"type": "integer",
					"minimum": 0
				},
				"nonNegativeIntegerDefault0": { "allOf": [{ "$ref": "#/definitions/nonNegativeInteger" }, { "default": 0 }] },
				"simpleTypes": { "enum": [
					"array",
					"boolean",
					"integer",
					"null",
					"number",
					"object",
					"string"
				] },
				"stringArray": {
					"type": "array",
					"items": { "type": "string" },
					"uniqueItems": true,
					"default": []
				}
			},
			"type": ["object", "boolean"],
			"properties": {
				"$id": {
					"type": "string",
					"format": "uri-reference"
				},
				"$schema": {
					"type": "string",
					"format": "uri"
				},
				"$ref": {
					"type": "string",
					"format": "uri-reference"
				},
				"$comment": { "type": "string" },
				"title": { "type": "string" },
				"description": { "type": "string" },
				"default": true,
				"readOnly": {
					"type": "boolean",
					"default": false
				},
				"writeOnly": {
					"type": "boolean",
					"default": false
				},
				"examples": {
					"type": "array",
					"items": true
				},
				"multipleOf": {
					"type": "number",
					"exclusiveMinimum": 0
				},
				"maximum": { "type": "number" },
				"exclusiveMaximum": { "type": "number" },
				"minimum": { "type": "number" },
				"exclusiveMinimum": { "type": "number" },
				"maxLength": { "$ref": "#/definitions/nonNegativeInteger" },
				"minLength": { "$ref": "#/definitions/nonNegativeIntegerDefault0" },
				"pattern": {
					"type": "string",
					"format": "regex"
				},
				"additionalItems": { "$ref": "#" },
				"items": {
					"anyOf": [{ "$ref": "#" }, { "$ref": "#/definitions/schemaArray" }],
					"default": true
				},
				"maxItems": { "$ref": "#/definitions/nonNegativeInteger" },
				"minItems": { "$ref": "#/definitions/nonNegativeIntegerDefault0" },
				"uniqueItems": {
					"type": "boolean",
					"default": false
				},
				"contains": { "$ref": "#" },
				"maxProperties": { "$ref": "#/definitions/nonNegativeInteger" },
				"minProperties": { "$ref": "#/definitions/nonNegativeIntegerDefault0" },
				"required": { "$ref": "#/definitions/stringArray" },
				"additionalProperties": { "$ref": "#" },
				"definitions": {
					"type": "object",
					"additionalProperties": { "$ref": "#" },
					"default": {}
				},
				"properties": {
					"type": "object",
					"additionalProperties": { "$ref": "#" },
					"default": {}
				},
				"patternProperties": {
					"type": "object",
					"additionalProperties": { "$ref": "#" },
					"propertyNames": { "format": "regex" },
					"default": {}
				},
				"dependencies": {
					"type": "object",
					"additionalProperties": { "anyOf": [{ "$ref": "#" }, { "$ref": "#/definitions/stringArray" }] }
				},
				"propertyNames": { "$ref": "#" },
				"const": true,
				"enum": {
					"type": "array",
					"items": true,
					"minItems": 1,
					"uniqueItems": true
				},
				"type": { "anyOf": [{ "$ref": "#/definitions/simpleTypes" }, {
					"type": "array",
					"items": { "$ref": "#/definitions/simpleTypes" },
					"minItems": 1,
					"uniqueItems": true
				}] },
				"format": { "type": "string" },
				"contentMediaType": { "type": "string" },
				"contentEncoding": { "type": "string" },
				"if": { "$ref": "#" },
				"then": { "$ref": "#" },
				"else": { "$ref": "#" },
				"allOf": { "$ref": "#/definitions/schemaArray" },
				"anyOf": { "$ref": "#/definitions/schemaArray" },
				"oneOf": { "$ref": "#/definitions/schemaArray" },
				"not": { "$ref": "#" }
			},
			"default": true
		}]
	]) };
}));
//#endregion
//#region ../node_modules/.pnpm/ata-validator@1.7.4_yaml@2.9.0/node_modules/ata-validator/lib/plan-compiler.js
var require_plan_compiler = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	function install(deps) {
		const { Plan, NOERRORS, err, evalLeaf, evalLeafV, dataBits, escapePointer, deepEqual, multipleOfOk, cpAtLeast, cpAtMost, T_STRING, T_ARRAY, T_OBJECT, resolveRef, splitFragment, resolveUri } = deps;
		const TRUE_FN = () => true;
		const TRUE_PAIR = {
			v: TRUE_FN,
			c: TRUE_FN
		};
		const FALSE_PAIR = {
			v: () => false,
			c: (data, errors, instancePath, schemaPath) => {
				if (errors !== NOERRORS) errors.push(err("false schema", "not", instancePath, schemaPath, {}, "boolean schema is false"));
				return false;
			}
		};
		function dynTarget(interp, ref, base, chain) {
			const state = interp.state;
			let { node, base: refBase } = resolveRef(ref, base, state);
			const [, fragment] = splitFragment(resolveUri(base, ref));
			if (fragment && !fragment.startsWith("/")) {
				const initialDyn = state.dynamicAnchors.get(refBase);
				if (node !== void 0 && initialDyn && initialDyn.get(fragment) === node || !interp.bookending) for (let i = 0; i < chain.length; i++) {
					const dyn = state.dynamicAnchors.get(chain[i]);
					if (dyn && dyn.has(fragment)) {
						node = dyn.get(fragment);
						refBase = chain[i];
						break;
					}
				}
			}
			return {
				node,
				base: refBase
			};
		}
		function fresh() {
			return {
				props: null,
				n: 0,
				x: null,
				keys: null
			};
		}
		function keysOf(rec, data) {
			if (rec.keys === null) rec.keys = Object.keys(data);
			return rec.keys;
		}
		function hasProp(rec, key) {
			const p = rec.props;
			if (p === null) return false;
			for (let i = 0; i < p.length; i++) if (p[i] === key) return true;
			return false;
		}
		function addProp(rec, key) {
			if (rec.props === null) rec.props = [key];
			else rec.props.push(key);
		}
		function hasItem(rec, i) {
			if (i < rec.n) return true;
			const x = rec.x;
			if (x === null) return false;
			for (let j = 0; j < x.length; j++) if (x[j] === i) return true;
			return false;
		}
		function addItem(rec, i) {
			if (i < rec.n) return;
			if (i === rec.n) {
				rec.n = i + 1;
				return;
			}
			if (rec.x === null) rec.x = [i];
			else rec.x.push(i);
		}
		function markRange(rec, from, to) {
			if (from >= to) return;
			if (from <= rec.n) {
				if (to > rec.n) rec.n = to;
				return;
			}
			if (rec.x === null) rec.x = [];
			for (let i = from; i < to; i++) rec.x.push(i);
		}
		function mergeRec(target, from) {
			if (from.props !== null) {
				if (target.props === null) target.props = from.props;
				else for (let i = 0; i < from.props.length; i++) target.props.push(from.props[i]);
			}
			if (from.n > target.n) target.n = from.n;
			if (from.x !== null) {
				if (target.x === null) target.x = from.x;
				else for (let i = 0; i < from.x.length; i++) target.x.push(from.x[i]);
			}
		}
		function pLen(rec) {
			return rec.props === null ? 0 : rec.props.length;
		}
		function xLen(rec) {
			return rec.x === null ? 0 : rec.x.length;
		}
		function undo(rec, pl, n0, xl) {
			if (rec.props !== null) rec.props.length = pl;
			rec.n = n0;
			if (rec.x !== null) rec.x.length = xl;
		}
		function compileLeafV(P) {
			const checks = [];
			let needsBits = false;
			if (P.hasType) {
				const mask = P.typeMask;
				needsBits = true;
				checks.push((data, bits) => (bits & mask) !== 0);
			}
			if (P.enum !== null) {
				const vals = P.enum;
				if (vals.length === 0) checks.push(() => false);
				else checks.push((data) => {
					for (let i = 0; i < vals.length; i++) if (deepEqual(vals[i], data)) return true;
					return false;
				});
			}
			if (P.hasConst) {
				const c = P.const;
				checks.push((data) => deepEqual(c, data));
			}
			if (P.hasNumber) {
				const nums = [];
				if (P.minimum !== void 0) {
					const m = P.minimum;
					nums.push((d) => d >= m);
				}
				if (P.maximum !== void 0) {
					const m = P.maximum;
					nums.push((d) => d <= m);
				}
				if (P.exclusiveMinimum !== void 0) {
					const m = P.exclusiveMinimum;
					nums.push((d) => d > m);
				}
				if (P.exclusiveMaximum !== void 0) {
					const m = P.exclusiveMaximum;
					nums.push((d) => d < m);
				}
				if (P.multipleOf !== void 0) {
					const m = P.multipleOf;
					nums.push((d) => multipleOfOk(d, m));
				}
				const run = combineValue(nums);
				if (run !== null) checks.push((data) => typeof data !== "number" || run(data));
			}
			if (P.hasString) {
				const strs = [];
				if (P.minLength !== void 0) {
					const m = P.minLength;
					strs.push((d) => cpAtLeast(d, m));
				}
				if (P.maxLength !== void 0) {
					const m = P.maxLength;
					strs.push((d) => cpAtMost(d, m));
				}
				if (P.pattern !== null) {
					const re = P.pattern;
					strs.push((d) => re.test(d));
				}
				if (P.formatFn !== null) {
					const f = P.formatFn;
					strs.push((d) => f(d));
				}
				const run = combineValue(strs);
				if (run !== null) {
					needsBits = true;
					checks.push((data, bits) => bits !== T_STRING || run(data));
				}
			}
			if (P.minItems !== void 0 || P.maxItems !== void 0 || P.uniqueItems) {
				const arrs = [];
				if (P.minItems !== void 0) {
					const m = P.minItems;
					arrs.push((d) => d.length >= m);
				}
				if (P.maxItems !== void 0) {
					const m = P.maxItems;
					arrs.push((d) => d.length <= m);
				}
				if (P.uniqueItems) arrs.push((d) => {
					for (let i = 0; i < d.length; i++) for (let j = i + 1; j < d.length; j++) if (deepEqual(d[i], d[j])) return false;
					return true;
				});
				const run = combineValue(arrs);
				if (run !== null) {
					needsBits = true;
					checks.push((data, bits) => bits !== T_ARRAY || run(data));
				}
			}
			if (P.required !== null || P.minProperties !== void 0 || P.maxProperties !== void 0 || P.dependentRequired !== null) {
				const objs = [];
				if (P.required !== null) {
					const req = P.required;
					if (req.length === 1) {
						const k = req[0];
						objs.push((d) => Object.hasOwn(d, k));
					} else objs.push((d) => {
						for (let i = 0; i < req.length; i++) if (!Object.hasOwn(d, req[i])) return false;
						return true;
					});
				}
				if (P.minProperties !== void 0) {
					const m = P.minProperties;
					objs.push((d) => Object.keys(d).length >= m);
				}
				if (P.maxProperties !== void 0) {
					const m = P.maxProperties;
					objs.push((d) => Object.keys(d).length <= m);
				}
				if (P.dependentRequired !== null) {
					const entries = P.dependentRequired;
					objs.push((d) => {
						for (let i = 0; i < entries.length; i++) {
							const [key, deps] = entries[i];
							if (!Object.hasOwn(d, key)) continue;
							for (let j = 0; j < deps.length; j++) if (!Object.hasOwn(d, deps[j])) return false;
						}
						return true;
					});
				}
				const run = combineValue(objs);
				if (run !== null) {
					needsBits = true;
					checks.push((data, bits) => bits !== T_OBJECT || run(data));
				}
			}
			if (checks.length === 0) return TRUE_FN;
			if (!needsBits) {
				if (checks.length === 1) {
					const a = checks[0];
					return (data) => a(data, 0);
				}
				return (data) => {
					for (let i = 0; i < checks.length; i++) if (!checks[i](data, 0)) return false;
					return true;
				};
			}
			if (checks.length === 1) {
				const a = checks[0];
				return (data) => a(data, dataBits(data));
			}
			if (checks.length === 2) {
				const [a, b] = checks;
				return (data) => {
					const bits = dataBits(data);
					return a(data, bits) && b(data, bits);
				};
			}
			return (data) => {
				const bits = dataBits(data);
				for (let i = 0; i < checks.length; i++) if (!checks[i](data, bits)) return false;
				return true;
			};
		}
		function combineValue(fns) {
			if (fns.length === 0) return null;
			if (fns.length === 1) return fns[0];
			if (fns.length === 2) {
				const [a, b] = fns;
				return (d) => a(d) && b(d);
			}
			return (d) => {
				for (let i = 0; i < fns.length; i++) if (!fns[i](d)) return false;
				return true;
			};
		}
		function compileNode(ctx, node, base, chain, ann) {
			if (node === true) return TRUE_PAIR;
			if (node === false) return FALSE_PAIR;
			if (!(node instanceof Plan)) return TRUE_PAIR;
			const interp = ctx.interp;
			const P = node;
			if (P.nodeBase !== null && P.nodeBase !== base) base = P.nodeBase;
			if (chain.indexOf(base) === -1) chain = chain.concat(base);
			const collect = ann || P.hasUnevaluated;
			let perKey = ctx.memo.get(P);
			if (perKey === void 0) {
				perKey = /* @__PURE__ */ new Map();
				ctx.memo.set(P, perKey);
			}
			const key = (ann ? "a " : "p ") + base + " " + chain.join(" ");
			const cached = perKey.get(key);
			if (cached !== void 0) {
				if (cached.open) ctx.cyclic = true;
				return cached;
			}
			const box = {
				v: null,
				c: null
			};
			const pair = {
				open: true,
				v: (d, st, rec) => box.v(d, st, rec),
				c: (d, e, ip, sp, st, rec) => box.c(d, e, ip, sp, st, rec)
			};
			perKey.set(key, pair);
			const inPlace = (n, b) => compileNode(ctx, n, b, chain, collect);
			const child = (n) => compileNode(ctx, n, base, chain, false);
			const steps = [];
			const vsteps = [];
			for (let which = 0; which < 2; which++) {
				let t, seg;
				if (which === 0) {
					if (P.ref === null) continue;
					t = resolveRef(P.ref, base, interp.state);
					seg = "/$ref";
				} else {
					if (P.dynamicRef === null) continue;
					t = dynTarget(interp, P.dynamicRef, base, chain);
					seg = "/$dynamicRef";
				}
				if (t.node === void 0) {
					const ref = which === 0 ? P.ref : P.dynamicRef;
					const kw = which === 0 ? "$ref" : "$dynamicRef";
					steps.push((data, errors, instancePath, schemaPath) => {
						if (errors !== NOERRORS) errors.push(err(kw, kw, instancePath, schemaPath + seg, { ref }, `cannot resolve ${kw} ${ref}`));
						return false;
					});
					vsteps.push(() => false);
					continue;
				}
				const target = inPlace(interp.node(t.node), t.base);
				let cstep, vstep;
				if (collect) {
					cstep = (data, errors, instancePath, schemaPath, stack, rec) => {
						const pl = pLen(rec), n0 = rec.n, xl = xLen(rec);
						const ok = target.c(data, errors, instancePath, schemaPath + seg, stack, rec);
						if (!ok) undo(rec, pl, n0, xl);
						return ok;
					};
					vstep = (data, stack, rec) => target.v(data, stack, rec);
				} else {
					cstep = (data, errors, instancePath, schemaPath, stack) => target.c(data, errors, instancePath, schemaPath + seg, stack);
					vstep = target.v;
				}
				if (ctx.guard) {
					const schema = P.schema;
					const ic = cstep, iv = vstep;
					cstep = (data, errors, instancePath, schemaPath, stack, rec) => {
						for (let i = stack.length - 2; i >= 0; i -= 2) if (stack[i] === schema && stack[i + 1] === data) return true;
						stack.push(schema, data);
						const ok = ic(data, errors, instancePath, schemaPath, stack, rec);
						stack.length -= 2;
						return ok;
					};
					vstep = (data, stack, rec) => {
						for (let i = stack.length - 2; i >= 0; i -= 2) if (stack[i] === schema && stack[i + 1] === data) return true;
						stack.push(schema, data);
						const ok = iv(data, stack, rec);
						stack.length -= 2;
						return ok;
					};
				}
				steps.push(cstep);
				vsteps.push(vstep);
			}
			if (P.hasType || P.enum !== null || P.hasConst || P.hasNumber || P.hasString || P.minItems !== void 0 || P.maxItems !== void 0 || P.uniqueItems || P.required !== null || P.minProperties !== void 0 || P.maxProperties !== void 0 || P.dependentRequired !== null) {
				steps.push((data, errors, instancePath, schemaPath) => evalLeaf(P, data, errors, instancePath, schemaPath));
				vsteps.push(compileLeafV(P));
			}
			if (P.prefixItems !== null) {
				const fns = P.prefixItems.map(child);
				steps.push((data, errors, instancePath, schemaPath, stack, rec) => {
					if (dataBits(data) !== T_ARRAY) return true;
					let ok = true;
					const n = Math.min(fns.length, data.length);
					for (let i = 0; i < n; i++) if (!fns[i].c(data[i], errors, instancePath + "/" + i, schemaPath + "/prefixItems/" + i, stack)) {
						ok = false;
						if (errors === NOERRORS) return false;
					}
					if (collect) markRange(rec, 0, n);
					return ok;
				});
				vsteps.push((data, stack, rec) => {
					if (dataBits(data) !== T_ARRAY) return true;
					const n = Math.min(fns.length, data.length);
					for (let i = 0; i < n; i++) if (!fns[i].v(data[i], stack)) return false;
					if (collect) markRange(rec, 0, n);
					return true;
				});
			}
			if (P.items !== void 0) {
				const fn = child(P.items);
				const start = P.prefixItems !== null ? P.prefixItems.length : 0;
				steps.push((data, errors, instancePath, schemaPath, stack, rec) => {
					if (dataBits(data) !== T_ARRAY) return true;
					let ok = true;
					for (let i = start; i < data.length; i++) if (!fn.c(data[i], errors, instancePath + "/" + i, schemaPath + "/items", stack)) {
						ok = false;
						if (errors === NOERRORS) return false;
					}
					if (collect) markRange(rec, start, data.length);
					return ok;
				});
				const fv = fn.v;
				vsteps.push((data, stack, rec) => {
					if (dataBits(data) !== T_ARRAY) return true;
					for (let i = start; i < data.length; i++) if (!fv(data[i], stack)) return false;
					if (collect) markRange(rec, start, data.length);
					return true;
				});
			}
			if (P.contains !== void 0) {
				const fn = child(P.contains);
				const minC = P.minContains !== void 0 ? P.minContains : 1;
				const maxC = P.maxContains;
				steps.push((data, errors, instancePath, schemaPath, stack, rec) => {
					if (dataBits(data) !== T_ARRAY) return true;
					let matched = 0;
					for (let i = 0; i < data.length; i++) if (fn.v(data[i], stack)) {
						matched++;
						if (collect) addItem(rec, i);
					}
					let ok = true;
					if (matched < minC) {
						if (errors !== NOERRORS) errors.push(err("contains", "contains", instancePath, schemaPath + "/contains", { minContains: minC }, `must contain at least ${minC} valid item(s)`));
						ok = false;
					}
					if (maxC !== void 0 && matched > maxC) {
						if (errors !== NOERRORS) errors.push(err("maxContains", "maxContains", instancePath, schemaPath + "/maxContains", { limit: maxC }, `must NOT contain more than ${maxC} valid item(s)`));
						ok = false;
					}
					return ok;
				});
				if (collect) vsteps.push((data, stack, rec) => {
					if (dataBits(data) !== T_ARRAY) return true;
					let matched = 0;
					for (let i = 0; i < data.length; i++) if (fn.v(data[i], stack)) {
						matched++;
						addItem(rec, i);
					}
					return matched >= minC && (maxC === void 0 || matched <= maxC);
				});
				else vsteps.push((data, stack) => {
					if (dataBits(data) !== T_ARRAY) return true;
					let matched = 0;
					for (let i = 0; i < data.length; i++) if (fn.v(data[i], stack)) {
						matched++;
						if (maxC === void 0 && matched >= minC) return true;
					}
					return matched >= minC && (maxC === void 0 || matched <= maxC);
				});
			}
			if (P.properties !== null || P.patternProperties !== null || P.additionalProperties !== void 0 || P.propertyNames !== void 0) {
				const props = P.properties;
				const propKeys = props !== null ? [...props.keys()] : null;
				const propList = props !== null ? [...props.values()].map((entry) => ({
					fn: child(entry.node),
					seg: entry.seg,
					schemaSeg: entry.schemaSeg
				})) : null;
				const propMap = props !== null && props.size > 8 ? new Map(propKeys.map((k, i) => [k, propList[i]])) : null;
				const lookup = propMap !== null ? (key) => propMap.get(key) : propKeys !== null ? (key) => {
					for (let i = 0; i < propKeys.length; i++) if (propKeys[i] === key) return propList[i];
				} : null;
				const patterns = P.patternProperties !== null ? P.patternProperties.map((e) => ({
					re: e.re,
					src: e.src,
					fn: child(e.node)
				})) : null;
				const apFn = P.additionalProperties !== void 0 ? child(P.additionalProperties) : null;
				const pnFn = P.propertyNames !== void 0 ? child(P.propertyNames) : null;
				steps.push((data, errors, instancePath, schemaPath, stack, rec) => {
					if (dataBits(data) !== T_OBJECT) return true;
					let ok = true;
					const keys = collect ? keysOf(rec, data) : Object.keys(data);
					if (pnFn !== null) {
						for (const k of keys) if (!pnFn.c(k, errors, instancePath + "/" + escapePointer(k), schemaPath + "/propertyNames", stack)) {
							ok = false;
							if (errors === NOERRORS) return false;
						}
					}
					for (let k = 0; k < keys.length; k++) {
						const key = keys[k];
						let evaluated = false;
						const prop = lookup !== null ? lookup(key) : void 0;
						if (prop !== void 0) {
							if (!prop.fn.c(data[key], errors, instancePath + prop.seg, schemaPath + prop.schemaSeg, stack)) {
								ok = false;
								if (errors === NOERRORS) return false;
							}
							evaluated = true;
						}
						if (patterns !== null) for (let pi = 0; pi < patterns.length; pi++) {
							const pp = patterns[pi];
							if (pp.re.test(key)) {
								if (!pp.fn.c(data[key], errors, instancePath + "/" + escapePointer(key), schemaPath + "/patternProperties/" + escapePointer(pp.src), stack)) {
									ok = false;
									if (errors === NOERRORS) return false;
								}
								evaluated = true;
							}
						}
						if (!evaluated && apFn !== null) {
							if (!apFn.c(data[key], errors, instancePath + "/" + escapePointer(key), schemaPath + "/additionalProperties", stack)) {
								ok = false;
								if (errors === NOERRORS) return false;
							}
							evaluated = true;
						}
						if (evaluated && collect) addProp(rec, key);
					}
					return ok;
				});
				if (patterns === null && apFn === null && pnFn === null && propKeys.length <= 8) {
					const n = propKeys.length;
					vsteps.push((data, stack, rec) => {
						if (dataBits(data) !== T_OBJECT) return true;
						for (let i = 0; i < n; i++) {
							const key = propKeys[i];
							if (!Object.hasOwn(data, key)) continue;
							if (!propList[i].fn.v(data[key], stack)) return false;
							if (collect) addProp(rec, key);
						}
						return true;
					});
				} else vsteps.push((data, stack, rec) => {
					if (dataBits(data) !== T_OBJECT) return true;
					const keys = collect ? keysOf(rec, data) : Object.keys(data);
					if (pnFn !== null) {
						for (const k of keys) if (!pnFn.v(k, stack)) return false;
					}
					for (let k = 0; k < keys.length; k++) {
						const key = keys[k];
						let evaluated = false;
						const prop = lookup !== null ? lookup(key) : void 0;
						if (prop !== void 0) {
							if (!prop.fn.v(data[key], stack)) return false;
							evaluated = true;
						}
						if (patterns !== null) for (let pi = 0; pi < patterns.length; pi++) {
							const pp = patterns[pi];
							if (pp.re.test(key)) {
								if (!pp.fn.v(data[key], stack)) return false;
								evaluated = true;
							}
						}
						if (!evaluated && apFn !== null) {
							if (!apFn.v(data[key], stack)) return false;
							evaluated = true;
						}
						if (evaluated && collect) addProp(rec, key);
					}
					return true;
				});
			}
			if (P.dependentSchemas !== null) {
				const entries = P.dependentSchemas.map(([k, v]) => [
					k,
					inPlace(v, base),
					escapePointer(k)
				]);
				steps.push((data, errors, instancePath, schemaPath, stack, rec) => {
					if (dataBits(data) !== T_OBJECT) return true;
					let ok = true;
					for (const [k, fn, ek] of entries) if (Object.hasOwn(data, k)) {
						if (collect) {
							const pl = pLen(rec), n0 = rec.n, xl = xLen(rec);
							if (!fn.c(data, errors, instancePath, schemaPath + "/dependentSchemas/" + ek, stack, rec)) {
								undo(rec, pl, n0, xl);
								ok = false;
								if (errors === NOERRORS) return false;
							}
						} else if (!fn.c(data, errors, instancePath, schemaPath + "/dependentSchemas/" + ek, stack)) {
							ok = false;
							if (errors === NOERRORS) return false;
						}
					}
					return ok;
				});
				vsteps.push((data, stack, rec) => {
					if (dataBits(data) !== T_OBJECT) return true;
					for (const [k, fn] of entries) if (Object.hasOwn(data, k) && !fn.v(data, stack, rec)) return false;
					return true;
				});
			}
			if (P.propertyDependencies !== null) {
				const entries = P.propertyDependencies.map(([k, choices]) => {
					const m = /* @__PURE__ */ new Map();
					for (const [value, v] of choices) m.set(value, inPlace(v, base));
					return [k, m];
				});
				steps.push((data, errors, instancePath, schemaPath, stack, rec) => {
					if (dataBits(data) !== T_OBJECT) return true;
					let ok = true;
					for (const [k, choices] of entries) {
						if (!Object.hasOwn(data, k)) continue;
						const value = data[k];
						if (typeof value !== "string") continue;
						const fn = choices.get(value);
						if (fn === void 0) continue;
						const branchPath = schemaPath + "/propertyDependencies/" + escapePointer(k) + "/" + escapePointer(value);
						if (collect) {
							const pl = pLen(rec), n0 = rec.n, xl = xLen(rec);
							if (!fn.c(data, errors, instancePath, branchPath, stack, rec)) {
								undo(rec, pl, n0, xl);
								ok = false;
								if (errors === NOERRORS) return false;
							}
						} else if (!fn.c(data, errors, instancePath, branchPath, stack)) {
							ok = false;
							if (errors === NOERRORS) return false;
						}
					}
					return ok;
				});
				vsteps.push((data, stack, rec) => {
					if (dataBits(data) !== T_OBJECT) return true;
					for (const [k, choices] of entries) {
						if (!Object.hasOwn(data, k)) continue;
						const value = data[k];
						if (typeof value !== "string") continue;
						const fn = choices.get(value);
						if (fn !== void 0 && !fn.v(data, stack, rec)) return false;
					}
					return true;
				});
			}
			if (P.allOf !== null) {
				const fns = P.allOf.map((v) => inPlace(v, base));
				steps.push((data, errors, instancePath, schemaPath, stack, rec) => {
					let ok = true;
					for (let i = 0; i < fns.length; i++) if (collect) {
						const pl = pLen(rec), n0 = rec.n, xl = xLen(rec);
						if (!fns[i].c(data, errors, instancePath, schemaPath + "/allOf/" + i, stack, rec)) {
							undo(rec, pl, n0, xl);
							ok = false;
							if (errors === NOERRORS) return false;
						}
					} else if (!fns[i].c(data, errors, instancePath, schemaPath + "/allOf/" + i, stack)) {
						ok = false;
						if (errors === NOERRORS) return false;
					}
					return ok;
				});
				vsteps.push((data, stack, rec) => {
					for (let i = 0; i < fns.length; i++) if (!fns[i].v(data, stack, rec)) return false;
					return true;
				});
			}
			if (P.anyOf !== null) {
				const fns = P.anyOf.map((v) => inPlace(v, base));
				steps.push((data, errors, instancePath, schemaPath, stack, rec) => {
					const scratch = errors === NOERRORS ? NOERRORS : [];
					let any = false;
					for (let i = 0; i < fns.length; i++) if (collect) {
						const pl = pLen(rec), n0 = rec.n, xl = xLen(rec);
						if (fns[i].c(data, scratch, instancePath, schemaPath + "/anyOf/" + i, stack, rec)) any = true;
						else undo(rec, pl, n0, xl);
					} else if (fns[i].c(data, scratch, instancePath, schemaPath + "/anyOf/" + i, stack)) any = true;
					if (!any) {
						if (errors !== NOERRORS) {
							for (const e of scratch) errors.push(e);
							errors.push(err("anyOf", "anyOf", instancePath, schemaPath + "/anyOf", {}, "must match a schema in anyOf"));
						}
						return false;
					}
					return true;
				});
				if (collect) vsteps.push((data, stack, rec) => {
					let any = false;
					for (let i = 0; i < fns.length; i++) {
						const pl = pLen(rec), n0 = rec.n, xl = xLen(rec);
						if (fns[i].v(data, stack, rec)) any = true;
						else undo(rec, pl, n0, xl);
					}
					return any;
				});
				else vsteps.push((data, stack) => {
					for (let i = 0; i < fns.length; i++) if (fns[i].v(data, stack)) return true;
					return false;
				});
			}
			if (P.oneOf !== null) {
				const fns = P.oneOf.map((v) => inPlace(v, base));
				steps.push((data, errors, instancePath, schemaPath, stack, rec) => {
					const scratch = errors === NOERRORS ? NOERRORS : [];
					let count = 0;
					const pl0 = collect ? pLen(rec) : 0, n00 = collect ? rec.n : 0, xl0 = collect ? xLen(rec) : 0;
					for (let i = 0; i < fns.length; i++) if (collect) {
						const pl = pLen(rec), n0 = rec.n, xl = xLen(rec);
						if (fns[i].c(data, scratch, instancePath, schemaPath + "/oneOf/" + i, stack, rec)) count++;
						else undo(rec, pl, n0, xl);
					} else if (fns[i].c(data, scratch, instancePath, schemaPath + "/oneOf/" + i, stack)) count++;
					if (count !== 1) {
						if (collect) undo(rec, pl0, n00, xl0);
						if (errors !== NOERRORS) {
							if (count === 0) for (const e of scratch) errors.push(e);
							errors.push(err("oneOf", "oneOf", instancePath, schemaPath + "/oneOf", { passingSchemas: count }, "must match exactly one schema in oneOf"));
						}
						return false;
					}
					return true;
				});
				if (collect) vsteps.push((data, stack, rec) => {
					let count = 0;
					for (let i = 0; i < fns.length; i++) {
						const pl = pLen(rec), n0 = rec.n, xl = xLen(rec);
						if (fns[i].v(data, stack, rec)) {
							count++;
							if (count > 1) return false;
						} else undo(rec, pl, n0, xl);
					}
					return count === 1;
				});
				else vsteps.push((data, stack) => {
					let count = 0;
					for (let i = 0; i < fns.length; i++) if (fns[i].v(data, stack)) {
						count++;
						if (count > 1) return false;
					}
					return count === 1;
				});
			}
			if (P.not !== void 0) {
				const fn = child(P.not);
				steps.push((data, errors, instancePath, schemaPath, stack) => {
					if (fn.v(data, stack)) {
						if (errors !== NOERRORS) errors.push(err("not", "not", instancePath, schemaPath + "/not", {}, "must NOT be valid"));
						return false;
					}
					return true;
				});
				vsteps.push((data, stack) => !fn.v(data, stack));
			}
			if (P.if !== void 0) {
				const ifFn = inPlace(P.if, base);
				const thenFn = P.then !== void 0 ? inPlace(P.then, base) : null;
				const elseFn = P.else !== void 0 ? inPlace(P.else, base) : null;
				steps.push((data, errors, instancePath, schemaPath, stack, rec) => {
					let pl = collect ? pLen(rec) : 0, n0 = collect ? rec.n : 0, xl = collect ? xLen(rec) : 0;
					let ok;
					if (ifFn.v(data, stack, rec)) {
						if (thenFn === null) return true;
						if (collect) {
							pl = pLen(rec);
							n0 = rec.n;
							xl = xLen(rec);
						}
						ok = thenFn.c(data, errors, instancePath, schemaPath + "/then", stack, rec);
					} else {
						if (collect) undo(rec, pl, n0, xl);
						if (elseFn === null) return true;
						ok = elseFn.c(data, errors, instancePath, schemaPath + "/else", stack, rec);
					}
					if (!ok && collect) undo(rec, pl, n0, xl);
					return ok;
				});
				vsteps.push((data, stack, rec) => {
					const pl = collect ? pLen(rec) : 0, n0 = collect ? rec.n : 0, xl = collect ? xLen(rec) : 0;
					if (ifFn.v(data, stack, rec)) {
						if (thenFn !== null) return thenFn.v(data, stack, rec);
						return true;
					}
					if (collect) undo(rec, pl, n0, xl);
					if (elseFn !== null) return elseFn.v(data, stack, rec);
					return true;
				});
			}
			if (P.unevaluatedProperties !== void 0) {
				const fn = child(P.unevaluatedProperties);
				steps.push((data, errors, instancePath, schemaPath, stack, rec) => {
					if (dataBits(data) !== T_OBJECT) return true;
					let ok = true;
					const keys = keysOf(rec, data);
					for (let k = 0; k < keys.length; k++) {
						const key = keys[k];
						if (hasProp(rec, key)) continue;
						if (!fn.c(data[key], errors, instancePath + "/" + escapePointer(key), schemaPath + "/unevaluatedProperties", stack)) {
							ok = false;
							if (errors === NOERRORS) return false;
						}
						addProp(rec, key);
					}
					return ok;
				});
				if (fn === FALSE_PAIR) vsteps.push((data, stack, rec) => {
					if (dataBits(data) !== T_OBJECT) return true;
					const keys = keysOf(rec, data);
					if (keys.length === 0) return true;
					if (rec.props === null) return false;
					for (let k = 0; k < keys.length; k++) if (!hasProp(rec, keys[k])) return false;
					return true;
				});
				else vsteps.push((data, stack, rec) => {
					if (dataBits(data) !== T_OBJECT) return true;
					const keys = keysOf(rec, data);
					for (let k = 0; k < keys.length; k++) {
						const key = keys[k];
						if (hasProp(rec, key)) continue;
						if (!fn.v(data[key], stack)) return false;
						addProp(rec, key);
					}
					return true;
				});
			}
			if (P.unevaluatedItems !== void 0) {
				const fn = child(P.unevaluatedItems);
				steps.push((data, errors, instancePath, schemaPath, stack, rec) => {
					if (dataBits(data) !== T_ARRAY) return true;
					let ok = true;
					for (let i = 0; i < data.length; i++) {
						if (hasItem(rec, i)) continue;
						if (!fn.c(data[i], errors, instancePath + "/" + i, schemaPath + "/unevaluatedItems", stack)) {
							ok = false;
							if (errors === NOERRORS) return false;
						}
					}
					if (data.length > rec.n) rec.n = data.length;
					return ok;
				});
				if (fn === FALSE_PAIR) vsteps.push((data, stack, rec) => {
					if (dataBits(data) !== T_ARRAY) return true;
					for (let i = rec.n; i < data.length; i++) if (!hasItem(rec, i)) return false;
					return true;
				});
				else vsteps.push((data, stack, rec) => {
					if (dataBits(data) !== T_ARRAY) return true;
					for (let i = 0; i < data.length; i++) {
						if (hasItem(rec, i)) continue;
						if (!fn.v(data[i], stack)) return false;
					}
					if (data.length > rec.n) rec.n = data.length;
					return true;
				});
			}
			let cfn;
			if (steps.length === 0) cfn = TRUE_FN;
			else if (steps.length === 1) cfn = steps[0];
			else {
				const arr = steps;
				cfn = (d, e, ip, sp, st, rec) => {
					let ok = true;
					for (let i = 0; i < arr.length; i++) if (!arr[i](d, e, ip, sp, st, rec)) {
						if (e === NOERRORS) return false;
						ok = false;
					}
					return ok;
				};
			}
			let vfn;
			if (vsteps.length === 0) vfn = TRUE_FN;
			else if (vsteps.length === 1) vfn = vsteps[0];
			else if (vsteps.length === 2) {
				const [a, b] = vsteps;
				vfn = (d, st, rec) => a(d, st, rec) && b(d, st, rec);
			} else {
				const arr = vsteps;
				vfn = (d, st, rec) => {
					for (let i = 0; i < arr.length; i++) if (!arr[i](d, st, rec)) return false;
					return true;
				};
			}
			if (P.hasUnevaluated) {
				const inner = cfn;
				const innerV = vfn;
				if (ann) {
					cfn = (d, e, ip, sp, st, rec) => {
						const own = fresh();
						const ok = inner(d, e, ip, sp, st, own);
						if (ok) mergeRec(rec, own);
						return ok;
					};
					vfn = (d, st, rec) => {
						const own = fresh();
						const ok = innerV(d, st, own);
						if (ok) mergeRec(rec, own);
						return ok;
					};
				} else {
					cfn = (d, e, ip, sp, st) => inner(d, e, ip, sp, st, fresh());
					vfn = (d, st) => innerV(d, st, fresh());
				}
			}
			box.c = cfn;
			box.v = vfn;
			pair.c = cfn;
			pair.v = vfn;
			pair.open = false;
			return pair;
		}
		function compileInterpreter(interp) {
			const root = interp.rootNode;
			const base = interp.state.rootBase;
			let ctx = {
				interp,
				memo: /* @__PURE__ */ new Map(),
				guard: true,
				cyclic: false
			};
			let pair = compileNode(ctx, root, base, [base], false);
			if (!ctx.cyclic) {
				ctx = {
					interp,
					memo: /* @__PURE__ */ new Map(),
					guard: false,
					cyclic: false
				};
				pair = compileNode(ctx, root, base, [base], false);
			}
			return {
				v: pair.v,
				c: pair.c,
				cyclic: ctx.guard
			};
		}
		return { compileInterpreter };
	}
	module.exports = { install };
}));
//#endregion
//#region ../node_modules/.pnpm/ata-validator@1.7.4_yaml@2.9.0/node_modules/ata-validator/lib/interpreter.js
var require_interpreter = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const { compileSafe } = require_safe_regex();
	const SCHEMA_KEYWORDS = {
		single: [
			"additionalProperties",
			"contains",
			"propertyNames",
			"if",
			"then",
			"else",
			"not",
			"items",
			"unevaluatedItems",
			"unevaluatedProperties"
		],
		maps: [
			"$defs",
			"definitions",
			"properties",
			"patternProperties",
			"dependentSchemas"
		],
		lists: [
			"allOf",
			"anyOf",
			"oneOf",
			"prefixItems"
		]
	};
	const FALLBACK_BASE = "ata://root";
	function resolveUri(base, ref) {
		try {
			return new URL(ref, base || FALLBACK_BASE).href;
		} catch {
			return ref;
		}
	}
	function splitFragment(uri) {
		const hash = uri.indexOf("#");
		if (hash < 0) return [uri, ""];
		return [uri.slice(0, hash), decodeURIComponent(uri.slice(hash + 1))];
	}
	function indexSchemas(rootSchema, schemaMap) {
		const state = {
			resources: /* @__PURE__ */ new Map(),
			anchors: /* @__PURE__ */ new Map(),
			dynamicAnchors: /* @__PURE__ */ new Map(),
			nodeBase: /* @__PURE__ */ new Map(),
			rootBase: FALLBACK_BASE
		};
		const rootBase = typeof rootSchema === "object" && rootSchema !== null && typeof rootSchema.$id === "string" ? resolveUri(FALLBACK_BASE, splitFragment(rootSchema.$id)[0]) : FALLBACK_BASE;
		state.rootBase = rootBase;
		indexResource(rootSchema, rootBase, state);
		if (schemaMap) for (const [id, schema] of schemaMap) {
			const base = resolveUri(FALLBACK_BASE, splitFragment(id)[0]);
			if (!state.resources.has(base)) indexResource(schema, base, state);
			if (!state.resources.has(id)) state.resources.set(id, schema);
		}
		return state;
	}
	function indexResource(node, baseUri, state) {
		if (typeof node !== "object" || node === null) return;
		if (!state.resources.has(baseUri)) state.resources.set(baseUri, node);
		if (!state.anchors.has(baseUri)) state.anchors.set(baseUri, /* @__PURE__ */ new Map());
		if (!state.dynamicAnchors.has(baseUri)) state.dynamicAnchors.set(baseUri, /* @__PURE__ */ new Map());
		walkSchema(node, baseUri, state, true);
	}
	function walkSchema(node, baseUri, state, isResourceRoot) {
		if (typeof node !== "object" || node === null) return;
		if (state.nodeBase.has(node)) return;
		state.nodeBase.set(node, baseUri);
		if (!isResourceRoot && typeof node.$id === "string") {
			const newBase = splitFragment(resolveUri(baseUri, node.$id))[0];
			state.nodeBase.delete(node);
			indexResource(node, newBase, state);
			return;
		}
		if (typeof node.$anchor === "string") state.anchors.get(baseUri).set(node.$anchor, node);
		if (typeof node.$dynamicAnchor === "string") {
			state.dynamicAnchors.get(baseUri).set(node.$dynamicAnchor, node);
			state.anchors.get(baseUri).set(node.$dynamicAnchor, node);
		}
		for (const kw of SCHEMA_KEYWORDS.single) if (node[kw] !== void 0) walkSchema(node[kw], baseUri, state, false);
		for (const kw of SCHEMA_KEYWORDS.maps) {
			const map = node[kw];
			if (map && typeof map === "object" && !Array.isArray(map)) for (const key of Object.keys(map)) walkSchema(map[key], baseUri, state, false);
		}
		for (const kw of SCHEMA_KEYWORDS.lists) {
			const list = node[kw];
			if (Array.isArray(list)) for (const sub of list) walkSchema(sub, baseUri, state, false);
		}
		const propDeps = node.propertyDependencies;
		if (propDeps && typeof propDeps === "object" && !Array.isArray(propDeps)) {
			for (const choices of Object.values(propDeps)) if (choices && typeof choices === "object" && !Array.isArray(choices)) for (const sub of Object.values(choices)) walkSchema(sub, baseUri, state, false);
		}
	}
	function walkPointer(root, pointer) {
		if (pointer === "" || pointer === "/") return root;
		const parts = pointer.split("/").slice(1).map((s) => s.replace(/~1/g, "/").replace(/~0/g, "~"));
		let node = root;
		for (const part of parts) {
			if (node === null || typeof node !== "object") return void 0;
			if (Array.isArray(node)) node = node[Number(part)];
			else if (part in node) node = node[part];
			else if (part === "definitions" && node.$defs) node = node.$defs;
			else if (part === "$defs" && node.definitions) node = node.definitions;
			else if (part === "items" && Array.isArray(node.prefixItems)) node = node.prefixItems;
			else return;
		}
		return node;
	}
	function resolveRef(ref, fromBase, state) {
		const [uri, fragment] = splitFragment(resolveUri(fromBase, ref));
		let resource = state.resources.get(uri);
		let resourceBase = uri;
		if (resource === void 0 && (uri === FALLBACK_BASE || uri === "")) {
			resource = state.resources.get(state.rootBase);
			resourceBase = state.rootBase;
		}
		if (resource === void 0) {
			const [rawUri, rawFragment] = splitFragment(ref);
			if (state.resources.has(rawUri)) {
				resource = state.resources.get(rawUri);
				resourceBase = rawUri;
				if (rawFragment === "") return {
					node: resource,
					base: resourceBase
				};
				if (rawFragment.startsWith("/")) return {
					node: walkPointer(resource, rawFragment),
					base: resourceBase
				};
				const anchored = state.anchors.get(resourceBase);
				return {
					node: anchored ? anchored.get(rawFragment) : void 0,
					base: resourceBase
				};
			}
			return {
				node: void 0,
				base: resourceBase
			};
		}
		if (fragment === "") return {
			node: resource,
			base: resourceBase
		};
		if (fragment.startsWith("/")) {
			const node = walkPointer(resource, fragment);
			return {
				node,
				base: node !== null && typeof node === "object" && state.nodeBase.has(node) ? state.nodeBase.get(node) : resourceBase
			};
		}
		const anchored = state.anchors.get(resourceBase);
		return {
			node: anchored ? anchored.get(fragment) : void 0,
			base: resourceBase
		};
	}
	function deepEqual(a, b) {
		if (a === b) return true;
		if (typeof a === "number" && typeof b === "number") return a === b;
		if (a === null || b === null || typeof a !== "object" || typeof b !== "object") return false;
		const aArr = Array.isArray(a);
		if (aArr !== Array.isArray(b)) return false;
		if (aArr) {
			if (a.length !== b.length) return false;
			for (let i = 0; i < a.length; i++) if (!deepEqual(a[i], b[i])) return false;
			return true;
		}
		const ak = Object.keys(a);
		const bk = Object.keys(b);
		if (ak.length !== bk.length) return false;
		for (const k of ak) if (!(k in b) || !deepEqual(a[k], b[k])) return false;
		return true;
	}
	function codePointLength(s) {
		let n = 0;
		for (let i = 0; i < s.length; i++) {
			if (s.charCodeAt(i) - 55296 >>> 0 < 1024 && i + 1 < s.length) i++;
			n++;
		}
		return n;
	}
	function cpAtLeast(s, min) {
		if (s.length >= 2 * min) return true;
		if (s.length < min) return false;
		return codePointLength(s) >= min;
	}
	function cpAtMost(s, max) {
		if (s.length <= max) return true;
		if (s.length > 2 * max + 1) return false;
		return codePointLength(s) <= max;
	}
	function multipleOfOk(d, m) {
		if (m === 0) return false;
		const q = d / m;
		if (Number.isInteger(q)) return true;
		return Math.abs(q - Math.round(q)) < 1e-9;
	}
	const FORMAT_CHECKS = {
		email: (s) => {
			const at = s.indexOf("@");
			return at > 0 && at < s.length - 1 && s.indexOf(".", at) > at + 1;
		},
		date: (s) => {
			if (s.length !== 10 || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
			const m = +s.slice(5, 7), d = +s.slice(8, 10);
			return m >= 1 && m <= 12 && d >= 1 && d <= 31;
		},
		"date-time": (s) => /^\d{4}-\d{2}-\d{2}[Tt]\d{2}:\d{2}:\d{2}(\.\d+)?([Zz]|[+-]\d{2}:\d{2})$/.test(s) && !isNaN(Date.parse(s)),
		time: (s) => /^([01]\d|2[0-3]):[0-5]\d:[0-5]\d(\.\d+)?([Zz]|[+-]\d{2}:\d{2})?$/.test(s),
		duration: (s) => /^P(?:\d+Y)?(?:\d+M)?(?:\d+W)?(?:\d+D)?(?:T(?:\d+H)?(?:\d+M)?(?:\d+(?:\.\d+)?S)?)?$/.test(s) && s !== "P" && !s.endsWith("T"),
		uuid: (s) => s.length === 36 && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s),
		uri: (s) => /^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(s) && !/[\s\u0000-\u001f\u007f]/.test(s),
		"uri-reference": (s) => !/[\s\u0000-\u001f\u007f]/.test(s),
		ipv4: (s) => {
			const p = s.split(".");
			return p.length === 4 && p.every((n) => {
				const v = +n;
				return n !== "" && v >= 0 && v <= 255 && String(v) === n;
			});
		},
		ipv6: (s) => s !== "" && /^[0-9a-fA-F:.]+$/.test(s) && s.split(":").length >= 3 && s.split(":").length <= 8,
		hostname: (s) => s.length > 0 && s.length <= 253 && /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(s),
		regex: (s) => {
			try {
				new RegExp(s, "u");
				return true;
			} catch {
				try {
					new RegExp(s);
					return true;
				} catch {
					return false;
				}
			}
		},
		"json-pointer": (s) => s === "" || /^\//.test(s) && !/~(?![01])/.test(s)
	};
	const DISCARD = {
		props: null,
		items: null
	};
	const NOERRORS = Object.freeze([]);
	function mergeAnnotations(target, from) {
		if (from.props && from.props.size) {
			if (!target.props) target.props = /* @__PURE__ */ new Set();
			for (const p of from.props) target.props.add(p);
		}
		if (from.items && from.items.size) {
			if (!target.items) target.items = /* @__PURE__ */ new Set();
			for (const i of from.items) target.items.add(i);
		}
	}
	const T_STRING = 1;
	const T_NUMBER = 2;
	const T_INTEGER = 4;
	const T_BOOLEAN = 8;
	const T_NULL = 16;
	const T_OBJECT = 32;
	const T_ARRAY = 64;
	const T_ANY = 127;
	function typeBit(name) {
		switch (name) {
			case "string": return T_STRING;
			case "number": return T_NUMBER;
			case "integer": return T_INTEGER;
			case "boolean": return T_BOOLEAN;
			case "null": return T_NULL;
			case "object": return T_OBJECT;
			case "array": return T_ARRAY;
			default: return T_ANY;
		}
	}
	function dataBits(d) {
		switch (typeof d) {
			case "string": return T_STRING;
			case "number":
				if (!isFinite(d)) return 0;
				return Number.isInteger(d) ? 6 : T_NUMBER;
			case "boolean": return T_BOOLEAN;
			case "object":
				if (d === null) return T_NULL;
				return Array.isArray(d) ? T_ARRAY : T_OBJECT;
			default: return 0;
		}
	}
	function isObjectMap(v) {
		return v !== null && typeof v === "object" && !Array.isArray(v);
	}
	var Plan = class {
		constructor(schema) {
			this.schema = schema;
		}
		link(interp) {
			const schema = this.schema;
			const child = (sub) => interp.node(sub);
			this.refCache = null;
			this.refBase0 = void 0;
			this.refRes0 = null;
			this.dynCache = null;
			this.ref = typeof schema.$ref === "string" ? schema.$ref : null;
			this.dynamicRef = typeof schema.$dynamicRef === "string" ? schema.$dynamicRef : null;
			this.tracked = this.ref !== null || this.dynamicRef !== null;
			this.typeMask = 0;
			this.typeNames = null;
			if (schema.type !== void 0) {
				const types = Array.isArray(schema.type) ? schema.type : [schema.type];
				let mask = 0;
				for (const t of types) mask |= typeBit(t);
				this.typeMask = mask;
				this.typeNames = types;
			}
			this.hasType = schema.type !== void 0;
			this.enum = schema.enum !== void 0 ? schema.enum : null;
			this.hasConst = schema.const !== void 0;
			this.const = schema.const;
			this.minimum = typeof schema.minimum === "number" ? schema.minimum : void 0;
			this.maximum = typeof schema.maximum === "number" ? schema.maximum : void 0;
			this.exclusiveMinimum = typeof schema.exclusiveMinimum === "number" ? schema.exclusiveMinimum : void 0;
			this.exclusiveMaximum = typeof schema.exclusiveMaximum === "number" ? schema.exclusiveMaximum : void 0;
			this.multipleOf = typeof schema.multipleOf === "number" ? schema.multipleOf : void 0;
			this.hasNumber = this.minimum !== void 0 || this.maximum !== void 0 || this.exclusiveMinimum !== void 0 || this.exclusiveMaximum !== void 0 || this.multipleOf !== void 0;
			this.minLength = schema.minLength;
			this.maxLength = schema.maxLength;
			this.pattern = schema.pattern !== void 0 ? interp.pattern(schema.pattern) : null;
			this.patternSource = schema.pattern;
			this.format = schema.format;
			this.formatFn = null;
			if (schema.format !== void 0) {
				const uf = interp.userFormats;
				const fc = uf && typeof uf[schema.format] === "function" ? uf[schema.format] : FORMAT_CHECKS[schema.format];
				this.formatFn = fc || null;
			}
			this.hasString = this.minLength !== void 0 || this.maxLength !== void 0 || this.pattern !== null || this.formatFn !== null;
			this.minItems = schema.minItems;
			this.maxItems = schema.maxItems;
			this.uniqueItems = schema.uniqueItems === true;
			this.prefixItems = Array.isArray(schema.prefixItems) ? schema.prefixItems.map(child) : null;
			this.items = schema.items !== void 0 ? child(schema.items) : void 0;
			this.contains = schema.contains !== void 0 ? child(schema.contains) : void 0;
			this.minContains = schema.minContains;
			this.maxContains = schema.maxContains;
			this.hasArray = this.minItems !== void 0 || this.maxItems !== void 0 || this.uniqueItems || this.prefixItems !== null || this.items !== void 0 || this.contains !== void 0;
			this.required = Array.isArray(schema.required) ? schema.required : null;
			this.minProperties = schema.minProperties;
			this.maxProperties = schema.maxProperties;
			this.dependentRequired = isObjectMap(schema.dependentRequired) ? Object.entries(schema.dependentRequired) : null;
			this.propertyNames = schema.propertyNames !== void 0 ? child(schema.propertyNames) : void 0;
			this.properties = null;
			if (isObjectMap(schema.properties)) {
				this.properties = /* @__PURE__ */ new Map();
				for (const key of Object.keys(schema.properties)) {
					const ek = escapePointer(key);
					this.properties.set(key, {
						node: child(schema.properties[key]),
						seg: "/" + ek,
						schemaSeg: "/properties/" + ek
					});
				}
			}
			this.patternProperties = null;
			if (isObjectMap(schema.patternProperties)) this.patternProperties = Object.keys(schema.patternProperties).map((src) => ({
				src,
				re: interp.pattern(src),
				node: child(schema.patternProperties[src])
			}));
			this.additionalProperties = schema.additionalProperties !== void 0 ? child(schema.additionalProperties) : void 0;
			this.dependentSchemas = isObjectMap(schema.dependentSchemas) ? Object.entries(schema.dependentSchemas).map(([k, v]) => [k, child(v)]) : null;
			this.propertyDependencies = null;
			if (isObjectMap(schema.propertyDependencies)) this.propertyDependencies = Object.entries(schema.propertyDependencies).filter(([, choices]) => isObjectMap(choices)).map(([k, choices]) => [k, new Map(Object.keys(choices).map((v) => [v, child(choices[v])]))]);
			this.hasObject = this.required !== null || this.minProperties !== void 0 || this.maxProperties !== void 0 || this.dependentRequired !== null || this.propertyNames !== void 0 || this.properties !== null || this.patternProperties !== null || this.additionalProperties !== void 0 || this.dependentSchemas !== null || this.propertyDependencies !== null;
			this.allOf = Array.isArray(schema.allOf) ? schema.allOf.map(child) : null;
			this.anyOf = Array.isArray(schema.anyOf) ? schema.anyOf.map(child) : null;
			this.oneOf = Array.isArray(schema.oneOf) ? schema.oneOf.map(child) : null;
			this.not = schema.not !== void 0 ? child(schema.not) : void 0;
			this.if = schema.if !== void 0 ? child(schema.if) : void 0;
			this.then = schema.then !== void 0 ? child(schema.then) : void 0;
			this.else = schema.else !== void 0 ? child(schema.else) : void 0;
			this.hasApplicators = this.allOf !== null || this.anyOf !== null || this.oneOf !== null || this.not !== void 0 || this.if !== void 0;
			this.unevaluatedProperties = schema.unevaluatedProperties !== void 0 ? child(schema.unevaluatedProperties) : void 0;
			this.unevaluatedItems = schema.unevaluatedItems !== void 0 ? child(schema.unevaluatedItems) : void 0;
			this.hasUnevaluated = this.unevaluatedProperties !== void 0 || this.unevaluatedItems !== void 0;
			const nodeBase = interp.state.nodeBase.get(schema);
			this.nodeBase = nodeBase !== void 0 ? nodeBase : null;
			this.isResourceRoot = nodeBase !== void 0 && interp.state.resources.get(nodeBase) === schema;
			this.leaf = !this.tracked && !this.hasApplicators && !this.hasUnevaluated && this.properties === null && this.patternProperties === null && this.additionalProperties === void 0 && this.propertyNames === void 0 && this.dependentSchemas === null && this.propertyDependencies === null && this.prefixItems === null && this.items === void 0 && this.contains === void 0 && this.nodeBase === null;
		}
	};
	function evalLeafV(P, data) {
		const bits = dataBits(data);
		if (P.hasType && (bits & P.typeMask) === 0) return false;
		if (P.enum !== null) {
			let found = false;
			for (let i = 0; i < P.enum.length; i++) if (deepEqual(P.enum[i], data)) {
				found = true;
				break;
			}
			if (!found) return false;
		}
		if (P.hasConst && !deepEqual(P.const, data)) return false;
		if (P.hasNumber && typeof data === "number") {
			if (P.minimum !== void 0 && !(data >= P.minimum)) return false;
			if (P.maximum !== void 0 && !(data <= P.maximum)) return false;
			if (P.exclusiveMinimum !== void 0 && !(data > P.exclusiveMinimum)) return false;
			if (P.exclusiveMaximum !== void 0 && !(data < P.exclusiveMaximum)) return false;
			if (P.multipleOf !== void 0 && !multipleOfOk(data, P.multipleOf)) return false;
		}
		if (P.hasString && bits === T_STRING) {
			if (P.minLength !== void 0 && !cpAtLeast(data, P.minLength)) return false;
			if (P.maxLength !== void 0 && !cpAtMost(data, P.maxLength)) return false;
			if (P.pattern !== null && !P.pattern.test(data)) return false;
			if (P.formatFn !== null && !P.formatFn(data)) return false;
		}
		if (P.hasArray && bits === T_ARRAY) {
			if (P.minItems !== void 0 && data.length < P.minItems) return false;
			if (P.maxItems !== void 0 && data.length > P.maxItems) return false;
			if (P.uniqueItems) {
				for (let i = 0; i < data.length; i++) for (let j = i + 1; j < data.length; j++) if (deepEqual(data[i], data[j])) return false;
			}
		}
		if (P.hasObject && bits === T_OBJECT) {
			if (P.required !== null) {
				const req = P.required;
				for (let i = 0; i < req.length; i++) if (!Object.hasOwn(data, req[i])) return false;
			}
			if (P.minProperties !== void 0 && Object.keys(data).length < P.minProperties) return false;
			if (P.maxProperties !== void 0 && Object.keys(data).length > P.maxProperties) return false;
			if (P.dependentRequired !== null) {
				for (const [key, deps] of P.dependentRequired) if (Object.hasOwn(data, key)) {
					for (const dep of deps) if (!Object.hasOwn(data, dep)) return false;
				}
			}
		}
		return true;
	}
	function evalLeaf(P, data, errors, instancePath, schemaPath) {
		let valid = true;
		const schema = P.schema;
		const bits = dataBits(data);
		if (P.hasType && (bits & P.typeMask) === 0) {
			if (errors !== NOERRORS) errors.push(err("type", "type", instancePath, schemaPath + "/type", { type: schema.type }, `must be ${P.typeNames.join(" or ")}`));
			valid = false;
		}
		if (P.enum !== null) {
			let found = false;
			for (let i = 0; i < P.enum.length; i++) if (deepEqual(P.enum[i], data)) {
				found = true;
				break;
			}
			if (!found) {
				if (errors !== NOERRORS) errors.push(err("enum", "enum", instancePath, schemaPath + "/enum", { allowedValues: P.enum }, "must be equal to one of the allowed values"));
				valid = false;
			}
		}
		if (P.hasConst && !deepEqual(P.const, data)) {
			if (errors !== NOERRORS) errors.push(err("const", "const", instancePath, schemaPath + "/const", { allowedValue: P.const }, "must be equal to constant"));
			valid = false;
		}
		if (P.hasNumber && typeof data === "number") {
			if (P.minimum !== void 0 && !(data >= P.minimum)) {
				errors === NOERRORS || errors.push(err("minimum", "minimum", instancePath, schemaPath + "/minimum", {
					comparison: ">=",
					limit: P.minimum
				}, `must be >= ${P.minimum}`));
				valid = false;
			}
			if (P.maximum !== void 0 && !(data <= P.maximum)) {
				errors === NOERRORS || errors.push(err("maximum", "maximum", instancePath, schemaPath + "/maximum", {
					comparison: "<=",
					limit: P.maximum
				}, `must be <= ${P.maximum}`));
				valid = false;
			}
			if (P.exclusiveMinimum !== void 0 && !(data > P.exclusiveMinimum)) {
				errors === NOERRORS || errors.push(err("exclusiveMinimum", "exclusiveMinimum", instancePath, schemaPath + "/exclusiveMinimum", {
					comparison: ">",
					limit: P.exclusiveMinimum
				}, `must be > ${P.exclusiveMinimum}`));
				valid = false;
			}
			if (P.exclusiveMaximum !== void 0 && !(data < P.exclusiveMaximum)) {
				errors === NOERRORS || errors.push(err("exclusiveMaximum", "exclusiveMaximum", instancePath, schemaPath + "/exclusiveMaximum", {
					comparison: "<",
					limit: P.exclusiveMaximum
				}, `must be < ${P.exclusiveMaximum}`));
				valid = false;
			}
			if (P.multipleOf !== void 0 && !multipleOfOk(data, P.multipleOf)) {
				errors === NOERRORS || errors.push(err("multipleOf", "multipleOf", instancePath, schemaPath + "/multipleOf", { multipleOf: P.multipleOf }, `must be multiple of ${P.multipleOf}`));
				valid = false;
			}
		}
		if (P.hasString && bits === T_STRING) {
			if (P.minLength !== void 0 && !cpAtLeast(data, P.minLength)) {
				errors === NOERRORS || errors.push(err("minLength", "minLength", instancePath, schemaPath + "/minLength", { limit: P.minLength }, `must NOT have fewer than ${P.minLength} characters`));
				valid = false;
			}
			if (P.maxLength !== void 0 && !cpAtMost(data, P.maxLength)) {
				errors === NOERRORS || errors.push(err("maxLength", "maxLength", instancePath, schemaPath + "/maxLength", { limit: P.maxLength }, `must NOT have more than ${P.maxLength} characters`));
				valid = false;
			}
			if (P.pattern !== null && !P.pattern.test(data)) {
				errors === NOERRORS || errors.push(err("pattern", "pattern", instancePath, schemaPath + "/pattern", { pattern: P.patternSource }, `must match pattern "${P.patternSource}"`));
				valid = false;
			}
			if (P.formatFn !== null && !P.formatFn(data)) {
				errors === NOERRORS || errors.push(err("format", "format", instancePath, schemaPath + "/format", { format: P.format }, `must match format "${P.format}"`));
				valid = false;
			}
		}
		if (P.hasArray && bits === T_ARRAY) {
			if (P.minItems !== void 0 && data.length < P.minItems) {
				errors === NOERRORS || errors.push(err("minItems", "minItems", instancePath, schemaPath + "/minItems", { limit: P.minItems }, `must NOT have fewer than ${P.minItems} items`));
				valid = false;
			}
			if (P.maxItems !== void 0 && data.length > P.maxItems) {
				errors === NOERRORS || errors.push(err("maxItems", "maxItems", instancePath, schemaPath + "/maxItems", { limit: P.maxItems }, `must NOT have more than ${P.maxItems} items`));
				valid = false;
			}
			if (P.uniqueItems) {
				outer: for (let i = 0; i < data.length; i++) for (let j = i + 1; j < data.length; j++) if (deepEqual(data[i], data[j])) {
					if (errors !== NOERRORS) errors.push(err("uniqueItems", "uniqueItems", instancePath, schemaPath + "/uniqueItems", {
						i,
						j
					}, "must NOT have duplicate items"));
					valid = false;
					break outer;
				}
			}
		}
		if (P.hasObject && bits === T_OBJECT) {
			const keys = Object.keys(data);
			if (P.required !== null) {
				const req = P.required;
				for (let i = 0; i < req.length; i++) {
					const key = req[i];
					if (!Object.hasOwn(data, key)) {
						errors === NOERRORS || errors.push(err("required", "required", instancePath, schemaPath + "/required", { missingProperty: key }, `must have required property '${key}'`));
						valid = false;
					}
				}
			}
			if (P.minProperties !== void 0 && keys.length < P.minProperties) {
				errors === NOERRORS || errors.push(err("minProperties", "minProperties", instancePath, schemaPath + "/minProperties", { limit: P.minProperties }, `must NOT have fewer than ${P.minProperties} properties`));
				valid = false;
			}
			if (P.maxProperties !== void 0 && keys.length > P.maxProperties) {
				errors === NOERRORS || errors.push(err("maxProperties", "maxProperties", instancePath, schemaPath + "/maxProperties", { limit: P.maxProperties }, `must NOT have more than ${P.maxProperties} properties`));
				valid = false;
			}
			if (P.dependentRequired !== null) {
				for (const [key, deps] of P.dependentRequired) if (Object.hasOwn(data, key)) {
					for (const dep of deps) if (!Object.hasOwn(data, dep)) {
						errors === NOERRORS || errors.push(err("required", "required", instancePath, schemaPath + "/dependentRequired", { missingProperty: dep }, `must have required property '${dep}'`));
						valid = false;
					}
				}
			}
		}
		return valid;
	}
	var Interpreter = class {
		constructor(rootSchema, options) {
			const opts = options || {};
			this.root = rootSchema;
			this.state = indexSchemas(rootSchema, opts.schemaMap);
			this.userFormats = opts.formats || null;
			this.bookending = !opts.v1;
			this.patternCache = /* @__PURE__ */ new Map();
			this.plans = /* @__PURE__ */ new Map();
			this.rootNode = this.node(rootSchema);
			this._fast = void 0;
		}
		_fastRoot() {
			if (this._fast === void 0) try {
				this._fast = compileInterpreter(this);
			} catch {
				this._fast = null;
			}
			return this._fast;
		}
		pattern(src) {
			let re = this.patternCache.get(src);
			if (!re) {
				if (/\\[pP]\{/.test(src)) try {
					re = new RegExp(src, "u");
				} catch {
					re = new RegExp(src);
				}
				else try {
					re = compileSafe(src);
				} catch {
					try {
						re = new RegExp(src, "u");
					} catch {
						re = new RegExp(src);
					}
				}
				this.patternCache.set(src, re);
			}
			return re;
		}
		plan(schema) {
			let p = this.plans.get(schema);
			if (p === void 0) {
				p = new Plan(schema);
				this.plans.set(schema, p);
				p.link(this);
			}
			return p;
		}
		resolveRefCached(P, base) {
			if (P.refBase0 === base) return P.refRes0;
			let cache = P.refCache;
			let r = cache !== null ? cache.get(base) : void 0;
			if (r === void 0) {
				const raw = resolveRef(P.ref, base, this.state);
				r = {
					child: raw.node === void 0 ? void 0 : this.node(raw.node),
					base: raw.base
				};
				if (P.refBase0 === void 0) {
					P.refBase0 = base;
					P.refRes0 = r;
				} else {
					if (cache === null) cache = P.refCache = /* @__PURE__ */ new Map();
					cache.set(base, r);
				}
			}
			return r;
		}
		resolveDynamicRefCached(P, base) {
			let cache = P.dynCache;
			if (cache === null) cache = P.dynCache = /* @__PURE__ */ new Map();
			let r = cache.get(base);
			if (r === void 0) {
				const { node, base: refBase } = resolveRef(P.dynamicRef, base, this.state);
				const [, fragment] = splitFragment(resolveUri(base, P.dynamicRef));
				r = {
					node,
					base: refBase,
					fragment,
					byAnchor: Boolean(fragment) && !fragment.startsWith("/")
				};
				cache.set(base, r);
			}
			return r;
		}
		node(schema) {
			if (schema === true || schema === false) return schema;
			if (typeof schema !== "object" || schema === null) return true;
			return this.plan(schema);
		}
		isValid(data) {
			const fast = this._fastRoot();
			if (fast !== null) return fast.v(data, fast.cyclic ? [] : null);
			const dynScope = [this.state.rootBase];
			return this.eval(this.rootNode, data, this.state.rootBase, dynScope, NOERRORS, "", "#", [], DISCARD);
		}
		validate(data) {
			const fast = this._fastRoot();
			if (fast !== null) {
				const errors = [];
				return fast.c(data, errors, "", "#", fast.cyclic ? [] : null) ? {
					valid: true,
					data,
					errors: []
				} : {
					valid: false,
					errors
				};
			}
			const errors = [];
			const dynScope = [this.state.rootBase];
			return this.eval(this.rootNode, data, this.state.rootBase, dynScope, errors, "", "#", [], DISCARD) ? {
				valid: true,
				data,
				errors: []
			} : {
				valid: false,
				errors
			};
		}
		eval(P, data, base, dynScope, errors, instancePath, schemaPath, stack, sink) {
			if (P === true) return true;
			if (P === false) {
				if (errors !== NOERRORS) errors.push(err("false schema", "not", instancePath, schemaPath, {}, "boolean schema is false"));
				return false;
			}
			if (P.leaf) return evalLeaf(P, data, errors, instancePath, schemaPath);
			const schema = P.schema;
			const tracked = P.tracked;
			if (tracked) {
				for (let i = stack.length - 2; i >= 0; i -= 2) if (stack[i] === schema && stack[i + 1] === data) return true;
				stack.push(schema, data);
			}
			if (P.nodeBase !== null && P.nodeBase !== base) base = P.nodeBase;
			let scopePushed = false;
			if (dynScope[dynScope.length - 1] !== base) {
				dynScope.push(base);
				scopePushed = true;
			}
			let valid = true;
			const collect = sink !== DISCARD || P.hasUnevaluated;
			const local = collect ? {
				props: null,
				items: null
			} : DISCARD;
			if (P.ref !== null) {
				const { child, base: refBase } = this.resolveRefCached(P, base);
				if (child === void 0) {
					if (errors !== NOERRORS) errors.push(err("$ref", "$ref", instancePath, schemaPath + "/$ref", { ref: P.ref }, `cannot resolve $ref ${P.ref}`));
					valid = false;
				} else {
					const sub = collect ? {
						props: null,
						items: null
					} : DISCARD;
					if (!this.eval(child, data, refBase, dynScope, errors, instancePath, schemaPath + "/$ref", stack, sub)) valid = false;
					else if (collect) mergeAnnotations(local, sub);
				}
			}
			if (P.dynamicRef !== null) {
				const ref = P.dynamicRef;
				const initial = this.resolveDynamicRefCached(P, base);
				let node = initial.node;
				let refBase = initial.base;
				const fragment = initial.fragment;
				if (initial.byAnchor) {
					const initialDyn = this.state.dynamicAnchors.get(refBase);
					if (node !== void 0 && initialDyn && initialDyn.get(fragment) === node || !this.bookending) for (const scopeBase of dynScope) {
						const dyn = this.state.dynamicAnchors.get(scopeBase);
						if (dyn && dyn.has(fragment)) {
							node = dyn.get(fragment);
							refBase = scopeBase;
							break;
						}
					}
				}
				if (node === void 0) {
					if (errors !== NOERRORS) errors.push(err("$dynamicRef", "$dynamicRef", instancePath, schemaPath + "/$dynamicRef", { ref }, `cannot resolve $dynamicRef ${ref}`));
					valid = false;
				} else {
					const sub = collect ? {
						props: null,
						items: null
					} : DISCARD;
					if (!this.eval(this.node(node), data, refBase, dynScope, errors, instancePath, schemaPath + "/$dynamicRef", stack, sub)) valid = false;
					else if (collect) mergeAnnotations(local, sub);
				}
			}
			const bits = dataBits(data);
			if (P.hasType && (bits & P.typeMask) === 0) {
				if (errors !== NOERRORS) errors.push(err("type", "type", instancePath, schemaPath + "/type", { type: schema.type }, `must be ${P.typeNames.join(" or ")}`));
				valid = false;
			}
			if (P.enum !== null) {
				let found = false;
				for (let i = 0; i < P.enum.length; i++) if (deepEqual(P.enum[i], data)) {
					found = true;
					break;
				}
				if (!found) {
					if (errors !== NOERRORS) errors.push(err("enum", "enum", instancePath, schemaPath + "/enum", { allowedValues: P.enum }, "must be equal to one of the allowed values"));
					valid = false;
				}
			}
			if (P.hasConst && !deepEqual(P.const, data)) {
				if (errors !== NOERRORS) errors.push(err("const", "const", instancePath, schemaPath + "/const", { allowedValue: P.const }, "must be equal to constant"));
				valid = false;
			}
			if (P.hasNumber && typeof data === "number") {
				if (P.minimum !== void 0 && !(data >= P.minimum)) {
					errors === NOERRORS || errors.push(err("minimum", "minimum", instancePath, schemaPath + "/minimum", {
						comparison: ">=",
						limit: P.minimum
					}, `must be >= ${P.minimum}`));
					valid = false;
				}
				if (P.maximum !== void 0 && !(data <= P.maximum)) {
					errors === NOERRORS || errors.push(err("maximum", "maximum", instancePath, schemaPath + "/maximum", {
						comparison: "<=",
						limit: P.maximum
					}, `must be <= ${P.maximum}`));
					valid = false;
				}
				if (P.exclusiveMinimum !== void 0 && !(data > P.exclusiveMinimum)) {
					errors === NOERRORS || errors.push(err("exclusiveMinimum", "exclusiveMinimum", instancePath, schemaPath + "/exclusiveMinimum", {
						comparison: ">",
						limit: P.exclusiveMinimum
					}, `must be > ${P.exclusiveMinimum}`));
					valid = false;
				}
				if (P.exclusiveMaximum !== void 0 && !(data < P.exclusiveMaximum)) {
					errors === NOERRORS || errors.push(err("exclusiveMaximum", "exclusiveMaximum", instancePath, schemaPath + "/exclusiveMaximum", {
						comparison: "<",
						limit: P.exclusiveMaximum
					}, `must be < ${P.exclusiveMaximum}`));
					valid = false;
				}
				if (P.multipleOf !== void 0 && !multipleOfOk(data, P.multipleOf)) {
					errors === NOERRORS || errors.push(err("multipleOf", "multipleOf", instancePath, schemaPath + "/multipleOf", { multipleOf: P.multipleOf }, `must be multiple of ${P.multipleOf}`));
					valid = false;
				}
			}
			if (P.hasString && bits === T_STRING) {
				if (P.minLength !== void 0 && !cpAtLeast(data, P.minLength)) {
					errors === NOERRORS || errors.push(err("minLength", "minLength", instancePath, schemaPath + "/minLength", { limit: P.minLength }, `must NOT have fewer than ${P.minLength} characters`));
					valid = false;
				}
				if (P.maxLength !== void 0 && !cpAtMost(data, P.maxLength)) {
					errors === NOERRORS || errors.push(err("maxLength", "maxLength", instancePath, schemaPath + "/maxLength", { limit: P.maxLength }, `must NOT have more than ${P.maxLength} characters`));
					valid = false;
				}
				if (P.pattern !== null && !P.pattern.test(data)) {
					errors === NOERRORS || errors.push(err("pattern", "pattern", instancePath, schemaPath + "/pattern", { pattern: P.patternSource }, `must match pattern "${P.patternSource}"`));
					valid = false;
				}
				if (P.formatFn !== null && !P.formatFn(data)) {
					errors === NOERRORS || errors.push(err("format", "format", instancePath, schemaPath + "/format", { format: P.format }, `must match format "${P.format}"`));
					valid = false;
				}
			}
			if (P.hasArray && bits === T_ARRAY) {
				if (P.minItems !== void 0 && data.length < P.minItems) {
					errors === NOERRORS || errors.push(err("minItems", "minItems", instancePath, schemaPath + "/minItems", { limit: P.minItems }, `must NOT have fewer than ${P.minItems} items`));
					valid = false;
				}
				if (P.maxItems !== void 0 && data.length > P.maxItems) {
					errors === NOERRORS || errors.push(err("maxItems", "maxItems", instancePath, schemaPath + "/maxItems", { limit: P.maxItems }, `must NOT have more than ${P.maxItems} items`));
					valid = false;
				}
				if (P.uniqueItems) {
					outer: for (let i = 0; i < data.length; i++) for (let j = i + 1; j < data.length; j++) if (deepEqual(data[i], data[j])) {
						if (errors !== NOERRORS) errors.push(err("uniqueItems", "uniqueItems", instancePath, schemaPath + "/uniqueItems", {
							i,
							j
						}, "must NOT have duplicate items"));
						valid = false;
						break outer;
					}
				}
				const prefix = P.prefixItems;
				if (prefix !== null) {
					const n = Math.min(prefix.length, data.length);
					for (let i = 0; i < n; i++) {
						if (!this.eval(prefix[i], data[i], base, dynScope, errors, instancePath + "/" + i, schemaPath + "/prefixItems/" + i, stack, DISCARD)) valid = false;
						if (collect) {
							if (!local.items) local.items = /* @__PURE__ */ new Set();
							local.items.add(i);
						}
					}
				}
				if (P.items !== void 0) {
					const start = prefix !== null ? prefix.length : 0;
					for (let i = start; i < data.length; i++) {
						if (!this.eval(P.items, data[i], base, dynScope, errors, instancePath + "/" + i, schemaPath + "/items", stack, DISCARD)) valid = false;
						if (collect) {
							if (!local.items) local.items = /* @__PURE__ */ new Set();
							local.items.add(i);
						}
					}
				}
				if (P.contains !== void 0) {
					const matched = [];
					for (let i = 0; i < data.length; i++) {
						const scratch = errors === NOERRORS ? NOERRORS : [];
						if (this.eval(P.contains, data[i], base, dynScope, scratch, instancePath + "/" + i, schemaPath + "/contains", stack, DISCARD)) matched.push(i);
					}
					const minC = P.minContains !== void 0 ? P.minContains : 1;
					if (matched.length < minC) {
						errors === NOERRORS || errors.push(err("contains", "contains", instancePath, schemaPath + "/contains", { minContains: minC }, `must contain at least ${minC} valid item(s)`));
						valid = false;
					}
					if (P.maxContains !== void 0 && matched.length > P.maxContains) {
						errors === NOERRORS || errors.push(err("maxContains", "maxContains", instancePath, schemaPath + "/maxContains", { limit: P.maxContains }, `must NOT contain more than ${P.maxContains} valid item(s)`));
						valid = false;
					}
					if (collect && matched.length) {
						if (!local.items) local.items = /* @__PURE__ */ new Set();
						for (const i of matched) local.items.add(i);
					}
				}
			}
			if (P.hasObject && bits === T_OBJECT) {
				const keys = Object.keys(data);
				if (P.required !== null) {
					const req = P.required;
					for (let i = 0; i < req.length; i++) {
						const key = req[i];
						if (!Object.hasOwn(data, key)) {
							errors === NOERRORS || errors.push(err("required", "required", instancePath, schemaPath + "/required", { missingProperty: key }, `must have required property '${key}'`));
							valid = false;
						}
					}
				}
				if (P.minProperties !== void 0 && keys.length < P.minProperties) {
					errors === NOERRORS || errors.push(err("minProperties", "minProperties", instancePath, schemaPath + "/minProperties", { limit: P.minProperties }, `must NOT have fewer than ${P.minProperties} properties`));
					valid = false;
				}
				if (P.maxProperties !== void 0 && keys.length > P.maxProperties) {
					errors === NOERRORS || errors.push(err("maxProperties", "maxProperties", instancePath, schemaPath + "/maxProperties", { limit: P.maxProperties }, `must NOT have more than ${P.maxProperties} properties`));
					valid = false;
				}
				if (P.dependentRequired !== null) {
					for (const [key, deps] of P.dependentRequired) if (Object.hasOwn(data, key)) {
						for (const dep of deps) if (!Object.hasOwn(data, dep)) {
							errors === NOERRORS || errors.push(err("required", "required", instancePath, schemaPath + "/dependentRequired", { missingProperty: dep }, `must have required property '${dep}'`));
							valid = false;
						}
					}
				}
				if (P.propertyNames !== void 0) {
					for (const key of keys) if (!this.eval(P.propertyNames, key, base, dynScope, errors, instancePath + "/" + escapePointer(key), schemaPath + "/propertyNames", stack, DISCARD)) valid = false;
				}
				const props = P.properties;
				const patterns = P.patternProperties;
				for (let k = 0; k < keys.length; k++) {
					const key = keys[k];
					let evaluated = false;
					const prop = props !== null ? props.get(key) : void 0;
					if (prop !== void 0) {
						if (!this.eval(prop.node, data[key], base, dynScope, errors, instancePath + prop.seg, schemaPath + prop.schemaSeg, stack, DISCARD)) valid = false;
						evaluated = true;
					}
					if (patterns !== null) for (let pi = 0; pi < patterns.length; pi++) {
						const pp = patterns[pi];
						if (pp.re.test(key)) {
							if (!this.eval(pp.node, data[key], base, dynScope, errors, instancePath + "/" + escapePointer(key), schemaPath + "/patternProperties/" + escapePointer(pp.src), stack, DISCARD)) valid = false;
							evaluated = true;
						}
					}
					if (!evaluated && P.additionalProperties !== void 0) {
						if (!this.eval(P.additionalProperties, data[key], base, dynScope, errors, instancePath + "/" + escapePointer(key), schemaPath + "/additionalProperties", stack, DISCARD)) valid = false;
						evaluated = true;
					}
					if (evaluated && collect) {
						if (!local.props) local.props = /* @__PURE__ */ new Set();
						local.props.add(key);
					}
				}
				if (P.dependentSchemas !== null) {
					for (const [key, dep] of P.dependentSchemas) if (Object.hasOwn(data, key)) {
						const sub = collect ? {
							props: null,
							items: null
						} : DISCARD;
						if (!this.eval(dep, data, base, dynScope, errors, instancePath, schemaPath + "/dependentSchemas/" + escapePointer(key), stack, sub)) valid = false;
						else if (collect) mergeAnnotations(local, sub);
					}
				}
				if (P.propertyDependencies !== null) for (const [key, choices] of P.propertyDependencies) {
					if (!Object.hasOwn(data, key)) continue;
					const value = data[key];
					if (typeof value !== "string") continue;
					const choice = choices.get(value);
					if (choice === void 0) continue;
					const sub = collect ? {
						props: null,
						items: null
					} : DISCARD;
					const branchPath = schemaPath + "/propertyDependencies/" + escapePointer(key) + "/" + escapePointer(value);
					if (!this.eval(choice, data, base, dynScope, errors, instancePath, branchPath, stack, sub)) valid = false;
					else if (collect) mergeAnnotations(local, sub);
				}
			}
			if (P.hasApplicators) {
				if (P.allOf !== null) for (let i = 0; i < P.allOf.length; i++) {
					const sub = collect ? {
						props: null,
						items: null
					} : DISCARD;
					if (!this.eval(P.allOf[i], data, base, dynScope, errors, instancePath, schemaPath + "/allOf/" + i, stack, sub)) valid = false;
					else if (collect) mergeAnnotations(local, sub);
				}
				if (P.anyOf !== null) {
					let any = false;
					const scratch = errors === NOERRORS ? NOERRORS : [];
					for (let i = 0; i < P.anyOf.length; i++) {
						const sub = collect ? {
							props: null,
							items: null
						} : DISCARD;
						if (this.eval(P.anyOf[i], data, base, dynScope, scratch, instancePath, schemaPath + "/anyOf/" + i, stack, sub)) {
							any = true;
							if (collect) mergeAnnotations(local, sub);
						}
					}
					if (!any) {
						if (errors !== NOERRORS) for (const e of scratch) errors.push(e);
						if (errors !== NOERRORS) errors.push(err("anyOf", "anyOf", instancePath, schemaPath + "/anyOf", {}, "must match a schema in anyOf"));
						valid = false;
					}
				}
				if (P.oneOf !== null) {
					let count = 0;
					let winner = null;
					const scratch = errors === NOERRORS ? NOERRORS : [];
					for (let i = 0; i < P.oneOf.length; i++) {
						const sub = collect ? {
							props: null,
							items: null
						} : DISCARD;
						if (this.eval(P.oneOf[i], data, base, dynScope, scratch, instancePath, schemaPath + "/oneOf/" + i, stack, sub)) {
							count++;
							winner = sub;
						}
					}
					if (count === 1) {
						if (collect) mergeAnnotations(local, winner);
					} else {
						if (count === 0) for (const e of scratch) errors.push(e);
						if (errors !== NOERRORS) errors.push(err("oneOf", "oneOf", instancePath, schemaPath + "/oneOf", { passingSchemas: count }, "must match exactly one schema in oneOf"));
						valid = false;
					}
				}
				if (P.not !== void 0) {
					const scratch = errors === NOERRORS ? NOERRORS : [];
					if (this.eval(P.not, data, base, dynScope, scratch, instancePath, schemaPath + "/not", stack, DISCARD)) {
						if (errors !== NOERRORS) errors.push(err("not", "not", instancePath, schemaPath + "/not", {}, "must NOT be valid"));
						valid = false;
					}
				}
				if (P.if !== void 0) {
					const ifSub = collect ? {
						props: null,
						items: null
					} : DISCARD;
					const ifScratch = errors === NOERRORS ? NOERRORS : [];
					if (this.eval(P.if, data, base, dynScope, ifScratch, instancePath, schemaPath + "/if", stack, ifSub)) {
						if (collect) mergeAnnotations(local, ifSub);
						if (P.then !== void 0) {
							const sub = collect ? {
								props: null,
								items: null
							} : DISCARD;
							if (!this.eval(P.then, data, base, dynScope, errors, instancePath, schemaPath + "/then", stack, sub)) valid = false;
							else if (collect) mergeAnnotations(local, sub);
						}
					} else if (P.else !== void 0) {
						const sub = collect ? {
							props: null,
							items: null
						} : DISCARD;
						if (!this.eval(P.else, data, base, dynScope, errors, instancePath, schemaPath + "/else", stack, sub)) valid = false;
						else if (collect) mergeAnnotations(local, sub);
					}
				}
			}
			if (P.hasUnevaluated) {
				if (P.unevaluatedProperties !== void 0 && bits === T_OBJECT) for (const key of Object.keys(data)) {
					if (local.props && local.props.has(key)) continue;
					if (!this.eval(P.unevaluatedProperties, data[key], base, dynScope, errors, instancePath + "/" + escapePointer(key), schemaPath + "/unevaluatedProperties", stack, DISCARD)) valid = false;
					if (!local.props) local.props = /* @__PURE__ */ new Set();
					local.props.add(key);
				}
				if (P.unevaluatedItems !== void 0 && bits === T_ARRAY) for (let i = 0; i < data.length; i++) {
					if (local.items && local.items.has(i)) continue;
					if (!this.eval(P.unevaluatedItems, data[i], base, dynScope, errors, instancePath + "/" + i, schemaPath + "/unevaluatedItems", stack, DISCARD)) valid = false;
					if (!local.items) local.items = /* @__PURE__ */ new Set();
					local.items.add(i);
				}
			}
			if (scopePushed) dynScope.pop();
			if (tracked) stack.length -= 2;
			if (valid && collect && sink !== DISCARD) mergeAnnotations(sink, local);
			return valid;
		}
	};
	function escapePointer(s) {
		if (typeof s !== "string") s = String(s);
		for (let i = 0; i < s.length; i++) {
			const c = s.charCodeAt(i);
			if (c === 126 || c === 47) return s.replace(/~/g, "~0").replace(/\//g, "~1");
		}
		return s;
	}
	function err(code, keyword, instancePath, schemaPath, params, message) {
		return {
			keyword,
			instancePath,
			schemaPath,
			params,
			message
		};
	}
	const { compileInterpreter } = require_plan_compiler().install({
		Plan,
		NOERRORS,
		err,
		evalLeaf,
		evalLeafV,
		dataBits,
		escapePointer,
		deepEqual,
		multipleOfOk,
		cpAtLeast,
		cpAtMost,
		T_STRING,
		T_ARRAY,
		T_OBJECT,
		resolveRef,
		splitFragment,
		resolveUri
	});
	function createInterpreter(schema, options) {
		return new Interpreter(schema, options);
	}
	module.exports = { createInterpreter };
}));
//#endregion
//#region ../node_modules/.pnpm/ata-validator@1.7.4_yaml@2.9.0/node_modules/ata-validator/lib/levenshtein.js
var require_levenshtein = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	function levenshtein(a, b, maxDistance) {
		const max = maxDistance == null ? Infinity : maxDistance;
		if (a === b) return 0;
		if (Math.abs(a.length - b.length) > max) return Infinity;
		if (a.length === 0) return b.length;
		if (b.length === 0) return a.length;
		let prev = new Array(b.length + 1);
		let curr = new Array(b.length + 1);
		for (let j = 0; j <= b.length; j++) prev[j] = j;
		for (let i = 1; i <= a.length; i++) {
			curr[0] = i;
			let rowMin = i;
			for (let j = 1; j <= b.length; j++) {
				const cost = a[i - 1] === b[j - 1] ? 0 : 1;
				curr[j] = Math.min(curr[j - 1] + 1, prev[j] + 1, prev[j - 1] + cost);
				if (curr[j] < rowMin) rowMin = curr[j];
			}
			if (rowMin > max) return Infinity;
			[prev, curr] = [curr, prev];
		}
		return prev[b.length];
	}
	module.exports = { levenshtein };
}));
//#endregion
//#region ../node_modules/.pnpm/ata-validator@1.7.4_yaml@2.9.0/node_modules/ata-validator/lib/suggestions.js
var require_suggestions = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const { levenshtein } = require_levenshtein();
	const FORMAT_HINTS = {
		email: (val) => {
			if (typeof val !== "string") return null;
			if (!val.includes("@")) return "missing '@' and domain part";
			if (val.split("@").length > 2) return "multiple '@' characters";
			const [, dom] = val.split("@");
			if (!dom || !dom.includes(".")) return "domain part missing dot";
			return null;
		},
		date: (val) => {
			if (typeof val !== "string") return null;
			const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(val);
			if (!m) return "expected YYYY-MM-DD layout";
			const mo = +m[2];
			if (mo < 1 || mo > 12) return "month must be 01-12";
			const d = +m[3];
			if (d < 1 || d > 31) return "day must be 01-31";
			return null;
		},
		uuid: (val) => {
			if (typeof val !== "string") return null;
			if (!/^[0-9a-fA-F-]+$/.test(val)) return "expected hex digits and dashes";
			return "expected 8-4-4-4-12 hex layout";
		},
		ipv4: (val) => typeof val === "string" ? "expected four 0-255 octets separated by dots" : null
	};
	function suggestEnumTypo(received, enumValues) {
		if (typeof received !== "string") return null;
		if (!Array.isArray(enumValues) || enumValues.length === 0 || enumValues.length > 30) return null;
		let best = null;
		let bestDist = Infinity;
		let tied = false;
		for (const v of enumValues) {
			if (typeof v !== "string") continue;
			const d = levenshtein(received, v, 2);
			if (d < bestDist) {
				best = v;
				bestDist = d;
				tied = false;
			} else if (d === bestDist) tied = true;
		}
		if (best && bestDist <= 2 && !tied) return {
			text: `did you mean \`${best}\`?`,
			kind: "typo"
		};
		return null;
	}
	function suggestRequiredTypo(missing, presentKeys) {
		if (!missing || !Array.isArray(presentKeys)) return null;
		for (const k of presentKeys) {
			if (typeof k !== "string") continue;
			const d = levenshtein(missing, k, 2);
			if (d <= 2 && d > 0) return {
				text: `did you mean \`${missing}\` instead of \`${k}\`?`,
				kind: "similar-key"
			};
		}
		return null;
	}
	function suggestFormat(format, received) {
		const fn = FORMAT_HINTS[format];
		if (!fn) return null;
		let raw = received;
		if (typeof raw === "string" && raw.startsWith("\"") && raw.endsWith("\"")) try {
			raw = JSON.parse(raw);
		} catch {}
		const text = fn(raw);
		return text ? {
			text,
			kind: "format"
		} : null;
	}
	function suggestCoercion(expectedType, received) {
		if (typeof received !== "string" || !received.startsWith("\"") || !received.endsWith("\"")) return null;
		let raw;
		try {
			raw = JSON.parse(received);
		} catch {
			return null;
		}
		if (typeof raw !== "string") return null;
		if (expectedType === "integer" && /^-?\d+$/.test(raw)) return {
			text: "value would coerce; enable `coerceTypes` or pass an integer",
			kind: "coercion"
		};
		if (expectedType === "number" && /^-?\d+(\.\d+)?$/.test(raw)) return {
			text: "value would coerce; enable `coerceTypes` or pass a number",
			kind: "coercion"
		};
		if (expectedType === "boolean" && (raw === "true" || raw === "false")) return {
			text: "value would coerce; enable `coerceTypes` or pass a boolean",
			kind: "coercion"
		};
		return null;
	}
	/**
	* Apply suggestion sources in priority order. Returns the first hit, or null.
	* @param err Enriched ValidationError (with `received`, `params`, `keyword`)
	* @param data The full input data (for required-typo)
	*/
	function suggestFor(err, data) {
		if (err.keyword === "enum") return suggestEnumTypo(parseReceived(err.received), err.params && err.params.allowedValues);
		if (err.keyword === "required") {
			const missing = err.params && err.params.missingProperty;
			let parentPath = err.path || "";
			if (parentPath.endsWith("/" + missing)) parentPath = parentPath.slice(0, -missing.length - 1);
			const parent = walk(data, parentPath);
			if (parent && typeof parent === "object") return suggestRequiredTypo(missing, Object.keys(parent));
			return null;
		}
		if (err.keyword === "format") return suggestFormat(err.params && err.params.format, err.received);
		if (err.keyword === "type") return suggestCoercion(err.params && err.params.type, err.received);
		return null;
	}
	function parseReceived(r) {
		if (typeof r !== "string") return r;
		if (r.startsWith("\"") && r.endsWith("\"")) try {
			return JSON.parse(r);
		} catch {
			return r;
		}
		return r;
	}
	function walk(data, pointer) {
		if (!pointer) return data;
		const parts = pointer.replace(/^\//, "").split("/").map((s) => s.replace(/~1/g, "/").replace(/~0/g, "~"));
		let cur = data;
		for (const p of parts) {
			if (cur == null) return void 0;
			cur = cur[p];
		}
		return cur;
	}
	module.exports = {
		suggestFor,
		suggestEnumTypo,
		suggestRequiredTypo,
		suggestFormat,
		suggestCoercion
	};
}));
//#endregion
//#region ../node_modules/.pnpm/ata-validator@1.7.4_yaml@2.9.0/node_modules/ata-validator/lib/enrich-error.js
var require_enrich_error = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const { CODES, codeFor } = require_error_codes();
	const { suggestFor } = require_suggestions();
	const DOC_BASE = "https://ata-validator.com/e/";
	function reprValue(v) {
		if (v === void 0) return "undefined";
		if (v === null) return "null";
		const t = typeof v;
		if (t === "string") {
			const s = JSON.stringify(v);
			return s.length > 60 ? s.slice(0, 57) + "...\"" : s;
		}
		if (t === "number" || t === "boolean") return String(v);
		if (Array.isArray(v)) return `[array, ${v.length} items]`;
		if (t === "object") try {
			const s = JSON.stringify(v);
			if (s.length <= 60) return s;
			return `[object, ~${(s.length / 1024).toFixed(1)}KB]`;
		} catch {
			return "[object, unserializable]";
		}
		return `[${t}]`;
	}
	function expectedFor(err) {
		switch (err.keyword) {
			case "type": return err.params && err.params.type ? String(err.params.type) : void 0;
			case "minLength": return err.params && err.params.limit != null ? `string with ≥${err.params.limit} chars` : void 0;
			case "maxLength": return err.params && err.params.limit != null ? `string with ≤${err.params.limit} chars` : void 0;
			case "minimum": return err.params && err.params.limit != null ? `≥${err.params.limit}` : void 0;
			case "maximum": return err.params && err.params.limit != null ? `≤${err.params.limit}` : void 0;
			case "format": return err.params && err.params.format ? `format '${err.params.format}'` : void 0;
			case "enum": return err.params && err.params.allowedValues ? `one of [${err.params.allowedValues.map(reprValue).join(", ")}]` : void 0;
			case "const": return err.params && "allowedValue" in err.params ? reprValue(err.params.allowedValue) : void 0;
			case "required": return err.params && err.params.missingProperty ? `property '${err.params.missingProperty}'` : void 0;
			default: return;
		}
	}
	function pickReceived(err, data) {
		if (!data && data !== 0 && data !== false) return void 0;
		const p = err.instancePath || err.path || "";
		if (!p) return reprValue(data);
		const len = p.length;
		let cur = data;
		let i = p.charCodeAt(0) === 47 ? 1 : 0;
		for (;;) {
			let j = p.indexOf("/", i);
			if (j === -1) j = len;
			let seg = p.slice(i, j);
			if (seg.indexOf("~") !== -1) seg = seg.replace(/~1/g, "/").replace(/~0/g, "~");
			if (cur == null) return void 0;
			cur = cur[seg];
			if (j === len) break;
			i = j + 1;
		}
		return reprValue(cur);
	}
	/**
	* Enrich a raw codegen error with code/path/expected/received/docUrl.
	* Pure: returns a new object. Source frames and suggestions are added by
	* other helpers later in the pipeline.
	*/
	function enrich(rawErr, opts) {
		const data = opts && opts.data;
		const positions = opts && opts.positions;
		const keyword = rawErr.keyword;
		const format = rawErr.params && rawErr.params.format;
		const code = rawErr.code || codeFor(keyword, format) || "ATA9001";
		const meta = CODES[code];
		const path = rawErr.instancePath != null ? rawErr.instancePath : rawErr.path || "";
		const out = {
			code,
			message: rawErr.message || meta && meta.headline || "validation failed",
			keyword,
			path,
			expected: expectedFor(rawErr),
			received: data !== void 0 ? pickReceived(rawErr, data) : void 0,
			schemaPath: rawErr.schemaPath,
			docUrl: DOC_BASE + code,
			instancePath: path,
			dataPath: path,
			params: rawErr.params,
			parentSchema: rawErr.parentSchema
		};
		if (rawErr.branchErrors) out.branchErrors = rawErr.branchErrors;
		if (positions && positions[path]) {
			const p = positions[path];
			out.dataFrame = {
				byteOffset: p.byteOffset,
				length: p.length,
				line: p.line,
				col: p.col,
				text: p.text
			};
		}
		if (opts && opts.schemaPositions && rawErr.schemaPath) {
			const sp = rawErr.schemaPath;
			const ptr = sp.startsWith("#") ? sp.slice(1) : sp;
			const hit = opts.schemaPositions[ptr] || opts.schemaPositions[ptr + "#key"];
			if (hit) out.schemaSource = {
				file: opts.schemaFile,
				line: hit.line,
				col: hit.col,
				text: hit.text
			};
		}
		const sugg = suggestFor(out, opts && opts.data);
		if (sugg) out.suggestion = sugg;
		return out;
	}
	module.exports = {
		enrich,
		reprValue,
		expectedFor
	};
}));
//#endregion
//#region ../node_modules/.pnpm/ata-validator@1.7.4_yaml@2.9.0/node_modules/ata-validator/lib/error-messages.js
var require_error_messages = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	function resolveOwner(rootSchema, schemaPath) {
		if (!schemaPath || typeof schemaPath !== "string" || schemaPath[0] !== "#") return void 0;
		const stripped = schemaPath.slice(1);
		if (!stripped || stripped === "/") return rootSchema;
		const parts = stripped.split("/").filter(Boolean).map((s) => s.replace(/~1/g, "/").replace(/~0/g, "~"));
		let target = rootSchema;
		for (let i = 0; i < parts.length - 1; i++) {
			if (target == null || typeof target !== "object") return void 0;
			target = target[parts[i]];
		}
		return target;
	}
	function pickMessage(em, err) {
		if (em == null) return void 0;
		if (typeof em === "string") return em;
		if (typeof em !== "object") return void 0;
		const kw = err.keyword;
		if (kw === "required") {
			const r = em.required;
			if (typeof r === "string") return r;
			if (r && typeof r === "object") {
				const prop = err.params && err.params.missingProperty;
				if (prop != null && typeof r[prop] === "string") return r[prop];
			}
		}
		if (kw != null && typeof em[kw] === "string") return em[kw];
		if (typeof em._ === "string") return em._;
	}
	function schemaHasErrorMessages(schemaStr) {
		return typeof schemaStr === "string" && schemaStr.indexOf("\"errorMessage\"") !== -1;
	}
	function applyErrorMessages(errors, rootSchema) {
		if (!errors || !errors.length) return errors;
		let changed = false;
		const out = new Array(errors.length);
		for (let i = 0; i < errors.length; i++) {
			const err = errors[i];
			out[i] = err;
			if (!err || typeof err.schemaPath !== "string") continue;
			const owner = resolveOwner(rootSchema, err.schemaPath);
			if (!owner || typeof owner !== "object") continue;
			const msg = pickMessage(owner.errorMessage, err);
			if (msg == null) continue;
			out[i] = Object.assign({}, err, { message: msg });
			changed = true;
		}
		return changed ? out : errors;
	}
	module.exports = {
		schemaHasErrorMessages,
		applyErrorMessages,
		resolveOwner,
		pickMessage
	};
}));
//#endregion
//#region ../node_modules/.pnpm/ata-validator@1.7.4_yaml@2.9.0/node_modules/ata-validator/lib/buffer-gate.js
var require_buffer_gate = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const UNSUPPORTED_KEYWORDS = /* @__PURE__ */ new Set([
		"contains",
		"minContains",
		"maxContains",
		"unevaluatedProperties",
		"unevaluatedItems",
		"dependencies",
		"dependentSchemas",
		"dependentRequired",
		"propertyNames",
		"patternProperties"
	]);
	const DIVERGENT_FORMATS = /* @__PURE__ */ new Set([
		"hostname",
		"date-time",
		"time",
		"uri-reference",
		"duration"
	]);
	const SUBSCHEMA_MAPS = [
		"properties",
		"patternProperties",
		"$defs",
		"definitions",
		"dependentSchemas",
		"dependencies"
	];
	const SUBSCHEMA_NODES = [
		"items",
		"additionalItems",
		"additionalProperties",
		"contains",
		"propertyNames",
		"not",
		"if",
		"then",
		"else",
		"unevaluatedProperties",
		"unevaluatedItems",
		"allOf",
		"anyOf",
		"oneOf",
		"prefixItems"
	];
	function walk(schema, depth) {
		if (schema === true || schema === false) return depth === 0;
		if (schema === null || typeof schema !== "object") return false;
		if (Array.isArray(schema)) {
			for (const s of schema) if (walk(s, depth + 1)) return true;
			return false;
		}
		for (const key of Object.keys(schema)) {
			const v = schema[key];
			if (UNSUPPORTED_KEYWORDS.has(key)) return true;
			if (key === "$ref" && typeof v === "string" && !v.startsWith("#")) return true;
			if (key === "$id" && depth > 0) return true;
			if (key === "enum" && Array.isArray(v) && v.length === 0) return true;
			if (key === "format" && DIVERGENT_FORMATS.has(v)) return true;
			if (key === "pattern" && typeof v === "string" && /\\[pP]\{/.test(v)) return true;
			if (key === "prefixItems") return true;
			if ((key === "items" || key === "additionalItems") && (typeof v === "boolean" || Array.isArray(v))) return true;
			if (SUBSCHEMA_MAPS.includes(key)) {
				if (v && typeof v === "object" && !Array.isArray(v)) {
					for (const k of Object.keys(v)) if (walk(v[k], depth + 1)) return true;
				}
			} else if (SUBSCHEMA_NODES.includes(key)) {
				if (walk(v, depth + 1)) return true;
			}
		}
		return false;
	}
	function bufferNeedsSlowPath(schema, schemaMap) {
		if (walk(schema, 0)) return true;
		if (schemaMap && schemaMap.size > 0) {
			for (const s of schemaMap.values()) if (walk(s, 1)) return true;
		}
		return false;
	}
	function toText(input, name) {
		if (typeof input === "string") return input;
		if (input instanceof Uint8Array) return Buffer.from(input.buffer, input.byteOffset, input.byteLength).toString("utf8");
		throw new TypeError(`${name}() requires a Buffer, Uint8Array, or string. For parsed objects, use isValidObject().`);
	}
	function installSlowBufferApis(validator) {
		const isValidText = (text) => {
			let value;
			try {
				value = JSON.parse(text);
			} catch {
				return false;
			}
			return validator.validate(value).valid;
		};
		validator.isValid = (input) => isValidText(toText(input, "isValid"));
		validator.isValidJSON = (jsonStr) => isValidText(jsonStr);
		validator.isValidPrepadded = (paddedBuffer, jsonLength) => isValidText(Buffer.from(paddedBuffer.buffer, paddedBuffer.byteOffset, jsonLength).toString("utf8"));
		const ndjson = (input, name) => {
			const lines = toText(input, name).split("\n");
			const out = [];
			for (const line of lines) {
				if (line === "") continue;
				out.push(isValidText(line));
			}
			return out;
		};
		validator.isValidNDJSON = (input) => ndjson(input, "isValidNDJSON");
		validator.isValidParallel = (input) => ndjson(input, "isValidParallel");
		validator.countValid = (input) => {
			let n = 0;
			for (const ok of ndjson(input, "countValid")) if (ok) n++;
			return n;
		};
		validator.batchIsValid = (buffers) => {
			let n = 0;
			for (const b of buffers) {
				if (!(b instanceof Uint8Array)) throw new TypeError("batchIsValid() requires Buffer or Uint8Array elements");
				if (isValidText(toText(b, "batchIsValid"))) n++;
			}
			return n;
		};
	}
	module.exports = {
		bufferNeedsSlowPath,
		installSlowBufferApis
	};
}));
//#endregion
//#region ../node_modules/.pnpm/ata-validator@1.7.4_yaml@2.9.0/node_modules/ata-validator/lib/refine.js
var require_refine = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const REFINE = Symbol.for("ata.t.refine");
	function getRefinements(schema) {
		if (!schema || typeof schema !== "object") return null;
		const r = schema[REFINE];
		return Array.isArray(r) && r.length ? r : null;
	}
	function attach(schema, check, opts) {
		if (typeof check !== "function") throw new TypeError("t.refine(schema, check, opts?) — check must be a function");
		const prev = schema && Array.isArray(schema[REFINE]) ? schema[REFINE] : [];
		const o = opts || {};
		const entry = {
			check,
			message: o.message,
			path: o.path || ""
		};
		return Object.assign({}, schema, { [REFINE]: prev.concat(entry) });
	}
	function issue(entry, message) {
		return {
			keyword: "refine",
			instancePath: entry.path || "",
			path: entry.path || "",
			schemaPath: "",
			params: {},
			message: message != null ? message : entry.message || "value failed refinement"
		};
	}
	async function runRefinements(refinements, data) {
		const issues = [];
		await Promise.all(refinements.map(async (entry) => {
			let passed;
			try {
				passed = await entry.check(data);
			} catch (e) {
				issues.push(issue(entry, entry.message || e && e.message || "refinement threw"));
				return;
			}
			if (!passed) issues.push(issue(entry));
		}));
		return issues;
	}
	module.exports = {
		REFINE,
		getRefinements,
		attach,
		runRefinements
	};
}));
//#endregion
//#region ../node_modules/.pnpm/ata-validator@1.7.4_yaml@2.9.0/node_modules/ata-validator/lib/version.js
var require_version = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = "1.7.4";
}));
//#endregion
//#region ../node_modules/.pnpm/ata-validator@1.7.4_yaml@2.9.0/node_modules/ata-validator/lib/safe-regex-source.js
var require_safe_regex_source = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = "'use strict'\n\n// Linear-time regex engine for JSON Schema `pattern`, used in place of JS RegExp\n// so an adversarial input cannot trigger catastrophic backtracking (ReDoS).\n//\n// It is a Pike VM: the pattern compiles to a small instruction program, and the\n// VM simulates all NFA threads in lockstep over the input, deduping by program\n// counter. Runtime is O(input * program), with no backtracking.\n//\n// Supported (the RE2 subset, which is what ata's native path also accepts):\n// literals, ., character classes, \\d \\w \\s \\D \\W \\S, anchors ^ $, quantifiers\n// * + ? {n} {n,} {n,m} (greedy or lazy, same language for a boolean test),\n// groups ( ) (?: ), alternation |. Backreferences and lookaround are not\n// supported by linear engines; compileSafe throws on them so the caller can\n// decide (ata's codegen rejects such schemas rather than risk a hang).\n\nconst WS = [[9, 13], [32, 32], [160, 160]]\nconst DIGIT = [[48, 57]]\nconst WORD = [[48, 57], [65, 90], [97, 122], [95, 95]]\n\nfunction parse (src) {\n  let i = 0\n  const len = src.length\n  const peek = () => src[i]\n  const eof = () => i >= len\n\n  function parseAlt () {\n    const opts = [parseConcat()]\n    while (!eof() && peek() === '|') { i++; opts.push(parseConcat()) }\n    return opts.length === 1 ? opts[0] : { t: 'alt', opts }\n  }\n\n  function parseConcat () {\n    const parts = []\n    while (!eof() && peek() !== '|' && peek() !== ')') parts.push(parseRepeat())\n    if (parts.length === 0) return { t: 'empty' }\n    return parts.length === 1 ? parts[0] : { t: 'concat', parts }\n  }\n\n  function parseRepeat () {\n    let node = parseAtom()\n    while (!eof()) {\n      const ch = peek()\n      if (ch === '*') { i++; node = { t: 'star', child: node } }\n      else if (ch === '+') { i++; node = { t: 'plus', child: node } }\n      else if (ch === '?') { i++; node = { t: 'quest', child: node } }\n      else if (ch === '{') {\n        const saved = i\n        const q = tryQuantifier()\n        if (!q) { i = saved; break }\n        node = { t: 'repeat', child: node, min: q.min, max: q.max }\n      } else break\n      // a trailing ? makes the quantifier lazy; same language for a boolean test\n      if (!eof() && peek() === '?') i++\n    }\n    return node\n  }\n\n  function tryQuantifier () {\n    // assumes current char is '{'\n    i++\n    let min = ''\n    while (!eof() && /[0-9]/.test(peek())) { min += peek(); i++ }\n    if (min === '') return null\n    let max\n    if (peek() === '}') { i++; return { min: +min, max: +min } }\n    if (peek() === ',') {\n      i++\n      let m = ''\n      while (!eof() && /[0-9]/.test(peek())) { m += peek(); i++ }\n      if (peek() !== '}') return null\n      i++\n      max = m === '' ? Infinity : +m\n      return { min: +min, max }\n    }\n    return null\n  }\n\n  function parseAtom () {\n    const ch = peek()\n    if (ch === '(') {\n      i++\n      if (src[i] === '?') {\n        if (src[i + 1] === ':') { i += 2 }\n        else throw new Error('unsupported group (lookaround/named) in pattern')\n      }\n      const child = parseAlt()\n      if (peek() !== ')') throw new Error('unbalanced ( in pattern')\n      i++\n      return { t: 'group', child }\n    }\n    if (ch === '[') return parseClass()\n    if (ch === '.') { i++; return { t: 'any' } }\n    if (ch === '^') { i++; return { t: 'bol' } }\n    if (ch === '$') { i++; return { t: 'eol' } }\n    if (ch === '\\\\') return parseEscape(false)\n    if (ch === ')' || ch === '|') return { t: 'empty' }\n    i++\n    return { t: 'char', c: ch.charCodeAt(0) }\n  }\n\n  function parseClass () {\n    i++ // [\n    let neg = false\n    if (peek() === '^') { neg = true; i++ }\n    const ranges = []\n    while (!eof() && peek() !== ']') {\n      let lo\n      if (peek() === '\\\\') {\n        const esc = parseEscape(true)\n        if (esc.t === 'classpart') { for (const r of esc.ranges) ranges.push(r); continue }\n        lo = esc.c\n      } else { lo = peek().charCodeAt(0); i++ }\n      if (peek() === '-' && src[i + 1] !== ']' && i + 1 < len) {\n        i++ // -\n        let hi\n        if (peek() === '\\\\') { const e = parseEscape(true); hi = e.c } else { hi = peek().charCodeAt(0); i++ }\n        ranges.push([lo, hi])\n      } else {\n        ranges.push([lo, lo])\n      }\n    }\n    if (peek() !== ']') throw new Error('unbalanced [ in pattern')\n    i++\n    return { t: 'class', neg, ranges }\n  }\n\n  function parseEscape (inClass) {\n    i++ // backslash\n    if (eof()) throw new Error('trailing backslash in pattern')\n    const ch = peek(); i++\n    switch (ch) {\n      case 'd': return inClass ? { t: 'classpart', ranges: DIGIT } : { t: 'class', neg: false, ranges: DIGIT }\n      case 'w': return inClass ? { t: 'classpart', ranges: WORD } : { t: 'class', neg: false, ranges: WORD }\n      case 's': return inClass ? { t: 'classpart', ranges: WS } : { t: 'class', neg: false, ranges: WS }\n      case 'D': if (inClass) throw new Error('\\\\D inside a class is not supported'); return { t: 'class', neg: true, ranges: DIGIT }\n      case 'W': if (inClass) throw new Error('\\\\W inside a class is not supported'); return { t: 'class', neg: true, ranges: WORD }\n      case 'S': if (inClass) throw new Error('\\\\S inside a class is not supported'); return { t: 'class', neg: true, ranges: WS }\n      case 'n': return { t: 'char', c: 10 }\n      case 'r': return { t: 'char', c: 13 }\n      case 't': return { t: 'char', c: 9 }\n      case 'f': return { t: 'char', c: 12 }\n      case 'v': return { t: 'char', c: 11 }\n      case '0': return { t: 'char', c: 0 }\n      case 'x': { const h = src.slice(i, i + 2); i += 2; return { t: 'char', c: parseInt(h, 16) } }\n      case 'u': { const h = src.slice(i, i + 4); i += 4; return { t: 'char', c: parseInt(h, 16) } }\n      case 'b': if (inClass) return { t: 'char', c: 8 }; throw new Error('\\\\b word boundary is not supported')\n      default:\n        if (/[1-9]/.test(ch)) throw new Error('backreferences are not supported in pattern')\n        return { t: 'char', c: ch.charCodeAt(0) }\n    }\n  }\n\n  const ast = parseAlt()\n  if (!eof()) throw new Error('unexpected \"' + peek() + '\" in pattern')\n  return ast\n}\n\nfunction compileProg (ast) {\n  const prog = []\n  const emit = (op, extra) => { const idx = prog.length; prog.push(Object.assign({ op }, extra)); return idx }\n\n  function rec (n) {\n    switch (n.t) {\n      case 'empty': break\n      case 'char': emit('char', { c: n.c }); break\n      case 'any': emit('any'); break\n      case 'class': emit('class', { neg: n.neg, ranges: n.ranges }); break\n      case 'bol': emit('bol'); break\n      case 'eol': emit('eol'); break\n      case 'group': rec(n.child); break\n      case 'concat': for (const p of n.parts) rec(p); break\n      case 'alt': {\n        const jmps = []\n        for (let k = 0; k < n.opts.length; k++) {\n          if (k < n.opts.length - 1) {\n            const sp = emit('split', { x: 0, y: 0 })\n            prog[sp].x = prog.length\n            rec(n.opts[k])\n            jmps.push(emit('jmp', { x: 0 }))\n            prog[sp].y = prog.length\n          } else {\n            rec(n.opts[k])\n          }\n        }\n        for (const j of jmps) prog[j].x = prog.length\n        break\n      }\n      case 'star': {\n        const sp = emit('split', { x: 0, y: 0 })\n        prog[sp].x = prog.length\n        rec(n.child)\n        emit('jmp', { x: sp })\n        prog[sp].y = prog.length\n        break\n      }\n      case 'plus': {\n        const start = prog.length\n        rec(n.child)\n        const sp = emit('split', { x: start, y: 0 })\n        prog[sp].y = prog.length\n        break\n      }\n      case 'quest': {\n        const sp = emit('split', { x: 0, y: 0 })\n        prog[sp].x = prog.length\n        rec(n.child)\n        prog[sp].y = prog.length\n        break\n      }\n      case 'repeat': {\n        for (let k = 0; k < n.min; k++) rec(n.child)\n        if (n.max === Infinity) {\n          if (n.min === 0) rec({ t: 'star', child: n.child })\n          else rec({ t: 'star', child: n.child })\n        } else {\n          for (let k = 0; k < n.max - n.min; k++) rec({ t: 'quest', child: n.child })\n        }\n        break\n      }\n    }\n  }\n\n  rec(ast)\n  emit('match')\n  return prog\n}\n\n// Numeric opcodes for the runner. The program is compiled once into flat\n// typed arrays so the inner loop does no property lookups or string compares.\nconst OP_CHAR = 0\nconst OP_ANY = 1\nconst OP_CLASS = 2\nconst OP_SPLIT = 3\nconst OP_JMP = 4\nconst OP_BOL = 5\nconst OP_EOL = 6\nconst OP_MATCH = 7\n\nfunction classMatcher (instr) {\n  // ASCII is answered from a bitmap; anything above 0x7f walks the ranges.\n  const bits = new Uint8Array(128)\n  const r = instr.ranges\n  for (let k = 0; k < r.length; k++) {\n    const hi = Math.min(r[k][1], 127)\n    for (let c = r[k][0]; c <= hi; c++) bits[c] = 1\n  }\n  return { bits, ranges: r, neg: instr.neg }\n}\n\nfunction matchClass (cls, c) {\n  let inside\n  if (c < 128) {\n    inside = cls.bits[c] === 1\n  } else {\n    inside = false\n    const r = cls.ranges\n    for (let k = 0; k < r.length; k++) { if (c >= r[k][0] && c <= r[k][1]) { inside = true; break } }\n  }\n  return cls.neg ? !inside : inside\n}\n\nfunction makeRunner (prog) {\n  const n = prog.length\n  const ops = new Uint8Array(n)\n  const xs = new Int32Array(n)\n  const ys = new Int32Array(n)\n  const cs = new Int32Array(n)\n  const classes = new Array(n)\n  for (let i = 0; i < n; i++) {\n    const I = prog[i]\n    switch (I.op) {\n      case 'char': ops[i] = OP_CHAR; cs[i] = I.c; break\n      case 'any': ops[i] = OP_ANY; break\n      case 'class': ops[i] = OP_CLASS; classes[i] = classMatcher(I); break\n      case 'split': ops[i] = OP_SPLIT; xs[i] = I.x; ys[i] = I.y; break\n      case 'jmp': ops[i] = OP_JMP; xs[i] = I.x; break\n      case 'bol': ops[i] = OP_BOL; break\n      case 'eol': ops[i] = OP_EOL; break\n      case 'match': ops[i] = OP_MATCH; break\n    }\n  }\n\n  const lastGen = new Int32Array(n).fill(-1)\n  let gen = 0\n  // Each unvisited instruction is popped once and pushes at most two, so the\n  // stack never holds more than 2n + 1 entries.\n  const stack = new Int32Array(2 * n + 2)\n  // Thread lists hold at most one entry per instruction per step.\n  let clist = new Int32Array(n)\n  let nlist = new Int32Array(n)\n  let clen = 0\n  let nlen = 0\n\n  // Follows epsilon edges from `pc` and records every consuming instruction\n  // (or match) reached in `list`. `lastGen` dedupes per step.\n  function addThread (list, len0, pc, pos, len) {\n    // Most transitions land directly on a consuming instruction; skip the\n    // stack walk for those.\n    if (ops[pc] <= OP_CLASS || ops[pc] === OP_MATCH) {\n      if (lastGen[pc] === gen) return len0\n      lastGen[pc] = gen\n      list[len0] = pc\n      return len0 + 1\n    }\n    let sp = 0\n    stack[sp++] = pc\n    let count = len0\n    while (sp > 0) {\n      const p = stack[--sp]\n      if (lastGen[p] === gen) continue\n      lastGen[p] = gen\n      switch (ops[p]) {\n        case OP_JMP: stack[sp++] = xs[p]; break\n        case OP_SPLIT: stack[sp++] = ys[p]; stack[sp++] = xs[p]; break\n        case OP_BOL: if (pos === 0) stack[sp++] = p + 1; break\n        case OP_EOL: if (pos === len) stack[sp++] = p + 1; break\n        default: list[count++] = p\n      }\n    }\n    return count\n  }\n\n  // A pattern is anchored when starting it anywhere but position 0 yields no\n  // thread, which is the case for `^...` and its alternations. The probe sits\n  // at position 1 of a length-1 string so that only `^` can fail. For anchored\n  // patterns the per-position restart below is skipped, and an empty thread\n  // list means the match has already failed.\n  gen++\n  const anchored = addThread(nlist, 0, 0, 1, 1) === 0\n\n  function testNFA (s) {\n    const len = s.length\n    gen++\n    clen = addThread(clist, 0, 0, 0, len)\n    for (let pos = 0; pos <= len; pos++) {\n      const c = pos < len ? s.charCodeAt(pos) : -1\n      gen++\n      nlen = 0\n      for (let k = 0; k < clen; k++) {\n        const pc = clist[k]\n        switch (ops[pc]) {\n          case OP_MATCH: return true\n          case OP_CHAR: if (c === cs[pc]) nlen = addThread(nlist, nlen, pc + 1, pos + 1, len); break\n          case OP_ANY: if (c !== -1 && c !== 10) nlen = addThread(nlist, nlen, pc + 1, pos + 1, len); break\n          case OP_CLASS: if (c !== -1 && matchClass(classes[pc], c)) nlen = addThread(nlist, nlen, pc + 1, pos + 1, len); break\n        }\n      }\n      if (pos < len) {\n        if (!anchored) nlen = addThread(nlist, nlen, 0, pos + 1, len)\n        else if (nlen === 0) return false\n      }\n      const tmp = clist; clist = nlist; nlist = tmp\n      clen = nlen\n    }\n    return false\n  }\n\n  // Lazy DFA on top of the NFA. A DFA state is the set of consuming\n  // instructions live at a position; transitions are computed on first use\n  // and cached per ASCII character. `^` and `$` depend on position, so the\n  // closure is taken with flags for \"at start\" and \"at end\", which gives two\n  // start states and two transition tables per state. The state count is\n  // capped; past the cap the matcher falls back to the NFA walk above, so the\n  // time bound stays linear either way.\n  const MAX_STATES = 256\n  const states = []\n  const stateIds = new Map()\n  let overflow = false\n\n  function closure (list, count, pc, atStart, atEnd) {\n    // Same walk as addThread, with the position replaced by the two flags.\n    let sp = 0\n    stack[sp++] = pc\n    while (sp > 0) {\n      const p = stack[--sp]\n      if (lastGen[p] === gen) continue\n      lastGen[p] = gen\n      switch (ops[p]) {\n        case OP_JMP: stack[sp++] = xs[p]; break\n        case OP_SPLIT: stack[sp++] = ys[p]; stack[sp++] = xs[p]; break\n        case OP_BOL: if (atStart) stack[sp++] = p + 1; break\n        case OP_EOL: if (atEnd) stack[sp++] = p + 1; break\n        default: list[count++] = p\n      }\n    }\n    return count\n  }\n\n  function internState (list, count) {\n    const pcs = Array.from(list.subarray(0, count)).sort((a, b) => a - b)\n    const key = pcs.join(',')\n    let id = stateIds.get(key)\n    if (id !== undefined) return id\n    if (states.length >= MAX_STATES) { overflow = true; return -1 }\n    id = states.length\n    let isMatch = false\n    for (let k = 0; k < pcs.length; k++) if (ops[pcs[k]] === OP_MATCH) { isMatch = true; break }\n    states.push({ pcs: Int32Array.from(pcs), isMatch, next: new Int32Array(128).fill(-2), nextEnd: new Int32Array(128).fill(-2) })\n    stateIds.set(key, id)\n    return id\n  }\n\n  function step (state, c, atEnd) {\n    gen++\n    let count = 0\n    const pcs = state.pcs\n    for (let k = 0; k < pcs.length; k++) {\n      const pc = pcs[k]\n      switch (ops[pc]) {\n        case OP_CHAR: if (c === cs[pc]) count = closure(nlist, count, pc + 1, false, atEnd); break\n        case OP_ANY: if (c !== 10) count = closure(nlist, count, pc + 1, false, atEnd); break\n        case OP_CLASS: if (matchClass(classes[pc], c)) count = closure(nlist, count, pc + 1, false, atEnd); break\n      }\n    }\n    if (!anchored) count = closure(nlist, count, 0, false, atEnd)\n    return internState(nlist, count)\n  }\n\n  let startEmpty = -2\n  let startNonEmpty = -2\n\n  function startState (atEnd) {\n    gen++\n    const count = closure(nlist, 0, 0, true, atEnd)\n    return internState(nlist, count)\n  }\n\n  function testDFA (s) {\n    const len = s.length\n    let id\n    if (len === 0) {\n      if (startEmpty === -2) startEmpty = startState(true)\n      id = startEmpty\n    } else {\n      if (startNonEmpty === -2) startNonEmpty = startState(false)\n      id = startNonEmpty\n    }\n    if (id < 0) return testNFA(s)\n    let state = states[id]\n    for (let pos = 0; pos < len; pos++) {\n      if (state.isMatch) return true\n      const c = s.charCodeAt(pos)\n      const atEnd = pos + 1 === len\n      let nid\n      if (c < 128) {\n        const table = atEnd ? state.nextEnd : state.next\n        nid = table[c]\n        if (nid === -2) { nid = step(state, c, atEnd); table[c] = nid }\n      } else {\n        nid = step(state, c, atEnd)\n      }\n      if (nid < 0) return testNFA(s)\n      state = states[nid]\n      if (anchored && state.pcs.length === 0) return false\n    }\n    return state.isMatch\n  }\n\n  return function test (s) {\n    return overflow ? testNFA(s) : testDFA(s)\n  }\n}\n\nfunction compileSafe (pattern) {\n  const prog = compileProg(parse(pattern))\n  const runner = makeRunner(prog)\n  // `__ataSafe` brands the result so the standalone serializer can tell a safe\n  // matcher apart from a RegExp and emit `__ataSafeRe(source)` instead.\n  return { test: runner, source: pattern, __ataSafe: true }\n}\n\n// True when the linear engine can represent `src`. Used by the codegen to decide\n// between the safe matcher and a JS RegExp fallback for patterns outside the\n// supported (RE2) subset (backreferences, lookaround, etc.).\nfunction patternIsSafe (src) {\n  try { compileSafe(src); return true } catch { return false }\n}\n\nmodule.exports = { compileSafe, patternIsSafe }\n";
}));
//#endregion
//#region ../node_modules/.pnpm/ata-validator@1.7.4_yaml@2.9.0/node_modules/ata-validator/lib/aot.js
var require_aot = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const { compileToJSCodegenWithErrors } = require_js_compiler();
	const SAFE_REGEX_SOURCE = require_safe_regex_source();
	const _CP_LEN_SOURCE = `function _cpLen(s) {
  const len = s.length;
  for (let i = 0; i < len; i++) {
    if (((s.charCodeAt(i) - 0xD800) >>> 0) < 0x400) {
      let n = 0; for (const _ of s) n++; return n;
    }
  }
  return len;
}`;
	let _safeRegexEmbed = null;
	function getSafeRegexEmbed() {
		if (_safeRegexEmbed === null) _safeRegexEmbed = SAFE_REGEX_SOURCE.replace(/^'use strict'\s*\n/, "").replace(/\nmodule\.exports[^\n]*\n?/, "\n").trimEnd() + "\nconst __ataSafeRe = compileSafe;";
		return _safeRegexEmbed;
	}
	function safeRePrelude(...fns) {
		return fns.some((f) => f && f._usesSafeRe) ? getSafeRegexEmbed() + "\n" : "";
	}
	function toStandalone(validator) {
		validator._ensureCompiled();
		const jsFn = validator._jsFn;
		if (!jsFn || !jsFn._source) return null;
		const src = jsFn._source;
		const hybridSrc = jsFn._hybridSource || "";
		const preambleSrc = jsFn._preambleSource || "";
		const jsErrFn = compileToJSCodegenWithErrors(typeof validator._schemaObj === "object" ? validator._schemaObj : {});
		const errSrc = jsErrFn && jsErrFn._errSource ? jsErrFn._errSource : "";
		return `// Auto-generated by ata-validator — do not edit
'use strict';
${_CP_LEN_SOURCE}
${safeRePrelude(jsFn, jsErrFn)}${preambleSrc}
const boolFn = function(d) {
  ${src}
};
const hybridFactory = function(R, E) {
  return function(d) {
    ${hybridSrc}
  };
};
${errSrc ? `const errFn = function(d, _all) {\n  ${errSrc}\n};` : "const errFn = null;"}
module.exports = { boolFn, hybridFactory, errFn };
`;
	}
	function emitFormatDecls(closures, mode, declKW) {
		if (!closures || closures.length === 0) return {
			decls: "",
			exportsSetFormats: false
		};
		if (mode === "inject") {
			let out = `${declKW} __formats = Object.create(null);\n`;
			out += `function setFormats(map) { for (const k in map) __formats[k] = map[k]; }\n`;
			for (const { name, format } of closures) {
				const key = JSON.stringify(format === null ? name.slice(4) : format);
				out += `${declKW} ${name} = function (v) { const f = __formats[${key}]; if (typeof f !== 'function') throw new Error('ata: format ' + ${key} + ' is not registered; call setFormats({ [' + ${key} + ']: fn }) before validating'); return f(v); };\n`;
			}
			return {
				decls: out,
				exportsSetFormats: true
			};
		}
		let out = "";
		for (const { name, fn, format } of closures) {
			const src = fn.toString();
			const label = format === null ? name : format;
			if (/\bcov_[A-Za-z0-9_$]+\b/.test(src)) throw new Error(`ata: custom format "${label}" is instrumented for coverage and cannot be embedded; use { formatMode: 'inject' } and register it with setFormats() at load time`);
			try {
				new Function("return (" + src + ")");
			} catch {
				throw new Error(`ata: custom format "${label}" has no standalone source (a bound function, a class method, or a native); use { formatMode: 'inject' } and register it with setFormats() at load time`);
			}
			out += `${declKW} ${name} = ${src};\n`;
		}
		return {
			decls: out,
			exportsSetFormats: false
		};
	}
	function toStandaloneModule(validator, opts) {
		validator._ensureCompiled();
		const jsFn = validator._jsFn;
		if (!jsFn || !jsFn._source) return null;
		const format = opts && opts.format || "esm";
		const abortEarly = !!(opts && opts.abortEarly);
		const source = !!(opts && opts.source);
		const sourceMap = opts && opts.sourceMap ? opts.sourceMap : null;
		const schemaFile = opts && opts.schemaFile ? opts.schemaFile : null;
		const src = jsFn._source;
		let errCore = "";
		let jsErrFn = null;
		if (!abortEarly) {
			jsErrFn = compileToJSCodegenWithErrors(typeof validator._schemaObj === "object" ? validator._schemaObj : {}, null, validator._userFormats, source && sourceMap && schemaFile ? {
				sourceMap,
				schemaFile
			} : null);
			const errSrc = jsErrFn && jsErrFn._errSource ? jsErrFn._errSource : "";
			if (errSrc) errCore = `const errFn = function(d, _all) {\n  ${errSrc}\n};\n`;
		}
		const schemaSourceConst = source && schemaFile ? `const __ATA_SCHEMA_SOURCE__ = ${JSON.stringify({ file: schemaFile })};\n` : "";
		let closureDecls = "";
		if (jsFn._closures && jsFn._closures.length > 0) {
			const lines = [];
			for (const { name, val } of jsFn._closures) {
				if (Array.isArray(val)) {
					lines.push(`const ${name} = ${JSON.stringify(val)};`);
					continue;
				}
				if (val && val.__ataSafe) lines.push(`const ${name} = __ataSafeRe(${JSON.stringify(val.source)});`);
				else if (val instanceof RegExp) {
					const flags = val.flags;
					lines.push(`const ${name} = new RegExp(${JSON.stringify(val.source)}${flags ? ", " + JSON.stringify(flags) : ""});`);
				} else if (val instanceof Set) lines.push(`const ${name} = new Set(${JSON.stringify([...val])});`);
				else if (typeof val === "function") {
					const str = val.toString();
					const m = str.match(/^function[^(]*\([^)]*\)\s*\{([\s\S]*)\}$/);
					const body = m ? m[1].trim() : str;
					lines.push(`const ${name} = function(_ppv) { ${body} };`);
				}
			}
			if (lines.length) closureDecls = lines.join("\n") + "\n";
		}
		const preambleDecls = jsFn._preambleSource ? jsFn._preambleSource + "\n" : "";
		const fmt = emitFormatDecls(jsFn._formatClosures, opts && opts.formatMode, "const");
		const formatDecls = fmt.decls;
		const validBody = errCore ? "return _fn(data) ? VALID : { valid: false, errors: errFn(data, true).errors }" : "return _fn(data) ? VALID : ABORT";
		const names = fmt.exportsSetFormats ? "validate, isValid, setFormats" : "validate, isValid";
		const exports$1 = format === "esm" ? `export { ${names} };\nexport default { ${names} };\n` : `module.exports = { ${names} };\nmodule.exports.default = module.exports;\n`;
		return `// Auto-generated by ata-validator — do not edit.
// Schema is embedded; runtime has zero dependency on ata-validator.
'use strict';
${_CP_LEN_SOURCE}
${safeRePrelude(jsFn, jsErrFn)}${schemaSourceConst}const VALID = Object.freeze({ valid: true, errors: Object.freeze([]) });
const ABORT = Object.freeze({
  valid: false,
  errors: Object.freeze([Object.freeze({
    code: 'ATA9000',
    message: 'validation failed',
    keyword: '__abort_early__',
    path: '',
  })]),
});
${closureDecls}${preambleDecls}${formatDecls}const _fn = function(d) {
  ${src}
};
${errCore}function isValid(data) { return _fn(data); }
function validate(data) { ${validBody}; }
${exports$1}`;
	}
	function bundle(Validator, schemas, opts) {
		return "'use strict';\nmodule.exports = [\n" + schemas.map((schema) => {
			const standalone = toStandalone(new Validator(schema, opts));
			if (!standalone) return "null";
			return "(function(){" + standalone.replace("'use strict';", "").replace("module.exports = ", "return ") + "})()";
		}).join(",\n") + "\n];\n";
	}
	function bundleStandalone(Validator, schemas, opts) {
		const bundleOpts = schemas.some((s) => s && typeof s === "object" && s.$id) ? {
			...opts || {},
			schemas
		} : opts || {};
		const format = opts && opts.format || "cjs";
		const R = "Object.freeze({valid:true,errors:Object.freeze([])})";
		let bundleUsesSafeRe = false;
		let bundleInjects = false;
		const fns = schemas.map((schema) => {
			const v = new Validator(schema, bundleOpts);
			v._ensureCompiled();
			const jsFn = v._jsFn;
			if (!jsFn || !jsFn._hybridSource) return "null";
			const jsErrFn = compileToJSCodegenWithErrors(typeof schema === "string" ? JSON.parse(schema) : schema, v._schemaMap, v._userFormats);
			if (jsFn._usesSafeRe || jsErrFn && jsErrFn._usesSafeRe) bundleUsesSafeRe = true;
			const errBody = jsErrFn && jsErrFn._errSource ? jsErrFn._errSource : "return{valid:false,errors:[{code:'error',path:'',message:'validation failed'}]}";
			let preamble = "";
			if (jsFn._formatClosures) {
				const f = emitFormatDecls(jsFn._formatClosures, opts && opts.formatMode, "var");
				preamble = f.decls.replace(/^var __formats = [^\n]*\n|^function setFormats[^\n]*\n/gm, "");
				if (f.exportsSetFormats) bundleInjects = true;
			}
			if (jsFn._preambleSource) preamble = preamble ? `${preamble}\n${jsFn._preambleSource}` : jsFn._preambleSource;
			if (opts && opts.verbose) {
				const schemaLit = JSON.stringify(typeof schema === "string" ? JSON.parse(schema) : schema);
				return `(function(R){${preamble}var _S=${schemaLit};function _PS(p){if(!p||p[0]!=='#')return undefined;var s=p.slice(1);if(!s)return _S;var ps=s.split('/').filter(Boolean).map(function(x){return x.replace(/~1/g,'/').replace(/~0/g,'~')});var t=_S;for(var i=0;i<ps.length-1;i++){if(t==null||typeof t!=='object')return undefined;t=t[ps[i]]}return t}var E=function(d){var _all=true;${errBody}};var _v=function(d){${jsFn._hybridSource}};return function(d){var r=_v(d);if(r&&r.valid===false&&r.errors){var es=[];for(var i=0;i<r.errors.length;i++){var e=r.errors[i];es.push(Object.assign({},e,{parentSchema:_PS(e.schemaPath)}))}return{valid:false,errors:es}}return r}})(R)`;
			}
			return `(function(R){${preamble}var E=function(d){var _all=true;${errBody}};return function(d){${jsFn._hybridSource}}})(R)`;
		});
		const arr = `[${fns.join(",")}]`;
		const safeEmbed = bundleUsesSafeRe ? getSafeRegexEmbed() + "\n" : "";
		const registry = bundleInjects ? `var __formats=Object.create(null);\nfunction setFormats(map){for(var k in map)__formats[k]=map[k]}\n` : "";
		if (format === "esm") return `// Auto-generated by ata-validator — do not edit\n${safeEmbed}${registry}const R=${R};\nconst validators=${arr};\nexport default validators;\n${bundleInjects ? "export { validators, setFormats };" : "export { validators };"}\n`;
		const attach = bundleInjects ? "module.exports.setFormats=setFormats;\n" : "";
		return `'use strict';\n${safeEmbed}${registry}var R=${R};\nmodule.exports=[${fns.join(",")}];\n${attach}`;
	}
	function bundleCompact(Validator, schemas, opts) {
		const bundleOpts = schemas.some((s) => s && typeof s === "object" && s.$id) ? {
			...opts || {},
			schemas
		} : opts || {};
		const format = opts && opts.format || "cjs";
		let bundleUsesSafeRe = false;
		const entries = schemas.map((schema) => {
			const v = new Validator(schema, bundleOpts);
			v._ensureCompiled();
			const jsFn = v._jsFn;
			if (!jsFn || !jsFn._hybridSource) return null;
			const jsErrFn = compileToJSCodegenWithErrors(typeof schema === "string" ? JSON.parse(schema) : schema, v._schemaMap, v._userFormats);
			if (jsFn._usesSafeRe || jsErrFn && jsErrFn._usesSafeRe) bundleUsesSafeRe = true;
			return {
				hybrid: jsFn._preambleSource ? `${jsFn._preambleSource}\n${jsFn._hybridSource}` : jsFn._hybridSource,
				err: jsErrFn && jsErrFn._errSource ? jsErrFn._errSource : null,
				fmt: jsFn._formatClosures || null
			};
		});
		const bodyMap = /* @__PURE__ */ new Map();
		const bodies = [];
		const errMap = /* @__PURE__ */ new Map();
		const errBodies = [];
		const indices = entries.map((e) => {
			if (!e) return [-1, -1];
			let hi = bodyMap.get(e.hybrid);
			if (hi === void 0) {
				hi = bodies.length;
				bodies.push(e.hybrid);
				bodyMap.set(e.hybrid, hi);
			}
			let ei = -1;
			if (e.err) {
				ei = errMap.get(e.err);
				if (ei === void 0) {
					ei = errBodies.length;
					errBodies.push(e.err);
					errMap.set(e.err, ei);
				}
			}
			return [hi, ei];
		});
		const isEsm = format === "esm";
		let out = isEsm ? "// Auto-generated by ata-validator — do not edit\n" : "'use strict';\n";
		if (bundleUsesSafeRe) out += getSafeRegexEmbed() + "\n";
		const declKW = isEsm ? "const" : "var";
		out += `${declKW} R=Object.freeze({valid:true,errors:Object.freeze([])});\n`;
		const fmtSeen = /* @__PURE__ */ new Set();
		const fmtAll = [];
		for (const e of entries) {
			if (!e || !e.fmt) continue;
			for (const entry of e.fmt) {
				if (fmtSeen.has(entry.name)) continue;
				fmtSeen.add(entry.name);
				fmtAll.push(entry);
			}
		}
		const fmtOut = emitFormatDecls(fmtAll, opts && opts.formatMode, declKW);
		out += fmtOut.decls;
		out += `${declKW} H=[\n`;
		out += bodies.map((b) => `function(R,E){return function(d){${b}}}`).join(",\n");
		out += "\n];\n";
		out += `${declKW} EF=[\n`;
		out += errBodies.map((b) => `function(d){var _all=true;${b}}`).join(",\n");
		out += "\n];\n";
		const arrBody = indices.map(([hi, ei]) => {
			if (hi < 0) return "null";
			if (ei >= 0) return `H[${hi}](R,EF[${ei}])`;
			return `H[${hi}](R,function(){return{valid:false,errors:[]}})`;
		}).join(",");
		if (isEsm) out += `const validators=[${arrBody}];\nexport default validators;\nexport { validators${fmtOut.exportsSetFormats ? ", setFormats" : ""} };\n`;
		else {
			out += `module.exports=[${arrBody}];\n`;
			if (fmtOut.exportsSetFormats) out += "module.exports.setFormats=setFormats;\n";
		}
		return out;
	}
	function loadBundle(Validator, mods, schemas, opts) {
		return schemas.map((schema, i) => {
			if (mods[i]) return Validator.fromStandalone(mods[i], schema, opts);
			return new Validator(schema, opts);
		});
	}
	module.exports = {
		toStandalone,
		toStandaloneModule,
		bundle,
		bundleStandalone,
		bundleCompact,
		loadBundle
	};
}));
//#endregion
//#region ../node_modules/.pnpm/ata-validator@1.7.4_yaml@2.9.0/node_modules/ata-validator/lib/ts-gen.js
var require_ts_gen = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	function renderValueType(schema, defs, depth = 0) {
		if (depth > 32) return "unknown";
		if (schema === true) return "unknown";
		if (schema === false) return "never";
		if (typeof schema !== "object" || schema === null) return "unknown";
		if (schema.$ref) {
			const m = schema.$ref.match(/^#\/(?:\$defs|definitions)\/(.+)$/);
			if (m && defs && defs[m[1]]) return toTypeName(m[1]);
			return "unknown";
		}
		if (schema.const !== void 0) return renderLiteral(schema.const);
		if (Array.isArray(schema.enum)) return schema.enum.map(renderLiteral).join(" | ") || "never";
		if (Array.isArray(schema.oneOf)) return schema.oneOf.map((s) => renderValueType(s, defs, depth + 1)).join(" | ") || "unknown";
		if (Array.isArray(schema.anyOf)) return schema.anyOf.map((s) => renderValueType(s, defs, depth + 1)).join(" | ") || "unknown";
		const t = schema.type;
		if (Array.isArray(t)) return t.map((tt) => renderValueType({
			...schema,
			type: tt
		}, defs, depth + 1)).join(" | ");
		if (t === "string") return "string";
		if (t === "number" || t === "integer") return "number";
		if (t === "boolean") return "boolean";
		if (t === "null") return "null";
		if (t === "array") {
			const items = schema.items;
			const prefix = Array.isArray(schema.prefixItems) ? schema.prefixItems : null;
			if (prefix) {
				const prefixTypes = prefix.map((s) => renderValueType(s, defs, depth + 1));
				const minItems = typeof schema.minItems === "number" ? schema.minItems : 0;
				const elements = prefixTypes.map((t, i) => i < minItems ? t : `${t}?`);
				if (items === false) return `[${elements.join(", ")}]`;
				if (items === void 0 || items === true) return `[${elements.join(", ")}, ...unknown[]]`;
				if (typeof items === "object" && items !== null) {
					const rest = renderValueType(items, defs, depth + 1);
					const restType = rest.includes(" | ") ? `(${rest})` : rest;
					return `[${elements.join(", ")}, ...${restType}[]]`;
				}
			}
			if (items === false) return "never[]";
			if (items === void 0 || items === true) return "unknown[]";
			const inner = renderValueType(items, defs, depth + 1);
			return inner.includes(" | ") ? `Array<${inner}>` : `${inner}[]`;
		}
		if (t === "object" || !t && schema.properties) return renderObject(schema, defs, depth + 1);
		return "unknown";
	}
	function renderObject(schema, defs, depth) {
		const props = schema.properties || {};
		const required = new Set(schema.required || []);
		const keys = Object.keys(props);
		if (keys.length === 0) {
			if (schema.additionalProperties === false) return "Record<string, never>";
			const ap = schema.additionalProperties;
			if (ap && typeof ap === "object") return `Record<string, ${renderValueType(ap, defs, depth + 1)}>`;
			return "Record<string, unknown>";
		}
		const lines = keys.map((k) => {
			const t = renderValueType(props[k], defs, depth + 1);
			const opt = required.has(k) ? "" : "?";
			const safeKey = /^[A-Za-z_$][\w$]*$/.test(k) ? k : JSON.stringify(k);
			return `${renderJsDoc(props[k], "  ")}  ${safeKey}${opt}: ${t};`;
		});
		const extra = schema.additionalProperties;
		if (extra && typeof extra === "object") {
			const widen = /* @__PURE__ */ new Set();
			widen.add(renderValueType(extra, defs, depth + 1));
			let hasOptional = false;
			for (const k of keys) {
				widen.add(renderValueType(props[k], defs, depth + 1));
				if (!required.has(k)) hasOptional = true;
			}
			if (hasOptional) widen.add("undefined");
			const indexType = widen.has("unknown") ? "unknown" : Array.from(widen).join(" | ");
			lines.push(`  [key: string]: ${indexType};`);
		} else if (extra !== false) lines.push(`  [key: string]: unknown;`);
		return `{\n${lines.join("\n")}\n}`;
	}
	function renderLiteral(v) {
		if (v === null) return "null";
		if (typeof v === "string") return JSON.stringify(v);
		if (typeof v === "number" || typeof v === "boolean") return String(v);
		return "unknown";
	}
	function toTypeName(name) {
		const cleaned = String(name).replace(/[^A-Za-z0-9_]/g, "_");
		if (cleaned === "") return "_Anon";
		if (/^[0-9]/.test(cleaned)) return `_${cleaned}`;
		return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
	}
	function renderJsDoc(schema, indent) {
		if (!schema || typeof schema !== "object") return "";
		let description = "";
		if (typeof schema.description === "string" && schema.description.length > 0) description = schema.description.replace(/\*\//g, "* /");
		const tags = [];
		for (const k of [
			"minLength",
			"maxLength",
			"minItems",
			"maxItems",
			"minProperties",
			"maxProperties",
			"minimum",
			"maximum",
			"exclusiveMinimum",
			"exclusiveMaximum",
			"multipleOf"
		]) if (typeof schema[k] === "number") tags.push(`@${k} ${schema[k]}`);
		if (typeof schema.pattern === "string") tags.push(`@pattern ${schema.pattern}`);
		if (typeof schema.format === "string") tags.push(`@format ${schema.format}`);
		if (schema.uniqueItems === true) tags.push("@uniqueItems");
		if (schema.deprecated === true) tags.push("@deprecated");
		if (schema.default !== void 0) try {
			tags.push(`@default ${JSON.stringify(schema.default)}`);
		} catch (_) {}
		if (Array.isArray(schema.examples) && schema.examples.length > 0) try {
			tags.push(`@example ${JSON.stringify(schema.examples[0])}`);
		} catch (_) {}
		if (description === "" && tags.length === 0) return "";
		if (description !== "" && tags.length === 0) return `${indent}/** ${description} */\n`;
		const lines = [`${indent}/**`];
		if (description !== "") lines.push(`${indent} * ${description}`);
		if (description !== "" && tags.length > 0) lines.push(`${indent} *`);
		for (const t of tags) lines.push(`${indent} * ${t}`);
		lines.push(`${indent} */`);
		return lines.join("\n") + "\n";
	}
	function toTypeScript(schema, opts) {
		const rootName = toTypeName((opts || {}).name || "Data");
		const defs = schema && (schema.$defs || schema.definitions);
		const defLines = [];
		if (defs && typeof defs === "object") for (const [defName, defSchema] of Object.entries(defs)) {
			const body = renderValueType(defSchema, defs, 0);
			defLines.push(`export type ${toTypeName(defName)} = ${body};`);
		}
		const rootType = renderValueType(schema, defs, 0);
		const rootDoc = renderJsDoc(schema, "");
		const rootDecl = rootType.startsWith("{") && rootType.endsWith("}") && !rootType.includes(" | ") ? `${rootDoc}export interface ${rootName} ${rootType}` : `${rootDoc}export type ${rootName} = ${rootType};`;
		return `// Auto-generated by ata-validator — do not edit.
${defLines.length ? defLines.join("\n\n") + "\n\n" : ""}${rootDecl}

export interface ValidationError {
  keyword?: string;
  instancePath?: string;
  schemaPath?: string;
  params?: Record<string, unknown>;
  message?: string;
}

export interface ValidResult {
  valid: true;
  errors: readonly never[];
}
export interface InvalidResult {
  valid: false;
  errors: readonly ValidationError[];
}
export type Result = ValidResult | InvalidResult;

export declare function isValid(data: unknown): data is ${rootName};
export declare function validate(data: unknown): Result;
declare const _default: { validate: typeof validate; isValid: typeof isValid };
export default _default;
`;
	}
	module.exports = { toTypeScript };
}));
//#endregion
//#region ../node_modules/.pnpm/ata-validator@1.7.4_yaml@2.9.0/node_modules/ata-validator/lib/render-shared.js
var require_render_shared = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const ANSI = {
		reset: "\x1B[0m",
		bold: "\x1B[1m",
		dim: "\x1B[2m",
		red: "\x1B[31m",
		yellow: "\x1B[33m",
		cyan: "\x1B[36m"
	};
	function resolveColor(opt) {
		if (opt === "never") return false;
		if (opt === "always") return true;
		if (process.env.NO_COLOR != null && process.env.NO_COLOR !== "") return false;
		const fc = process.env.FORCE_COLOR;
		if (fc === "1" || fc === "2" || fc === "3" || fc === "true") return true;
		return !!(process.stdout && process.stdout.isTTY);
	}
	function color(enabled, code, s) {
		return enabled ? code + s + ANSI.reset : s;
	}
	function pathToDotted(jsonPointer) {
		if (!jsonPointer || jsonPointer === "/") return "body";
		const parts = jsonPointer.replace(/^\//, "").split("/").map((s) => s.replace(/~1/g, "/").replace(/~0/g, "~"));
		let out = "body";
		for (const p of parts) if (/^[0-9]+$/.test(p)) out += "[" + p + "]";
		else if (/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(p)) out += "." + p;
		else out += "[" + JSON.stringify(p) + "]";
		return out;
	}
	function trimCwd(file, cwd) {
		if (!file) return file;
		const c = cwd || process.cwd();
		if (file.startsWith(c + "/")) return file.slice(c.length + 1);
		return file;
	}
	function truncateLine(text, maxWidth) {
		if (!text || text.length <= maxWidth) return text;
		return text.slice(0, maxWidth - 1) + "…";
	}
	function terminalWidth() {
		const w = process.stdout && process.stdout.columns;
		return typeof w === "number" && w > 0 ? w : 100;
	}
	module.exports = {
		ANSI,
		resolveColor,
		color,
		pathToDotted,
		trimCwd,
		truncateLine,
		terminalWidth
	};
}));
//#endregion
//#region ../node_modules/.pnpm/ata-validator@1.7.4_yaml@2.9.0/node_modules/ata-validator/lib/render-pretty.js
var require_render_pretty = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const { color, ANSI, resolveColor, trimCwd, truncateLine, terminalWidth } = require_render_shared();
	function caretLine(col, length, gutter) {
		const pad = " ".repeat(gutter);
		const lead = " ".repeat(Math.max(0, col - 1));
		const carets = "^".repeat(Math.max(1, length || 1));
		return pad + "| " + lead + carets;
	}
	function renderOne(err, useColor, opts) {
		const lines = [];
		const cwd = opts.cwd;
		const width = terminalWidth();
		const gutter = 3;
		const headline = `${err.message}`;
		lines.push(color(useColor, ANSI.red + ANSI.bold, `error[${err.code}]: `) + headline);
		if (err.schemaSource) {
			const f = trimCwd(err.schemaSource.file, cwd);
			lines.push(`  --> ${color(useColor, ANSI.cyan, `${f}:${err.schemaSource.line}:${err.schemaSource.col}`)}`);
			lines.push("   |");
			const ln = String(err.schemaSource.line).padStart(2, " ");
			const srcText = truncateLine(err.schemaSource.text, width - 8);
			lines.push(` ${ln} | ${srcText}`);
			const inlineHint = err.expected ? "  " + color(useColor, ANSI.dim, `expected ${err.expected}`) : "";
			lines.push(caretLine(err.schemaSource.col, 1, gutter) + inlineHint);
			lines.push("   |");
		}
		if (err.dataFrame) {
			lines.push(`  --> ${color(useColor, ANSI.dim, `input, byte ${err.dataFrame.byteOffset}`)}`);
			lines.push("   |");
			const ln = String(err.dataFrame.line).padStart(2, " ");
			const srcText = truncateLine(err.dataFrame.text, width - 8);
			lines.push(` ${ln} | ${srcText}`);
			const got = err.received != null ? "  " + color(useColor, ANSI.dim, `got ${err.received}`) : "";
			lines.push(caretLine(err.dataFrame.col, err.dataFrame.length, gutter) + got);
			lines.push("   |");
		}
		if (err.suggestion) lines.push("   = " + color(useColor, ANSI.yellow, "help: ") + err.suggestion.text);
		if (err.branchErrors && err.branchErrors.length) {
			const variant = err.params && err.params.closestName || "closest variant";
			const n = err.branchErrors.length;
			lines.push("   = " + color(useColor, ANSI.dim, "note: ") + `closest match was ${variant} with ${n} error${n === 1 ? "" : "s"}:`);
			renderBranchErrors(err.branchErrors, 1, lines, useColor);
		}
		if (err.docUrl) lines.push("   = " + color(useColor, ANSI.dim, "note: see ") + err.docUrl);
		return lines.join("\n");
	}
	function renderBranchErrors(subs, depth, lines, useColor) {
		if (depth >= 3) {
			lines.push("       " + color(useColor, ANSI.dim, "... deeper branch errors omitted, see structured output"));
			return;
		}
		const max = 3;
		const shown = subs.slice(0, max);
		for (const sub of shown) {
			lines.push("       " + color(useColor, ANSI.dim, `${sub.keyword}: ${sub.message || ""}`));
			if (sub.branchErrors && sub.branchErrors.length) renderBranchErrors(sub.branchErrors, depth + 1, lines, useColor);
		}
		if (subs.length > max) lines.push("       " + color(useColor, ANSI.dim, `... and ${subs.length - max} more`));
	}
	function renderPretty(errors, opts) {
		if (!Array.isArray(errors) || errors.length === 0) return "";
		opts = opts || {};
		const useColor = resolveColor(opts.color || "auto");
		const maxErrors = opts.maxErrors != null ? opts.maxErrors : 20;
		const context = opts.context || "input";
		const blocks = [];
		const limit = maxErrors === 0 ? errors.length : Math.min(maxErrors, errors.length);
		for (let i = 0; i < limit; i++) blocks.push(renderOne(errors[i], useColor, opts));
		let out = blocks.join("\n\n");
		if (limit < errors.length) out += `\n\n... and ${errors.length - limit} more errors (run with --pretty --max-errors=0 to see all)`;
		const n = errors.length;
		out += `\n\n` + color(useColor, ANSI.red + ANSI.bold, `error: `) + `${n} schema violation${n === 1 ? "" : "s"} in ${context}`;
		return out;
	}
	module.exports = { renderPretty };
}));
//#endregion
//#region ../node_modules/.pnpm/ata-validator@1.7.4_yaml@2.9.0/node_modules/ata-validator/lib/render-compact.js
var require_render_compact = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const { color, ANSI, resolveColor, pathToDotted, trimCwd } = require_render_shared();
	function renderCompact(errors, opts) {
		if (!Array.isArray(errors) || errors.length === 0) return "";
		opts = opts || {};
		const useColor = resolveColor(opts.color || "auto");
		const cwd = opts.cwd;
		const lines = [];
		for (const err of errors) {
			let prefix = "";
			if (err.schemaSource) {
				const f = trimCwd(err.schemaSource.file, cwd);
				prefix = color(useColor, ANSI.cyan, `${f}:${err.schemaSource.line}:${err.schemaSource.col}`) + " - ";
			}
			const codeStr = color(useColor, ANSI.red + ANSI.bold, `error ${err.code}`);
			const pathStr = color(useColor, ANSI.cyan, pathToDotted(err.path));
			const got = err.received != null ? `got ${err.received}` : "";
			const sugg = err.suggestion ? color(useColor, ANSI.yellow, `, ${err.suggestion.text}`) : "";
			const tail = got || sugg ? ` (${got}${sugg})` : "";
			lines.push(`${prefix}${codeStr}: ${pathStr} ${err.message}${tail}`);
		}
		const n = errors.length;
		lines.push("");
		lines.push(`Found ${n} error${n === 1 ? "" : "s"} in ${opts.context || "input"}.`);
		if (!(process.stdout && process.stdout.isTTY)) lines.push("(run with --pretty for source frames)");
		return lines.join("\n");
	}
	module.exports = { renderCompact };
}));
//#endregion
//#region ../node_modules/.pnpm/ata-validator@1.7.4_yaml@2.9.0/node_modules/ata-validator/lib/render-json.js
var require_render_json = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	function renderJSON(errors, opts) {
		opts = opts || {};
		const payload = {
			errors: Array.isArray(errors) ? errors : [],
			summary: {
				count: Array.isArray(errors) ? errors.length : 0,
				context: opts.context || "input"
			}
		};
		return opts.pretty ? JSON.stringify(payload, null, 2) : JSON.stringify(payload);
	}
	module.exports = { renderJSON };
}));
//#endregion
//#region ../node_modules/.pnpm/ata-validator@1.7.4_yaml@2.9.0/node_modules/ata-validator/index.js
var require_ata_validator = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const native = require_native_load_browser()();
	const { compileToJS, compileToJSCodegen, compileToJSCodegenWithErrors, compileToJSCombined } = require_js_compiler();
	const { normalizeDraft7, normalizeNullable, stripFormatAssertions } = require_draft7();
	const { isV1Dialect } = require_dialect();
	const { classify } = require_shape_classifier();
	const { buildTier0Plan, tier0Validate } = require_tier0();
	function buildDefaultsApplier(schema) {
		if (typeof schema !== "object" || schema === null) return null;
		const actions = [];
		collectDefaults(schema, actions);
		if (actions.length === 0) return null;
		return (data) => {
			for (let i = 0; i < actions.length; i++) actions[i](data);
		};
	}
	function collectDefaults(schema, actions, path) {
		if (typeof schema !== "object" || schema === null) return;
		const props = schema.properties;
		if (!props) return;
		for (const [key, prop] of Object.entries(props)) {
			if (prop && typeof prop === "object" && prop.default !== void 0) {
				const defaultVal = prop.default;
				if (!path) actions.push((data) => {
					if (typeof data === "object" && data !== null && !(key in data)) data[key] = typeof defaultVal === "object" && defaultVal !== null ? JSON.parse(JSON.stringify(defaultVal)) : defaultVal;
				});
				else {
					const parentPath = path;
					actions.push((data) => {
						let target = data;
						for (let j = 0; j < parentPath.length; j++) {
							if (typeof target !== "object" || target === null) return;
							target = target[parentPath[j]];
						}
						if (typeof target === "object" && target !== null && !(key in target)) target[key] = typeof defaultVal === "object" && defaultVal !== null ? JSON.parse(JSON.stringify(defaultVal)) : defaultVal;
					});
				}
			}
			if (prop && typeof prop === "object" && prop.properties) collectDefaults(prop, actions, (path || []).concat(key));
		}
	}
	function buildCoercer(schema) {
		if (typeof schema !== "object" || schema === null) return null;
		const actions = [];
		collectCoercions(schema, actions);
		if (actions.length === 0) return null;
		return (data) => {
			for (let i = 0; i < actions.length; i++) actions[i](data);
		};
	}
	function collectCoercions(schema, actions, path) {
		if (typeof schema !== "object" || schema === null) return;
		const props = schema.properties;
		if (!props) return;
		for (const [key, prop] of Object.entries(props)) {
			if (!prop || typeof prop !== "object" || !prop.type) continue;
			const targetType = Array.isArray(prop.type) ? null : prop.type;
			if (!targetType) continue;
			const coerce = buildSingleCoercion(targetType);
			if (!coerce) continue;
			if (!path) actions.push((data) => {
				if (typeof data === "object" && data !== null && key in data) {
					const coerced = coerce(data[key]);
					if (coerced !== void 0) data[key] = coerced;
				}
			});
			else {
				const parentPath = path;
				actions.push((data) => {
					let target = data;
					for (let j = 0; j < parentPath.length; j++) {
						if (typeof target !== "object" || target === null) return;
						target = target[parentPath[j]];
					}
					if (typeof target === "object" && target !== null && key in target) {
						const coerced = coerce(target[key]);
						if (coerced !== void 0) target[key] = coerced;
					}
				});
			}
			if (prop.properties) collectCoercions(prop, actions, (path || []).concat(key));
		}
	}
	function buildSingleCoercion(targetType) {
		switch (targetType) {
			case "number": return (v) => {
				if (typeof v === "string") {
					const n = Number(v);
					if (v !== "" && !isNaN(n)) return n;
				}
				if (typeof v === "boolean") return v ? 1 : 0;
			};
			case "integer": return (v) => {
				if (typeof v === "string") {
					const n = Number(v);
					if (v !== "" && Number.isInteger(n)) return n;
				}
				if (typeof v === "boolean") return v ? 1 : 0;
			};
			case "string": return (v) => {
				if (typeof v === "number" || typeof v === "boolean") return String(v);
			};
			case "boolean": return (v) => {
				if (v === "true" || v === "1") return true;
				if (v === "false" || v === "0") return false;
			};
			default: return null;
		}
	}
	function buildRemover(schema) {
		if (typeof schema !== "object" || schema === null) return null;
		const actions = [];
		collectRemovals(schema, actions);
		if (actions.length === 0) return null;
		return (data) => {
			for (let i = 0; i < actions.length; i++) actions[i](data);
		};
	}
	function collectRemovals(schema, actions, path) {
		if (typeof schema !== "object" || schema === null || !schema.properties) return;
		if (schema.additionalProperties === false) {
			const allowed = new Set(Object.keys(schema.properties));
			if (!path) actions.push((data) => {
				if (typeof data !== "object" || data === null || Array.isArray(data)) return;
				const keys = Object.keys(data);
				for (let i = 0; i < keys.length; i++) if (!allowed.has(keys[i])) delete data[keys[i]];
			});
			else {
				const parentPath = path;
				actions.push((data) => {
					let target = data;
					for (let j = 0; j < parentPath.length; j++) {
						if (typeof target !== "object" || target === null) return;
						target = target[parentPath[j]];
					}
					if (typeof target !== "object" || target === null || Array.isArray(target)) return;
					const keys = Object.keys(target);
					for (let i = 0; i < keys.length; i++) if (!allowed.has(keys[i])) delete target[keys[i]];
				});
			}
		}
		for (const [key, prop] of Object.entries(schema.properties)) if (prop && typeof prop === "object" && prop.properties) collectRemovals(prop, actions, (path || []).concat(key));
	}
	function buildPreprocessCodegen(schema, options) {
		if (typeof schema !== "object" || schema === null || !schema.properties) return null;
		const lines = [];
		const props = schema.properties;
		const keys = Object.keys(props);
		if (options.removeAdditional && schema.additionalProperties === false) {
			const checks = keys.map((k) => `_k!==${JSON.stringify(k)}`).join("&&");
			lines.push(`for(var _k in d)if(${checks})delete d[_k]`);
		}
		if (options.coerceTypes) for (const [key, prop] of Object.entries(props)) {
			if (!prop || typeof prop !== "object" || !prop.type) continue;
			const t = Array.isArray(prop.type) ? null : prop.type;
			if (!t) continue;
			const k = JSON.stringify(key);
			if (t === "integer") {
				lines.push(`if(typeof d[${k}]==='string'){var _n=Number(d[${k}]);if(d[${k}]!==''&&Number.isInteger(_n))d[${k}]=_n}`);
				lines.push(`if(typeof d[${k}]==='boolean')d[${k}]=d[${k}]?1:0`);
			} else if (t === "number") {
				lines.push(`if(typeof d[${k}]==='string'){var _n=Number(d[${k}]);if(d[${k}]!==''&&!isNaN(_n))d[${k}]=_n}`);
				lines.push(`if(typeof d[${k}]==='boolean')d[${k}]=d[${k}]?1:0`);
			} else if (t === "string") lines.push(`if(typeof d[${k}]==='number'||typeof d[${k}]==='boolean')d[${k}]=String(d[${k}])`);
			else if (t === "boolean") {
				lines.push(`if(d[${k}]==='true'||d[${k}]==='1')d[${k}]=true`);
				lines.push(`if(d[${k}]==='false'||d[${k}]==='0')d[${k}]=false`);
			} else if (t === "array" && options.coerceTypes === "array") lines.push(`if(${k} in d&&d[${k}]!==undefined&&!Array.isArray(d[${k}]))d[${k}]=[d[${k}]]`);
		}
		if (options.useDefaults !== false) {
			for (const [key, prop] of Object.entries(props)) if (prop && typeof prop === "object" && prop.default !== void 0) {
				const k = JSON.stringify(key);
				const def = JSON.stringify(prop.default);
				lines.push(`if(!(${k} in d))d[${k}]=${def}`);
			}
		}
		if (lines.length === 0) return null;
		lines.unshift(`if(d===null||typeof d!=='object')return`);
		try {
			return new Function("d", lines.join("\n"));
		} catch {
			return null;
		}
	}
	let _codegenAvailable = null;
	function codegenAvailable() {
		if (_codegenAvailable === null) try {
			_codegenAvailable = new Function("return 1")() === 1;
		} catch {
			_codegenAvailable = false;
		}
		return _codegenAvailable;
	}
	const _compileCache = /* @__PURE__ */ new Map();
	const _identityCache = /* @__PURE__ */ new WeakMap();
	const SIMDJSON_PADDING = 64;
	const VALID_RESULT = Object.freeze({
		valid: true,
		errors: Object.freeze([])
	});
	const ABORT_EARLY_RESULT = Object.freeze({
		valid: false,
		errors: Object.freeze([Object.freeze({
			code: "ATA9000",
			message: "validation failed",
			keyword: "__abort_early__",
			path: ""
		})])
	});
	var LazyRejection = class {
		constructor(build, data) {
			this.valid = false;
			this._build = build;
			this._data = data;
			this._errors = null;
		}
		toJSON() {
			return {
				valid: false,
				errors: this.errors
			};
		}
	};
	Object.defineProperty(LazyRejection.prototype, "errors", {
		enumerable: true,
		configurable: true,
		get() {
			if (this._errors === null) this._errors = this._build(this._data);
			return this._errors;
		}
	});
	const SIMDJSON_THRESHOLD = 8192;
	function resolveSchemaByPath(rootSchema, schemaPath) {
		if (!schemaPath || typeof schemaPath !== "string" || !schemaPath.startsWith("#")) return;
		const stripped = schemaPath.slice(1);
		if (!stripped || stripped === "/") return rootSchema;
		const parts = stripped.split("/").filter(Boolean).map((s) => s.replace(/~1/g, "/").replace(/~0/g, "~"));
		let target = rootSchema;
		for (let i = 0; i < parts.length - 1; i++) {
			if (target == null || typeof target !== "object") return void 0;
			target = target[parts[i]];
		}
		return target;
	}
	function schemaOrderRank(rootSchema, schemaPath) {
		if (!schemaPath || typeof schemaPath !== "string" || !schemaPath.startsWith("#")) return null;
		const parts = schemaPath.slice(1).split("/").filter(Boolean).map((s) => s.replace(/~1/g, "/").replace(/~0/g, "~"));
		const rank = [];
		let node = rootSchema;
		for (const seg of parts) {
			if (node == null || typeof node !== "object") break;
			if (Array.isArray(node)) {
				const idx = Number(seg);
				if (!Number.isInteger(idx) || idx < 0 || idx >= node.length) break;
				rank.push(idx);
				node = node[idx];
			} else {
				const idx = Object.keys(node).indexOf(seg);
				if (idx < 0) break;
				rank.push(idx);
				node = node[seg];
			}
		}
		return rank;
	}
	function sortErrorsBySchemaOrder(rootSchema, errors) {
		const ranked = errors.map((e, i) => ({
			e,
			i,
			rank: schemaOrderRank(rootSchema, e.schemaPath)
		}));
		ranked.sort((a, b) => {
			if (!a.rank || !b.rank) return a.i - b.i;
			const n = Math.min(a.rank.length, b.rank.length);
			for (let k = 0; k < n; k++) if (a.rank[k] !== b.rank[k]) return a.rank[k] - b.rank[k];
			return a.i - b.i;
		});
		return ranked.map((r) => r.e);
	}
	function parsePointerPath(path) {
		if (!path) return [];
		return path.split("/").filter(Boolean).map((seg) => {
			const decoded = seg.replace(/~1/g, "/").replace(/~0/g, "~");
			if (/^(0|[1-9][0-9]*)$/.test(decoded)) return { key: Number(decoded) };
			return { key: decoded };
		});
	}
	function createPaddedBuffer(jsonStr) {
		if (typeof Buffer === "undefined") throw new Error("createPaddedBuffer requires Node.js Buffer");
		const jsonBuf = Buffer.from(jsonStr);
		const padded = Buffer.allocUnsafe(jsonBuf.length + SIMDJSON_PADDING);
		jsonBuf.copy(padded);
		padded.fill(0, jsonBuf.length);
		return {
			buffer: padded,
			length: jsonBuf.length
		};
	}
	function _deepCloneWithSymbols(v) {
		if (v === null || typeof v !== "object") return v;
		if (Array.isArray(v)) {
			const a = new Array(v.length);
			for (let i = 0; i < v.length; i++) a[i] = _deepCloneWithSymbols(v[i]);
			return a;
		}
		if (Object.getPrototypeOf(v) !== Object.prototype && Object.getPrototypeOf(v) !== null) return v;
		const out = Object.create(null);
		for (const k of Object.keys(v)) Object.defineProperty(out, k, {
			value: _deepCloneWithSymbols(v[k]),
			writable: true,
			enumerable: true,
			configurable: true
		});
		for (const sym of Object.getOwnPropertySymbols(v)) out[sym] = v[sym];
		return Object.setPrototypeOf(out, Object.prototype);
	}
	function _normalizeCallerSchema(s, inheritDraft7) {
		const needsDraft7 = s && typeof s === "object" && s.$schema !== void 0 ? s.$schema === "http://json-schema.org/draft-07/schema#" || s.$schema === "http://json-schema.org/draft-07/schema" : !!inheritDraft7;
		const str = JSON.stringify(s);
		const copy = _deepCloneWithSymbols(s);
		if (needsDraft7) normalizeDraft7(copy, true);
		normalizeNullable(copy);
		return JSON.stringify(copy) === str ? s : copy;
	}
	function declaredId(original, normalized) {
		const n = normalized && typeof normalized === "object" ? normalized.$id : void 0;
		if (typeof n === "string" && n !== "") return n;
		const o = original && typeof original === "object" ? original.$id : void 0;
		if (typeof o === "string" && o !== "" && o[0] !== "#") return o;
	}
	function buildSchemaMap(schemas, inheritDraft7) {
		if (!schemas) return null;
		const map = /* @__PURE__ */ new Map();
		if (Array.isArray(schemas)) for (const s of schemas) {
			const normalized = _normalizeCallerSchema(s, inheritDraft7);
			const id = declaredId(s, normalized);
			if (!id) throw new Error("Schema in schemas option must have $id");
			map.set(id, normalized);
		}
		else for (const [key, s] of Object.entries(schemas)) {
			const normalized = _normalizeCallerSchema(s, inheritDraft7);
			map.set(key, normalized);
			const id = declaredId(s, normalized);
			if (id && id !== key) map.set(id, normalized);
		}
		return map;
	}
	function compileCacheKey(schemaStr, schemaMap) {
		if (!schemaMap || schemaMap.size === 0) return schemaStr;
		const parts = [];
		for (const [id, s] of schemaMap) parts.push(id + "=" + JSON.stringify(s));
		parts.sort();
		return schemaStr + "\0" + parts.join("\0");
	}
	function resolveRefForPreprocess(ref, schemaMap) {
		if (!schemaMap || schemaMap.size === 0 || typeof ref !== "string") return null;
		const hashIdx = ref.indexOf("#");
		const baseId = hashIdx >= 0 ? ref.slice(0, hashIdx) : ref;
		const fragment = hashIdx >= 0 ? ref.slice(hashIdx + 1) : "";
		if (!baseId) return null;
		let base = null;
		if (schemaMap.has(baseId)) base = schemaMap.get(baseId);
		else if (!ref.includes("://")) {
			for (const [id, s] of schemaMap) if (id.endsWith("/" + baseId)) {
				base = s;
				break;
			}
		}
		if (!base) return null;
		if (!fragment) return base;
		let target = base;
		for (const part of fragment.split("/")) {
			if (part === "") continue;
			if (target == null || typeof target !== "object") return null;
			target = target[part.replace(/~1/g, "/").replace(/~0/g, "~")];
		}
		return target == null ? null : target;
	}
	function resolveSchemaForPreprocess(schema, schemaMap) {
		if (!schema || typeof schema !== "object" || !schemaMap || schemaMap.size === 0) return schema;
		let s = schema;
		if (s.$ref && !s.properties) {
			const t = resolveRefForPreprocess(s.$ref, schemaMap);
			if (t && typeof t === "object") s = t;
		}
		if (!s.properties) return s;
		let cloned = null;
		for (const key of Object.keys(s.properties)) {
			const p = s.properties[key];
			if (p && typeof p === "object" && p.$ref && !p.type) {
				const t = resolveRefForPreprocess(p.$ref, schemaMap);
				if (t && typeof t === "object") {
					if (!cloned) {
						cloned = Object.assign({}, s);
						cloned.properties = Object.assign({}, s.properties);
					}
					cloned.properties[key] = t;
				}
			}
		}
		return cloned || s;
	}
	var Validator = class Validator {
		constructor(schema, opts) {
			const options = opts || {};
			if (!opts && typeof schema === "object" && schema !== null) {
				const hit = _identityCache.get(schema);
				if (hit) return hit;
			}
			let schemaObj = typeof schema === "string" ? _normalizeCallerSchema(JSON.parse(schema)) : _normalizeCallerSchema(schema);
			const rootIsDraft7 = !!(schemaObj && typeof schemaObj === "object" && typeof schemaObj.$schema === "string" && (schemaObj.$schema === "http://json-schema.org/draft-07/schema#" || schemaObj.$schema === "http://json-schema.org/draft-07/schema"));
			if (options.assertFormat === false) schemaObj = stripFormatAssertions(schemaObj === schema ? _deepCloneWithSymbols(schemaObj) : schemaObj);
			this._schemaStr = null;
			this._schemaObj = schemaObj;
			this._options = options;
			this._initialized = false;
			this._nativeReady = false;
			this._compiled = null;
			this._fastSlot = -1;
			this._jsFn = null;
			this._engine = void 0;
			this._preprocess = null;
			this._applyDefaults = null;
			this._schemaMap = buildSchemaMap(options.schemas, rootIsDraft7) || /* @__PURE__ */ new Map();
			this._userFormats = options.formats || null;
			this._verbose = !!options.verbose;
			this._richErrors = options && options.richErrors === false ? false : true;
			this._source = options && options.source && typeof options.source === "object" ? {
				path: String(options.source.path || ""),
				content: String(options.source.content || "")
			} : null;
			if (this._source) {
				const { buildPositionMap } = require_source_positions();
				this._schemaPositions = buildPositionMap(this._source.content);
			} else this._schemaPositions = null;
			this._posCache = require_data_position_cache().createCache();
			this._lastRawInput = null;
			this.validate = (data) => {
				this._ensureCompiled();
				return this.validate(data);
			};
			this.isValidObject = (data) => {
				if (classify(this._schemaObj).tier === 0) {
					const _plan = buildTier0Plan(this._schemaObj);
					let _n = 0;
					this.isValidObject = (d) => {
						const r = tier0Validate(_plan, d);
						if (++_n === 2) try {
							this._ensureCodegen();
						} catch {}
						return r;
					};
				} else {
					this._ensureCodegen();
					if (!this._jsFn) this._ensureCompiled();
				}
				return this.isValidObject(data);
			};
			this.validateJSON = (jsonStr) => {
				this._ensureCompiled();
				return this.validateJSON(jsonStr);
			};
			this.isValidJSON = (jsonStr) => {
				this._ensureCompiled();
				return this.isValidJSON(jsonStr);
			};
			this.validateAndParse = (jsonStr) => {
				if (!native) throw new Error("Native addon required for validateAndParse()");
				this._ensureCompiled();
				return this.validateAndParse(jsonStr);
			};
			this.isValid = (buf) => {
				if (!native) throw new Error("Native addon required for isValid() — use validate() or isValidObject() instead");
				this._ensureCompiled();
				return this.isValid(buf);
			};
			this.countValid = (ndjsonBuf) => {
				if (!native) throw new Error("Native addon required for countValid()");
				this._ensureCompiled();
				return this.countValid(ndjsonBuf);
			};
			this.batchIsValid = (buffers) => {
				if (!native) throw new Error("Native addon required for batchIsValid()");
				this._ensureCompiled();
				return this.batchIsValid(buffers);
			};
			const self = this;
			Object.defineProperty(this, "~standard", {
				value: Object.freeze({
					version: 1,
					vendor: "ata-validator",
					validate(value) {
						const result = self.validate(value);
						if (result.valid) return { value };
						return { issues: result.errors.map((err) => ({
							message: err.message,
							path: parsePointerPath(err.instancePath)
						})) };
					}
				}),
				writable: false,
				enumerable: false,
				configurable: false
			});
			if (!opts && typeof schema === "object" && schema !== null) _identityCache.set(schema, this);
		}
		_ensureCompiled() {
			if (this._initialized) return;
			this._initialized = true;
			const schemaObj = this._schemaObj;
			const options = this._options;
			if (!this._schemaStr) this._schemaStr = JSON.stringify(schemaObj);
			if (this._schemaStr.includes("json-schema.org/draft")) {
				const { METASCHEMAS } = require_metaschemas();
				for (const [id, meta] of METASCHEMAS) {
					const bare = id.replace(/#$/, "");
					for (const key of [
						id,
						bare,
						bare + "#",
						bare.replace(/^https:/, "http:"),
						bare.replace(/^http:/, "https:")
					]) if (!this._schemaMap.has(key)) this._schemaMap.set(key, meta);
				}
			}
			const sm = this._schemaMap.size > 0 ? this._schemaMap : null;
			const mapKey = compileCacheKey(this._schemaStr, this._schemaMap);
			const cached = this._userFormats ? null : _compileCache.get(mapKey);
			let jsFn, jsCombinedFn, jsErrFn, _isCodegen = false;
			var _forceNapi = typeof process !== "undefined" && process.env && process.env.ATA_FORCE_NAPI;
			this._v1Dynamic = isV1Dialect(schemaObj) && (this._schemaStr.includes("\"$dynamicRef\"") || this._schemaStr.includes("\"$dynamicAnchor\""));
			if (this._v1Dynamic || !codegenAvailable()) {
				jsFn = null;
				jsCombinedFn = null;
				jsErrFn = null;
			} else if (cached && !_forceNapi) {
				jsFn = cached.jsFn;
				jsCombinedFn = cached.combined;
				jsErrFn = cached.errFn;
				_isCodegen = !!cached.isCodegen;
			} else if (!_forceNapi) {
				const uf = this._userFormats;
				const _cgFn = compileToJSCodegen(schemaObj, sm, uf);
				jsFn = _cgFn || compileToJS(schemaObj, null, sm);
				jsCombinedFn = compileToJSCombined(schemaObj, VALID_RESULT, sm, uf);
				jsErrFn = compileToJSCodegenWithErrors(schemaObj, sm, uf);
				_isCodegen = !!_cgFn;
				this._engine = _cgFn ? "codegen" : jsFn ? "closure" : null;
				if (!uf) _compileCache.set(mapKey, {
					jsFn,
					combined: jsCombinedFn,
					errFn: jsErrFn,
					isCodegen: _isCodegen
				});
			} else {
				jsFn = null;
				jsCombinedFn = null;
				jsErrFn = null;
			}
			this._jsFn = jsFn;
			if (this._engine === void 0) this._engine = cached ? cached.isCodegen ? "codegen" : jsFn ? "closure" : null : null;
			const preprocessSchema = resolveSchemaForPreprocess(schemaObj, this._schemaMap);
			let preprocess = buildPreprocessCodegen(preprocessSchema, options);
			if (!preprocess) {
				const applyDefaults = options.useDefaults === false ? null : buildDefaultsApplier(preprocessSchema);
				const applyCoerce = options.coerceTypes ? buildCoercer(preprocessSchema) : null;
				const mutators = [
					options.removeAdditional ? buildRemover(preprocessSchema) : null,
					applyCoerce,
					applyDefaults
				].filter(Boolean);
				preprocess = mutators.length === 0 ? null : mutators.length === 1 ? mutators[0] : (data) => {
					for (let i = 0; i < mutators.length; i++) mutators[i](data);
				};
			}
			this._applyDefaults = preprocess;
			this._preprocess = preprocess;
			const useSimdjsonForLarge = !(schemaObj && (schemaObj.items || schemaObj.prefixItems || schemaObj.contains || schemaObj.properties && Object.values(schemaObj.properties).some((p) => p && (p.items || p.prefixItems || p.contains))));
			if (jsFn) {
				let safeErrFn = null;
				if (jsErrFn) try {
					jsErrFn({}, true);
					safeErrFn = (d) => jsErrFn(d, true);
				} catch {}
				const hasUnevaluated = schemaObj && (schemaObj.unevaluatedProperties !== void 0 || schemaObj.unevaluatedItems !== void 0 || this._schemaStr.includes("unevaluatedProperties") || this._schemaStr.includes("unevaluatedItems"));
				const hasDynRef = this._schemaStr.includes("\"$dynamicRef\"") || this._schemaStr.includes("\"$dynamicAnchor\"");
				let _interp = null;
				const jsOnlyFallback = (d) => {
					if (jsFn(d)) return {
						valid: true,
						data: d,
						errors: []
					};
					if (!_interp) {
						const { createInterpreter } = require_interpreter();
						_interp = createInterpreter(schemaObj, {
							schemaMap: this._schemaMap.size > 0 ? this._schemaMap : null,
							formats: this._userFormats,
							v1: isV1Dialect(schemaObj)
						});
					}
					const r = _interp.validate(d);
					if (!r.valid) return r;
					return {
						valid: false,
						errors: [{
							keyword: "validation",
							instancePath: "",
							schemaPath: "",
							params: {},
							message: "schema validation failed"
						}]
					};
				};
				const errFn = safeErrFn || (hasUnevaluated ? (d) => ({
					valid: jsFn(d),
					errors: jsFn(d) ? [] : [{
						code: "unevaluated",
						path: "",
						message: "unevaluated property or item"
					}]
				}) : !native ? jsOnlyFallback : hasDynRef ? (d) => {
					this._ensureNative();
					return this._compiled.validateJSON(JSON.stringify(d));
				} : (d) => {
					this._ensureNative();
					return this._compiled.validate(d);
				});
				let safeCombinedFn = null;
				if (jsCombinedFn) try {
					const probe = {};
					if (schemaObj && schemaObj.properties) for (const k of Object.keys(schemaObj.properties)) probe[k] = "";
					if (schemaObj && schemaObj.if && schemaObj.if.properties) for (const k of Object.keys(schemaObj.if.properties)) probe[k] = "";
					jsCombinedFn(probe);
					jsCombinedFn({});
					jsCombinedFn(null);
					jsCombinedFn(0);
					safeCombinedFn = jsCombinedFn;
				} catch {}
				if (!hasDynRef || _isCodegen) this._fastVerdict = preprocess ? null : jsFn;
				if (options.abortEarly && jsFn && !hasDynRef) {
					const _fn = jsFn;
					this.validate = preprocess ? (data) => {
						preprocess(data);
						return _fn(data) ? VALID_RESULT : ABORT_EARLY_RESULT;
					} : (data) => _fn(data) ? VALID_RESULT : ABORT_EARLY_RESULT;
				} else if (hasDynRef && _isCodegen && jsFn) {
					const _fn = jsFn, _efn = safeErrFn || errFn, _R = VALID_RESULT;
					this.validate = preprocess ? (data) => {
						preprocess(data);
						return _fn(data) ? _R : _efn(data);
					} : (data) => _fn(data) ? _R : _efn(data);
				} else if (hasDynRef) {
					if (!_interp) {
						const { createInterpreter } = require_interpreter();
						_interp = createInterpreter(schemaObj, {
							schemaMap: this._schemaMap.size > 0 ? this._schemaMap : null,
							formats: this._userFormats,
							v1: isV1Dialect(schemaObj)
						});
					}
					const interp = _interp;
					this._fastVerdict = preprocess ? null : (d) => interp.isValid(d);
					this.validate = preprocess ? (data) => {
						preprocess(data);
						return interp.validate(data);
					} : (data) => interp.validate(data);
				} else if (jsFn && jsFn._hybridFactory) {
					const hybridFn = jsFn._hybridFactory(VALID_RESULT, safeCombinedFn || errFn);
					this.validate = preprocess ? (data) => {
						preprocess(data);
						return hybridFn(data);
					} : hybridFn;
				} else if (safeCombinedFn) this.validate = preprocess ? (data) => {
					preprocess(data);
					return safeCombinedFn(data);
				} : safeCombinedFn;
				else {
					const hybridFn = jsFn && jsFn._hybridFactory ? jsFn._hybridFactory(VALID_RESULT, errFn) : null;
					this.validate = hybridFn ? preprocess ? (data) => {
						preprocess(data);
						return hybridFn(data);
					} : hybridFn : preprocess ? (data) => {
						preprocess(data);
						return jsFn(data) ? VALID_RESULT : errFn(data);
					} : (data) => jsFn(data) ? VALID_RESULT : errFn(data);
				}
				if (this._verbose) {
					const inner = this.validate;
					const root = this._schemaObj;
					this.validate = (data) => {
						const result = inner(data);
						if (result && !result.valid && result.errors) return {
							valid: false,
							errors: result.errors.map((err) => err && err.parentSchema === void 0 ? {
								...err,
								parentSchema: resolveSchemaByPath(root, err.schemaPath)
							} : err)
						};
						return result;
					};
				}
				this.isValidObject = jsFn;
				const hybridFn = jsFn._hybridFactory ? jsFn._hybridFactory(VALID_RESULT, errFn) : null;
				const jsonValidateFn = safeCombinedFn || hybridFn || ((obj) => jsFn(obj) ? VALID_RESULT : errFn(obj));
				this.validateJSON = useSimdjsonForLarge && native ? (jsonStr) => {
					if (jsonStr.length >= SIMDJSON_THRESHOLD) {
						this._ensureNative();
						const buf = Buffer.from(jsonStr);
						if (native.rawFastValidate(this._fastSlot, buf)) return VALID_RESULT;
						return this._compiled.validateJSON(jsonStr);
					}
					try {
						return jsonValidateFn(JSON.parse(jsonStr));
					} catch (e) {
						if (!(e instanceof SyntaxError)) throw e;
					}
					this._ensureNative();
					return this._compiled.validateJSON(jsonStr);
				} : (jsonStr) => {
					try {
						return jsonValidateFn(JSON.parse(jsonStr));
					} catch (e) {
						if (!(e instanceof SyntaxError)) throw e;
						if (!native) return {
							valid: false,
							errors: [{
								keyword: "syntax",
								instancePath: "",
								schemaPath: "#",
								params: {},
								message: e.message
							}]
						};
					}
					this._ensureNative();
					return this._compiled.validateJSON(jsonStr);
				};
				this.isValidJSON = useSimdjsonForLarge && native ? (jsonStr) => {
					if (jsonStr.length >= SIMDJSON_THRESHOLD) {
						this._ensureNative();
						return native.rawFastValidate(this._fastSlot, Buffer.from(jsonStr));
					}
					try {
						return jsFn(JSON.parse(jsonStr));
					} catch (e) {
						if (!(e instanceof SyntaxError)) throw e;
						return false;
					}
				} : (jsonStr) => {
					try {
						return jsFn(JSON.parse(jsonStr));
					} catch (e) {
						if (!(e instanceof SyntaxError)) throw e;
						return false;
					}
				};
				{
					const self = this;
					this.validateAndParse = (jsonStr) => {
						let value;
						try {
							value = JSON.parse(typeof jsonStr === "string" ? jsonStr : new TextDecoder().decode(jsonStr));
						} catch (e) {
							return {
								valid: false,
								value: void 0,
								errors: [{
									code: "ATA9001",
									message: "invalid JSON: " + e.message,
									keyword: "__parse__",
									instancePath: "",
									schemaPath: "",
									params: {}
								}]
							};
						}
						const r = self.validate(value);
						return {
							valid: r.valid,
							value,
							errors: r.errors
						};
					};
				}
				if (native) {
					const self = this;
					this.isValid = (buf) => {
						self._ensureNative();
						const slot = self._fastSlot;
						self.isValid = (b) => {
							if (typeof b === "string") b = Buffer.from(b);
							else if (!(b instanceof Uint8Array)) throw new TypeError("isValid() requires a Buffer, Uint8Array, or string. For parsed objects, use isValidObject().");
							return native.rawFastValidate(slot, b);
						};
						return self.isValid(buf);
					};
					this.countValid = (ndjsonBuf) => {
						self._ensureNative();
						const slot = self._fastSlot;
						self.countValid = (b) => {
							if (typeof b === "string") b = Buffer.from(b);
							else if (!(b instanceof Uint8Array)) throw new TypeError("countValid() requires a Buffer, Uint8Array, or string");
							const r = native.rawNDJSONValidate(slot, b);
							let c = 0;
							for (let i = 0; i < r.length; i++) if (r[i]) c++;
							return c;
						};
						return self.countValid(ndjsonBuf);
					};
					this.batchIsValid = (buffers) => {
						self._ensureNative();
						const slot = self._fastSlot;
						self.batchIsValid = (bufs) => {
							let v = 0;
							for (const b of bufs) {
								if (!(b instanceof Uint8Array)) throw new TypeError("batchIsValid() requires Buffer or Uint8Array elements");
								if (native.rawFastValidate(slot, b)) v++;
							}
							return v;
						};
						return self.batchIsValid(buffers);
					};
				}
			} else if (native) {
				this._ensureNative();
				this._schemaStr.includes("\"$dynamicRef\"") || this._schemaStr.includes("\"$dynamicAnchor\"");
				this._schemaStr.includes("\"unevaluatedProperties\"") || this._schemaStr.includes("\"unevaluatedItems\"");
				this._schemaStr.includes("\"propertyDependencies\"");
				let _validate;
				{
					const { createInterpreter } = require_interpreter();
					const interp = createInterpreter(schemaObj, {
						schemaMap: this._schemaMap.size > 0 ? this._schemaMap : null,
						formats: this._userFormats,
						v1: isV1Dialect(schemaObj)
					});
					this._engine = "interpreter";
					_validate = (data) => interp.validate(data);
					this._fastVerdict = preprocess ? null : (d) => interp.isValid(d);
					this.validateJSON = (jsonStr) => {
						try {
							return _validate(JSON.parse(jsonStr));
						} catch (e) {
							return {
								valid: false,
								errors: [{
									keyword: "syntax",
									instancePath: "",
									schemaPath: "#",
									params: {},
									message: e.message
								}]
							};
						}
					};
					this.isValidJSON = (jsonStr) => this.validateJSON(jsonStr).valid;
				}
				this.validate = preprocess ? (data) => {
					preprocess(data);
					return _validate(data);
				} : _validate;
				this.isValidObject = this._fastVerdict ? this._fastVerdict : (data) => _validate(data).valid;
				this.validateAndParse = (jsonStr) => this._compiled.validateAndParse(jsonStr);
				{
					const slot = this._fastSlot;
					this.isValid = (buf) => {
						if (typeof buf === "string") buf = Buffer.from(buf);
						else if (!(buf instanceof Uint8Array)) throw new TypeError("isValid() requires a Buffer, Uint8Array, or string. For parsed objects, use isValidObject().");
						return native.rawFastValidate(slot, buf);
					};
				}
				{
					const slot = this._fastSlot;
					this.countValid = (ndjsonBuf) => {
						if (typeof ndjsonBuf === "string") ndjsonBuf = Buffer.from(ndjsonBuf);
						else if (!(ndjsonBuf instanceof Uint8Array)) throw new TypeError("countValid() requires a Buffer, Uint8Array, or string");
						const results = native.rawNDJSONValidate(slot, ndjsonBuf);
						let count = 0;
						for (let i = 0; i < results.length; i++) if (results[i]) count++;
						return count;
					};
				}
				{
					const slot = this._fastSlot;
					this.batchIsValid = (buffers) => {
						let valid = 0;
						for (const buf of buffers) {
							if (!(buf instanceof Uint8Array)) throw new TypeError("batchIsValid() requires Buffer or Uint8Array elements");
							if (native.rawFastValidate(slot, buf)) valid++;
						}
						return valid;
					};
				}
			} else {
				const { createInterpreter } = require_interpreter();
				const interp = createInterpreter(schemaObj, {
					schemaMap: this._schemaMap.size > 0 ? this._schemaMap : null,
					formats: this._userFormats,
					v1: isV1Dialect(schemaObj)
				});
				this._engine = "interpreter";
				if (!preprocess) this._fastVerdict = (d) => interp.isValid(d);
				const run = preprocess ? (data) => {
					preprocess(data);
					return interp.validate(data);
				} : (data) => interp.validate(data);
				this.validate = run;
				this.isValidObject = this._fastVerdict ? this._fastVerdict : (data) => run(data).valid;
				this.validateJSON = (jsonStr) => {
					try {
						return run(JSON.parse(jsonStr));
					} catch (e) {
						return {
							valid: false,
							errors: [{
								keyword: "syntax",
								instancePath: "",
								schemaPath: "#",
								params: {},
								message: e.message
							}]
						};
					}
				};
				this.isValidJSON = (jsonStr) => this.validateJSON(jsonStr).valid;
			}
			if (this.validate) {
				const inner = this.validate;
				const enrich = this._richErrors ? require_enrich_error().enrich : null;
				const root = this._schemaObj;
				const self = this;
				this.validate = (data) => {
					const result = inner(data);
					if (result && result.valid === false && result !== ABORT_EARLY_RESULT) {
						const positions = enrich && self._lastRawInput != null ? self._posCache.get(self._lastRawInput) : null;
						if (positions) self._posCache.reset();
						let cached = null;
						return {
							valid: false,
							get errors() {
								if (cached === null) {
									let raw = result.errors || [];
									if (raw.length > 1) raw = sortErrorsBySchemaOrder(root, raw);
									cached = enrich && raw.length ? raw.map((e) => enrich(e, {
										data,
										positions,
										schemaPositions: self._schemaPositions,
										schemaFile: self._source ? self._source.path : void 0
									})) : raw;
								}
								return cached;
							}
						};
					}
					return result;
				};
				if (this._richErrors && this.validateJSON) {
					const innerJson = this.validateJSON;
					this.validateJSON = (jsonStr) => {
						this._lastRawInput = jsonStr;
						let result;
						try {
							result = innerJson(jsonStr);
						} finally {}
						if (result && !result.valid && result.errors && result.errors.length) {
							const first = result.errors[0];
							if (!first || !first.code) {
								const positions = this._lastRawInput != null ? this._posCache.get(this._lastRawInput) : null;
								let parsedData;
								try {
									parsedData = JSON.parse(jsonStr);
								} catch {
									parsedData = void 0;
								}
								const enriched = result.errors.map((e) => enrich(e, {
									data: parsedData,
									positions,
									schemaPositions: this._schemaPositions,
									schemaFile: this._source ? this._source.path : void 0
								}));
								if (positions) this._posCache.reset();
								this._lastRawInput = null;
								return {
									valid: false,
									errors: enriched
								};
							}
							const positions = this._lastRawInput != null ? this._posCache.get(this._lastRawInput) : null;
							if (positions) {
								for (const e of result.errors) if (e && !e.dataFrame) {
									const p = positions[e.path != null ? e.path : e.instancePath || ""];
									if (p) e.dataFrame = {
										byteOffset: p.byteOffset,
										length: p.length,
										line: p.line,
										col: p.col,
										text: p.text
									};
								}
								this._posCache.reset();
							}
						}
						this._lastRawInput = null;
						return result;
					};
				}
			}
			if (this.validate) {
				const _bare = this.validate;
				this.validate = (data) => {
					const r = _bare(data);
					return r.valid === true && r.data === void 0 ? {
						valid: true,
						data,
						errors: r.errors
					} : r;
				};
			}
			{
				const emLib = require_error_messages();
				const schemaStr = this._schemaStr || (this._schemaObj ? JSON.stringify(this._schemaObj) : "");
				if (emLib.schemaHasErrorMessages(schemaStr)) {
					const root = this._schemaObj;
					const wrap = (inner) => (arg) => {
						const result = inner(arg);
						if (result && result.valid === false && result.errors && result.errors.length && result !== ABORT_EARLY_RESULT) {
							const overridden = emLib.applyErrorMessages(result.errors, root);
							if (overridden !== result.errors) return {
								valid: false,
								errors: overridden
							};
						}
						return result;
					};
					if (this.validate) this.validate = wrap(this.validate);
					if (this.validateJSON) this.validateJSON = wrap(this.validateJSON);
					if (this.validateAndParse) {
						const innerVP = this.validateAndParse;
						this.validateAndParse = (arg) => {
							const result = innerVP(arg);
							if (result && result.valid === false && result.errors && result.errors.length) {
								const overridden = emLib.applyErrorMessages(result.errors, root);
								if (overridden !== result.errors) return {
									valid: false,
									value: result.value,
									errors: overridden
								};
							}
							return result;
						};
					}
				}
			}
			if (this._fastVerdict && !preprocess && !options.abortEarly && this.validate) {
				const _full = this.validate;
				const _fast = this._fastVerdict;
				const EMPTY_ERRORS = Object.freeze([]);
				const _buildErrors = (data) => {
					const r = _full(data);
					return r && r.valid === false && r.errors && r.errors.length ? r.errors : [{
						keyword: "validation",
						instancePath: "",
						schemaPath: "#",
						params: {},
						message: "schema validation failed"
					}];
				};
				this.validate = (data) => {
					if (_fast(data)) return {
						valid: true,
						data,
						errors: EMPTY_ERRORS
					};
					return new LazyRejection(_buildErrors, data);
				};
			}
			if (native) {
				const { bufferNeedsSlowPath, installSlowBufferApis } = require_buffer_gate();
				if (bufferNeedsSlowPath(schemaObj, this._schemaMap)) installSlowBufferApis(this);
			}
			if (this._schemaObj && typeof this._schemaObj === "object") _identityCache.set(this._schemaObj, this);
		}
		engine() {
			this._ensureCompiled();
			return this._engine || "interpreter";
		}
		_ensureNative() {
			if (this._nativeReady) return;
			this._nativeReady = true;
			if (!native) return;
			let nativeSchemaStr = this._schemaStr;
			if (this._schemaMap.size > 0) {
				const merged = JSON.parse(this._schemaStr);
				if (!merged.$defs) merged.$defs = {};
				for (const [id, s] of this._schemaMap) merged.$defs["__ext_" + id.replace(/[^a-zA-Z0-9]/g, "_")] = s;
				nativeSchemaStr = JSON.stringify(merged);
			}
			this._compiled = new native.CompiledSchema(nativeSchemaStr);
			this._fastSlot = native.fastRegister(nativeSchemaStr);
		}
		addSchema(schema) {
			if (this._initialized) throw new Error("Cannot add schema after compilation — call addSchema() before validate()");
			if (!schema || !schema.$id) throw new Error("Schema must have $id");
			const root = this._schemaObj;
			const normalized = _normalizeCallerSchema(schema, !!(root && typeof root === "object" && typeof root.$schema === "string" && (root.$schema === "http://json-schema.org/draft-07/schema#" || root.$schema === "http://json-schema.org/draft-07/schema")));
			this._schemaMap.set(normalized.$id, normalized);
		}
		_ensureCodegen() {
			if (this._jsFn) return;
			if (typeof process !== "undefined" && process.env && process.env.ATA_FORCE_NAPI) return;
			if (!this._schemaStr) this._schemaStr = JSON.stringify(this._schemaObj);
			const sm = this._schemaMap.size > 0 ? this._schemaMap : null;
			const mapKey = compileCacheKey(this._schemaStr, this._schemaMap);
			const cached = this._userFormats ? null : _compileCache.get(mapKey);
			if (cached && cached.jsFn) {
				this._jsFn = cached.jsFn;
				this.isValidObject = cached.jsFn;
				return;
			}
			const uf = this._userFormats;
			const jsFn = compileToJSCodegen(this._schemaObj, sm, uf) || compileToJS(this._schemaObj, null, sm);
			this._jsFn = jsFn;
			if (jsFn) {
				this.isValidObject = jsFn;
				if (!uf) {
					if (!cached) _compileCache.set(mapKey, {
						jsFn,
						combined: null,
						errFn: null
					});
					else cached.jsFn = jsFn;
				}
			}
		}
		static fromStandalone(mod, schema, opts) {
			const options = opts || {};
			const schemaObj = typeof schema === "string" ? JSON.parse(schema) : schema;
			const v = Object.create(Validator.prototype);
			v._jsFn = mod.boolFn;
			v._compiled = null;
			v._fastSlot = -1;
			const applyDefaults = buildDefaultsApplier(schemaObj);
			const applyCoerce = options.coerceTypes ? buildCoercer(schemaObj) : null;
			const mutators = [
				options.removeAdditional ? buildRemover(schemaObj) : null,
				applyCoerce,
				applyDefaults
			].filter(Boolean);
			const preprocess = mutators.length === 0 ? null : mutators.length === 1 ? mutators[0] : (data) => {
				for (let i = 0; i < mutators.length; i++) mutators[i](data);
			};
			v._preprocess = preprocess;
			let errFn = (d) => ({
				valid: false,
				errors: [{
					code: "validation_failed",
					path: "",
					message: "validation failed"
				}]
			});
			if (mod.errFn) errFn = (d) => mod.errFn(d, true);
			else {
				const jsErrFn = compileToJSCodegenWithErrors(schemaObj);
				if (jsErrFn) try {
					jsErrFn({}, true);
					errFn = (d) => jsErrFn(d, true);
				} catch {}
			}
			const hybridFn = mod.hybridFactory ? mod.hybridFactory(VALID_RESULT, errFn) : null;
			v.validate = hybridFn ? preprocess ? (data) => {
				preprocess(data);
				return hybridFn(data);
			} : hybridFn : preprocess ? (data) => {
				preprocess(data);
				return mod.boolFn(data) ? VALID_RESULT : errFn(data);
			} : (data) => mod.boolFn(data) ? VALID_RESULT : errFn(data);
			{
				const _bare = v.validate;
				v.validate = (data) => {
					const r = _bare(data);
					return r.valid === true && r.data === void 0 ? {
						valid: true,
						data,
						errors: r.errors
					} : r;
				};
			}
			v.isValidObject = mod.boolFn;
			v.isValidJSON = (jsonStr) => {
				try {
					return mod.boolFn(JSON.parse(jsonStr));
				} catch {
					return false;
				}
			};
			v.validateJSON = (jsonStr) => {
				try {
					const obj = JSON.parse(jsonStr);
					return hybridFn ? hybridFn(obj) : mod.boolFn(obj) ? VALID_RESULT : errFn(obj);
				} catch {
					return {
						valid: false,
						errors: [{
							code: "invalid_json",
							path: "",
							message: "invalid JSON"
						}]
					};
				}
			};
			v.validateAndParse = native ? (jsonStr) => {
				v._ensureNative();
				v.validateAndParse = (s) => v._compiled.validateAndParse(s);
				return v.validateAndParse(jsonStr);
			} : () => {
				throw new Error("Native addon required for validateAndParse()");
			};
			Object.defineProperty(v, "~standard", {
				value: Object.freeze({
					version: 1,
					vendor: "ata-validator",
					validate(value) {
						const result = v.validate(value);
						if (result.valid) return { value };
						return { issues: result.errors.map((e) => ({
							message: e.message,
							path: parsePointerPath(e.instancePath)
						})) };
					}
				}),
				writable: false,
				enumerable: false,
				configurable: false
			});
			return v;
		}
		isValid(input) {
			if (!native) throw new Error("Native addon required for isValid() — install build tools or use validate() instead");
			if (typeof input === "string") input = Buffer.from(input);
			else if (!(input instanceof Uint8Array)) throw new TypeError("isValid() requires a Buffer, Uint8Array, or string. For parsed objects, use isValidObject().");
			this._ensureNative();
			return native.rawFastValidate(this._fastSlot, input);
		}
		isValidPrepadded(paddedBuffer, jsonLength) {
			if (!native) throw new Error("Native addon required for isValidPrepadded()");
			this._ensureNative();
			return native.rawFastValidate(this._fastSlot, paddedBuffer, jsonLength);
		}
		isValidParallel(buffer) {
			if (!native) throw new Error("Native addon required for isValidParallel()");
			this._ensureNative();
			return native.rawParallelValidate(this._fastSlot, buffer);
		}
		countValid(buffer) {
			if (!native) throw new Error("Native addon required for countValid()");
			this._ensureNative();
			return native.rawParallelCount(this._fastSlot, buffer);
		}
		isValidNDJSON(buffer) {
			if (!native) throw new Error("Native addon required for isValidNDJSON()");
			this._ensureNative();
			return native.rawNDJSONValidate(this._fastSlot, buffer);
		}
	};
	function validate(schema, data) {
		if (native) {
			const schemaStr = typeof schema === "string" ? schema : JSON.stringify(schema);
			return native.validate(schemaStr, data);
		}
		return new Validator(typeof schema === "string" ? JSON.parse(schema) : schema).validate(data);
	}
	async function validateAsync(schemaOrValidator, data) {
		const refineLib = require_refine();
		let validator, schema;
		if (schemaOrValidator instanceof Validator) {
			validator = schemaOrValidator;
			schema = validator._schemaObj;
		} else {
			schema = schemaOrValidator;
			validator = new Validator(schema);
		}
		const structural = validator.validate(data);
		if (!structural.valid) return structural;
		const refinements = refineLib.getRefinements(schema);
		if (!refinements) return structural;
		const issues = await refineLib.runRefinements(refinements, structural.data !== void 0 ? structural.data : data);
		if (issues.length) return {
			valid: false,
			errors: issues
		};
		return structural;
	}
	async function parseAsync(schemaOrValidator, data) {
		const result = await validateAsync(schemaOrValidator, data);
		if (result.valid) return result.data !== void 0 ? result.data : data;
		const err = /* @__PURE__ */ new Error("ata: async validation failed");
		err.errors = result.errors;
		throw err;
	}
	function version() {
		if (native) return native.version();
		try {
			return require_version();
		} catch {
			return "unknown";
		}
	}
	Validator.bundle = function(schemas, opts) {
		return require_aot().bundle(Validator, schemas, opts);
	};
	Validator.bundleStandalone = function(schemas, opts) {
		return require_aot().bundleStandalone(Validator, schemas, opts);
	};
	Validator.bundleCompact = function(schemas, opts) {
		return require_aot().bundleCompact(Validator, schemas, opts);
	};
	Validator.loadBundle = function(mods, schemas, opts) {
		return require_aot().loadBundle(Validator, mods, schemas, opts);
	};
	const parseJSON = native ? native.parseJSON : JSON.parse;
	const _compileFnCache = /* @__PURE__ */ new WeakMap();
	function compile(schema, opts) {
		if (!opts && typeof schema === "object" && schema !== null) {
			const hit = _compileFnCache.get(schema);
			if (hit) return hit;
		}
		const v = new Validator(schema, opts);
		v._ensureCompiled();
		const fn = v.validate;
		if (!opts && typeof schema === "object" && schema !== null) _compileFnCache.set(schema, fn);
		return fn;
	}
	const { toTypeScript } = require_ts_gen();
	const { renderPretty } = require_render_pretty();
	const { renderCompact } = require_render_compact();
	const { renderJSON } = require_render_json();
	const { suggestFor } = require_suggestions();
	const { reprValue } = require_enrich_error();
	function _walkPointer(root, pointer) {
		if (!pointer) return root;
		const parts = pointer.replace(/^\//, "").split("/").map((s) => s.replace(/~1/g, "/").replace(/~0/g, "~"));
		let cur = root;
		for (const p of parts) {
			if (cur == null) return void 0;
			cur = cur[p];
		}
		return cur;
	}
	function attachSuggestions(errors, data) {
		if (!errors) return errors;
		for (const e of errors) {
			if (!e || e.suggestion) continue;
			let received = e.received;
			if (received === void 0 && data !== void 0) {
				const ptr = e.instancePath != null ? e.instancePath : e.path || "";
				const raw = _walkPointer(data, ptr);
				if (raw !== void 0 || ptr === "") received = reprValue(raw);
			}
			const probe = received !== void 0 && e.received === void 0 ? Object.assign({}, e, { received }) : e;
			const s = suggestFor(probe, data);
			if (s) e.suggestion = s;
		}
		return errors;
	}
	function defineSchema(schema) {
		return schema;
	}
	module.exports = {
		Validator,
		compile,
		validate,
		validateAsync,
		parseAsync,
		version,
		createPaddedBuffer,
		SIMDJSON_PADDING,
		parseJSON,
		toTypeScript,
		defineSchema,
		renderPretty,
		renderCompact,
		renderJSON,
		attachSuggestions
	};
}));
//#endregion
//#region ../node_modules/.pnpm/ata-validator@1.7.4_yaml@2.9.0/node_modules/ata-validator/index.browser.mjs
var import_keywords = require_keywords();
const { Validator, validate, validateAsync, parseAsync, version, createPaddedBuffer, SIMDJSON_PADDING, renderPretty, renderCompact, renderJSON, toTypeScript } = (/* @__PURE__ */ __toESM(require_ata_validator(), 1)).default;
//#endregion
//#region ../node_modules/.pnpm/ata-validator@1.7.4_yaml@2.9.0/node_modules/ata-validator/lib/t.js
var require_t$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const OPTIONAL = Symbol.for("ata.t.optional");
	const { attach: attachRefine } = require_refine();
	function string(opts) {
		return Object.assign({ type: "string" }, opts);
	}
	function number(opts) {
		return Object.assign({ type: "number" }, opts);
	}
	function integer(opts) {
		return Object.assign({ type: "integer" }, opts);
	}
	function boolean() {
		return { type: "boolean" };
	}
	function nul() {
		return { type: "null" };
	}
	function literal(value) {
		return { const: value };
	}
	function constant(value) {
		return { const: value };
	}
	function enumOf(values) {
		return { enum: values };
	}
	function array(items, opts) {
		return Object.assign({
			type: "array",
			items
		}, opts);
	}
	function tuple(items, opts) {
		return Object.assign({
			type: "array",
			prefixItems: items,
			items: false,
			minItems: items.length
		}, opts);
	}
	function record(values, opts) {
		return Object.assign({
			type: "object",
			additionalProperties: values
		}, opts);
	}
	function object(properties, opts) {
		const props = {};
		const required = [];
		const keys = Object.keys(properties);
		for (const key of keys) {
			const schema = properties[key];
			if (schema && schema[OPTIONAL] === true) {
				const { [OPTIONAL]: _drop, ...rest } = schema;
				props[key] = rest;
			} else {
				props[key] = schema;
				required.push(key);
			}
		}
		const out = {
			type: "object",
			properties: props
		};
		if (required.length) out.required = required;
		return Object.assign(out, opts);
	}
	function optional(schema) {
		return Object.assign({}, schema, { [OPTIONAL]: true });
	}
	function union(schemas) {
		return { anyOf: schemas };
	}
	function intersect(schemas) {
		return { allOf: schemas };
	}
	function ref(pointer) {
		return { $ref: pointer };
	}
	function any() {
		return {};
	}
	function unknown() {
		return {};
	}
	function never() {
		return { not: {} };
	}
	function refine(schema, check, opts) {
		return attachRefine(schema, check, opts);
	}
	function assertObjectSchema(schema, fn) {
		if (!schema || typeof schema !== "object" || schema.type !== "object" || !schema.properties || typeof schema.properties !== "object") throw new Error(`t.${fn}: expected an object schema with properties`);
	}
	function cloneMeta(schema) {
		const out = {};
		for (const key of Object.keys(schema)) if (key !== "properties" && key !== "required") out[key] = schema[key];
		return out;
	}
	function pick(schema, keys) {
		assertObjectSchema(schema, "pick");
		const keep = new Set(keys);
		const props = {};
		for (const key of Object.keys(schema.properties)) if (keep.has(key)) props[key] = schema.properties[key];
		const required = (schema.required || []).filter((key) => keep.has(key));
		const out = Object.assign(cloneMeta(schema), { properties: props });
		if (required.length) out.required = required;
		return out;
	}
	function omit(schema, keys) {
		assertObjectSchema(schema, "omit");
		const drop = new Set(keys);
		const props = {};
		for (const key of Object.keys(schema.properties)) if (!drop.has(key)) props[key] = schema.properties[key];
		const required = (schema.required || []).filter((key) => !drop.has(key));
		const out = Object.assign(cloneMeta(schema), { properties: props });
		if (required.length) out.required = required;
		return out;
	}
	function partial(schema) {
		assertObjectSchema(schema, "partial");
		return Object.assign(cloneMeta(schema), { properties: schema.properties });
	}
	function requiredOf(schema, keys) {
		assertObjectSchema(schema, "required");
		const propKeys = Object.keys(schema.properties);
		let required;
		if (keys === void 0) required = propKeys.slice();
		else {
			const known = new Set(propKeys);
			required = Array.from(/* @__PURE__ */ new Set([...schema.required || [], ...keys])).filter((k) => known.has(k));
		}
		const out = Object.assign(cloneMeta(schema), { properties: schema.properties });
		if (required.length) out.required = required;
		return out;
	}
	function recursive(build, opts) {
		const body = build({ $ref: "#/$defs/self" });
		return Object.assign({
			$ref: "#/$defs/self",
			$defs: { self: body }
		}, opts);
	}
	function composite(schemas, opts) {
		const props = {};
		const requiredSet = /* @__PURE__ */ new Set();
		for (const schema of schemas) {
			assertObjectSchema(schema, "composite");
			for (const key of Object.keys(schema.properties)) props[key] = schema.properties[key];
			for (const key of schema.required || []) requiredSet.add(key);
		}
		const required = Array.from(requiredSet).filter((key) => Object.hasOwn(props, key));
		const out = {
			type: "object",
			properties: props
		};
		if (required.length) out.required = required;
		return Object.assign(out, opts);
	}
	module.exports = {
		string,
		number,
		integer,
		boolean,
		null: nul,
		literal,
		const: constant,
		enum: enumOf,
		array,
		tuple,
		record,
		object,
		optional,
		union,
		intersect,
		ref,
		any,
		unknown,
		never,
		refine,
		OPTIONAL,
		pick,
		omit,
		partial,
		required: requiredOf,
		composite,
		recursive
	};
}));
const { t, OPTIONAL } = (/* @__PURE__ */ __toESM((/* @__PURE__ */ __commonJSMin(((exports, module) => {
	const t = require_t$1();
	module.exports = {
		t,
		OPTIONAL: t.OPTIONAL
	};
})))(), 1)).default;
//#endregion
//#region ../schemas/libraries/ata-validator/download.ts
const dateSchema = t.object({}, { instanceof: "Date" });
const imageSchema = t.object({
	id: t.number(),
	created: dateSchema,
	title: t.string({
		minLength: 1,
		maxLength: 100
	}),
	type: t.enum(["jpg", "png"]),
	size: t.number(),
	url: t.string({ format: "url" })
});
const ratingSchema = t.object({
	id: t.number(),
	stars: t.number({
		minimum: 1,
		maximum: 5
	}),
	title: t.string({
		minLength: 1,
		maxLength: 100
	}),
	text: t.string({
		minLength: 1,
		maxLength: 1e3
	}),
	images: t.array(imageSchema)
});
const productSchema = t.object({
	id: t.number(),
	created: dateSchema,
	title: t.string({
		minLength: 1,
		maxLength: 100
	}),
	brand: t.string({
		minLength: 1,
		maxLength: 30
	}),
	description: t.string({
		minLength: 1,
		maxLength: 500
	}),
	price: t.number({
		minimum: 1,
		maximum: 1e4
	}),
	discount: t.union([t.number({
		minimum: 1,
		maximum: 100
	}), t.null()]),
	quantity: t.number({
		minimum: 0,
		maximum: 10
	}),
	tags: t.array(t.string({
		minLength: 1,
		maxLength: 30
	})),
	images: t.array(imageSchema),
	ratings: t.array(ratingSchema)
});
(0, import_keywords.withKeywords)(new Validator(productSchema)).validate({});
//#endregion
