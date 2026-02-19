var __spreadArray$2 = function(to, from, pack) {
	if (pack || arguments.length === 2) {
		for (var i = 0, l = from.length, ar; i < l; i++) if (ar || !(i in from)) {
			if (!ar) ar = Array.prototype.slice.call(from, 0, i);
			ar[i] = from[i];
		}
	}
	return to.concat(ar || Array.prototype.slice.call(from));
};
/**
* @since 2.0.0
*/
function identity$1(a) {
	return a;
}
function pipe(a, ab, bc, cd, de, ef, fg, gh, hi) {
	switch (arguments.length) {
		case 1: return a;
		case 2: return ab(a);
		case 3: return bc(ab(a));
		case 4: return cd(bc(ab(a)));
		case 5: return de(cd(bc(ab(a))));
		case 6: return ef(de(cd(bc(ab(a)))));
		case 7: return fg(ef(de(cd(bc(ab(a))))));
		case 8: return gh(fg(ef(de(cd(bc(ab(a)))))));
		case 9: return hi(gh(fg(ef(de(cd(bc(ab(a))))))));
		default:
			var ret = arguments[0];
			for (var i = 1; i < arguments.length; i++) ret = arguments[i](ret);
			return ret;
	}
}
/** @internal */
var dual = function(arity, body) {
	var isDataFirst = typeof arity === "number" ? function(args) {
		return args.length >= arity;
	} : arity;
	return function() {
		var args = Array.from(arguments);
		if (isDataFirst(arguments)) return body.apply(this, args);
		return function(self) {
			return body.apply(void 0, __spreadArray$2([self], args, false));
		};
	};
};
/** @internal */
var isLeft$1 = function(ma) {
	return ma._tag === "Left";
};
/** @internal */
var left$1 = function(e) {
	return {
		_tag: "Left",
		left: e
	};
};
/** @internal */
var right$1 = function(a) {
	return {
		_tag: "Right",
		right: a
	};
};
/** @internal */
function as$1(F) {
	return function(self, b) {
		return F.map(self, function() {
			return b;
		});
	};
}
/** @internal */
function asUnit$1(F) {
	var asM = as$1(F);
	return function(self) {
		return asM(self, void 0);
	};
}
/** @internal */
function tap$1(M) {
	return function(first, f) {
		return M.chain(first, function(a) {
			return M.map(f(a), function() {
				return a;
			});
		});
	};
}
/**
* Constructs a new `Either` holding a `Left` value. This usually represents a failure, due to the right-bias of this
* structure.
*
* @category constructors
* @since 2.0.0
*/
var left = left$1;
/**
* Constructs a new `Either` holding a `Right` value. This usually represents a successful value due to the right bias
* of this structure.
*
* @category constructors
* @since 2.0.0
*/
var right = right$1;
/**
* @category sequencing
* @since 2.14.0
*/
var flatMap = /* @__PURE__ */ dual(2, function(ma, f) {
	return isLeft(ma) ? ma : f(ma.right);
});
var _map = function(fa, f) {
	return pipe(fa, map(f));
};
var _ap = function(fab, fa) {
	return pipe(fab, ap(fa));
};
/**
* @category type lambdas
* @since 2.0.0
*/
var URI = "Either";
/**
* @category mapping
* @since 2.0.0
*/
var map = function(f) {
	return function(fa) {
		return isLeft(fa) ? fa : right(f(fa.right));
	};
};
/**
* @category instances
* @since 2.7.0
*/
var Functor = {
	URI,
	map: _map
};
dual(2, as$1(Functor));
asUnit$1(Functor);
/**
* Less strict version of [`ap`](#ap).
*
* The `W` suffix (short for **W**idening) means that the error types will be merged.
*
* @since 2.8.0
*/
var apW = function(fa) {
	return function(fab) {
		return isLeft(fab) ? fab : isLeft(fa) ? fa : right(fab.right(fa.right));
	};
};
/**
* @since 2.0.0
*/
var ap = apW;
/**
* @category instances
* @since 2.10.0
*/
var Chain = {
	URI,
	map: _map,
	ap: _ap,
	chain: flatMap
};
/**
* @category instances
* @since 2.10.0
*/
var FromEither = {
	URI,
	fromEither: identity$1
};
/**
* Returns `true` if the either is an instance of `Left`, `false` otherwise.
*
* @category refinements
* @since 2.0.0
*/
var isLeft = isLeft$1;
tap$1(Chain);
FromEither.fromEither;
/**
* @since 1.0.0
*/
var __extends = (function() {
	var extendStatics = function(d, b) {
		extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d, b) {
			d.__proto__ = b;
		} || function(d, b) {
			for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
		};
		return extendStatics(d, b);
	};
	return function(d, b) {
		if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
		extendStatics(d, b);
		function __() {
			this.constructor = d;
		}
		d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
})();
var __assign = function() {
	__assign = Object.assign || function(t) {
		for (var s, i = 1, n = arguments.length; i < n; i++) {
			s = arguments[i];
			for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
		}
		return t;
	};
	return __assign.apply(this, arguments);
};
/**
* @category Decode error
* @since 1.0.0
*/
var failures = left;
/**
* @category Decode error
* @since 1.0.0
*/
var failure = function(value, context, message) {
	return failures([{
		value,
		context,
		message
	}]);
};
/**
* @category Decode error
* @since 1.0.0
*/
var success = right;
/**
* @category Codec
* @since 1.0.0
*/
var Type = function() {
	function Type(name, is, validate, encode) {
		this.name = name;
		this.is = is;
		this.validate = validate;
		this.encode = encode;
		this.decode = this.decode.bind(this);
	}
	/**
	* @since 1.0.0
	*/
	Type.prototype.pipe = function(ab, name) {
		var _this = this;
		if (name === void 0) name = "pipe(".concat(this.name, ", ").concat(ab.name, ")");
		return new Type(name, ab.is, function(i, c) {
			var e = _this.validate(i, c);
			if (isLeft(e)) return e;
			return ab.validate(e.right, c);
		}, this.encode === identity && ab.encode === identity ? identity : function(b) {
			return _this.encode(ab.encode(b));
		});
	};
	/**
	* @since 1.0.0
	*/
	Type.prototype.asDecoder = function() {
		return this;
	};
	/**
	* @since 1.0.0
	*/
	Type.prototype.asEncoder = function() {
		return this;
	};
	/**
	* a version of `validate` with a default context
	* @since 1.0.0
	*/
	Type.prototype.decode = function(i) {
		return this.validate(i, [{
			key: "",
			type: this,
			actual: i
		}]);
	};
	return Type;
}();
/**
* @since 1.0.0
*/
var identity = function(a) {
	return a;
};
/**
* @since 1.0.0
*/
function getFunctionName(f) {
	return f.displayName || f.name || "<function".concat(f.length, ">");
}
/**
* @since 1.0.0
*/
function appendContext(c, key, decoder, actual) {
	var len = c.length;
	var r = Array(len + 1);
	for (var i = 0; i < len; i++) r[i] = c[i];
	r[len] = {
		key,
		type: decoder,
		actual
	};
	return r;
}
function pushAll(xs, ys) {
	var l = ys.length;
	for (var i = 0; i < l; i++) xs.push(ys[i]);
}
var hasOwnProperty = Object.prototype.hasOwnProperty;
function getNameFromProps(props) {
	return Object.keys(props).map(function(k) {
		return "".concat(k, ": ").concat(props[k].name);
	}).join(", ");
}
function useIdentity(codecs) {
	for (var i = 0; i < codecs.length; i++) if (codecs[i].encode !== identity) return false;
	return true;
}
function getInterfaceTypeName(props) {
	return "{ ".concat(getNameFromProps(props), " }");
}
function getUnionName(codecs) {
	return "(" + codecs.map(function(type) {
		return type.name;
	}).join(" | ") + ")";
}
function isNonEmpty(as) {
	return as.length > 0;
}
/**
* @internal
*/
var emptyTags = {};
function intersect(a, b) {
	var r = [];
	for (var _i = 0, a_1 = a; _i < a_1.length; _i++) {
		var v = a_1[_i];
		if (b.indexOf(v) !== -1) r.push(v);
	}
	return r;
}
function mergeTags(a, b) {
	if (a === emptyTags) return b;
	if (b === emptyTags) return a;
	var r = Object.assign({}, a);
	for (var k in b) if (hasOwnProperty.call(a, k)) {
		var intersection_1 = intersect(a[k], b[k]);
		if (isNonEmpty(intersection_1)) r[k] = intersection_1;
		else {
			r = emptyTags;
			break;
		}
	} else r[k] = b[k];
	return r;
}
function intersectTags(a, b) {
	if (a === emptyTags || b === emptyTags) return emptyTags;
	var r = emptyTags;
	for (var k in a) if (hasOwnProperty.call(b, k)) {
		if (intersect(a[k], b[k]).length === 0) {
			if (r === emptyTags) r = {};
			r[k] = a[k].concat(b[k]);
		}
	}
	return r;
}
function isLiteralC(codec) {
	return codec._tag === "LiteralType";
}
function isTypeC(codec) {
	return codec._tag === "InterfaceType";
}
function isStrictC(codec) {
	return codec._tag === "StrictType";
}
function isExactC(codec) {
	return codec._tag === "ExactType";
}
function isRefinementC(codec) {
	return codec._tag === "RefinementType";
}
function isIntersectionC(codec) {
	return codec._tag === "IntersectionType";
}
function isUnionC(codec) {
	return codec._tag === "UnionType";
}
function isRecursiveC(codec) {
	return codec._tag === "RecursiveType";
}
function isReadonlyC(codec) {
	return codec._tag === "ReadonlyType";
}
var lazyCodecs = [];
/**
* @internal
*/
function getTags(codec) {
	if (lazyCodecs.indexOf(codec) !== -1) return emptyTags;
	if (isTypeC(codec) || isStrictC(codec)) {
		var index = emptyTags;
		for (var k in codec.props) {
			var prop = codec.props[k];
			if (isLiteralC(prop)) {
				if (index === emptyTags) index = {};
				index[k] = [prop.value];
			}
		}
		return index;
	} else if (isExactC(codec) || isRefinementC(codec) || isReadonlyC(codec)) return getTags(codec.type);
	else if (isIntersectionC(codec)) return codec.types.reduce(function(tags, codec) {
		return mergeTags(tags, getTags(codec));
	}, emptyTags);
	else if (isUnionC(codec)) return codec.types.slice(1).reduce(function(tags, codec) {
		return intersectTags(tags, getTags(codec));
	}, getTags(codec.types[0]));
	else if (isRecursiveC(codec)) {
		lazyCodecs.push(codec);
		var tags = getTags(codec.type);
		lazyCodecs.pop();
		return tags;
	}
	return emptyTags;
}
/**
* @internal
*/
function getIndex(codecs) {
	var tags = getTags(codecs[0]);
	var keys = Object.keys(tags);
	var len = codecs.length;
	var _loop_1 = function(k) {
		var all = tags[k].slice();
		var index = [tags[k]];
		for (var i = 1; i < len; i++) {
			var codec = codecs[i];
			var values = getTags(codec)[k];
			if (values === void 0) return "continue-keys";
			else if (values.some(function(v) {
				return all.indexOf(v) !== -1;
			})) return "continue-keys";
			else {
				all.push.apply(all, values);
				index.push(values);
			}
		}
		return { value: [k, index] };
	};
	keys: for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
		var k = keys_1[_i];
		var state_1 = _loop_1(k);
		if (typeof state_1 === "object") return state_1.value;
		switch (state_1) {
			case "continue-keys": continue keys;
		}
	}
}
/**
* @category primitives
* @since 1.0.0
*/
var nullType = new (function(_super) {
	__extends(NullType, _super);
	function NullType() {
		var _this = _super.call(this, "null", function(u) {
			return u === null;
		}, function(u, c) {
			return _this.is(u) ? success(u) : failure(u, c);
		}, identity) || this;
		/**
		* @since 1.0.0
		*/
		_this._tag = "NullType";
		return _this;
	}
	return NullType;
}(Type))();
var undefinedType = new (function(_super) {
	__extends(UndefinedType, _super);
	function UndefinedType() {
		var _this = _super.call(this, "undefined", function(u) {
			return u === void 0;
		}, function(u, c) {
			return _this.is(u) ? success(u) : failure(u, c);
		}, identity) || this;
		/**
		* @since 1.0.0
		*/
		_this._tag = "UndefinedType";
		return _this;
	}
	return UndefinedType;
}(Type))();
new (function(_super) {
	__extends(VoidType, _super);
	function VoidType() {
		var _this = _super.call(this, "void", undefinedType.is, undefinedType.validate, identity) || this;
		/**
		* @since 1.0.0
		*/
		_this._tag = "VoidType";
		return _this;
	}
	return VoidType;
}(Type))();
new (function(_super) {
	__extends(UnknownType, _super);
	function UnknownType() {
		var _this = _super.call(this, "unknown", function(_) {
			return true;
		}, success, identity) || this;
		/**
		* @since 1.0.0
		*/
		_this._tag = "UnknownType";
		return _this;
	}
	return UnknownType;
}(Type))();
/**
* @category primitives
* @since 1.0.0
*/
var string = new (function(_super) {
	__extends(StringType, _super);
	function StringType() {
		var _this = _super.call(this, "string", function(u) {
			return typeof u === "string";
		}, function(u, c) {
			return _this.is(u) ? success(u) : failure(u, c);
		}, identity) || this;
		/**
		* @since 1.0.0
		*/
		_this._tag = "StringType";
		return _this;
	}
	return StringType;
}(Type))();
/**
* @category primitives
* @since 1.0.0
*/
var number = new (function(_super) {
	__extends(NumberType, _super);
	function NumberType() {
		var _this = _super.call(this, "number", function(u) {
			return typeof u === "number";
		}, function(u, c) {
			return _this.is(u) ? success(u) : failure(u, c);
		}, identity) || this;
		/**
		* @since 1.0.0
		*/
		_this._tag = "NumberType";
		return _this;
	}
	return NumberType;
}(Type))();
new (function(_super) {
	__extends(BigIntType, _super);
	function BigIntType() {
		var _this = _super.call(this, "bigint", function(u) {
			return typeof u === "bigint";
		}, function(u, c) {
			return _this.is(u) ? success(u) : failure(u, c);
		}, identity) || this;
		/**
		* @since 1.0.0
		*/
		_this._tag = "BigIntType";
		return _this;
	}
	return BigIntType;
}(Type))();
new (function(_super) {
	__extends(BooleanType, _super);
	function BooleanType() {
		var _this = _super.call(this, "boolean", function(u) {
			return typeof u === "boolean";
		}, function(u, c) {
			return _this.is(u) ? success(u) : failure(u, c);
		}, identity) || this;
		/**
		* @since 1.0.0
		*/
		_this._tag = "BooleanType";
		return _this;
	}
	return BooleanType;
}(Type))();
/**
* @category primitives
* @since 1.7.1
*/
var UnknownArray = new (function(_super) {
	__extends(AnyArrayType, _super);
	function AnyArrayType() {
		var _this = _super.call(this, "UnknownArray", Array.isArray, function(u, c) {
			return _this.is(u) ? success(u) : failure(u, c);
		}, identity) || this;
		/**
		* @since 1.0.0
		*/
		_this._tag = "AnyArrayType";
		return _this;
	}
	return AnyArrayType;
}(Type))();
/**
* @category primitives
* @since 1.7.1
*/
var UnknownRecord = new (function(_super) {
	__extends(AnyDictionaryType, _super);
	function AnyDictionaryType() {
		var _this = _super.call(this, "UnknownRecord", function(u) {
			return u !== null && typeof u === "object" && !Array.isArray(u);
		}, function(u, c) {
			return _this.is(u) ? success(u) : failure(u, c);
		}, identity) || this;
		/**
		* @since 1.0.0
		*/
		_this._tag = "AnyDictionaryType";
		return _this;
	}
	return AnyDictionaryType;
}(Type))();
(function(_super) {
	__extends(LiteralType, _super);
	function LiteralType(name, is, validate, encode, value) {
		var _this = _super.call(this, name, is, validate, encode) || this;
		_this.value = value;
		/**
		* @since 1.0.0
		*/
		_this._tag = "LiteralType";
		return _this;
	}
	return LiteralType;
})(Type);
/**
* @since 1.0.0
*/
var KeyofType = function(_super) {
	__extends(KeyofType, _super);
	function KeyofType(name, is, validate, encode, keys) {
		var _this = _super.call(this, name, is, validate, encode) || this;
		_this.keys = keys;
		/**
		* @since 1.0.0
		*/
		_this._tag = "KeyofType";
		return _this;
	}
	return KeyofType;
}(Type);
/**
* @category constructors
* @since 1.0.0
*/
function keyof(keys, name) {
	if (name === void 0) name = Object.keys(keys).map(function(k) {
		return JSON.stringify(k);
	}).join(" | ");
	var is = function(u) {
		return string.is(u) && hasOwnProperty.call(keys, u);
	};
	return new KeyofType(name, is, function(u, c) {
		return is(u) ? success(u) : failure(u, c);
	}, identity, keys);
}
/**
* @since 1.0.0
*/
var RefinementType = function(_super) {
	__extends(RefinementType, _super);
	function RefinementType(name, is, validate, encode, type, predicate) {
		var _this = _super.call(this, name, is, validate, encode) || this;
		_this.type = type;
		_this.predicate = predicate;
		/**
		* @since 1.0.0
		*/
		_this._tag = "RefinementType";
		return _this;
	}
	return RefinementType;
}(Type);
/**
* @category combinators
* @since 1.8.1
*/
function brand(codec, predicate, name) {
	return refinement(codec, predicate, name);
}
brand(number, function(n) {
	return Number.isInteger(n);
}, "Int");
/**
* @since 1.0.0
*/
var RecursiveType = function(_super) {
	__extends(RecursiveType, _super);
	function RecursiveType(name, is, validate, encode, runDefinition) {
		var _this = _super.call(this, name, is, validate, encode) || this;
		_this.runDefinition = runDefinition;
		/**
		* @since 1.0.0
		*/
		_this._tag = "RecursiveType";
		return _this;
	}
	return RecursiveType;
}(Type);
Object.defineProperty(RecursiveType.prototype, "type", {
	get: function() {
		return this.runDefinition();
	},
	enumerable: true,
	configurable: true
});
/**
* @since 1.0.0
*/
var ArrayType = function(_super) {
	__extends(ArrayType, _super);
	function ArrayType(name, is, validate, encode, type) {
		var _this = _super.call(this, name, is, validate, encode) || this;
		_this.type = type;
		/**
		* @since 1.0.0
		*/
		_this._tag = "ArrayType";
		return _this;
	}
	return ArrayType;
}(Type);
/**
* @category combinators
* @since 1.0.0
*/
function array(item, name) {
	if (name === void 0) name = "Array<".concat(item.name, ">");
	return new ArrayType(name, function(u) {
		return UnknownArray.is(u) && u.every(item.is);
	}, function(u, c) {
		var e = UnknownArray.validate(u, c);
		if (isLeft(e)) return e;
		var us = e.right;
		var len = us.length;
		var as = us;
		var errors = [];
		for (var i = 0; i < len; i++) {
			var ui = us[i];
			var result = item.validate(ui, appendContext(c, String(i), item, ui));
			if (isLeft(result)) pushAll(errors, result.left);
			else {
				var ai = result.right;
				if (ai !== ui) {
					if (as === us) as = us.slice();
					as[i] = ai;
				}
			}
		}
		return errors.length > 0 ? failures(errors) : success(as);
	}, item.encode === identity ? identity : function(a) {
		return a.map(item.encode);
	}, item);
}
/**
* @since 1.0.0
*/
var InterfaceType = function(_super) {
	__extends(InterfaceType, _super);
	function InterfaceType(name, is, validate, encode, props) {
		var _this = _super.call(this, name, is, validate, encode) || this;
		_this.props = props;
		/**
		* @since 1.0.0
		*/
		_this._tag = "InterfaceType";
		return _this;
	}
	return InterfaceType;
}(Type);
/**
* @category combinators
* @since 1.0.0
*/
function type(props, name) {
	if (name === void 0) name = getInterfaceTypeName(props);
	var keys = Object.keys(props);
	var types = keys.map(function(key) {
		return props[key];
	});
	var len = keys.length;
	return new InterfaceType(name, function(u) {
		if (UnknownRecord.is(u)) {
			for (var i = 0; i < len; i++) {
				var k = keys[i];
				var uk = u[k];
				if (uk === void 0 && !hasOwnProperty.call(u, k) || !types[i].is(uk)) return false;
			}
			return true;
		}
		return false;
	}, function(u, c) {
		var e = UnknownRecord.validate(u, c);
		if (isLeft(e)) return e;
		var o = e.right;
		var a = o;
		var errors = [];
		for (var i = 0; i < len; i++) {
			var k = keys[i];
			var ak = a[k];
			var type_1 = types[i];
			var result = type_1.validate(ak, appendContext(c, k, type_1, ak));
			if (isLeft(result)) pushAll(errors, result.left);
			else {
				var vak = result.right;
				if (vak !== ak || vak === void 0 && !hasOwnProperty.call(a, k)) {
					/* istanbul ignore next */
					if (a === o) a = __assign({}, o);
					a[k] = vak;
				}
			}
		}
		return errors.length > 0 ? failures(errors) : success(a);
	}, useIdentity(types) ? identity : function(a) {
		var s = __assign({}, a);
		for (var i = 0; i < len; i++) {
			var k = keys[i];
			var encode = types[i].encode;
			if (encode !== identity) s[k] = encode(a[k]);
		}
		return s;
	}, props);
}
(function(_super) {
	__extends(PartialType, _super);
	function PartialType(name, is, validate, encode, props) {
		var _this = _super.call(this, name, is, validate, encode) || this;
		_this.props = props;
		/**
		* @since 1.0.0
		*/
		_this._tag = "PartialType";
		return _this;
	}
	return PartialType;
})(Type);
(function(_super) {
	__extends(DictionaryType, _super);
	function DictionaryType(name, is, validate, encode, domain, codomain) {
		var _this = _super.call(this, name, is, validate, encode) || this;
		_this.domain = domain;
		_this.codomain = codomain;
		/**
		* @since 1.0.0
		*/
		_this._tag = "DictionaryType";
		return _this;
	}
	return DictionaryType;
})(Type);
/**
* @since 1.0.0
*/
var UnionType = function(_super) {
	__extends(UnionType, _super);
	function UnionType(name, is, validate, encode, types) {
		var _this = _super.call(this, name, is, validate, encode) || this;
		_this.types = types;
		/**
		* @since 1.0.0
		*/
		_this._tag = "UnionType";
		return _this;
	}
	return UnionType;
}(Type);
/**
* @category combinators
* @since 1.0.0
*/
function union(codecs, name) {
	if (name === void 0) name = getUnionName(codecs);
	var index = getIndex(codecs);
	if (index !== void 0 && codecs.length > 0) {
		var tag_1 = index[0], groups_1 = index[1];
		var len_1 = groups_1.length;
		var find_1 = function(value) {
			for (var i = 0; i < len_1; i++) if (groups_1[i].indexOf(value) !== -1) return i;
		};
		return new TaggedUnionType(name, function(u) {
			if (UnknownRecord.is(u)) {
				var i = find_1(u[tag_1]);
				return i !== void 0 ? codecs[i].is(u) : false;
			}
			return false;
		}, function(u, c) {
			var e = UnknownRecord.validate(u, c);
			if (isLeft(e)) return e;
			var r = e.right;
			var i = find_1(r[tag_1]);
			if (i === void 0) return failure(u, c);
			var codec = codecs[i];
			return codec.validate(r, appendContext(c, String(i), codec, r));
		}, useIdentity(codecs) ? identity : function(a) {
			var i = find_1(a[tag_1]);
			if (i === void 0) throw new Error("no codec found to encode value in union codec ".concat(name));
			else return codecs[i].encode(a);
		}, codecs, tag_1);
	} else return new UnionType(name, function(u) {
		return codecs.some(function(type) {
			return type.is(u);
		});
	}, function(u, c) {
		var errors = [];
		for (var i = 0; i < codecs.length; i++) {
			var codec = codecs[i];
			var result = codec.validate(u, appendContext(c, String(i), codec, u));
			if (isLeft(result)) pushAll(errors, result.left);
			else return success(result.right);
		}
		return failures(errors);
	}, useIdentity(codecs) ? identity : function(a) {
		for (var _i = 0, codecs_1 = codecs; _i < codecs_1.length; _i++) {
			var codec = codecs_1[_i];
			if (codec.is(a)) return codec.encode(a);
		}
		throw new Error("no codec found to encode value in union type ".concat(name));
	}, codecs);
}
(function(_super) {
	__extends(IntersectionType, _super);
	function IntersectionType(name, is, validate, encode, types) {
		var _this = _super.call(this, name, is, validate, encode) || this;
		_this.types = types;
		/**
		* @since 1.0.0
		*/
		_this._tag = "IntersectionType";
		return _this;
	}
	return IntersectionType;
})(Type);
(function(_super) {
	__extends(TupleType, _super);
	function TupleType(name, is, validate, encode, types) {
		var _this = _super.call(this, name, is, validate, encode) || this;
		_this.types = types;
		/**
		* @since 1.0.0
		*/
		_this._tag = "TupleType";
		return _this;
	}
	return TupleType;
})(Type);
(function(_super) {
	__extends(ReadonlyType, _super);
	function ReadonlyType(name, is, validate, encode, type) {
		var _this = _super.call(this, name, is, validate, encode) || this;
		_this.type = type;
		/**
		* @since 1.0.0
		*/
		_this._tag = "ReadonlyType";
		return _this;
	}
	return ReadonlyType;
})(Type);
(function(_super) {
	__extends(ReadonlyArrayType, _super);
	function ReadonlyArrayType(name, is, validate, encode, type) {
		var _this = _super.call(this, name, is, validate, encode) || this;
		_this.type = type;
		/**
		* @since 1.0.0
		*/
		_this._tag = "ReadonlyArrayType";
		return _this;
	}
	return ReadonlyArrayType;
})(Type);
(function(_super) {
	__extends(ExactType, _super);
	function ExactType(name, is, validate, encode, type) {
		var _this = _super.call(this, name, is, validate, encode) || this;
		_this.type = type;
		/**
		* @since 1.0.0
		*/
		_this._tag = "ExactType";
		return _this;
	}
	return ExactType;
})(Type);
new (function(_super) {
	__extends(FunctionType, _super);
	function FunctionType() {
		var _this = _super.call(this, "Function", function(u) {
			return typeof u === "function";
		}, function(u, c) {
			return _this.is(u) ? success(u) : failure(u, c);
		}, identity) || this;
		/**
		* @since 1.0.0
		*/
		_this._tag = "FunctionType";
		return _this;
	}
	return FunctionType;
}(Type))();
new (function(_super) {
	__extends(NeverType, _super);
	function NeverType() {
		var _this = _super.call(
			this,
			"never",
			function(_) {
				return false;
			},
			function(u, c) {
				return failure(u, c);
			},
			/* istanbul ignore next */
			function() {
				throw new Error("cannot encode never");
			}
		) || this;
		/**
		* @since 1.0.0
		*/
		_this._tag = "NeverType";
		return _this;
	}
	return NeverType;
}(Type))();
new (function(_super) {
	__extends(AnyType, _super);
	function AnyType() {
		var _this = _super.call(this, "any", function(_) {
			return true;
		}, success, identity) || this;
		/**
		* @since 1.0.0
		*/
		_this._tag = "AnyType";
		return _this;
	}
	return AnyType;
}(Type))();
function refinement(codec, predicate, name) {
	if (name === void 0) name = "(".concat(codec.name, " | ").concat(getFunctionName(predicate), ")");
	return new RefinementType(name, function(u) {
		return codec.is(u) && predicate(u);
	}, function(i, c) {
		var e = codec.validate(i, c);
		if (isLeft(e)) return e;
		var a = e.right;
		return predicate(a) ? success(a) : failure(a, c);
	}, codec.encode, codec, predicate);
}
refinement(number, Number.isInteger, "Integer");
/**
* @since 1.3.0
* @deprecated
*/
var TaggedUnionType = function(_super) {
	__extends(TaggedUnionType, _super);
	function TaggedUnionType(name, is, validate, encode, codecs, tag) {
		var _this = _super.call(this, name, is, validate, encode, codecs) || this;
		_this.tag = tag;
		return _this;
	}
	return TaggedUnionType;
}(UnionType);
new (function(_super) {
	__extends(ObjectType, _super);
	function ObjectType() {
		var _this = _super.call(this, "object", function(u) {
			return u !== null && typeof u === "object";
		}, function(u, c) {
			return _this.is(u) ? success(u) : failure(u, c);
		}, identity) || this;
		/**
		* @since 1.0.0
		*/
		_this._tag = "ObjectType";
		return _this;
	}
	return ObjectType;
}(Type))();
(function(_super) {
	__extends(StrictType, _super);
	function StrictType(name, is, validate, encode, props) {
		var _this = _super.call(this, name, is, validate, encode) || this;
		_this.props = props;
		/**
		* @since 1.0.0
		*/
		_this._tag = "StrictType";
		return _this;
	}
	return StrictType;
})(Type);
/**
* @since 0.4.4
*/
/**
* Returns a codec from a refinement
*
* @since 0.4.4
*/
function fromRefinement(name, is) {
	return new Type(name, is, function(u, c) {
		return is(u) ? success(u) : failure(u, c);
	}, identity);
}
var isDate = function(u) {
	return u instanceof Date;
};
/**
* @since 0.5.0
*/
var date = fromRefinement("Date", isDate);
const stringWithLength = (min, max) => refinement(string, (s) => s.length >= min && s.length <= max, `string with length between ${min} and ${max}`);
const numberInRange = (min, max) => refinement(number, (n) => n >= min && n <= max, `number between ${min} and ${max}`);
const urlString = refinement(string, (s) => {
	try {
		new URL(s);
		return true;
	} catch {
		return false;
	}
}, "url");
const ImageData = type({
	id: number,
	created: date,
	title: stringWithLength(1, 100),
	type: keyof({
		jpg: null,
		png: null
	}),
	size: number,
	url: urlString
});
const RatingData = type({
	id: number,
	stars: numberInRange(0, 5),
	title: stringWithLength(1, 100),
	text: stringWithLength(1, 1e3),
	images: array(ImageData)
});
type({
	id: number,
	created: date,
	title: stringWithLength(1, 100),
	brand: stringWithLength(1, 30),
	description: stringWithLength(1, 500),
	price: numberInRange(1, 1e4),
	discount: union([numberInRange(1, 100), nullType]),
	quantity: numberInRange(0, 10),
	tags: array(stringWithLength(1, 30)),
	images: array(ImageData),
	ratings: array(RatingData)
}, "ProductData").decode({});
