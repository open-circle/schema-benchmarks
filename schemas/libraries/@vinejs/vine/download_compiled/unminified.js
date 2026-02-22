import "node:module";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJSMin = (cb, mod) => () => (mod || cb((mod = { exports: {} }).exports, mod), mod.exports);
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));
var require_dlv_umd = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	(function(t, n) {
		"object" == typeof exports && "undefined" != typeof module ? module.exports = function(t, n, e, i, o) {
			for (n = n.split ? n.split(".") : n, i = 0; i < n.length; i++) t = t ? t[n[i]] : o;
			return t === o ? e : t;
		} : "function" == typeof define && define.amd ? define(function() {
			return function(t, n, e, i, o) {
				for (n = n.split ? n.split(".") : n, i = 0; i < n.length; i++) t = t ? t[n[i]] : o;
				return t === o ? e : t;
			};
		}) : t.dlv = function(t, n, e, i, o) {
			for (n = n.split ? n.split(".") : n, i = 0; i < n.length; i++) t = t ? t[n[i]] : o;
			return t === o ? e : t;
		};
	})(exports);
}));
var require_dayjs_min = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	(function(t, e) {
		"object" == typeof exports && "undefined" != typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define(e) : (t = "undefined" != typeof globalThis ? globalThis : t || self).dayjs = e();
	})(exports, (function() {
		"use strict";
		var t = 1e3, e = 6e4, n = 36e5, r = "millisecond", i = "second", s = "minute", u = "hour", a = "day", o = "week", c = "month", f = "quarter", h = "year", d = "date", l = "Invalid Date", $ = /^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/, y = /\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g, M = {
			name: "en",
			weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),
			months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_"),
			ordinal: function(t) {
				var e = [
					"th",
					"st",
					"nd",
					"rd"
				], n = t % 100;
				return "[" + t + (e[(n - 20) % 10] || e[n] || e[0]) + "]";
			}
		}, m = function(t, e, n) {
			var r = String(t);
			return !r || r.length >= e ? t : "" + Array(e + 1 - r.length).join(n) + t;
		}, v = {
			s: m,
			z: function(t) {
				var e = -t.utcOffset(), n = Math.abs(e), r = Math.floor(n / 60), i = n % 60;
				return (e <= 0 ? "+" : "-") + m(r, 2, "0") + ":" + m(i, 2, "0");
			},
			m: function t(e, n) {
				if (e.date() < n.date()) return -t(n, e);
				var r = 12 * (n.year() - e.year()) + (n.month() - e.month()), i = e.clone().add(r, c), s = n - i < 0, u = e.clone().add(r + (s ? -1 : 1), c);
				return +(-(r + (n - i) / (s ? i - u : u - i)) || 0);
			},
			a: function(t) {
				return t < 0 ? Math.ceil(t) || 0 : Math.floor(t);
			},
			p: function(t) {
				return {
					M: c,
					y: h,
					w: o,
					d: a,
					D: d,
					h: u,
					m: s,
					s: i,
					ms: r,
					Q: f
				}[t] || String(t || "").toLowerCase().replace(/s$/, "");
			},
			u: function(t) {
				return void 0 === t;
			}
		}, g = "en", D = {};
		D[g] = M;
		var p = "$isDayjsObject", S = function(t) {
			return t instanceof _ || !(!t || !t[p]);
		}, w = function t(e, n, r) {
			var i;
			if (!e) return g;
			if ("string" == typeof e) {
				var s = e.toLowerCase();
				D[s] && (i = s), n && (D[s] = n, i = s);
				var u = e.split("-");
				if (!i && u.length > 1) return t(u[0]);
			} else {
				var a = e.name;
				D[a] = e, i = a;
			}
			return !r && i && (g = i), i || !r && g;
		}, O = function(t, e) {
			if (S(t)) return t.clone();
			var n = "object" == typeof e ? e : {};
			return n.date = t, n.args = arguments, new _(n);
		}, b = v;
		b.l = w, b.i = S, b.w = function(t, e) {
			return O(t, {
				locale: e.$L,
				utc: e.$u,
				x: e.$x,
				$offset: e.$offset
			});
		};
		var _ = function() {
			function M(t) {
				this.$L = w(t.locale, null, !0), this.parse(t), this.$x = this.$x || t.x || {}, this[p] = !0;
			}
			var m = M.prototype;
			return m.parse = function(t) {
				this.$d = function(t) {
					var e = t.date, n = t.utc;
					if (null === e) return /* @__PURE__ */ new Date(NaN);
					if (b.u(e)) return /* @__PURE__ */ new Date();
					if (e instanceof Date) return new Date(e);
					if ("string" == typeof e && !/Z$/i.test(e)) {
						var r = e.match($);
						if (r) {
							var i = r[2] - 1 || 0, s = (r[7] || "0").substring(0, 3);
							return n ? new Date(Date.UTC(r[1], i, r[3] || 1, r[4] || 0, r[5] || 0, r[6] || 0, s)) : new Date(r[1], i, r[3] || 1, r[4] || 0, r[5] || 0, r[6] || 0, s);
						}
					}
					return new Date(e);
				}(t), this.init();
			}, m.init = function() {
				var t = this.$d;
				this.$y = t.getFullYear(), this.$M = t.getMonth(), this.$D = t.getDate(), this.$W = t.getDay(), this.$H = t.getHours(), this.$m = t.getMinutes(), this.$s = t.getSeconds(), this.$ms = t.getMilliseconds();
			}, m.$utils = function() {
				return b;
			}, m.isValid = function() {
				return !(this.$d.toString() === l);
			}, m.isSame = function(t, e) {
				var n = O(t);
				return this.startOf(e) <= n && n <= this.endOf(e);
			}, m.isAfter = function(t, e) {
				return O(t) < this.startOf(e);
			}, m.isBefore = function(t, e) {
				return this.endOf(e) < O(t);
			}, m.$g = function(t, e, n) {
				return b.u(t) ? this[e] : this.set(n, t);
			}, m.unix = function() {
				return Math.floor(this.valueOf() / 1e3);
			}, m.valueOf = function() {
				return this.$d.getTime();
			}, m.startOf = function(t, e) {
				var n = this, r = !!b.u(e) || e, f = b.p(t), l = function(t, e) {
					var i = b.w(n.$u ? Date.UTC(n.$y, e, t) : new Date(n.$y, e, t), n);
					return r ? i : i.endOf(a);
				}, $ = function(t, e) {
					return b.w(n.toDate()[t].apply(n.toDate("s"), (r ? [
						0,
						0,
						0,
						0
					] : [
						23,
						59,
						59,
						999
					]).slice(e)), n);
				}, y = this.$W, M = this.$M, m = this.$D, v = "set" + (this.$u ? "UTC" : "");
				switch (f) {
					case h: return r ? l(1, 0) : l(31, 11);
					case c: return r ? l(1, M) : l(0, M + 1);
					case o:
						var g = this.$locale().weekStart || 0, D = (y < g ? y + 7 : y) - g;
						return l(r ? m - D : m + (6 - D), M);
					case a:
					case d: return $(v + "Hours", 0);
					case u: return $(v + "Minutes", 1);
					case s: return $(v + "Seconds", 2);
					case i: return $(v + "Milliseconds", 3);
					default: return this.clone();
				}
			}, m.endOf = function(t) {
				return this.startOf(t, !1);
			}, m.$set = function(t, e) {
				var n, o = b.p(t), f = "set" + (this.$u ? "UTC" : ""), l = (n = {}, n[a] = f + "Date", n[d] = f + "Date", n[c] = f + "Month", n[h] = f + "FullYear", n[u] = f + "Hours", n[s] = f + "Minutes", n[i] = f + "Seconds", n[r] = f + "Milliseconds", n)[o], $ = o === a ? this.$D + (e - this.$W) : e;
				if (o === c || o === h) {
					var y = this.clone().set(d, 1);
					y.$d[l]($), y.init(), this.$d = y.set(d, Math.min(this.$D, y.daysInMonth())).$d;
				} else l && this.$d[l]($);
				return this.init(), this;
			}, m.set = function(t, e) {
				return this.clone().$set(t, e);
			}, m.get = function(t) {
				return this[b.p(t)]();
			}, m.add = function(r, f) {
				var d, l = this;
				r = Number(r);
				var $ = b.p(f), y = function(t) {
					var e = O(l);
					return b.w(e.date(e.date() + Math.round(t * r)), l);
				};
				if ($ === c) return this.set(c, this.$M + r);
				if ($ === h) return this.set(h, this.$y + r);
				if ($ === a) return y(1);
				if ($ === o) return y(7);
				var M = (d = {}, d[s] = e, d[u] = n, d[i] = t, d)[$] || 1, m = this.$d.getTime() + r * M;
				return b.w(m, this);
			}, m.subtract = function(t, e) {
				return this.add(-1 * t, e);
			}, m.format = function(t) {
				var e = this, n = this.$locale();
				if (!this.isValid()) return n.invalidDate || l;
				var r = t || "YYYY-MM-DDTHH:mm:ssZ", i = b.z(this), s = this.$H, u = this.$m, a = this.$M, o = n.weekdays, c = n.months, f = n.meridiem, h = function(t, n, i, s) {
					return t && (t[n] || t(e, r)) || i[n].slice(0, s);
				}, d = function(t) {
					return b.s(s % 12 || 12, t, "0");
				}, $ = f || function(t, e, n) {
					var r = t < 12 ? "AM" : "PM";
					return n ? r.toLowerCase() : r;
				};
				return r.replace(y, (function(t, r) {
					return r || function(t) {
						switch (t) {
							case "YY": return String(e.$y).slice(-2);
							case "YYYY": return b.s(e.$y, 4, "0");
							case "M": return a + 1;
							case "MM": return b.s(a + 1, 2, "0");
							case "MMM": return h(n.monthsShort, a, c, 3);
							case "MMMM": return h(c, a);
							case "D": return e.$D;
							case "DD": return b.s(e.$D, 2, "0");
							case "d": return String(e.$W);
							case "dd": return h(n.weekdaysMin, e.$W, o, 2);
							case "ddd": return h(n.weekdaysShort, e.$W, o, 3);
							case "dddd": return o[e.$W];
							case "H": return String(s);
							case "HH": return b.s(s, 2, "0");
							case "h": return d(1);
							case "hh": return d(2);
							case "a": return $(s, u, !0);
							case "A": return $(s, u, !1);
							case "m": return String(u);
							case "mm": return b.s(u, 2, "0");
							case "s": return String(e.$s);
							case "ss": return b.s(e.$s, 2, "0");
							case "SSS": return b.s(e.$ms, 3, "0");
							case "Z": return i;
						}
						return null;
					}(t) || i.replace(":", "");
				}));
			}, m.utcOffset = function() {
				return 15 * -Math.round(this.$d.getTimezoneOffset() / 15);
			}, m.diff = function(r, d, l) {
				var $, y = this, M = b.p(d), m = O(r), v = (m.utcOffset() - this.utcOffset()) * e, g = this - m, D = function() {
					return b.m(y, m);
				};
				switch (M) {
					case h:
						$ = D() / 12;
						break;
					case c:
						$ = D();
						break;
					case f:
						$ = D() / 3;
						break;
					case o:
						$ = (g - v) / 6048e5;
						break;
					case a:
						$ = (g - v) / 864e5;
						break;
					case u:
						$ = g / n;
						break;
					case s:
						$ = g / e;
						break;
					case i:
						$ = g / t;
						break;
					default: $ = g;
				}
				return l ? $ : b.a($);
			}, m.daysInMonth = function() {
				return this.endOf(c).$D;
			}, m.$locale = function() {
				return D[this.$L];
			}, m.locale = function(t, e) {
				if (!t) return this.$L;
				var n = this.clone(), r = w(t, e, !0);
				return r && (n.$L = r), n;
			}, m.clone = function() {
				return b.w(this.$d, this);
			}, m.toDate = function() {
				return new Date(this.valueOf());
			}, m.toJSON = function() {
				return this.isValid() ? this.toISOString() : null;
			}, m.toISOString = function() {
				return this.$d.toISOString();
			}, m.toString = function() {
				return this.$d.toUTCString();
			}, M;
		}(), k = _.prototype;
		return O.prototype = k, [
			["$ms", r],
			["$s", i],
			["$m", s],
			["$H", u],
			["$W", a],
			["$M", c],
			["$y", h],
			["$D", d]
		].forEach((function(t) {
			k[t[1]] = function(e) {
				return this.$g(e, t[0], t[1]);
			};
		})), O.extend = function(t, e) {
			return t.$i || (t(e, _, O), t.$i = !0), O;
		}, O.locale = w, O.isDayjs = S, O.unix = function(t) {
			return O(1e3 * t);
		}, O.en = D[g], O.Ls = D, O.p = {}, O;
	}));
}));
var require_assertString = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = assertString;
	function assertString(input) {
		if (input === void 0 || input === null) throw new TypeError("Expected a string but received a ".concat(input));
		if (input.constructor.name !== "String") throw new TypeError("Expected a string but received a ".concat(input.constructor.name));
	}
	module.exports = exports.default;
	module.exports.default = exports.default;
}));
var require_isIP = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = isIP;
	var _assertString = _interopRequireDefault(require_assertString());
	function _interopRequireDefault(e) {
		return e && e.__esModule ? e : { default: e };
	}
	function _typeof(o) {
		"@babel/helpers - typeof";
		return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
			return typeof o;
		} : function(o) {
			return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
		}, _typeof(o);
	}
	/**
	11.3.  Examples
	
	The following addresses
	
	fe80::1234 (on the 1st link of the node)
	ff02::5678 (on the 5th link of the node)
	ff08::9abc (on the 10th organization of the node)
	
	would be represented as follows:
	
	fe80::1234%1
	ff02::5678%5
	ff08::9abc%10
	
	(Here we assume a natural translation from a zone index to the
	<zone_id> part, where the Nth zone of any scope is translated into
	"N".)
	
	If we use interface names as <zone_id>, those addresses could also be
	represented as follows:
	
	fe80::1234%ne0
	ff02::5678%pvc1.3
	ff08::9abc%interface10
	
	where the interface "ne0" belongs to the 1st link, "pvc1.3" belongs
	to the 5th link, and "interface10" belongs to the 10th organization.
	* * */
	var IPv4SegmentFormat = "(?:[0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])";
	var IPv4AddressFormat = "(".concat(IPv4SegmentFormat, "[.]){3}").concat(IPv4SegmentFormat);
	var IPv4AddressRegExp = new RegExp("^".concat(IPv4AddressFormat, "$"));
	var IPv6SegmentFormat = "(?:[0-9a-fA-F]{1,4})";
	var IPv6AddressRegExp = new RegExp("^(" + "(?:".concat(IPv6SegmentFormat, ":){7}(?:").concat(IPv6SegmentFormat, "|:)|") + "(?:".concat(IPv6SegmentFormat, ":){6}(?:").concat(IPv4AddressFormat, "|:").concat(IPv6SegmentFormat, "|:)|") + "(?:".concat(IPv6SegmentFormat, ":){5}(?::").concat(IPv4AddressFormat, "|(:").concat(IPv6SegmentFormat, "){1,2}|:)|") + "(?:".concat(IPv6SegmentFormat, ":){4}(?:(:").concat(IPv6SegmentFormat, "){0,1}:").concat(IPv4AddressFormat, "|(:").concat(IPv6SegmentFormat, "){1,3}|:)|") + "(?:".concat(IPv6SegmentFormat, ":){3}(?:(:").concat(IPv6SegmentFormat, "){0,2}:").concat(IPv4AddressFormat, "|(:").concat(IPv6SegmentFormat, "){1,4}|:)|") + "(?:".concat(IPv6SegmentFormat, ":){2}(?:(:").concat(IPv6SegmentFormat, "){0,3}:").concat(IPv4AddressFormat, "|(:").concat(IPv6SegmentFormat, "){1,5}|:)|") + "(?:".concat(IPv6SegmentFormat, ":){1}(?:(:").concat(IPv6SegmentFormat, "){0,4}:").concat(IPv4AddressFormat, "|(:").concat(IPv6SegmentFormat, "){1,6}|:)|") + "(?::((?::".concat(IPv6SegmentFormat, "){0,5}:").concat(IPv4AddressFormat, "|(?::").concat(IPv6SegmentFormat, "){1,7}|:))") + ")(%[0-9a-zA-Z.]{1,})?$");
	function isIP(ipAddress) {
		var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
		(0, _assertString.default)(ipAddress);
		var version = (_typeof(options) === "object" ? options.version : arguments[1]) || "";
		if (!version) return isIP(ipAddress, { version: 4 }) || isIP(ipAddress, { version: 6 });
		if (version.toString() === "4") return IPv4AddressRegExp.test(ipAddress);
		if (version.toString() === "6") return IPv6AddressRegExp.test(ipAddress);
		return false;
	}
	module.exports = exports.default;
	module.exports.default = exports.default;
}));
var require_merge = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = merge;
	function merge() {
		var obj = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
		var defaults = arguments.length > 1 ? arguments[1] : void 0;
		for (var key in defaults) if (typeof obj[key] === "undefined") obj[key] = defaults[key];
		return obj;
	}
	module.exports = exports.default;
	module.exports.default = exports.default;
}));
var require_isBase64 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = isBase64;
	var _assertString = _interopRequireDefault(require_assertString());
	var _merge = _interopRequireDefault(require_merge());
	function _interopRequireDefault(e) {
		return e && e.__esModule ? e : { default: e };
	}
	var base64WithPadding = /^[A-Za-z0-9+/]+={0,2}$/;
	var base64WithoutPadding = /^[A-Za-z0-9+/]+$/;
	var base64UrlWithPadding = /^[A-Za-z0-9_-]+={0,2}$/;
	var base64UrlWithoutPadding = /^[A-Za-z0-9_-]+$/;
	function isBase64(str, options) {
		var _options;
		(0, _assertString.default)(str);
		options = (0, _merge.default)(options, {
			urlSafe: false,
			padding: !((_options = options) !== null && _options !== void 0 && _options.urlSafe)
		});
		if (str === "") return true;
		if (options.padding && str.length % 4 !== 0) return false;
		var regex;
		if (options.urlSafe) regex = options.padding ? base64UrlWithPadding : base64UrlWithoutPadding;
		else regex = options.padding ? base64WithPadding : base64WithoutPadding;
		return (!options.padding || str.length % 4 === 0) && regex.test(str);
	}
	module.exports = exports.default;
	module.exports.default = exports.default;
}));
var require_isJWT = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = isJWT;
	var _assertString = _interopRequireDefault(require_assertString());
	var _isBase = _interopRequireDefault(require_isBase64());
	function _interopRequireDefault(e) {
		return e && e.__esModule ? e : { default: e };
	}
	function isJWT(str) {
		(0, _assertString.default)(str);
		var dotSplit = str.split(".");
		if (dotSplit.length !== 3) return false;
		return dotSplit.reduce(function(acc, currElem) {
			return acc && (0, _isBase.default)(currElem, { urlSafe: true });
		}, true);
	}
	module.exports = exports.default;
	module.exports.default = exports.default;
}));
var require_checkHost = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = checkHost;
	function isRegExp(obj) {
		return Object.prototype.toString.call(obj) === "[object RegExp]";
	}
	function checkHost(host, matches) {
		for (var i = 0; i < matches.length; i++) {
			var match = matches[i];
			if (host === match || isRegExp(match) && match.test(host)) return true;
		}
		return false;
	}
	module.exports = exports.default;
	module.exports.default = exports.default;
}));
var require_includesString = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = void 0;
	exports.default = function includes(str, val) {
		return str.indexOf(val) !== -1;
	};
	module.exports = exports.default;
	module.exports.default = exports.default;
}));
var require_isFQDN = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = isFQDN;
	var _assertString = _interopRequireDefault(require_assertString());
	var _merge = _interopRequireDefault(require_merge());
	function _interopRequireDefault(e) {
		return e && e.__esModule ? e : { default: e };
	}
	var default_fqdn_options = {
		require_tld: true,
		allow_underscores: false,
		allow_trailing_dot: false,
		allow_numeric_tld: false,
		allow_wildcard: false,
		ignore_max_length: false
	};
	function isFQDN(str, options) {
		(0, _assertString.default)(str);
		options = (0, _merge.default)(options, default_fqdn_options);
		if (options.allow_trailing_dot && str[str.length - 1] === ".") str = str.substring(0, str.length - 1);
		if (options.allow_wildcard === true && str.indexOf("*.") === 0) str = str.substring(2);
		var parts = str.split(".");
		var tld = parts[parts.length - 1];
		if (options.require_tld) {
			if (parts.length < 2) return false;
			if (!options.allow_numeric_tld && !/^([a-z\u00A1-\u00A8\u00AA-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]{2,}|xn[a-z0-9-]{2,})$/i.test(tld)) return false;
			if (/\s/.test(tld)) return false;
		}
		if (!options.allow_numeric_tld && /^\d+$/.test(tld)) return false;
		return parts.every(function(part) {
			if (part.length > 63 && !options.ignore_max_length) return false;
			if (!/^[a-z_\u00a1-\uffff0-9-]+$/i.test(part)) return false;
			if (/[\uff01-\uff5e]/.test(part)) return false;
			if (/^-|-$/.test(part)) return false;
			if (!options.allow_underscores && /_/.test(part)) return false;
			return true;
		});
	}
	module.exports = exports.default;
	module.exports.default = exports.default;
}));
var require_isURL = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = isURL;
	var _assertString = _interopRequireDefault(require_assertString());
	var _checkHost = _interopRequireDefault(require_checkHost());
	var _includesString = _interopRequireDefault(require_includesString());
	var _isFQDN = _interopRequireDefault(require_isFQDN());
	var _isIP = _interopRequireDefault(require_isIP());
	var _merge = _interopRequireDefault(require_merge());
	function _interopRequireDefault(e) {
		return e && e.__esModule ? e : { default: e };
	}
	function _slicedToArray(r, e) {
		return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest();
	}
	function _nonIterableRest() {
		throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
	}
	function _unsupportedIterableToArray(r, a) {
		if (r) {
			if ("string" == typeof r) return _arrayLikeToArray(r, a);
			var t = {}.toString.call(r).slice(8, -1);
			return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
		}
	}
	function _arrayLikeToArray(r, a) {
		(null == a || a > r.length) && (a = r.length);
		for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
		return n;
	}
	function _iterableToArrayLimit(r, l) {
		var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
		if (null != t) {
			var e, n, i, u, a = [], f = !0, o = !1;
			try {
				if (i = (t = t.call(r)).next, 0 === l) {
					if (Object(t) !== t) return;
					f = !1;
				} else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
			} catch (r) {
				o = !0, n = r;
			} finally {
				try {
					if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return;
				} finally {
					if (o) throw n;
				}
			}
			return a;
		}
	}
	function _arrayWithHoles(r) {
		if (Array.isArray(r)) return r;
	}
	var default_url_options = {
		protocols: [
			"http",
			"https",
			"ftp"
		],
		require_tld: true,
		require_protocol: false,
		require_host: true,
		require_port: false,
		require_valid_protocol: true,
		allow_underscores: false,
		allow_trailing_dot: false,
		allow_protocol_relative_urls: false,
		allow_fragments: true,
		allow_query_components: true,
		validate_length: true,
		max_allowed_length: 2084
	};
	var wrapped_ipv6 = /^\[([^\]]+)\](?::([0-9]+))?$/;
	function isURL(url, options) {
		(0, _assertString.default)(url);
		if (!url || /[\s<>]/.test(url)) return false;
		if (url.indexOf("mailto:") === 0) return false;
		options = (0, _merge.default)(options, default_url_options);
		if (options.validate_length && url.length > options.max_allowed_length) return false;
		if (!options.allow_fragments && (0, _includesString.default)(url, "#")) return false;
		if (!options.allow_query_components && ((0, _includesString.default)(url, "?") || (0, _includesString.default)(url, "&"))) return false;
		var protocol, auth, host, hostname, port, port_str, split = url.split("#"), ipv6;
		url = split.shift();
		split = url.split("?");
		url = split.shift();
		var protocol_match = url.match(/^([a-z][a-z0-9+\-.]*):/i);
		var had_explicit_protocol = false;
		var cleanUpProtocol = function cleanUpProtocol(potential_protocol) {
			had_explicit_protocol = true;
			protocol = potential_protocol.toLowerCase();
			if (options.require_valid_protocol && options.protocols.indexOf(protocol) === -1) return false;
			return url.substring(protocol_match[0].length);
		};
		if (protocol_match) {
			var potential_protocol = protocol_match[1];
			var after_colon = url.substring(protocol_match[0].length);
			if (!(after_colon.slice(0, 2) === "//")) {
				var first_slash_position = after_colon.indexOf("/");
				var before_slash = first_slash_position === -1 ? after_colon : after_colon.substring(0, first_slash_position);
				var at_position = before_slash.indexOf("@");
				if (at_position !== -1) {
					var before_at = before_slash.substring(0, at_position);
					var is_valid_auth = /^[a-zA-Z0-9\-_.%:]*$/.test(before_at);
					var has_encoded_content = /%[0-9a-fA-F]{2}/.test(before_at);
					if (is_valid_auth && !has_encoded_content) {
						if (options.require_protocol) return false;
					} else {
						url = cleanUpProtocol(potential_protocol);
						if (url === false) return false;
					}
				} else if (/^[0-9]/.test(after_colon)) {
					if (options.require_protocol) return false;
				} else {
					url = cleanUpProtocol(potential_protocol);
					if (url === false) return false;
				}
			} else {
				url = cleanUpProtocol(potential_protocol);
				if (url === false) return false;
			}
		} else if (options.require_protocol) return false;
		if (url.slice(0, 2) === "//") {
			if (!had_explicit_protocol && !options.allow_protocol_relative_urls) return false;
			url = url.slice(2);
		}
		if (url === "") return false;
		split = url.split("/");
		url = split.shift();
		if (url === "" && !options.require_host) return true;
		split = url.split("@");
		if (split.length > 1) {
			if (options.disallow_auth) return false;
			if (split[0] === "") return false;
			auth = split.shift();
			if (auth.indexOf(":") >= 0 && auth.split(":").length > 2) return false;
			var _auth$split2 = _slicedToArray(auth.split(":"), 2), user = _auth$split2[0], password = _auth$split2[1];
			if (user === "" && password === "") return false;
		}
		hostname = split.join("@");
		port_str = null;
		ipv6 = null;
		var ipv6_match = hostname.match(wrapped_ipv6);
		if (ipv6_match) {
			host = "";
			ipv6 = ipv6_match[1];
			port_str = ipv6_match[2] || null;
		} else {
			split = hostname.split(":");
			host = split.shift();
			if (split.length) port_str = split.join(":");
		}
		if (port_str !== null && port_str.length > 0) {
			port = parseInt(port_str, 10);
			if (!/^[0-9]+$/.test(port_str) || port <= 0 || port > 65535) return false;
		} else if (options.require_port) return false;
		if (options.host_whitelist) return (0, _checkHost.default)(host, options.host_whitelist);
		if (host === "" && !options.require_host) return true;
		if (!(0, _isIP.default)(host) && !(0, _isFQDN.default)(host, options) && (!ipv6 || !(0, _isIP.default)(ipv6, 6))) return false;
		host = host || ipv6;
		if (options.host_blacklist && (0, _checkHost.default)(host, options.host_blacklist)) return false;
		return true;
	}
	module.exports = exports.default;
	module.exports.default = exports.default;
}));
var require_isSlug = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = isSlug;
	var _assertString = _interopRequireDefault(require_assertString());
	function _interopRequireDefault(e) {
		return e && e.__esModule ? e : { default: e };
	}
	var charsetRegex = /^[^\s-_](?!.*?[-_]{2,})[a-z0-9-\\][^\s]*[^-_\s]$/;
	function isSlug(str) {
		(0, _assertString.default)(str);
		return charsetRegex.test(str);
	}
	module.exports = exports.default;
	module.exports.default = exports.default;
}));
var require_includesArray = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = void 0;
	exports.default = function includes(arr, val) {
		return arr.some(function(arrVal) {
			return val === arrVal;
		});
	};
	module.exports = exports.default;
	module.exports.default = exports.default;
}));
var require_isIBAN = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = isIBAN;
	exports.locales = void 0;
	var _assertString = _interopRequireDefault(require_assertString());
	var _includesArray = _interopRequireDefault(require_includesArray());
	function _interopRequireDefault(e) {
		return e && e.__esModule ? e : { default: e };
	}
	/**
	* List of country codes with
	* corresponding IBAN regular expression
	* Reference: https://en.wikipedia.org/wiki/International_Bank_Account_Number
	*/
	var ibanRegexThroughCountryCode = {
		AD: /^(AD[0-9]{2})\d{8}[A-Z0-9]{12}$/,
		AE: /^(AE[0-9]{2})\d{3}\d{16}$/,
		AL: /^(AL[0-9]{2})\d{8}[A-Z0-9]{16}$/,
		AT: /^(AT[0-9]{2})\d{16}$/,
		AZ: /^(AZ[0-9]{2})[A-Z0-9]{4}\d{20}$/,
		BA: /^(BA[0-9]{2})\d{16}$/,
		BE: /^(BE[0-9]{2})\d{12}$/,
		BG: /^(BG[0-9]{2})[A-Z]{4}\d{6}[A-Z0-9]{8}$/,
		BH: /^(BH[0-9]{2})[A-Z]{4}[A-Z0-9]{14}$/,
		BR: /^(BR[0-9]{2})\d{23}[A-Z]{1}[A-Z0-9]{1}$/,
		BY: /^(BY[0-9]{2})[A-Z0-9]{4}\d{20}$/,
		CH: /^(CH[0-9]{2})\d{5}[A-Z0-9]{12}$/,
		CR: /^(CR[0-9]{2})\d{18}$/,
		CY: /^(CY[0-9]{2})\d{8}[A-Z0-9]{16}$/,
		CZ: /^(CZ[0-9]{2})\d{20}$/,
		DE: /^(DE[0-9]{2})\d{18}$/,
		DK: /^(DK[0-9]{2})\d{14}$/,
		DO: /^(DO[0-9]{2})[A-Z]{4}\d{20}$/,
		DZ: /^(DZ\d{24})$/,
		EE: /^(EE[0-9]{2})\d{16}$/,
		EG: /^(EG[0-9]{2})\d{25}$/,
		ES: /^(ES[0-9]{2})\d{20}$/,
		FI: /^(FI[0-9]{2})\d{14}$/,
		FO: /^(FO[0-9]{2})\d{14}$/,
		FR: /^(FR[0-9]{2})\d{10}[A-Z0-9]{11}\d{2}$/,
		GB: /^(GB[0-9]{2})[A-Z]{4}\d{14}$/,
		GE: /^(GE[0-9]{2})[A-Z0-9]{2}\d{16}$/,
		GI: /^(GI[0-9]{2})[A-Z]{4}[A-Z0-9]{15}$/,
		GL: /^(GL[0-9]{2})\d{14}$/,
		GR: /^(GR[0-9]{2})\d{7}[A-Z0-9]{16}$/,
		GT: /^(GT[0-9]{2})[A-Z0-9]{4}[A-Z0-9]{20}$/,
		HR: /^(HR[0-9]{2})\d{17}$/,
		HU: /^(HU[0-9]{2})\d{24}$/,
		IE: /^(IE[0-9]{2})[A-Z]{4}\d{14}$/,
		IL: /^(IL[0-9]{2})\d{19}$/,
		IQ: /^(IQ[0-9]{2})[A-Z]{4}\d{15}$/,
		IR: /^(IR[0-9]{2})\d{22}$/,
		IS: /^(IS[0-9]{2})\d{22}$/,
		IT: /^(IT[0-9]{2})[A-Z]{1}\d{10}[A-Z0-9]{12}$/,
		JO: /^(JO[0-9]{2})[A-Z]{4}\d{22}$/,
		KW: /^(KW[0-9]{2})[A-Z]{4}[A-Z0-9]{22}$/,
		KZ: /^(KZ[0-9]{2})\d{3}[A-Z0-9]{13}$/,
		LB: /^(LB[0-9]{2})\d{4}[A-Z0-9]{20}$/,
		LC: /^(LC[0-9]{2})[A-Z]{4}[A-Z0-9]{24}$/,
		LI: /^(LI[0-9]{2})\d{5}[A-Z0-9]{12}$/,
		LT: /^(LT[0-9]{2})\d{16}$/,
		LU: /^(LU[0-9]{2})\d{3}[A-Z0-9]{13}$/,
		LV: /^(LV[0-9]{2})[A-Z]{4}[A-Z0-9]{13}$/,
		MA: /^(MA[0-9]{26})$/,
		MC: /^(MC[0-9]{2})\d{10}[A-Z0-9]{11}\d{2}$/,
		MD: /^(MD[0-9]{2})[A-Z0-9]{20}$/,
		ME: /^(ME[0-9]{2})\d{18}$/,
		MK: /^(MK[0-9]{2})\d{3}[A-Z0-9]{10}\d{2}$/,
		MR: /^(MR[0-9]{2})\d{23}$/,
		MT: /^(MT[0-9]{2})[A-Z]{4}\d{5}[A-Z0-9]{18}$/,
		MU: /^(MU[0-9]{2})[A-Z]{4}\d{19}[A-Z]{3}$/,
		MZ: /^(MZ[0-9]{2})\d{21}$/,
		NL: /^(NL[0-9]{2})[A-Z]{4}\d{10}$/,
		NO: /^(NO[0-9]{2})\d{11}$/,
		PK: /^(PK[0-9]{2})[A-Z0-9]{4}\d{16}$/,
		PL: /^(PL[0-9]{2})\d{24}$/,
		PS: /^(PS[0-9]{2})[A-Z]{4}[A-Z0-9]{21}$/,
		PT: /^(PT[0-9]{2})\d{21}$/,
		QA: /^(QA[0-9]{2})[A-Z]{4}[A-Z0-9]{21}$/,
		RO: /^(RO[0-9]{2})[A-Z]{4}[A-Z0-9]{16}$/,
		RS: /^(RS[0-9]{2})\d{18}$/,
		SA: /^(SA[0-9]{2})\d{2}[A-Z0-9]{18}$/,
		SC: /^(SC[0-9]{2})[A-Z]{4}\d{20}[A-Z]{3}$/,
		SE: /^(SE[0-9]{2})\d{20}$/,
		SI: /^(SI[0-9]{2})\d{15}$/,
		SK: /^(SK[0-9]{2})\d{20}$/,
		SM: /^(SM[0-9]{2})[A-Z]{1}\d{10}[A-Z0-9]{12}$/,
		SV: /^(SV[0-9]{2})[A-Z0-9]{4}\d{20}$/,
		TL: /^(TL[0-9]{2})\d{19}$/,
		TN: /^(TN[0-9]{2})\d{20}$/,
		TR: /^(TR[0-9]{2})\d{5}[A-Z0-9]{17}$/,
		UA: /^(UA[0-9]{2})\d{6}[A-Z0-9]{19}$/,
		VA: /^(VA[0-9]{2})\d{18}$/,
		VG: /^(VG[0-9]{2})[A-Z]{4}\d{16}$/,
		XK: /^(XK[0-9]{2})\d{16}$/
	};
	/**
	* Check if the country codes passed are valid using the
	* ibanRegexThroughCountryCode as a reference
	*
	* @param {array} countryCodeArray
	* @return {boolean}
	*/
	function hasOnlyValidCountryCodes(countryCodeArray) {
		if (countryCodeArray.filter(function(countryCode) {
			return !(countryCode in ibanRegexThroughCountryCode);
		}).length > 0) return false;
		return true;
	}
	/**
	* Check whether string has correct universal IBAN format
	* The IBAN consists of up to 34 alphanumeric characters, as follows:
	* Country Code using ISO 3166-1 alpha-2, two letters
	* check digits, two digits and
	* Basic Bank Account Number (BBAN), up to 30 alphanumeric characters.
	* NOTE: Permitted IBAN characters are: digits [0-9] and the 26 latin alphabetic [A-Z]
	*
	* @param {string} str - string under validation
	* @param {object} options - object to pass the countries to be either whitelisted or blacklisted
	* @return {boolean}
	*/
	function hasValidIbanFormat(str, options) {
		var strippedStr = str.replace(/[\s\-]+/gi, "").toUpperCase();
		var isoCountryCode = strippedStr.slice(0, 2).toUpperCase();
		var isoCountryCodeInIbanRegexCodeObject = isoCountryCode in ibanRegexThroughCountryCode;
		if (options.whitelist) {
			if (!hasOnlyValidCountryCodes(options.whitelist)) return false;
			if (!(0, _includesArray.default)(options.whitelist, isoCountryCode)) return false;
		}
		if (options.blacklist) {
			if ((0, _includesArray.default)(options.blacklist, isoCountryCode)) return false;
		}
		return isoCountryCodeInIbanRegexCodeObject && ibanRegexThroughCountryCode[isoCountryCode].test(strippedStr);
	}
	/**
	* Check whether string has valid IBAN Checksum
	* by performing basic mod-97 operation and
	* the remainder should equal 1
	* -- Start by rearranging the IBAN by moving the four initial characters to the end of the string
	* -- Replace each letter in the string with two digits, A -> 10, B = 11, Z = 35
	* -- Interpret the string as a decimal integer and
	* -- compute the remainder on division by 97 (mod 97)
	* Reference: https://en.wikipedia.org/wiki/International_Bank_Account_Number
	*
	* @param {string} str
	* @return {boolean}
	*/
	function hasValidIbanChecksum(str) {
		var strippedStr = str.replace(/[^A-Z0-9]+/gi, "").toUpperCase();
		return (strippedStr.slice(4) + strippedStr.slice(0, 4)).replace(/[A-Z]/g, function(char) {
			return char.charCodeAt(0) - 55;
		}).match(/\d{1,7}/g).reduce(function(acc, value) {
			return Number(acc + value) % 97;
		}, "") === 1;
	}
	function isIBAN(str) {
		var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
		(0, _assertString.default)(str);
		return hasValidIbanFormat(str, options) && hasValidIbanChecksum(str);
	}
	exports.locales = Object.keys(ibanRegexThroughCountryCode);
}));
var require_isUUID = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = isUUID;
	var _assertString = _interopRequireDefault(require_assertString());
	function _interopRequireDefault(e) {
		return e && e.__esModule ? e : { default: e };
	}
	var uuid = {
		1: /^[0-9A-F]{8}-[0-9A-F]{4}-1[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
		2: /^[0-9A-F]{8}-[0-9A-F]{4}-2[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
		3: /^[0-9A-F]{8}-[0-9A-F]{4}-3[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
		4: /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
		5: /^[0-9A-F]{8}-[0-9A-F]{4}-5[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
		6: /^[0-9A-F]{8}-[0-9A-F]{4}-6[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
		7: /^[0-9A-F]{8}-[0-9A-F]{4}-7[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
		8: /^[0-9A-F]{8}-[0-9A-F]{4}-8[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
		nil: /^00000000-0000-0000-0000-000000000000$/i,
		max: /^ffffffff-ffff-ffff-ffff-ffffffffffff$/i,
		loose: /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i,
		all: /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/i
	};
	function isUUID(str, version) {
		(0, _assertString.default)(str);
		if (version === void 0 || version === null) version = "all";
		return version in uuid ? uuid[version].test(str) : false;
	}
	module.exports = exports.default;
	module.exports.default = exports.default;
}));
var require_isAscii = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = isAscii;
	var _assertString = _interopRequireDefault(require_assertString());
	function _interopRequireDefault(e) {
		return e && e.__esModule ? e : { default: e };
	}
	var ascii = /^[\x00-\x7F]+$/;
	function isAscii(str) {
		(0, _assertString.default)(str);
		return ascii.test(str);
	}
	module.exports = exports.default;
	module.exports.default = exports.default;
}));
var require_isByteLength = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = isByteLength;
	var _assertString = _interopRequireDefault(require_assertString());
	function _interopRequireDefault(e) {
		return e && e.__esModule ? e : { default: e };
	}
	function _typeof(o) {
		"@babel/helpers - typeof";
		return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
			return typeof o;
		} : function(o) {
			return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
		}, _typeof(o);
	}
	function isByteLength(str, options) {
		(0, _assertString.default)(str);
		var min;
		var max;
		if (_typeof(options) === "object") {
			min = options.min || 0;
			max = options.max;
		} else {
			min = arguments[1];
			max = arguments[2];
		}
		var len = encodeURI(str).split(/%..|./).length - 1;
		return len >= min && (typeof max === "undefined" || len <= max);
	}
	module.exports = exports.default;
	module.exports.default = exports.default;
}));
var require_isEmail = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = isEmail;
	var _assertString = _interopRequireDefault(require_assertString());
	var _checkHost = _interopRequireDefault(require_checkHost());
	var _isByteLength = _interopRequireDefault(require_isByteLength());
	var _isFQDN = _interopRequireDefault(require_isFQDN());
	var _isIP = _interopRequireDefault(require_isIP());
	var _merge = _interopRequireDefault(require_merge());
	function _interopRequireDefault(e) {
		return e && e.__esModule ? e : { default: e };
	}
	var default_email_options = {
		allow_display_name: false,
		allow_underscores: false,
		require_display_name: false,
		allow_utf8_local_part: true,
		require_tld: true,
		blacklisted_chars: "",
		ignore_max_length: false,
		host_blacklist: [],
		host_whitelist: []
	};
	var splitNameAddress = /^([^\x00-\x1F\x7F-\x9F\cX]+)</i;
	var emailUserPart = /^[a-z\d!#\$%&'\*\+\-\/=\?\^_`{\|}~]+$/i;
	var gmailUserPart = /^[a-z\d]+$/;
	var quotedEmailUser = /^([\s\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e]|(\\[\x01-\x09\x0b\x0c\x0d-\x7f]))*$/i;
	var emailUserUtf8Part = /^[a-z\d!#\$%&'\*\+\-\/=\?\^_`{\|}~\u00A1-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+$/i;
	var quotedEmailUserUtf8 = /^([\s\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|(\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*$/i;
	var defaultMaxEmailLength = 254;
	/**
	* Validate display name according to the RFC2822: https://tools.ietf.org/html/rfc2822#appendix-A.1.2
	* @param {String} display_name
	*/
	function validateDisplayName(display_name) {
		var display_name_without_quotes = display_name.replace(/^"(.+)"$/, "$1");
		if (!display_name_without_quotes.trim()) return false;
		if (/[\.";<>]/.test(display_name_without_quotes)) {
			if (display_name_without_quotes === display_name) return false;
			if (!(display_name_without_quotes.split("\"").length === display_name_without_quotes.split("\\\"").length)) return false;
		}
		return true;
	}
	function isEmail(str, options) {
		(0, _assertString.default)(str);
		options = (0, _merge.default)(options, default_email_options);
		if (options.require_display_name || options.allow_display_name) {
			var display_email = str.match(splitNameAddress);
			if (display_email) {
				var display_name = display_email[1];
				str = str.replace(display_name, "").replace(/(^<|>$)/g, "");
				if (display_name.endsWith(" ")) display_name = display_name.slice(0, -1);
				if (!validateDisplayName(display_name)) return false;
			} else if (options.require_display_name) return false;
		}
		if (!options.ignore_max_length && str.length > defaultMaxEmailLength) return false;
		var parts = str.split("@");
		var domain = parts.pop();
		var lower_domain = domain.toLowerCase();
		if (options.host_blacklist.length > 0 && (0, _checkHost.default)(lower_domain, options.host_blacklist)) return false;
		if (options.host_whitelist.length > 0 && !(0, _checkHost.default)(lower_domain, options.host_whitelist)) return false;
		var user = parts.join("@");
		if (options.domain_specific_validation && (lower_domain === "gmail.com" || lower_domain === "googlemail.com")) {
			user = user.toLowerCase();
			var username = user.split("+")[0];
			if (!(0, _isByteLength.default)(username.replace(/\./g, ""), {
				min: 6,
				max: 30
			})) return false;
			var _user_parts = username.split(".");
			for (var i = 0; i < _user_parts.length; i++) if (!gmailUserPart.test(_user_parts[i])) return false;
		}
		if (options.ignore_max_length === false && (!(0, _isByteLength.default)(user, { max: 64 }) || !(0, _isByteLength.default)(domain, { max: 254 }))) return false;
		if (!(0, _isFQDN.default)(domain, {
			require_tld: options.require_tld,
			ignore_max_length: options.ignore_max_length,
			allow_underscores: options.allow_underscores
		})) {
			if (!options.allow_ip_domain) return false;
			if (!(0, _isIP.default)(domain)) {
				if (!domain.startsWith("[") || !domain.endsWith("]")) return false;
				var noBracketdomain = domain.slice(1, -1);
				if (noBracketdomain.length === 0 || !(0, _isIP.default)(noBracketdomain)) return false;
			}
		}
		if (options.blacklisted_chars) {
			if (user.search(new RegExp("[".concat(options.blacklisted_chars, "]+"), "g")) !== -1) return false;
		}
		if (user[0] === "\"" && user[user.length - 1] === "\"") {
			user = user.slice(1, user.length - 1);
			return options.allow_utf8_local_part ? quotedEmailUserUtf8.test(user) : quotedEmailUser.test(user);
		}
		var pattern = options.allow_utf8_local_part ? emailUserUtf8Part : emailUserPart;
		var user_parts = user.split(".");
		for (var _i = 0; _i < user_parts.length; _i++) if (!pattern.test(user_parts[_i])) return false;
		return true;
	}
	module.exports = exports.default;
	module.exports.default = exports.default;
}));
var require_alpha = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.farsiLocales = exports.englishLocales = exports.dotDecimal = exports.decimal = exports.commaDecimal = exports.bengaliLocales = exports.arabicLocales = exports.alphanumeric = exports.alpha = void 0;
	var alpha = exports.alpha = {
		"en-US": /^[A-Z]+$/i,
		"az-AZ": /^[A-VXYZÇƏĞİıÖŞÜ]+$/i,
		"bg-BG": /^[А-Я]+$/i,
		"cs-CZ": /^[A-ZÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ]+$/i,
		"da-DK": /^[A-ZÆØÅ]+$/i,
		"de-DE": /^[A-ZÄÖÜß]+$/i,
		"el-GR": /^[Α-ώ]+$/i,
		"es-ES": /^[A-ZÁÉÍÑÓÚÜ]+$/i,
		"fa-IR": /^[ابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهی]+$/i,
		"fi-FI": /^[A-ZÅÄÖ]+$/i,
		"fr-FR": /^[A-ZÀÂÆÇÉÈÊËÏÎÔŒÙÛÜŸ]+$/i,
		"it-IT": /^[A-ZÀÉÈÌÎÓÒÙ]+$/i,
		"ja-JP": /^[ぁ-んァ-ヶｦ-ﾟ一-龠ー・。、]+$/i,
		"nb-NO": /^[A-ZÆØÅ]+$/i,
		"nl-NL": /^[A-ZÁÉËÏÓÖÜÚ]+$/i,
		"nn-NO": /^[A-ZÆØÅ]+$/i,
		"hu-HU": /^[A-ZÁÉÍÓÖŐÚÜŰ]+$/i,
		"pl-PL": /^[A-ZĄĆĘŚŁŃÓŻŹ]+$/i,
		"pt-PT": /^[A-ZÃÁÀÂÄÇÉÊËÍÏÕÓÔÖÚÜ]+$/i,
		"ru-RU": /^[А-ЯЁ]+$/i,
		"kk-KZ": /^[А-ЯЁ\u04D8\u04B0\u0406\u04A2\u0492\u04AE\u049A\u04E8\u04BA]+$/i,
		"sl-SI": /^[A-ZČĆĐŠŽ]+$/i,
		"sk-SK": /^[A-ZÁČĎÉÍŇÓŠŤÚÝŽĹŔĽÄÔ]+$/i,
		"sr-RS@latin": /^[A-ZČĆŽŠĐ]+$/i,
		"sr-RS": /^[А-ЯЂЈЉЊЋЏ]+$/i,
		"sv-SE": /^[A-ZÅÄÖ]+$/i,
		"th-TH": /^[ก-๐\s]+$/i,
		"tr-TR": /^[A-ZÇĞİıÖŞÜ]+$/i,
		"uk-UA": /^[А-ЩЬЮЯЄIЇҐі]+$/i,
		"vi-VN": /^[A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴĐÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸ]+$/i,
		"ko-KR": /^[ㄱ-ㅎㅏ-ㅣ가-힣]*$/,
		"ku-IQ": /^[ئابپتجچحخدرڕزژسشعغفڤقکگلڵمنوۆھەیێيطؤثآإأكضصةظذ]+$/i,
		ar: /^[ءآأؤإئابةتثجحخدذرزسشصضطظعغفقكلمنهوىيًٌٍَُِّْٰ]+$/,
		he: /^[א-ת]+$/,
		fa: /^['آاءأؤئبپتثجچحخدذرزژسشصضطظعغفقکگلمنوهةی']+$/i,
		bn: /^['ঀঁংঃঅআইঈউঊঋঌএঐওঔকখগঘঙচছজঝঞটঠডঢণতথদধনপফবভমযরলশষসহ়ঽািীুূৃৄেৈোৌ্ৎৗড়ঢ়য়ৠৡৢৣৰৱ৲৳৴৵৶৷৸৹৺৻']+$/,
		eo: /^[ABCĈD-GĜHĤIJĴK-PRSŜTUŬVZ]+$/i,
		"hi-IN": /^[\u0900-\u0961]+[\u0972-\u097F]*$/i,
		"si-LK": /^[\u0D80-\u0DFF]+$/,
		"ta-IN": /^[\u0B80-\u0BFF]+$/i,
		"te-IN": /^[\u0C00-\u0C7F]+$/i,
		"kn-IN": /^[\u0C80-\u0CFF]+$/i,
		"ml-IN": /^[\u0D00-\u0D7F]+$/i,
		"gu-IN": /^[\u0A80-\u0AFF]+$/i,
		"pa-IN": /^[\u0A00-\u0A7F]+$/i,
		"or-IN": /^[\u0B00-\u0B7F]+$/i
	};
	var alphanumeric = exports.alphanumeric = {
		"en-US": /^[0-9A-Z]+$/i,
		"az-AZ": /^[0-9A-VXYZÇƏĞİıÖŞÜ]+$/i,
		"bg-BG": /^[0-9А-Я]+$/i,
		"cs-CZ": /^[0-9A-ZÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ]+$/i,
		"da-DK": /^[0-9A-ZÆØÅ]+$/i,
		"de-DE": /^[0-9A-ZÄÖÜß]+$/i,
		"el-GR": /^[0-9Α-ω]+$/i,
		"es-ES": /^[0-9A-ZÁÉÍÑÓÚÜ]+$/i,
		"fi-FI": /^[0-9A-ZÅÄÖ]+$/i,
		"fr-FR": /^[0-9A-ZÀÂÆÇÉÈÊËÏÎÔŒÙÛÜŸ]+$/i,
		"it-IT": /^[0-9A-ZÀÉÈÌÎÓÒÙ]+$/i,
		"ja-JP": /^[0-9０-９ぁ-んァ-ヶｦ-ﾟ一-龠ー・。、]+$/i,
		"hu-HU": /^[0-9A-ZÁÉÍÓÖŐÚÜŰ]+$/i,
		"nb-NO": /^[0-9A-ZÆØÅ]+$/i,
		"nl-NL": /^[0-9A-ZÁÉËÏÓÖÜÚ]+$/i,
		"nn-NO": /^[0-9A-ZÆØÅ]+$/i,
		"pl-PL": /^[0-9A-ZĄĆĘŚŁŃÓŻŹ]+$/i,
		"pt-PT": /^[0-9A-ZÃÁÀÂÄÇÉÊËÍÏÕÓÔÖÚÜ]+$/i,
		"ru-RU": /^[0-9А-ЯЁ]+$/i,
		"kk-KZ": /^[0-9А-ЯЁ\u04D8\u04B0\u0406\u04A2\u0492\u04AE\u049A\u04E8\u04BA]+$/i,
		"sl-SI": /^[0-9A-ZČĆĐŠŽ]+$/i,
		"sk-SK": /^[0-9A-ZÁČĎÉÍŇÓŠŤÚÝŽĹŔĽÄÔ]+$/i,
		"sr-RS@latin": /^[0-9A-ZČĆŽŠĐ]+$/i,
		"sr-RS": /^[0-9А-ЯЂЈЉЊЋЏ]+$/i,
		"sv-SE": /^[0-9A-ZÅÄÖ]+$/i,
		"th-TH": /^[ก-๙\s]+$/i,
		"tr-TR": /^[0-9A-ZÇĞİıÖŞÜ]+$/i,
		"uk-UA": /^[0-9А-ЩЬЮЯЄIЇҐі]+$/i,
		"ko-KR": /^[0-9ㄱ-ㅎㅏ-ㅣ가-힣]*$/,
		"ku-IQ": /^[٠١٢٣٤٥٦٧٨٩0-9ئابپتجچحخدرڕزژسشعغفڤقکگلڵمنوۆھەیێيطؤثآإأكضصةظذ]+$/i,
		"vi-VN": /^[0-9A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴĐÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸ]+$/i,
		ar: /^[٠١٢٣٤٥٦٧٨٩0-9ءآأؤإئابةتثجحخدذرزسشصضطظعغفقكلمنهوىيًٌٍَُِّْٰ]+$/,
		he: /^[0-9א-ת]+$/,
		fa: /^['0-9آاءأؤئبپتثجچحخدذرزژسشصضطظعغفقکگلمنوهةی۱۲۳۴۵۶۷۸۹۰']+$/i,
		bn: /^['ঀঁংঃঅআইঈউঊঋঌএঐওঔকখগঘঙচছজঝঞটঠডঢণতথদধনপফবভমযরলশষসহ়ঽািীুূৃৄেৈোৌ্ৎৗড়ঢ়য়ৠৡৢৣ০১২৩৪৫৬৭৮৯ৰৱ৲৳৴৵৶৷৸৹৺৻']+$/,
		eo: /^[0-9ABCĈD-GĜHĤIJĴK-PRSŜTUŬVZ]+$/i,
		"hi-IN": /^[\u0900-\u0963]+[\u0966-\u097F]*$/i,
		"si-LK": /^[0-9\u0D80-\u0DFF]+$/,
		"ta-IN": /^[0-9\u0B80-\u0BFF.]+$/i,
		"te-IN": /^[0-9\u0C00-\u0C7F.]+$/i,
		"kn-IN": /^[0-9\u0C80-\u0CFF.]+$/i,
		"ml-IN": /^[0-9\u0D00-\u0D7F.]+$/i,
		"gu-IN": /^[0-9\u0A80-\u0AFF.]+$/i,
		"pa-IN": /^[0-9\u0A00-\u0A7F.]+$/i,
		"or-IN": /^[0-9\u0B00-\u0B7F.]+$/i
	};
	var decimal = exports.decimal = {
		"en-US": ".",
		ar: "٫"
	};
	var englishLocales = exports.englishLocales = [
		"AU",
		"GB",
		"HK",
		"IN",
		"NZ",
		"ZA",
		"ZM"
	];
	for (var locale, i = 0; i < englishLocales.length; i++) {
		locale = "en-".concat(englishLocales[i]);
		alpha[locale] = alpha["en-US"];
		alphanumeric[locale] = alphanumeric["en-US"];
		decimal[locale] = decimal["en-US"];
	}
	var arabicLocales = exports.arabicLocales = [
		"AE",
		"BH",
		"DZ",
		"EG",
		"IQ",
		"JO",
		"KW",
		"LB",
		"LY",
		"MA",
		"QM",
		"QA",
		"SA",
		"SD",
		"SY",
		"TN",
		"YE"
	];
	for (var _locale, _i = 0; _i < arabicLocales.length; _i++) {
		_locale = "ar-".concat(arabicLocales[_i]);
		alpha[_locale] = alpha.ar;
		alphanumeric[_locale] = alphanumeric.ar;
		decimal[_locale] = decimal.ar;
	}
	var farsiLocales = exports.farsiLocales = ["IR", "AF"];
	for (var _locale2, _i2 = 0; _i2 < farsiLocales.length; _i2++) {
		_locale2 = "fa-".concat(farsiLocales[_i2]);
		alphanumeric[_locale2] = alphanumeric.fa;
		decimal[_locale2] = decimal.ar;
	}
	var bengaliLocales = exports.bengaliLocales = ["BD", "IN"];
	for (var _locale3, _i3 = 0; _i3 < bengaliLocales.length; _i3++) {
		_locale3 = "bn-".concat(bengaliLocales[_i3]);
		alpha[_locale3] = alpha.bn;
		alphanumeric[_locale3] = alphanumeric.bn;
		decimal[_locale3] = decimal["en-US"];
	}
	var dotDecimal = exports.dotDecimal = [
		"ar-EG",
		"ar-LB",
		"ar-LY"
	];
	var commaDecimal = exports.commaDecimal = [
		"bg-BG",
		"cs-CZ",
		"da-DK",
		"de-DE",
		"el-GR",
		"en-ZM",
		"eo",
		"es-ES",
		"fr-CA",
		"fr-FR",
		"gu-IN",
		"hi-IN",
		"hu-HU",
		"id-ID",
		"it-IT",
		"kk-KZ",
		"kn-IN",
		"ku-IQ",
		"ml-IN",
		"nb-NO",
		"nl-NL",
		"nn-NO",
		"or-IN",
		"pa-IN",
		"pl-PL",
		"pt-PT",
		"ru-RU",
		"si-LK",
		"sl-SI",
		"sr-RS",
		"sr-RS@latin",
		"sv-SE",
		"ta-IN",
		"te-IN",
		"tr-TR",
		"uk-UA",
		"vi-VN"
	];
	for (var _i4 = 0; _i4 < dotDecimal.length; _i4++) decimal[dotDecimal[_i4]] = decimal["en-US"];
	for (var _i5 = 0; _i5 < commaDecimal.length; _i5++) decimal[commaDecimal[_i5]] = ",";
	alpha["fr-CA"] = alpha["fr-FR"];
	alphanumeric["fr-CA"] = alphanumeric["fr-FR"];
	alpha["pt-BR"] = alpha["pt-PT"];
	alphanumeric["pt-BR"] = alphanumeric["pt-PT"];
	decimal["pt-BR"] = decimal["pt-PT"];
	alpha["pl-Pl"] = alpha["pl-PL"];
	alphanumeric["pl-Pl"] = alphanumeric["pl-PL"];
	decimal["pl-Pl"] = decimal["pl-PL"];
	alpha["fa-AF"] = alpha.fa;
}));
var require_isAlpha = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = isAlpha;
	exports.locales = void 0;
	var _assertString = _interopRequireDefault(require_assertString());
	var _alpha = require_alpha();
	function _interopRequireDefault(e) {
		return e && e.__esModule ? e : { default: e };
	}
	function isAlpha(_str) {
		var locale = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "en-US";
		var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
		(0, _assertString.default)(_str);
		var str = _str;
		var ignore = options.ignore;
		if (ignore) if (ignore instanceof RegExp) str = str.replace(ignore, "");
		else if (typeof ignore === "string") str = str.replace(new RegExp("[".concat(ignore.replace(/[-[\]{}()*+?.,\\^$|#\\s]/g, "\\$&"), "]"), "g"), "");
		else throw new Error("ignore should be instance of a String or RegExp");
		if (locale in _alpha.alpha) return _alpha.alpha[locale].test(str);
		throw new Error("Invalid locale '".concat(locale, "'"));
	}
	exports.locales = Object.keys(_alpha.alpha);
}));
var require_isLatLong = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = isLatLong;
	var _assertString = _interopRequireDefault(require_assertString());
	var _merge = _interopRequireDefault(require_merge());
	var _includesString = _interopRequireDefault(require_includesString());
	function _interopRequireDefault(e) {
		return e && e.__esModule ? e : { default: e };
	}
	var lat = /^\(?[+-]?(90(\.0+)?|[1-8]?\d(\.\d+)?)$/;
	var long = /^\s?[+-]?(180(\.0+)?|1[0-7]\d(\.\d+)?|\d{1,2}(\.\d+)?)\)?$/;
	var latDMS = /^(([1-8]?\d)\D+([1-5]?\d|60)\D+([1-5]?\d|60)(\.\d+)?|90\D+0\D+0)\D+[NSns]?$/i;
	var longDMS = /^\s*([1-7]?\d{1,2}\D+([1-5]?\d|60)\D+([1-5]?\d|60)(\.\d+)?|180\D+0\D+0)\D+[EWew]?$/i;
	var defaultLatLongOptions = { checkDMS: false };
	function isLatLong(str, options) {
		(0, _assertString.default)(str);
		options = (0, _merge.default)(options, defaultLatLongOptions);
		if (!(0, _includesString.default)(str, ",")) return false;
		var pair = str.split(",");
		if (pair[0].startsWith("(") && !pair[1].endsWith(")") || pair[1].endsWith(")") && !pair[0].startsWith("(")) return false;
		if (options.checkDMS) return latDMS.test(pair[0]) && longDMS.test(pair[1]);
		return lat.test(pair[0]) && long.test(pair[1]);
	}
	module.exports = exports.default;
	module.exports.default = exports.default;
}));
var require_isDecimal = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = isDecimal;
	var _merge = _interopRequireDefault(require_merge());
	var _assertString = _interopRequireDefault(require_assertString());
	var _includesArray = _interopRequireDefault(require_includesArray());
	var _alpha = require_alpha();
	function _interopRequireDefault(e) {
		return e && e.__esModule ? e : { default: e };
	}
	function decimalRegExp(options) {
		return new RegExp("^[-+]?([0-9]+)?(\\".concat(_alpha.decimal[options.locale], "[0-9]{").concat(options.decimal_digits, "})").concat(options.force_decimal ? "" : "?", "$"));
	}
	var default_decimal_options = {
		force_decimal: false,
		decimal_digits: "1,",
		locale: "en-US"
	};
	var blacklist = [
		"",
		"-",
		"+"
	];
	function isDecimal(str, options) {
		(0, _assertString.default)(str);
		options = (0, _merge.default)(options, default_decimal_options);
		if (options.locale in _alpha.decimal) return !(0, _includesArray.default)(blacklist, str.replace(/ /g, "")) && decimalRegExp(options).test(str);
		throw new Error("Invalid locale '".concat(options.locale, "'"));
	}
	module.exports = exports.default;
	module.exports.default = exports.default;
}));
var require_isHexColor = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = isHexColor;
	var _assertString = _interopRequireDefault(require_assertString());
	var _merge = _interopRequireDefault(require_merge());
	function _interopRequireDefault(e) {
		return e && e.__esModule ? e : { default: e };
	}
	var hexcolor = /^#?([0-9A-F]{3}|[0-9A-F]{4}|[0-9A-F]{6}|[0-9A-F]{8})$/i;
	var hexcolor_with_prefix = /^#([0-9A-F]{3}|[0-9A-F]{4}|[0-9A-F]{6}|[0-9A-F]{8})$/i;
	var default_is_hexcolor_options = { require_hashtag: false };
	function isHexColor(str, options) {
		(0, _assertString.default)(str);
		options = (0, _merge.default)(options, default_is_hexcolor_options);
		return (options.require_hashtag ? hexcolor_with_prefix : hexcolor).test(str);
	}
	module.exports = exports.default;
	module.exports.default = exports.default;
}));
var require_isLuhnNumber = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = isLuhnNumber;
	var _assertString = _interopRequireDefault(require_assertString());
	function _interopRequireDefault(e) {
		return e && e.__esModule ? e : { default: e };
	}
	function isLuhnNumber(str) {
		(0, _assertString.default)(str);
		var sanitized = str.replace(/[- ]+/g, "");
		var sum = 0;
		var digit;
		var tmpNum;
		var shouldDouble;
		for (var i = sanitized.length - 1; i >= 0; i--) {
			digit = sanitized.substring(i, i + 1);
			tmpNum = parseInt(digit, 10);
			if (shouldDouble) {
				tmpNum *= 2;
				if (tmpNum >= 10) sum += tmpNum % 10 + 1;
				else sum += tmpNum;
			} else sum += tmpNum;
			shouldDouble = !shouldDouble;
		}
		return !!(sum % 10 === 0 ? sanitized : false);
	}
	module.exports = exports.default;
	module.exports.default = exports.default;
}));
var require_isCreditCard = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = isCreditCard;
	var _assertString = _interopRequireDefault(require_assertString());
	var _isLuhnNumber = _interopRequireDefault(require_isLuhnNumber());
	function _interopRequireDefault(e) {
		return e && e.__esModule ? e : { default: e };
	}
	var cards = {
		amex: /^3[47][0-9]{13}$/,
		dinersclub: /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/,
		discover: /^6(?:011|5[0-9][0-9])[0-9]{12,15}$/,
		jcb: /^(?:2131|1800|35\d{3})\d{11}$/,
		mastercard: /^5[1-5][0-9]{2}|(222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}$/,
		unionpay: /^(6[27][0-9]{14}|^(81[0-9]{14,17}))$/,
		visa: /^(?:4[0-9]{12})(?:[0-9]{3,6})?$/
	};
	var allCards = function() {
		var tmpCardsArray = [];
		for (var cardProvider in cards)
 // istanbul ignore else
		if (cards.hasOwnProperty(cardProvider)) tmpCardsArray.push(cards[cardProvider]);
		return tmpCardsArray;
	}();
	function isCreditCard(card) {
		var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
		(0, _assertString.default)(card);
		var provider = options.provider;
		var sanitized = card.replace(/[- ]+/g, "");
		if (provider && provider.toLowerCase() in cards) {
			if (!cards[provider.toLowerCase()].test(sanitized)) return false;
		} else if (provider && !(provider.toLowerCase() in cards)) throw new Error("".concat(provider, " is not a valid credit card provider."));
		else if (!allCards.some(function(cardProvider) {
			return cardProvider.test(sanitized);
		})) return false;
		return (0, _isLuhnNumber.default)(card);
	}
	module.exports = exports.default;
	module.exports.default = exports.default;
}));
var require_isSameOrAfter = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	(function(e, t) {
		"object" == typeof exports && "undefined" != typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define(t) : (e = "undefined" != typeof globalThis ? globalThis : e || self).dayjs_plugin_isSameOrAfter = t();
	})(exports, (function() {
		"use strict";
		return function(e, t) {
			t.prototype.isSameOrAfter = function(e, t) {
				return this.isSame(e, t) || this.isAfter(e, t);
			};
		};
	}));
}));
var require_isSameOrBefore = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	(function(e, i) {
		"object" == typeof exports && "undefined" != typeof module ? module.exports = i() : "function" == typeof define && define.amd ? define(i) : (e = "undefined" != typeof globalThis ? globalThis : e || self).dayjs_plugin_isSameOrBefore = i();
	})(exports, (function() {
		"use strict";
		return function(e, i) {
			i.prototype.isSameOrBefore = function(e, i) {
				return this.isSame(e, i) || this.isBefore(e, i);
			};
		};
	}));
}));
var require_isAlphanumeric = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = isAlphanumeric;
	exports.locales = void 0;
	var _assertString = _interopRequireDefault(require_assertString());
	var _alpha = require_alpha();
	function _interopRequireDefault(e) {
		return e && e.__esModule ? e : { default: e };
	}
	function isAlphanumeric(_str) {
		var locale = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "en-US";
		var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
		(0, _assertString.default)(_str);
		var str = _str;
		var ignore = options.ignore;
		if (ignore) if (ignore instanceof RegExp) str = str.replace(ignore, "");
		else if (typeof ignore === "string") str = str.replace(new RegExp("[".concat(ignore.replace(/[-[\]{}()*+?.,\\^$|#\\s]/g, "\\$&"), "]"), "g"), "");
		else throw new Error("ignore should be instance of a String or RegExp");
		if (locale in _alpha.alphanumeric) return _alpha.alphanumeric[locale].test(str);
		throw new Error("Invalid locale '".concat(locale, "'"));
	}
	exports.locales = Object.keys(_alpha.alphanumeric);
}));
var require_isPassportNumber = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = isPassportNumber;
	exports.locales = void 0;
	var _assertString = _interopRequireDefault(require_assertString());
	function _interopRequireDefault(e) {
		return e && e.__esModule ? e : { default: e };
	}
	/**
	* Reference:
	* https://en.wikipedia.org/ -- Wikipedia
	* https://docs.microsoft.com/en-us/microsoft-365/compliance/eu-passport-number -- EU Passport Number
	* https://countrycode.org/ -- Country Codes
	*/
	var passportRegexByCountryCode = {
		AM: /^[A-Z]{2}\d{7}$/,
		AR: /^[A-Z]{3}\d{6}$/,
		AT: /^[A-Z]\d{7}$/,
		AU: /^[A-Z]\d{7}$/,
		AZ: /^[A-Z]{1}\d{8}$/,
		BE: /^[A-Z]{2}\d{6}$/,
		BG: /^\d{9}$/,
		BR: /^[A-Z]{2}\d{6}$/,
		BY: /^[A-Z]{2}\d{7}$/,
		CA: /^[A-Z]{2}\d{6}$|^[A-Z]\d{6}[A-Z]{2}$/,
		CH: /^[A-Z]\d{7}$/,
		CN: /^G\d{8}$|^E(?![IO])[A-Z0-9]\d{7}$/,
		CY: /^[A-Z](\d{6}|\d{8})$/,
		CZ: /^\d{8}$/,
		DE: /^[CFGHJKLMNPRTVWXYZ0-9]{9}$/,
		DK: /^\d{9}$/,
		DZ: /^\d{9}$/,
		EE: /^([A-Z]\d{7}|[A-Z]{2}\d{7})$/,
		ES: /^[A-Z0-9]{2}([A-Z0-9]?)\d{6}$/,
		FI: /^[A-Z]{2}\d{7}$/,
		FR: /^\d{2}[A-Z]{2}\d{5}$/,
		GB: /^\d{9}$/,
		GR: /^[A-Z]{2}\d{7}$/,
		HR: /^\d{9}$/,
		HU: /^[A-Z]{2}(\d{6}|\d{7})$/,
		IE: /^[A-Z0-9]{2}\d{7}$/,
		IN: /^[A-Z]{1}-?\d{7}$/,
		ID: /^[A-C]\d{7}$/,
		IR: /^[A-Z]\d{8}$/,
		IS: /^(A)\d{7}$/,
		IT: /^[A-Z0-9]{2}\d{7}$/,
		JM: /^[Aa]\d{7}$/,
		JP: /^[A-Z]{2}\d{7}$/,
		KR: /^[MS]\d{8}$/,
		KZ: /^[a-zA-Z]\d{7}$/,
		LI: /^[a-zA-Z]\d{5}$/,
		LT: /^[A-Z0-9]{8}$/,
		LU: /^[A-Z0-9]{8}$/,
		LV: /^[A-Z0-9]{2}\d{7}$/,
		LY: /^[A-Z0-9]{8}$/,
		MT: /^\d{7}$/,
		MZ: /^([A-Z]{2}\d{7})|(\d{2}[A-Z]{2}\d{5})$/,
		MY: /^[AHK]\d{8}$/,
		MX: /^\d{10,11}$/,
		NL: /^[A-Z]{2}[A-Z0-9]{6}\d$/,
		NZ: /^([Ll]([Aa]|[Dd]|[Ff]|[Hh])|[Ee]([Aa]|[Pp])|[Nn])\d{6}$/,
		PH: /^([A-Z](\d{6}|\d{7}[A-Z]))|([A-Z]{2}(\d{6}|\d{7}))$/,
		PK: /^[A-Z]{2}\d{7}$/,
		PL: /^[A-Z]{2}\d{7}$/,
		PT: /^[A-Z]\d{6}$/,
		RO: /^\d{8,9}$/,
		RU: /^\d{9}$/,
		SE: /^\d{8}$/,
		SL: /^(P)[A-Z]\d{7}$/,
		SK: /^[0-9A-Z]\d{7}$/,
		TH: /^[A-Z]{1,2}\d{6,7}$/,
		TR: /^[A-Z]\d{8}$/,
		UA: /^[A-Z]{2}\d{6}$/,
		US: /^\d{9}$|^[A-Z]\d{8}$/,
		ZA: /^[TAMD]\d{8}$/
	};
	exports.locales = Object.keys(passportRegexByCountryCode);
	/**
	* Check if str is a valid passport number
	* relative to provided ISO Country Code.
	*
	* @param {string} str
	* @param {string} countryCode
	* @return {boolean}
	*/
	function isPassportNumber(str, countryCode) {
		(0, _assertString.default)(str);
		/** Remove All Whitespaces, Convert to UPPERCASE */
		var normalizedStr = str.replace(/\s/g, "").toUpperCase();
		return countryCode.toUpperCase() in passportRegexByCountryCode && passportRegexByCountryCode[countryCode].test(normalizedStr);
	}
}));
var require_algorithms = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.iso7064Check = iso7064Check;
	exports.luhnCheck = luhnCheck;
	exports.reverseMultiplyAndSum = reverseMultiplyAndSum;
	exports.verhoeffCheck = verhoeffCheck;
	/**
	* Algorithmic validation functions
	* May be used as is or implemented in the workflow of other validators.
	*/
	function iso7064Check(str) {
		var checkvalue = 10;
		for (var i = 0; i < str.length - 1; i++) checkvalue = (parseInt(str[i], 10) + checkvalue) % 10 === 0 ? 20 % 11 : (parseInt(str[i], 10) + checkvalue) % 10 * 2 % 11;
		checkvalue = checkvalue === 1 ? 0 : 11 - checkvalue;
		return checkvalue === parseInt(str[10], 10);
	}
	function luhnCheck(str) {
		var checksum = 0;
		var second = false;
		for (var i = str.length - 1; i >= 0; i--) {
			if (second) {
				var product = parseInt(str[i], 10) * 2;
				if (product > 9) checksum += product.toString().split("").map(function(a) {
					return parseInt(a, 10);
				}).reduce(function(a, b) {
					return a + b;
				}, 0);
				else checksum += product;
			} else checksum += parseInt(str[i], 10);
			second = !second;
		}
		return checksum % 10 === 0;
	}
	function reverseMultiplyAndSum(digits, base) {
		var total = 0;
		for (var i = 0; i < digits.length; i++) total += digits[i] * (base - i);
		return total;
	}
	function verhoeffCheck(str) {
		var d_table = [
			[
				0,
				1,
				2,
				3,
				4,
				5,
				6,
				7,
				8,
				9
			],
			[
				1,
				2,
				3,
				4,
				0,
				6,
				7,
				8,
				9,
				5
			],
			[
				2,
				3,
				4,
				0,
				1,
				7,
				8,
				9,
				5,
				6
			],
			[
				3,
				4,
				0,
				1,
				2,
				8,
				9,
				5,
				6,
				7
			],
			[
				4,
				0,
				1,
				2,
				3,
				9,
				5,
				6,
				7,
				8
			],
			[
				5,
				9,
				8,
				7,
				6,
				0,
				4,
				3,
				2,
				1
			],
			[
				6,
				5,
				9,
				8,
				7,
				1,
				0,
				4,
				3,
				2
			],
			[
				7,
				6,
				5,
				9,
				8,
				2,
				1,
				0,
				4,
				3
			],
			[
				8,
				7,
				6,
				5,
				9,
				3,
				2,
				1,
				0,
				4
			],
			[
				9,
				8,
				7,
				6,
				5,
				4,
				3,
				2,
				1,
				0
			]
		];
		var p_table = [
			[
				0,
				1,
				2,
				3,
				4,
				5,
				6,
				7,
				8,
				9
			],
			[
				1,
				5,
				7,
				6,
				2,
				8,
				3,
				0,
				9,
				4
			],
			[
				5,
				8,
				0,
				3,
				7,
				9,
				6,
				1,
				4,
				2
			],
			[
				8,
				9,
				1,
				6,
				0,
				4,
				3,
				5,
				2,
				7
			],
			[
				9,
				4,
				5,
				3,
				1,
				2,
				6,
				8,
				7,
				0
			],
			[
				4,
				2,
				8,
				6,
				5,
				7,
				3,
				9,
				0,
				1
			],
			[
				2,
				7,
				9,
				3,
				8,
				0,
				6,
				4,
				1,
				5
			],
			[
				7,
				0,
				4,
				6,
				9,
				1,
				3,
				2,
				5,
				8
			]
		];
		var str_copy = str.split("").reverse().join("");
		var checksum = 0;
		for (var i = 0; i < str_copy.length; i++) checksum = d_table[checksum][p_table[i % 8][parseInt(str_copy[i], 10)]];
		return checksum === 0;
	}
}));
var require_isVAT = /* @__PURE__ */ __commonJSMin(((exports) => {
	function _typeof(o) {
		"@babel/helpers - typeof";
		return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
			return typeof o;
		} : function(o) {
			return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
		}, _typeof(o);
	}
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = isVAT;
	exports.vatMatchers = void 0;
	var _assertString = _interopRequireDefault(require_assertString());
	var algorithms = _interopRequireWildcard(require_algorithms());
	function _interopRequireWildcard(e, t) {
		if ("function" == typeof WeakMap) var r = /* @__PURE__ */ new WeakMap(), n = /* @__PURE__ */ new WeakMap();
		return (_interopRequireWildcard = function _interopRequireWildcard(e, t) {
			if (!t && e && e.__esModule) return e;
			var o, i, f = {
				__proto__: null,
				default: e
			};
			if (null === e || "object" != _typeof(e) && "function" != typeof e) return f;
			if (o = t ? n : r) {
				if (o.has(e)) return o.get(e);
				o.set(e, f);
			}
			for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]);
			return f;
		})(e, t);
	}
	function _interopRequireDefault(e) {
		return e && e.__esModule ? e : { default: e };
	}
	var vatMatchers = exports.vatMatchers = {
		AT: function AT(str) {
			return /^(AT)?U\d{8}$/.test(str);
		},
		BE: function BE(str) {
			return /^(BE)?\d{10}$/.test(str);
		},
		BG: function BG(str) {
			return /^(BG)?\d{9,10}$/.test(str);
		},
		HR: function HR(str) {
			return /^(HR)?\d{11}$/.test(str);
		},
		CY: function CY(str) {
			return /^(CY)?\w{9}$/.test(str);
		},
		CZ: function CZ(str) {
			return /^(CZ)?\d{8,10}$/.test(str);
		},
		DK: function DK(str) {
			return /^(DK)?\d{8}$/.test(str);
		},
		EE: function EE(str) {
			return /^(EE)?\d{9}$/.test(str);
		},
		FI: function FI(str) {
			return /^(FI)?\d{8}$/.test(str);
		},
		FR: function FR(str) {
			return /^(FR)([A-Z0-9]{2}\d{9})$/.test(str);
		},
		DE: function DE(str) {
			return /^(DE)?\d{9}$/.test(str);
		},
		EL: function EL(str) {
			return /^(EL)?\d{9}$/.test(str);
		},
		HU: function HU(str) {
			return /^(HU)?\d{8}$/.test(str);
		},
		IE: function IE(str) {
			return /^(IE)?\d{7}\w{1}(W)?$/.test(str);
		},
		IT: function IT(str) {
			return /^(IT)?\d{11}$/.test(str);
		},
		LV: function LV(str) {
			return /^(LV)?\d{11}$/.test(str);
		},
		LT: function LT(str) {
			return /^(LT)?\d{9,12}$/.test(str);
		},
		LU: function LU(str) {
			return /^(LU)?\d{8}$/.test(str);
		},
		MT: function MT(str) {
			return /^(MT)?\d{8}$/.test(str);
		},
		NL: function NL(str) {
			return /^(NL)?\d{9}B\d{2}$/.test(str);
		},
		PL: function PL(str) {
			return /^(PL)?(\d{10}|(\d{3}-\d{3}-\d{2}-\d{2})|(\d{3}-\d{2}-\d{2}-\d{3}))$/.test(str);
		},
		PT: function PT(str) {
			var match = str.match(/^(PT)?(\d{9})$/);
			if (!match) return false;
			var tin = match[2];
			var checksum = 11 - algorithms.reverseMultiplyAndSum(tin.split("").slice(0, 8).map(function(a) {
				return parseInt(a, 10);
			}), 9) % 11;
			if (checksum > 9) return parseInt(tin[8], 10) === 0;
			return checksum === parseInt(tin[8], 10);
		},
		RO: function RO(str) {
			return /^(RO)?\d{2,10}$/.test(str);
		},
		SK: function SK(str) {
			return /^(SK)?\d{10}$/.test(str);
		},
		SI: function SI(str) {
			return /^(SI)?\d{8}$/.test(str);
		},
		ES: function ES(str) {
			return /^(ES)?\w\d{7}[A-Z]$/.test(str);
		},
		SE: function SE(str) {
			return /^(SE)?\d{12}$/.test(str);
		},
		AL: function AL(str) {
			return /^(AL)?\w{9}[A-Z]$/.test(str);
		},
		MK: function MK(str) {
			return /^(MK)?\d{13}$/.test(str);
		},
		AU: function AU(str) {
			if (!str.match(/^(AU)?(\d{11})$/)) return false;
			var weights = [
				10,
				1,
				3,
				5,
				7,
				9,
				11,
				13,
				15,
				17,
				19
			];
			str = str.replace(/^AU/, "");
			var ABN = (parseInt(str.slice(0, 1), 10) - 1).toString() + str.slice(1);
			var total = 0;
			for (var i = 0; i < 11; i++) total += weights[i] * ABN.charAt(i);
			return total !== 0 && total % 89 === 0;
		},
		BY: function BY(str) {
			return /^(УНП )?\d{9}$/.test(str);
		},
		CA: function CA(str) {
			return /^(CA)?\d{9}$/.test(str);
		},
		IS: function IS(str) {
			return /^(IS)?\d{5,6}$/.test(str);
		},
		IN: function IN(str) {
			return /^(IN)?\d{15}$/.test(str);
		},
		ID: function ID(str) {
			return /^(ID)?(\d{15}|(\d{2}.\d{3}.\d{3}.\d{1}-\d{3}.\d{3}))$/.test(str);
		},
		IL: function IL(str) {
			return /^(IL)?\d{9}$/.test(str);
		},
		KZ: function KZ(str) {
			return /^(KZ)?\d{12}$/.test(str);
		},
		NZ: function NZ(str) {
			return /^(NZ)?\d{9}$/.test(str);
		},
		NG: function NG(str) {
			return /^(NG)?(\d{12}|(\d{8}-\d{4}))$/.test(str);
		},
		NO: function NO(str) {
			return /^(NO)?\d{9}MVA$/.test(str);
		},
		PH: function PH(str) {
			return /^(PH)?(\d{12}|\d{3} \d{3} \d{3} \d{3})$/.test(str);
		},
		RU: function RU(str) {
			return /^(RU)?(\d{10}|\d{12})$/.test(str);
		},
		SM: function SM(str) {
			return /^(SM)?\d{5}$/.test(str);
		},
		SA: function SA(str) {
			return /^(SA)?\d{15}$/.test(str);
		},
		RS: function RS(str) {
			return /^(RS)?\d{9}$/.test(str);
		},
		CH: function CH(str) {
			return /^(CHE[- ]?)?(\d{9}|(\d{3}\.\d{3}\.\d{3})|(\d{3} \d{3} \d{3})) ?(TVA|MWST|IVA)?$/.test(str) && function hasValidCheckNumber(digits) {
				var lastDigit = digits.pop();
				var weights = [
					5,
					4,
					3,
					2,
					7,
					6,
					5,
					4
				];
				return lastDigit === (11 - digits.reduce(function(acc, el, idx) {
					return acc + el * weights[idx];
				}, 0) % 11) % 11;
			}(str.match(/\d/g).map(function(el) {
				return +el;
			}));
		},
		TR: function TR(str) {
			return /^(TR)?\d{10}$/.test(str);
		},
		UA: function UA(str) {
			return /^(UA)?\d{12}$/.test(str);
		},
		GB: function GB(str) {
			return /^GB((\d{3} \d{4} ([0-8][0-9]|9[0-6]))|(\d{9} \d{3})|(((GD[0-4])|(HA[5-9]))[0-9]{2}))$/.test(str);
		},
		UZ: function UZ(str) {
			return /^(UZ)?\d{9}$/.test(str);
		},
		AR: function AR(str) {
			return /^(AR)?\d{11}$/.test(str);
		},
		BO: function BO(str) {
			return /^(BO)?\d{7}$/.test(str);
		},
		BR: function BR(str) {
			return /^(BR)?((\d{2}.\d{3}.\d{3}\/\d{4}-\d{2})|(\d{3}.\d{3}.\d{3}-\d{2}))$/.test(str);
		},
		CL: function CL(str) {
			return /^(CL)?\d{8}-\d{1}$/.test(str);
		},
		CO: function CO(str) {
			return /^(CO)?\d{10}$/.test(str);
		},
		CR: function CR(str) {
			return /^(CR)?\d{9,12}$/.test(str);
		},
		EC: function EC(str) {
			return /^(EC)?\d{13}$/.test(str);
		},
		SV: function SV(str) {
			return /^(SV)?\d{4}-\d{6}-\d{3}-\d{1}$/.test(str);
		},
		GT: function GT(str) {
			return /^(GT)?\d{7}-\d{1}$/.test(str);
		},
		HN: function HN(str) {
			return /^(HN)?$/.test(str);
		},
		MX: function MX(str) {
			return /^(MX)?\w{3,4}\d{6}\w{3}$/.test(str);
		},
		NI: function NI(str) {
			return /^(NI)?\d{3}-\d{6}-\d{4}\w{1}$/.test(str);
		},
		PA: function PA(str) {
			return /^(PA)?$/.test(str);
		},
		PY: function PY(str) {
			return /^(PY)?\d{6,8}-\d{1}$/.test(str);
		},
		PE: function PE(str) {
			return /^(PE)?\d{11}$/.test(str);
		},
		DO: function DO(str) {
			return /^(DO)?(\d{11}|(\d{3}-\d{7}-\d{1})|[1,4,5]{1}\d{8}|([1,4,5]{1})-\d{2}-\d{5}-\d{1})$/.test(str);
		},
		UY: function UY(str) {
			return /^(UY)?\d{12}$/.test(str);
		},
		VE: function VE(str) {
			return /^(VE)?[J,G,V,E]{1}-(\d{9}|(\d{8}-\d{1}))$/.test(str);
		}
	};
	function isVAT(str, countryCode) {
		(0, _assertString.default)(str);
		(0, _assertString.default)(countryCode);
		if (countryCode in vatMatchers) return vatMatchers[countryCode](str);
		throw new Error("Invalid country code: '".concat(countryCode, "'"));
	}
}));
var require_customParseFormat = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	(function(e, t) {
		"object" == typeof exports && "undefined" != typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define(t) : (e = "undefined" != typeof globalThis ? globalThis : e || self).dayjs_plugin_customParseFormat = t();
	})(exports, (function() {
		"use strict";
		var e = {
			LTS: "h:mm:ss A",
			LT: "h:mm A",
			L: "MM/DD/YYYY",
			LL: "MMMM D, YYYY",
			LLL: "MMMM D, YYYY h:mm A",
			LLLL: "dddd, MMMM D, YYYY h:mm A"
		}, t = /(\[[^[]*\])|([-_:/.,()\s]+)|(A|a|Q|YYYY|YY?|ww?|MM?M?M?|Do|DD?|hh?|HH?|mm?|ss?|S{1,3}|z|ZZ?)/g, n = /\d/, r = /\d\d/, i = /\d\d?/, o = /\d*[^-_:/,()\s\d]+/, s = {}, a = function(e) {
			return (e = +e) + (e > 68 ? 1900 : 2e3);
		};
		var f = function(e) {
			return function(t) {
				this[e] = +t;
			};
		}, h = [/[+-]\d\d:?(\d\d)?|Z/, function(e) {
			(this.zone || (this.zone = {})).offset = function(e) {
				if (!e) return 0;
				if ("Z" === e) return 0;
				var t = e.match(/([+-]|\d\d)/g), n = 60 * t[1] + (+t[2] || 0);
				return 0 === n ? 0 : "+" === t[0] ? -n : n;
			}(e);
		}], u = function(e) {
			var t = s[e];
			return t && (t.indexOf ? t : t.s.concat(t.f));
		}, d = function(e, t) {
			var n, r = s.meridiem;
			if (r) {
				for (var i = 1; i <= 24; i += 1) if (e.indexOf(r(i, 0, t)) > -1) {
					n = i > 12;
					break;
				}
			} else n = e === (t ? "pm" : "PM");
			return n;
		}, c = {
			A: [o, function(e) {
				this.afternoon = d(e, !1);
			}],
			a: [o, function(e) {
				this.afternoon = d(e, !0);
			}],
			Q: [n, function(e) {
				this.month = 3 * (e - 1) + 1;
			}],
			S: [n, function(e) {
				this.milliseconds = 100 * +e;
			}],
			SS: [r, function(e) {
				this.milliseconds = 10 * +e;
			}],
			SSS: [/\d{3}/, function(e) {
				this.milliseconds = +e;
			}],
			s: [i, f("seconds")],
			ss: [i, f("seconds")],
			m: [i, f("minutes")],
			mm: [i, f("minutes")],
			H: [i, f("hours")],
			h: [i, f("hours")],
			HH: [i, f("hours")],
			hh: [i, f("hours")],
			D: [i, f("day")],
			DD: [r, f("day")],
			Do: [o, function(e) {
				var t = s.ordinal;
				if (this.day = e.match(/\d+/)[0], t) for (var r = 1; r <= 31; r += 1) t(r).replace(/\[|\]/g, "") === e && (this.day = r);
			}],
			w: [i, f("week")],
			ww: [r, f("week")],
			M: [i, f("month")],
			MM: [r, f("month")],
			MMM: [o, function(e) {
				var t = u("months"), n = (u("monthsShort") || t.map((function(e) {
					return e.slice(0, 3);
				}))).indexOf(e) + 1;
				if (n < 1) throw new Error();
				this.month = n % 12 || n;
			}],
			MMMM: [o, function(e) {
				var t = u("months").indexOf(e) + 1;
				if (t < 1) throw new Error();
				this.month = t % 12 || t;
			}],
			Y: [/[+-]?\d+/, f("year")],
			YY: [r, function(e) {
				this.year = a(e);
			}],
			YYYY: [/\d{4}/, f("year")],
			Z: h,
			ZZ: h
		};
		function l(n) {
			var r = n, i = s && s.formats;
			for (var o = (n = r.replace(/(\[[^\]]+])|(LTS?|l{1,4}|L{1,4})/g, (function(t, n, r) {
				var o = r && r.toUpperCase();
				return n || i[r] || e[r] || i[o].replace(/(\[[^\]]+])|(MMMM|MM|DD|dddd)/g, (function(e, t, n) {
					return t || n.slice(1);
				}));
			}))).match(t), a = o.length, f = 0; f < a; f += 1) {
				var h = o[f], u = c[h], d = u && u[0], l = u && u[1];
				o[f] = l ? {
					regex: d,
					parser: l
				} : h.replace(/^\[|\]$/g, "");
			}
			return function(e) {
				for (var t = {}, n = 0, r = 0; n < a; n += 1) {
					var i = o[n];
					if ("string" == typeof i) r += i.length;
					else {
						var s = i.regex, f = i.parser, h = e.slice(r), u = s.exec(h)[0];
						f.call(t, u), e = e.replace(u, "");
					}
				}
				return function(e) {
					var t = e.afternoon;
					if (void 0 !== t) {
						var n = e.hours;
						t ? n < 12 && (e.hours += 12) : 12 === n && (e.hours = 0), delete e.afternoon;
					}
				}(t), t;
			};
		}
		return function(e, t, n) {
			n.p.customParseFormat = !0, e && e.parseTwoDigitYear && (a = e.parseTwoDigitYear);
			var r = t.prototype, i = r.parse;
			r.parse = function(e) {
				var t = e.date, r = e.utc, o = e.args;
				this.$u = r;
				var a = o[1];
				if ("string" == typeof a) {
					var f = !0 === o[2], h = !0 === o[3], u = f || h, d = o[2];
					h && (d = o[2]), s = this.$locale(), !f && d && (s = n.Ls[d]), this.$d = function(e, t, n, r) {
						try {
							if (["x", "X"].indexOf(t) > -1) return /* @__PURE__ */ new Date(("X" === t ? 1e3 : 1) * e);
							var i = l(t)(e), o = i.year, s = i.month, a = i.day, f = i.hours, h = i.minutes, u = i.seconds, d = i.milliseconds, c = i.zone, m = i.week, M = /* @__PURE__ */ new Date(), Y = a || (o || s ? 1 : M.getDate()), p = o || M.getFullYear(), v = 0;
							o && !s || (v = s > 0 ? s - 1 : M.getMonth());
							var D, w = f || 0, g = h || 0, y = u || 0, L = d || 0;
							return c ? new Date(Date.UTC(p, v, Y, w, g, y, L + 60 * c.offset * 1e3)) : n ? new Date(Date.UTC(p, v, Y, w, g, y, L)) : (D = new Date(p, v, Y, w, g, y, L), m && (D = r(D).week(m).toDate()), D);
						} catch (e) {
							return /* @__PURE__ */ new Date("");
						}
					}(t, a, r, n), this.init(), d && !0 !== d && (this.$L = this.locale(d).$L), u && t != this.format(a) && (this.$d = /* @__PURE__ */ new Date("")), s = {};
				} else if (a instanceof Array) for (var c = a.length, m = 1; m <= c; m += 1) {
					o[1] = a[m - 1];
					var M = n.apply(this, o);
					if (M.isValid()) {
						this.$d = M.$d, this.$L = M.$L, this.init();
						break;
					}
					m === c && (this.$d = /* @__PURE__ */ new Date(""));
				}
				else i.call(this, e);
			};
		};
	}));
}));
var require_isPostalCode = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = isPostalCode;
	exports.locales = void 0;
	var _assertString = _interopRequireDefault(require_assertString());
	function _interopRequireDefault(e) {
		return e && e.__esModule ? e : { default: e };
	}
	var threeDigit = /^\d{3}$/;
	var fourDigit = /^\d{4}$/;
	var fiveDigit = /^\d{5}$/;
	var sixDigit = /^\d{6}$/;
	var patterns = {
		AD: /^AD\d{3}$/,
		AT: fourDigit,
		AU: fourDigit,
		AZ: /^AZ\d{4}$/,
		BA: /^([7-8]\d{4}$)/,
		BD: /^([1-8][0-9]{3}|9[0-4][0-9]{2})$/,
		BE: fourDigit,
		BG: fourDigit,
		BR: /^\d{5}-?\d{3}$/,
		BY: /^2[1-4]\d{4}$/,
		CA: /^[ABCEGHJKLMNPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][\s\-]?\d[ABCEGHJ-NPRSTV-Z]\d$/i,
		CH: fourDigit,
		CN: /^(0[1-7]|1[012356]|2[0-7]|3[0-6]|4[0-7]|5[1-7]|6[1-7]|7[1-5]|8[1345]|9[09])\d{4}$/,
		CO: /^(05|08|11|13|15|17|18|19|20|23|25|27|41|44|47|50|52|54|63|66|68|70|73|76|81|85|86|88|91|94|95|97|99)(\d{4})$/,
		CZ: /^\d{3}\s?\d{2}$/,
		DE: fiveDigit,
		DK: fourDigit,
		DO: fiveDigit,
		DZ: fiveDigit,
		EE: fiveDigit,
		ES: /^(5[0-2]{1}|[0-4]{1}\d{1})\d{3}$/,
		FI: fiveDigit,
		FR: /^(?:(?:0[1-9]|[1-8]\d|9[0-5])\d{3}|97[1-46]\d{2})$/,
		GB: /^(gir\s?0aa|[a-z]{1,2}\d[\da-z]?\s?(\d[a-z]{2})?)$/i,
		GR: /^\d{3}\s?\d{2}$/,
		HR: /^([1-5]\d{4}$)/,
		HT: /^HT\d{4}$/,
		HU: fourDigit,
		ID: fiveDigit,
		IE: /^(?!.*(?:o))[A-Za-z]\d[\dw]\s\w{4}$/i,
		IL: /^(\d{5}|\d{7})$/,
		IN: /^((?!10|29|35|54|55|65|66|86|87|88|89)[1-9][0-9]{5})$/,
		IR: /^(?!(\d)\1{3})[13-9]{4}[1346-9][013-9]{5}$/,
		IS: threeDigit,
		IT: fiveDigit,
		JP: /^\d{3}\-\d{4}$/,
		KE: fiveDigit,
		KR: /^(\d{5}|\d{6})$/,
		LI: /^(948[5-9]|949[0-7])$/,
		LT: /^LT\-\d{5}$/,
		LU: fourDigit,
		LV: /^LV\-\d{4}$/,
		LK: fiveDigit,
		MG: threeDigit,
		MX: fiveDigit,
		MT: /^[A-Za-z]{3}\s{0,1}\d{4}$/,
		MY: fiveDigit,
		NL: /^[1-9]\d{3}\s?(?!sa|sd|ss)[a-z]{2}$/i,
		NO: fourDigit,
		NP: /^(10|21|22|32|33|34|44|45|56|57)\d{3}$|^(977)$/i,
		NZ: fourDigit,
		PK: fiveDigit,
		PL: /^\d{2}\-\d{3}$/,
		PR: /^00[679]\d{2}([ -]\d{4})?$/,
		PT: /^\d{4}\-\d{3}?$/,
		RO: sixDigit,
		RU: sixDigit,
		SA: fiveDigit,
		SE: /^[1-9]\d{2}\s?\d{2}$/,
		SG: sixDigit,
		SI: fourDigit,
		SK: /^\d{3}\s?\d{2}$/,
		TH: fiveDigit,
		TN: fourDigit,
		TW: /^\d{3}(\d{2,3})?$/,
		UA: fiveDigit,
		US: /^\d{5}(-\d{4})?$/,
		ZA: fourDigit,
		ZM: fiveDigit
	};
	exports.locales = Object.keys(patterns);
	function isPostalCode(str, locale) {
		(0, _assertString.default)(str);
		if (locale in patterns) return patterns[locale].test(str);
		else if (locale === "any") {
			for (var key in patterns)
 // istanbul ignore else
			if (patterns.hasOwnProperty(key)) {
				if (patterns[key].test(str)) return true;
			}
			return false;
		}
		throw new Error("Invalid locale '".concat(locale, "'"));
	}
}));
var require_isMobilePhone = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = isMobilePhone;
	exports.locales = void 0;
	var _assertString = _interopRequireDefault(require_assertString());
	function _interopRequireDefault(e) {
		return e && e.__esModule ? e : { default: e };
	}
	var phones = {
		"am-AM": /^(\+?374|0)(33|4[134]|55|77|88|9[13-689])\d{6}$/,
		"ar-AE": /^((\+?971)|0)?5[024568]\d{7}$/,
		"ar-BH": /^(\+?973)?(3|6)\d{7}$/,
		"ar-DZ": /^(\+?213|0)(5|6|7)\d{8}$/,
		"ar-LB": /^(\+?961)?((3|81)\d{6}|7\d{7})$/,
		"ar-EG": /^((\+?20)|0)?1[0125]\d{8}$/,
		"ar-IQ": /^(\+?964|0)?7[0-9]\d{8}$/,
		"ar-JO": /^(\+?962|0)?7[789]\d{7}$/,
		"ar-KW": /^(\+?965)([569]\d{7}|41\d{6})$/,
		"ar-LY": /^((\+?218)|0)?(9[1-6]\d{7}|[1-8]\d{7,9})$/,
		"ar-MA": /^(?:(?:\+|00)212|0)[5-7]\d{8}$/,
		"ar-OM": /^((\+|00)968)?([79][1-9])\d{6}$/,
		"ar-PS": /^(\+?970|0)5[6|9](\d{7})$/,
		"ar-SA": /^(!?(\+?966)|0)?5\d{8}$/,
		"ar-SD": /^((\+?249)|0)?(9[012369]|1[012])\d{7}$/,
		"ar-SY": /^(!?(\+?963)|0)?9\d{8}$/,
		"ar-TN": /^(\+?216)?[2459]\d{7}$/,
		"az-AZ": /^(\+994|0)(10|5[015]|7[07]|99)\d{7}$/,
		"ar-QA": /^(\+?974|0)?([3567]\d{7})$/,
		"bs-BA": /^((((\+|00)3876)|06))((([0-3]|[5-6])\d{6})|(4\d{7}))$/,
		"be-BY": /^(\+?375)?(24|25|29|33|44)\d{7}$/,
		"bg-BG": /^(\+?359|0)?8[789]\d{7}$/,
		"bn-BD": /^(\+?880|0)1[13456789][0-9]{8}$/,
		"ca-AD": /^(\+376)?[346]\d{5}$/,
		"cs-CZ": /^(\+?420)? ?[1-9][0-9]{2} ?[0-9]{3} ?[0-9]{3}$/,
		"da-DK": /^(\+?45)?\s?\d{2}\s?\d{2}\s?\d{2}\s?\d{2}$/,
		"de-DE": /^((\+49|0)1)(5[0-25-9]\d|6([23]|0\d?)|7([0-57-9]|6\d))\d{7,9}$/,
		"de-AT": /^(\+43|0)\d{1,4}\d{3,12}$/,
		"de-CH": /^(\+41|0)([1-9])\d{1,9}$/,
		"de-LU": /^(\+352)?((6\d1)\d{6})$/,
		"dv-MV": /^(\+?960)?(7[2-9]|9[1-9])\d{5}$/,
		"el-GR": /^(\+?30|0)?6(8[5-9]|9(?![26])[0-9])\d{7}$/,
		"el-CY": /^(\+?357?)?(9(9|7|6|5|4)\d{6})$/,
		"en-AI": /^(\+?1|0)264(?:2(35|92)|4(?:6[1-2]|76|97)|5(?:3[6-9]|8[1-4])|7(?:2(4|9)|72))\d{4}$/,
		"en-AU": /^(\+?61|0)4\d{8}$/,
		"en-AG": /^(?:\+1|1)268(?:464|7(?:1[3-9]|[28]\d|3[0246]|64|7[0-689]))\d{4}$/,
		"en-BM": /^(\+?1)?441(((3|7)\d{6}$)|(5[0-3][0-9]\d{4}$)|(59\d{5}$))/,
		"en-BS": /^(\+?1[-\s]?|0)?\(?242\)?[-\s]?\d{3}[-\s]?\d{4}$/,
		"en-GB": /^(\+?44|0)7[1-9]\d{8}$/,
		"en-GG": /^(\+?44|0)1481\d{6}$/,
		"en-GH": /^(\+233|0)(20|50|24|54|27|57|26|56|23|53|28|55|59)\d{7}$/,
		"en-GY": /^(\+592|0)6\d{6}$/,
		"en-HK": /^(\+?852[-\s]?)?[456789]\d{3}[-\s]?\d{4}$/,
		"en-MO": /^(\+?853[-\s]?)?[6]\d{3}[-\s]?\d{4}$/,
		"en-IE": /^(\+?353|0)8[356789]\d{7}$/,
		"en-IN": /^(\+?91|0)?[6789]\d{9}$/,
		"en-JM": /^(\+?876)?\d{7}$/,
		"en-KE": /^(\+?254|0)(7|1)\d{8}$/,
		"fr-CF": /^(\+?236| ?)(70|75|77|72|21|22)\d{6}$/,
		"en-SS": /^(\+?211|0)(9[1257])\d{7}$/,
		"en-KI": /^((\+686|686)?)?( )?((6|7)(2|3|8)[0-9]{6})$/,
		"en-KN": /^(?:\+1|1)869(?:46\d|48[89]|55[6-8]|66\d|76[02-7])\d{4}$/,
		"en-LS": /^(\+?266)(22|28|57|58|59|27|52)\d{6}$/,
		"en-MT": /^(\+?356|0)?(99|79|77|21|27|22|25)[0-9]{6}$/,
		"en-MU": /^(\+?230|0)?\d{8}$/,
		"en-MW": /^(\+?265|0)(((77|88|31|99|98|21)\d{7})|(((111)|1)\d{6})|(32000\d{4}))$/,
		"en-NA": /^(\+?264|0)(6|8)\d{7}$/,
		"en-NG": /^(\+?234|0)?[789]\d{9}$/,
		"en-NZ": /^(\+?64|0)[28]\d{7,9}$/,
		"en-PG": /^(\+?675|0)?(7\d|8[18])\d{6}$/,
		"en-PK": /^((00|\+)?92|0)3[0-6]\d{8}$/,
		"en-PH": /^(09|\+639)\d{9}$/,
		"en-RW": /^(\+?250|0)?[7]\d{8}$/,
		"en-SG": /^(\+65)?[3689]\d{7}$/,
		"en-SL": /^(\+?232|0)\d{8}$/,
		"en-TZ": /^(\+?255|0)?[67]\d{8}$/,
		"en-UG": /^(\+?256|0)?[7]\d{8}$/,
		"en-US": /^((\+1|1)?( |-)?)?(\([2-9][0-9]{2}\)|[2-9][0-9]{2})( |-)?([2-9][0-9]{2}( |-)?[0-9]{4})$/,
		"en-ZA": /^(\+?27|0)\d{9}$/,
		"en-ZM": /^(\+?26)?0[79][567]\d{7}$/,
		"en-ZW": /^(\+263)[0-9]{9}$/,
		"en-BW": /^(\+?267)?(7[1-8]{1})\d{6}$/,
		"es-AR": /^\+?549(11|[2368]\d)\d{8}$/,
		"es-BO": /^(\+?591)?(6|7)\d{7}$/,
		"es-CO": /^(\+?57)?3(0(0|1|2|4|5)|1\d|2[0-4]|5(0|1))\d{7}$/,
		"es-CL": /^(\+?56|0)[2-9]\d{1}\d{7}$/,
		"es-CR": /^(\+506)?[2-8]\d{7}$/,
		"es-CU": /^(\+53|0053)?5\d{7}$/,
		"es-DO": /^(\+?1)?8[024]9\d{7}$/,
		"es-HN": /^(\+?504)?[9|8|3|2]\d{7}$/,
		"es-EC": /^(\+?593|0)([2-7]|9[2-9])\d{7}$/,
		"es-ES": /^(\+?34)?[6|7]\d{8}$/,
		"es-GT": /^(\+?502)?[2|6|7]\d{7}$/,
		"es-PE": /^(\+?51)?9\d{8}$/,
		"es-MX": /^(\+?52)?(1|01)?\d{10,11}$/,
		"es-NI": /^(\+?505)\d{7,8}$/,
		"es-PA": /^(\+?507)\d{7,8}$/,
		"es-PY": /^(\+?595|0)9[9876]\d{7}$/,
		"es-SV": /^(\+?503)?[67]\d{7}$/,
		"es-UY": /^(\+598|0)9[1-9][\d]{6}$/,
		"es-VE": /^(\+?58)?(2|4)\d{9}$/,
		"et-EE": /^(\+?372)?\s?(5|8[1-4])\s?([0-9]\s?){6,7}$/,
		"fa-IR": /^(\+?98[\-\s]?|0)9[0-39]\d[\-\s]?\d{3}[\-\s]?\d{4}$/,
		"fi-FI": /^(\+?358|0)\s?(4[0-6]|50)\s?(\d\s?){4,8}$/,
		"fj-FJ": /^(\+?679)?\s?\d{3}\s?\d{4}$/,
		"fo-FO": /^(\+?298)?\s?\d{2}\s?\d{2}\s?\d{2}$/,
		"fr-BF": /^(\+226|0)[67]\d{7}$/,
		"fr-BJ": /^(\+229)\d{8}$/,
		"fr-CD": /^(\+?243|0)?(8|9)\d{8}$/,
		"fr-CM": /^(\+?237)6[0-9]{8}$/,
		"fr-FR": /^(\+?33|0)[67]\d{8}$/,
		"fr-GF": /^(\+?594|0|00594)[67]\d{8}$/,
		"fr-GP": /^(\+?590|0|00590)[67]\d{8}$/,
		"fr-MQ": /^(\+?596|0|00596)[67]\d{8}$/,
		"fr-PF": /^(\+?689)?8[789]\d{6}$/,
		"fr-RE": /^(\+?262|0|00262)[67]\d{8}$/,
		"fr-WF": /^(\+681)?\d{6}$/,
		"he-IL": /^(\+972|0)([23489]|5[012345689]|77)[1-9]\d{6}$/,
		"hu-HU": /^(\+?36|06)(20|30|31|50|70)\d{7}$/,
		"id-ID": /^(\+?62|0)8(1[123456789]|2[1238]|3[1238]|5[12356789]|7[78]|9[56789]|8[123456789])([\s?|\d]{5,11})$/,
		"ir-IR": /^(\+98|0)?9\d{9}$/,
		"it-IT": /^(\+?39)?\s?3\d{2} ?\d{6,7}$/,
		"it-SM": /^((\+378)|(0549)|(\+390549)|(\+3780549))?6\d{5,9}$/,
		"ja-JP": /^(\+81[ \-]?(\(0\))?|0)[6789]0[ \-]?\d{4}[ \-]?\d{4}$/,
		"ka-GE": /^(\+?995)?(79\d{7}|5\d{8})$/,
		"kk-KZ": /^(\+?7|8)?7\d{9}$/,
		"kl-GL": /^(\+?299)?\s?\d{2}\s?\d{2}\s?\d{2}$/,
		"ko-KR": /^((\+?82)[ \-]?)?0?1([0|1|6|7|8|9]{1})[ \-]?\d{3,4}[ \-]?\d{4}$/,
		"ky-KG": /^(\+996\s?)?(22[0-9]|50[0-9]|55[0-9]|70[0-9]|75[0-9]|77[0-9]|880|990|995|996|997|998)\s?\d{3}\s?\d{3}$/,
		"lt-LT": /^(\+370|8)\d{8}$/,
		"lv-LV": /^(\+?371)2\d{7}$/,
		"mg-MG": /^((\+?261|0)(2|3)\d)?\d{7}$/,
		"mn-MN": /^(\+|00|011)?976(77|81|88|91|94|95|96|99)\d{6}$/,
		"my-MM": /^(\+?959|09|9)(2[5-7]|3[1-2]|4[0-5]|6[6-9]|7[5-9]|9[6-9])[0-9]{7}$/,
		"ms-MY": /^(\+?60|0)1(([0145](-|\s)?\d{7,8})|([236-9](-|\s)?\d{7}))$/,
		"mz-MZ": /^(\+?258)?8[234567]\d{7}$/,
		"nb-NO": /^(\+?47)?[49]\d{7}$/,
		"ne-NP": /^(\+?977)?9[78]\d{8}$/,
		"nl-BE": /^(\+?32|0)4\d{8}$/,
		"nl-NL": /^(((\+|00)?31\(0\))|((\+|00)?31)|0)6{1}\d{8}$/,
		"nl-AW": /^(\+)?297(56|59|64|73|74|99)\d{5}$/,
		"nn-NO": /^(\+?47)?[49]\d{7}$/,
		"pl-PL": /^(\+?48)? ?([5-8]\d|45) ?\d{3} ?\d{2} ?\d{2}$/,
		"pt-BR": /^((\+?55\ ?[1-9]{2}\ ?)|(\+?55\ ?\([1-9]{2}\)\ ?)|(0[1-9]{2}\ ?)|(\([1-9]{2}\)\ ?)|([1-9]{2}\ ?))((\d{4}\-?\d{4})|(9[1-9]{1}\d{3}\-?\d{4}))$/,
		"pt-PT": /^(\+?351)?9[1236]\d{7}$/,
		"pt-AO": /^(\+?244)?9\d{8}$/,
		"ro-MD": /^(\+?373|0)((6(0|1|2|6|7|8|9))|(7(6|7|8|9)))\d{6}$/,
		"ro-RO": /^(\+?40|0)\s?7\d{2}(\/|\s|\.|-)?\d{3}(\s|\.|-)?\d{3}$/,
		"ru-RU": /^(\+?7|8)?9\d{9}$/,
		"si-LK": /^(?:0|94|\+94)?(7(0|1|2|4|5|6|7|8)( |-)?)\d{7}$/,
		"sl-SI": /^(\+386\s?|0)(\d{1}\s?\d{3}\s?\d{2}\s?\d{2}|\d{2}\s?\d{3}\s?\d{3})$/,
		"sk-SK": /^(\+?421)? ?[1-9][0-9]{2} ?[0-9]{3} ?[0-9]{3}$/,
		"so-SO": /^(\+?252|0)((6[0-9])\d{7}|(7[1-9])\d{7})$/,
		"sq-AL": /^(\+355|0)6[2-9]\d{7}$/,
		"sr-RS": /^(\+3816|06)[- \d]{5,9}$/,
		"sv-SE": /^(\+?46|0)[\s\-]?7[\s\-]?[02369]([\s\-]?\d){7}$/,
		"tg-TJ": /^(\+?992)?[5][5]\d{7}$/,
		"th-TH": /^(\+66|66|0)\d{9}$/,
		"tr-TR": /^(\+?90|0)?5\d{9}$/,
		"tk-TM": /^(\+993|993|8)\d{8}$/,
		"uk-UA": /^(\+?38)?0(50|6[36-8]|7[357]|9[1-9])\d{7}$/,
		"uz-UZ": /^(\+?998)?(6[125-79]|7[1-69]|88|9\d)\d{7}$/,
		"vi-VN": /^((\+?84)|0)((3([2-9]))|(5([25689]))|(7([0|6-9]))|(8([1-9]))|(9([0-9])))([0-9]{7})$/,
		"zh-CN": /^((\+|00)86)?(1[3-9]|9[28])\d{9}$/,
		"zh-TW": /^(\+?886\-?|0)?9\d{8}$/,
		"dz-BT": /^(\+?975|0)?(17|16|77|02)\d{6}$/,
		"ar-YE": /^(((\+|00)9677|0?7)[0137]\d{7}|((\+|00)967|0)[1-7]\d{6})$/,
		"ar-EH": /^(\+?212|0)[\s\-]?(5288|5289)[\s\-]?\d{5}$/,
		"fa-AF": /^(\+93|0)?(2{1}[0-8]{1}|[3-5]{1}[0-4]{1})(\d{7})$/,
		"mk-MK": /^(\+?389|0)?((?:2[2-9]\d{6}|(?:3[1-4]|4[2-8])\d{6}|500\d{5}|5[2-9]\d{6}|7[0-9][2-9]\d{5}|8[1-9]\d{6}|800\d{5}|8009\d{4}))$/
	};
	phones["en-CA"] = phones["en-US"];
	phones["fr-CA"] = phones["en-CA"];
	phones["fr-BE"] = phones["nl-BE"];
	phones["zh-HK"] = phones["en-HK"];
	phones["zh-MO"] = phones["en-MO"];
	phones["ga-IE"] = phones["en-IE"];
	phones["fr-CH"] = phones["de-CH"];
	phones["it-CH"] = phones["fr-CH"];
	function isMobilePhone(str, locale, options) {
		(0, _assertString.default)(str);
		if (options && options.strictMode && !str.startsWith("+")) return false;
		if (Array.isArray(locale)) return locale.some(function(key) {
			// istanbul ignore else
			if (phones.hasOwnProperty(key)) {
				if (phones[key].test(str)) return true;
			}
			return false;
		});
		else if (locale in phones) return phones[locale].test(str);
		else if (!locale || locale === "any") {
			for (var key in phones)
 // istanbul ignore else
			if (phones.hasOwnProperty(key)) {
				if (phones[key].test(str)) return true;
			}
			return false;
		}
		throw new Error("Invalid locale '".concat(locale, "'"));
	}
	exports.locales = Object.keys(phones);
}));
var import_dlv_umd = /* @__PURE__ */ __toESM(require_dlv_umd(), 1);
var import_dayjs_min = /* @__PURE__ */ __toESM(require_dayjs_min(), 1);
var import_isIP = /* @__PURE__ */ __toESM(require_isIP(), 1);
var import_isJWT = /* @__PURE__ */ __toESM(require_isJWT(), 1);
var import_isURL = /* @__PURE__ */ __toESM(require_isURL(), 1);
var import_isSlug = /* @__PURE__ */ __toESM(require_isSlug(), 1);
var import_isIBAN = /* @__PURE__ */ __toESM(require_isIBAN(), 1);
var import_isUUID = /* @__PURE__ */ __toESM(require_isUUID(), 1);
var import_isAscii = /* @__PURE__ */ __toESM(require_isAscii(), 1);
var import_isEmail = /* @__PURE__ */ __toESM(require_isEmail(), 1);
var import_isAlpha = /* @__PURE__ */ __toESM(require_isAlpha(), 1);
var import_isLatLong = /* @__PURE__ */ __toESM(require_isLatLong(), 1);
var import_isDecimal = /* @__PURE__ */ __toESM(require_isDecimal(), 1);
var import_isHexColor = /* @__PURE__ */ __toESM(require_isHexColor(), 1);
var import_isCreditCard = /* @__PURE__ */ __toESM(require_isCreditCard(), 1);
var import_isSameOrAfter = /* @__PURE__ */ __toESM(require_isSameOrAfter(), 1);
var import_isSameOrBefore = /* @__PURE__ */ __toESM(require_isSameOrBefore(), 1);
var import_isAlphanumeric = /* @__PURE__ */ __toESM(require_isAlphanumeric(), 1);
var import_isPassportNumber = /* @__PURE__ */ __toESM(require_isPassportNumber(), 1);
var import_isVAT = /* @__PURE__ */ __toESM(require_isVAT(), 1);
var import_customParseFormat = /* @__PURE__ */ __toESM(require_customParseFormat(), 1);
var import_isPostalCode = /* @__PURE__ */ __toESM(require_isPostalCode(), 1);
var import_isMobilePhone = /* @__PURE__ */ __toESM(require_isMobilePhone(), 1);
const BOOLEAN_POSITIVES = [
	"1",
	1,
	"true",
	true,
	"on"
];
const BOOLEAN_NEGATIVES = [
	"0",
	0,
	"false",
	false
];
const DEFAULT_DATE_FORMATS = ["YYYY-MM-DD", "YYYY-MM-DD HH:mm:ss"];
const ULID = /^[0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{26}$/;
import_dayjs_min.default.extend(import_customParseFormat.default);
import_dayjs_min.default.extend(import_isSameOrAfter.default);
import_dayjs_min.default.extend(import_isSameOrBefore.default);
const helpers = {
	exists(value) {
		return value !== null && value !== void 0;
	},
	isMissing(value) {
		return !this.exists(value);
	},
	isTrue(value) {
		return BOOLEAN_POSITIVES.includes(value);
	},
	isFalse(value) {
		return BOOLEAN_NEGATIVES.includes(value);
	},
	isString(value) {
		return typeof value === "string";
	},
	isObject(value) {
		return !!(value && typeof value === "object" && !Array.isArray(value));
	},
	hasKeys(value, keys) {
		for (let key of keys) if (key in value === false) return false;
		return true;
	},
	isArray(value) {
		return Array.isArray(value);
	},
	isNumeric(value) {
		return !Number.isNaN(Number(value));
	},
	asNumber(value) {
		return value === null ? NaN : Number(value);
	},
	asBoolean(value) {
		if (this.isTrue(value)) return true;
		if (this.isFalse(value)) return false;
		return null;
	},
	asDayJS(value, format) {
		let isTimestampAllowed = false;
		let isISOAllowed = false;
		let formats = format || DEFAULT_DATE_FORMATS;
		if (Array.isArray(formats)) {
			formats = [...formats];
			isTimestampAllowed = formats.includes("x");
			isISOAllowed = formats.includes("iso8601");
		} else if (typeof formats !== "string") {
			formats = { ...formats };
			isTimestampAllowed = formats.format === "x";
			isISOAllowed = formats.format === "iso";
		}
		const valueAsNumber = isTimestampAllowed ? helpers.asNumber(value) : value;
		let dateTime;
		if (isTimestampAllowed && !Number.isNaN(valueAsNumber)) dateTime = (0, import_dayjs_min.default)(valueAsNumber);
		else dateTime = (0, import_dayjs_min.default)(value, formats, true);
		if (!dateTime.isValid() && isISOAllowed) dateTime = (0, import_dayjs_min.default)(value);
		return {
			dateTime,
			formats
		};
	},
	compareValues(inputValue, expectedValue) {
		let input = inputValue;
		if (typeof expectedValue === "boolean") input = this.asBoolean(inputValue);
		else if (typeof expectedValue === "number") input = this.asNumber(inputValue);
		return {
			isEqual: input === expectedValue,
			casted: input
		};
	},
	isEmail: import_isEmail.default.default,
	isURL: import_isURL.default.default,
	isAlpha: import_isAlpha.default.default,
	isAlphaNumeric: import_isAlphanumeric.default.default,
	isIP: import_isIP.default.default,
	isUUID: import_isUUID.default.default,
	isAscii: import_isAscii.default.default,
	isCreditCard: import_isCreditCard.default.default,
	isIBAN: import_isIBAN.default.default,
	isJWT: import_isJWT.default.default,
	isLatLong: import_isLatLong.default.default,
	isMobilePhone: import_isMobilePhone.default.default,
	isPassportNumber: import_isPassportNumber.default.default,
	isVAT: import_isVAT.default.default,
	isPostalCode: import_isPostalCode.default.default,
	isSlug: import_isSlug.default.default,
	isDecimal: import_isDecimal.default.default,
	mobileLocales: import_isMobilePhone.locales,
	postalCountryCodes: import_isPostalCode.locales,
	passportCountryCodes: [
		"AM",
		"AR",
		"AT",
		"AU",
		"AZ",
		"BE",
		"BG",
		"BR",
		"BY",
		"CA",
		"CH",
		"CY",
		"CZ",
		"DE",
		"DK",
		"DZ",
		"ES",
		"FI",
		"FR",
		"GB",
		"GR",
		"HR",
		"HU",
		"IE",
		"IN",
		"ID",
		"IR",
		"IS",
		"IT",
		"JM",
		"JP",
		"KR",
		"KZ",
		"LI",
		"LT",
		"LU",
		"LV",
		"LY",
		"MT",
		"MZ",
		"MY",
		"MX",
		"NL",
		"NZ",
		"PH",
		"PK",
		"PL",
		"PT",
		"RO",
		"RU",
		"SE",
		"SL",
		"SK",
		"TH",
		"TR",
		"UA",
		"US"
	],
	isULID(value) {
		if (typeof value !== "string") return false;
		if (value[0] > "7") return false;
		return ULID.test(value);
	},
	isHexColor: (value) => {
		if (!value.startsWith("#")) return false;
		return import_isHexColor.default.default(value);
	},
	isActiveURL: async (url) => {
		const { resolve4, resolve6 } = await import("node:dns/promises");
		try {
			const { hostname } = new URL(url);
			if ((await resolve6(hostname)).length) return true;
			else return (await resolve4(hostname)).length > 0;
		} catch {
			return false;
		}
	},
	isDistinct: (dataSet, fields) => {
		const uniqueItems = /* @__PURE__ */ new Set();
		if (!fields) {
			for (let item of dataSet) if (helpers.exists(item)) if (uniqueItems.has(item)) return false;
			else uniqueItems.add(item);
			return true;
		}
		const fieldsList = Array.isArray(fields) ? fields : [fields];
		for (let item of dataSet) if (helpers.isObject(item) && helpers.hasKeys(item, fieldsList)) {
			const element = fieldsList.map((field) => item[field]).join("_");
			if (uniqueItems.has(element)) return false;
			else uniqueItems.add(element);
		}
		return true;
	},
	getNestedValue(key, field) {
		if (key.indexOf(".") > -1) return (0, import_dlv_umd.default)(field.data, key);
		return field.parent[key];
	},
	optional(props) {
		const result = {};
		for (const name of Object.keys(props)) {
			let field = props[name].clone();
			if ("optional" in field && typeof field.optional === "function") field = field.optional();
			result[name] = field;
		}
		return result;
	}
};
var SimpleMessagesProvider = class {
	#messages;
	#fields;
	constructor(messages, fields) {
		this.#messages = messages;
		this.#fields = fields || {};
	}
	#interpolate(message, data) {
		if (!message.includes("{{")) return message;
		return message.replace(/(\\)?{{(.*?)}}/g, (_, __, key) => {
			const tokens = key.trim().split(".");
			let output = data;
			while (tokens.length) {
				if (output === null || typeof output !== "object") return;
				const token = tokens.shift();
				output = Object.hasOwn(output, token) ? output[token] : void 0;
			}
			return output;
		});
	}
	getMessage(rawMessage, rule, field, args) {
		const fieldName = this.#fields[field.name] || field.name;
		const fieldMessage = this.#messages[`${field.getFieldPath()}.${rule}`];
		if (fieldMessage) return this.#interpolate(fieldMessage, {
			field: fieldName,
			...args
		});
		const wildcardMessage = this.#messages[`${field.wildCardPath}.${rule}`];
		if (wildcardMessage) return this.#interpolate(wildcardMessage, {
			field: fieldName,
			...args
		});
		const ruleMessage = this.#messages[rule];
		if (ruleMessage) return this.#interpolate(ruleMessage, {
			field: fieldName,
			...args
		});
		return this.#interpolate(rawMessage, {
			field: fieldName,
			...args
		});
	}
	toJSON() {
		return {
			messages: this.#messages,
			fields: this.#fields
		};
	}
};
var ValidationError = class extends Error {
	status = 422;
	code = "E_VALIDATION_ERROR";
	constructor(messages, options) {
		super("Validation failure", options);
		this.messages = messages;
		const ErrorConstructor = this.constructor;
		if ("captureStackTrace" in Error) Error.captureStackTrace(this, ErrorConstructor);
	}
	get [Symbol.toStringTag]() {
		return this.constructor.name;
	}
	toString() {
		return `${this.name} [${this.code}]: ${this.message}`;
	}
};
const E_VALIDATION_ERROR = ValidationError;
var SimpleErrorReporter = class {
	hasErrors = false;
	errors = [];
	report(message, rule, field, meta) {
		const error = {
			message,
			rule,
			field: field.getFieldPath()
		};
		if (meta) error.meta = meta;
		if (field.isArrayMember) error.index = field.name;
		this.hasErrors = true;
		this.errors.push(error);
	}
	createError() {
		return new E_VALIDATION_ERROR(this.errors);
	}
};
const messages = {
	"required": "The {{ field }} field must be defined",
	"string": "The {{ field }} field must be a string",
	"email": "The {{ field }} field must be a valid email address",
	"mobile": "The {{ field }} field must be a valid mobile phone number",
	"creditCard": "The {{ field }} field must be a valid {{ providersList }} card number",
	"passport": "The {{ field }} field must be a valid passport number",
	"postalCode": "The {{ field }} field must be a valid postal code",
	"regex": "The {{ field }} field format is invalid",
	"ascii": "The {{ field }} field must only contain ASCII characters",
	"iban": "The {{ field }} field must be a valid IBAN number",
	"jwt": "The {{ field }} field must be a valid JWT token",
	"coordinates": "The {{ field }} field must contain latitude and longitude coordinates",
	"url": "The {{ field }} field must be a valid URL",
	"activeUrl": "The {{ field }} field must be a valid URL",
	"alpha": "The {{ field }} field must contain only letters",
	"alphaNumeric": "The {{ field }} field must contain only letters and numbers",
	"minLength": "The {{ field }} field must have at least {{ min }} characters",
	"maxLength": "The {{ field }} field must not be greater than {{ max }} characters",
	"fixedLength": "The {{ field }} field must be {{ size }} characters long",
	"confirmed": "The {{ originalField }} field and {{ otherField }} field must be the same",
	"endsWith": "The {{ field }} field must end with {{ substring }}",
	"startsWith": "The {{ field }} field must start with {{ substring }}",
	"sameAs": "The {{ field }} field and {{ otherField }} field must be the same",
	"notSameAs": "The {{ field }} field and {{ otherField }} field must be different",
	"in": "The selected {{ field }} is invalid",
	"notIn": "The selected {{ field }} is invalid",
	"ipAddress": "The {{ field }} field must be a valid IP address",
	"vat": "The {{ field }} field must be a valid VAT number",
	"uuid": "The {{ field }} field must be a valid UUID",
	"ulid": "The {{ field }} field must be a valid ULID",
	"hexCode": "The {{ field }} field must be a valid hex color code",
	"boolean": "The value must be a boolean",
	"number": "The {{ field }} field must be a number",
	"number.in": "The selected {{ field }} is not in {{ values }}",
	"min": "The {{ field }} field must be at least {{ min }}",
	"max": "The {{ field }} field must not be greater than {{ max }}",
	"range": "The {{ field }} field must be between {{ min }} and {{ max }}",
	"positive": "The {{ field }} field must be positive",
	"negative": "The {{ field }} field must be negative",
	"nonNegative": "The {{ field }} field must be positive or zero",
	"nonPositive": "The {{ field }} field must be negative or zero",
	"decimal": "The {{ field }} field must have {{ digits }} decimal places",
	"withoutDecimals": "The {{ field }} field must be an integer",
	"accepted": "The {{ field }} field must be accepted",
	"enum": "The selected {{ field }} is invalid",
	"literal": "The {{ field }} field must be {{ expectedValue }}",
	"object": "The {{ field }} field must be an object",
	"array": "The {{ field }} field must be an array",
	"array.minLength": "The {{ field }} field must have at least {{ min }} items",
	"array.maxLength": "The {{ field }} field must not have more than {{ max }} items",
	"array.fixedLength": "The {{ field }} field must contain {{ size }} items",
	"notEmpty": "The {{ field }} field must not be empty",
	"distinct": "The {{ field }} field has duplicate values",
	"record": "The {{ field }} field must be an object",
	"record.minLength": "The {{ field }} field must have at least {{ min }} items",
	"record.maxLength": "The {{ field }} field must not have more than {{ max }} items",
	"record.fixedLength": "The {{ field }} field must contain {{ size }} items",
	"tuple": "The {{ field }} field must be an array",
	"union": "Invalid value provided for {{ field }} field",
	"unionGroup": "Invalid value provided for {{ field }} field",
	"unionOfTypes": "Invalid value provided for {{ field }} field",
	"date": "The {{ field }} field must be a datetime value",
	"date.equals": "The {{ field }} field must be a date equal to {{ expectedValue }}",
	"date.after": "The {{ field }} field must be a date after {{ expectedValue }}",
	"date.before": "The {{ field }} field must be a date before {{ expectedValue }}",
	"date.afterOrEqual": "The {{ field }} field must be a date after or equal to {{ expectedValue }}",
	"date.beforeOrEqual": "The {{ field }} field must be a date before or equal to {{ expectedValue }}",
	"date.sameAs": "The {{ field }} field and {{ otherField }} field must be the same",
	"date.notSameAs": "The {{ field }} field and {{ otherField }} field must be different",
	"date.afterField": "The {{ field }} field must be a date after {{ otherField }}",
	"date.afterOrSameAs": "The {{ field }} field must be a date after or same as {{ otherField }}",
	"date.beforeField": "The {{ field }} field must be a date before {{ otherField }}",
	"date.beforeOrSameAs": "The {{ field }} field must be a date before or same as {{ otherField }}",
	"date.weekend": "The {{ field }} field is not a weekend",
	"date.weekday": "The {{ field }} field is not a weekday",
	"nativeFile": "The {{ field }} field must be a valid file",
	"nativeFile.minSize": "The {{ field }} field must be at least {{ min }} bytes in size",
	"nativeFile.maxSize": "The {{ field }} field must not exceed {{ max }} bytes in size",
	"nativeFile.mimeTypes": "The {{ field }} mime type is invalid"
};
const fields = { "": "data" };
const globalTransforms = {};
var Macroable = class {
	/**
	* Set of instance properties that will be added to each instance during construction.
	* Each entry contains a key and value pair representing the property name and its value.
	*/
	static instanceMacros = /* @__PURE__ */ new Set();
	/**
	* Adds a macro (property or method) to the class prototype.
	* Macros are standard properties that get added to the class prototype,
	* making them available on all instances of the class.
	*
	* @param name - The name of the property or method to add
	* @param value - The value to assign to the property or method
	*
	* @example
	* ```ts
	* // Add a property macro
	* MyClass.macro('version', '1.0.0')
	*
	* // Add a method macro
	* MyClass.macro('greet', function() {
	*   return 'Hello!'
	* })
	*
	* const instance = new MyClass()
	* instance.version // "1.0.0"
	* instance.greet() // "Hello!"
	* ```
	*/
	static macro(name, value) {
		this.prototype[name] = value;
	}
	/**
	* Adds an instance property that will be assigned to each instance during construction.
	* Unlike macros which are added to the prototype, instance properties are unique to each instance.
	*
	* @param name - The name of the property to add to instances
	* @param value - The value to assign to the property on each instance
	*
	* @example
	* ```ts
	* // Add an instance method
	* MyClass.instanceProperty('save', function() {
	*   console.log('Saving...', this.id)
	* })
	*
	* const { save } = new MyClass()
	* save()
	* ```
	*/
	static instanceProperty(name, value) {
		const self = this;
		if (!self.hasOwnProperty("instanceMacros")) {
			const inheritedProperties = self.instanceMacros;
			Object.defineProperty(self, "instanceMacros", {
				value: new Set(inheritedProperties),
				configurable: true,
				enumerable: true,
				writable: true
			});
		}
		self.instanceMacros.add({
			key: name,
			value
		});
	}
	/**
	* Adds a getter property to the class prototype using Object.defineProperty.
	* Getters are computed properties that are evaluated each time they are accessed,
	* unless the singleton flag is enabled.
	*
	* @param name - The name of the getter property
	* @param accumulator - Function that computes and returns the property value
	* @param singleton - If true, the getter value is cached after first access
	*
	* @example
	* ```ts
	* // Add a regular getter
	* MyClass.getter('timestamp', function() {
	*   return Date.now()
	* })
	*
	* // Add a singleton getter (cached after first access)
	* MyClass.getter('config', function() {
	*   return loadConfig()
	* }, true)
	*
	* const instance = new MyClass()
	* instance.timestamp // Computed each time
	* instance.config // Computed once, then cached
	* ```
	*/
	static getter(name, accumulator, singleton = false) {
		Object.defineProperty(this.prototype, name, {
			get() {
				const value = accumulator.call(this);
				if (singleton) Object.defineProperty(this, name, {
					configurable: false,
					enumerable: false,
					value,
					writable: false
				});
				return value;
			},
			configurable: true,
			enumerable: false
		});
	}
	/**
	* Constructor that applies all registered instance properties to the new instance.
	* This method iterates through the instanceMacros set and assigns each property
	* to the instance, binding functions to the instance context.
	*/
	constructor() {
		const self = this;
		this.constructor.instanceMacros.forEach(({ key, value }) => {
			self[key] = typeof value === "function" ? value.bind(this) : value;
		});
	}
};
const UPPERCASE = /[\p{Lu}]/u;
const LOWERCASE = /[\p{Ll}]/u;
const LEADING_CAPITAL = /^[\p{Lu}](?![\p{Lu}])/u;
const SEPARATORS = /[_.\- ]+/;
const IDENTIFIER = /([\p{Alpha}\p{N}_]|$)/u;
const LEADING_SEPARATORS = new RegExp("^" + SEPARATORS.source);
const SEPARATORS_AND_IDENTIFIER = new RegExp(SEPARATORS.source + IDENTIFIER.source, "gu");
const NUMBERS_AND_IDENTIFIER = new RegExp(String.raw`\d+` + IDENTIFIER.source, "gu");
const preserveCamelCase = (string, toLowerCase, toUpperCase, preserveConsecutiveUppercase) => {
	let isLastCharLower = false;
	let isLastCharUpper = false;
	let isLastLastCharUpper = false;
	let isLastLastCharPreserved = false;
	for (let index = 0; index < string.length; index++) {
		const character = string[index];
		isLastLastCharPreserved = index > 2 ? string[index - 3] === "-" : true;
		if (isLastCharLower && UPPERCASE.test(character)) {
			string = string.slice(0, index) + "-" + string.slice(index);
			isLastCharLower = false;
			isLastLastCharUpper = isLastCharUpper;
			isLastCharUpper = true;
			index++;
		} else if (isLastCharUpper && isLastLastCharUpper && LOWERCASE.test(character) && (!isLastLastCharPreserved || preserveConsecutiveUppercase)) {
			string = string.slice(0, index - 1) + "-" + string.slice(index - 1);
			isLastLastCharUpper = isLastCharUpper;
			isLastCharUpper = false;
			isLastCharLower = true;
		} else {
			isLastCharLower = toLowerCase(character) === character && toUpperCase(character) !== character;
			isLastLastCharUpper = isLastCharUpper;
			isLastCharUpper = toUpperCase(character) === character && toLowerCase(character) !== character;
		}
	}
	return string;
};
const preserveConsecutiveUppercase = (input, toLowerCase) => input.replace(LEADING_CAPITAL, (match) => toLowerCase(match));
const processWithCasePreservation = (input, toLowerCase, preserveConsecutiveUppercase) => {
	let result = "";
	let previousWasNumber = false;
	let previousWasUppercase = false;
	const characters = [...input];
	for (let index = 0; index < characters.length; index++) {
		const character = characters[index];
		const isUpperCase = UPPERCASE.test(character);
		const nextCharIsUpperCase = index + 1 < characters.length && UPPERCASE.test(characters[index + 1]);
		if (previousWasNumber && /[\p{Alpha}]/u.test(character)) {
			result += character;
			previousWasNumber = false;
			previousWasUppercase = isUpperCase;
		} else if (preserveConsecutiveUppercase && isUpperCase && (previousWasUppercase || nextCharIsUpperCase)) {
			result += character;
			previousWasUppercase = true;
		} else if (/\d/.test(character)) {
			result += character;
			previousWasNumber = true;
			previousWasUppercase = false;
		} else if (SEPARATORS.test(character)) {
			result += character;
			previousWasUppercase = false;
		} else {
			result += toLowerCase(character);
			previousWasNumber = false;
			previousWasUppercase = false;
		}
	}
	return result;
};
/**
Core post-processing:
- Collapses separators and uppercases the following identifier character.
- Optionally uppercases the identifier following a numeric sequence.

Two-pass strategy prevents conflicts:
1. NUMBERS_AND_IDENTIFIER: handles digit-to-letter transitions
2. SEPARATORS_AND_IDENTIFIER: handles separator-to-identifier transitions

Example: "b2b_registration" with capitalizeAfterNumber: true
- Pass 1: "2b" matches, next char is "_" (separator), so don't capitalize → "b2b_registration"
- Pass 2: "_r" matches, replace with "R" → "b2bRegistration"
*/
const postProcess = (input, toUpperCase, { capitalizeAfterNumber }) => {
	const transformNumericIdentifier = capitalizeAfterNumber ? (match, identifier, offset, string) => {
		const nextCharacter = string.charAt(offset + match.length);
		if (SEPARATORS.test(nextCharacter)) return match;
		return identifier ? match.slice(0, -identifier.length) + toUpperCase(identifier) : match;
	} : (match) => match;
	return input.replaceAll(NUMBERS_AND_IDENTIFIER, transformNumericIdentifier).replaceAll(SEPARATORS_AND_IDENTIFIER, (_, identifier) => toUpperCase(identifier));
};
function camelCase(input, options) {
	if (!(typeof input === "string" || Array.isArray(input))) throw new TypeError("Expected the input to be `string | string[]`");
	options = {
		pascalCase: false,
		preserveConsecutiveUppercase: false,
		capitalizeAfterNumber: true,
		...options
	};
	if (Array.isArray(input)) input = input.map((element) => element.trim()).filter((element) => element.length > 0).join("-");
	else input = input.trim();
	if (input.length === 0) return "";
	const leadingPrefix = input.match(/^[_$]*/)[0];
	input = input.slice(leadingPrefix.length);
	if (input.length === 0) return leadingPrefix;
	const toLowerCase = options.locale === false ? (string) => string.toLowerCase() : (string) => string.toLocaleLowerCase(options.locale);
	const toUpperCase = options.locale === false ? (string) => string.toUpperCase() : (string) => string.toLocaleUpperCase(options.locale);
	if (input.length === 1) {
		if (SEPARATORS.test(input)) return leadingPrefix;
		return leadingPrefix + (options.pascalCase ? toUpperCase(input) : toLowerCase(input));
	}
	if (input !== toLowerCase(input)) input = preserveCamelCase(input, toLowerCase, toUpperCase, options.preserveConsecutiveUppercase);
	input = input.replace(LEADING_SEPARATORS, "");
	if (options.capitalizeAfterNumber) input = options.preserveConsecutiveUppercase ? preserveConsecutiveUppercase(input, toLowerCase) : toLowerCase(input);
	else input = processWithCasePreservation(input, toLowerCase, options.preserveConsecutiveUppercase);
	if (options.pascalCase && input.length > 0) input = toUpperCase(input[0]) + input.slice(1);
	return leadingPrefix + postProcess(input, toUpperCase, options);
}
const DATA_URL_DEFAULT_MIME_TYPE = "text/plain";
const DATA_URL_DEFAULT_CHARSET = "us-ascii";
const testParameter = (name, filters) => filters.some((filter) => filter instanceof RegExp ? filter.test(name) : filter === name);
const supportedProtocols = new Set([
	"https:",
	"http:",
	"file:"
]);
const hasCustomProtocol = (urlString) => {
	try {
		const { protocol } = new URL(urlString);
		return protocol.endsWith(":") && !protocol.includes(".") && !supportedProtocols.has(protocol);
	} catch {
		return false;
	}
};
const normalizeDataURL = (urlString, { stripHash }) => {
	const match = /^data:(?<type>[^,]*?),(?<data>[^#]*?)(?:#(?<hash>.*))?$/.exec(urlString);
	if (!match) throw new Error(`Invalid URL: ${urlString}`);
	const { type, data, hash } = match.groups;
	const mediaType = type.split(";");
	const isBase64 = mediaType.at(-1) === "base64";
	if (isBase64) mediaType.pop();
	const mimeType = mediaType.shift()?.toLowerCase() ?? "";
	const normalizedMediaType = [...mediaType.map((attribute) => {
		let [key, value = ""] = attribute.split("=").map((string) => string.trim());
		if (key === "charset") {
			value = value.toLowerCase();
			if (value === DATA_URL_DEFAULT_CHARSET) return "";
		}
		return `${key}${value ? `=${value}` : ""}`;
	}).filter(Boolean)];
	if (isBase64) normalizedMediaType.push("base64");
	if (normalizedMediaType.length > 0 || mimeType && mimeType !== DATA_URL_DEFAULT_MIME_TYPE) normalizedMediaType.unshift(mimeType);
	const hashPart = stripHash || !hash ? "" : `#${hash}`;
	return `data:${normalizedMediaType.join(";")},${isBase64 ? data.trim() : data}${hashPart}`;
};
function normalizeUrl(urlString, options) {
	options = {
		defaultProtocol: "http",
		normalizeProtocol: true,
		forceHttp: false,
		forceHttps: false,
		stripAuthentication: true,
		stripHash: false,
		stripTextFragment: true,
		stripWWW: true,
		removeQueryParameters: [/^utm_\w+/i],
		removeTrailingSlash: true,
		removeSingleSlash: true,
		removeDirectoryIndex: false,
		removeExplicitPort: false,
		sortQueryParameters: true,
		removePath: false,
		transformPath: false,
		...options
	};
	if (typeof options.defaultProtocol === "string" && !options.defaultProtocol.endsWith(":")) options.defaultProtocol = `${options.defaultProtocol}:`;
	urlString = urlString.trim();
	if (/^data:/i.test(urlString)) return normalizeDataURL(urlString, options);
	if (hasCustomProtocol(urlString)) return urlString;
	const hasRelativeProtocol = urlString.startsWith("//");
	if (!(!hasRelativeProtocol && /^\.*\//.test(urlString))) urlString = urlString.replace(/^(?!(?:\w+:)?\/\/)|^\/\//, options.defaultProtocol);
	const urlObject = new URL(urlString);
	if (options.forceHttp && options.forceHttps) throw new Error("The `forceHttp` and `forceHttps` options cannot be used together");
	if (options.forceHttp && urlObject.protocol === "https:") urlObject.protocol = "http:";
	if (options.forceHttps && urlObject.protocol === "http:") urlObject.protocol = "https:";
	if (options.stripAuthentication) {
		urlObject.username = "";
		urlObject.password = "";
	}
	if (options.stripHash) urlObject.hash = "";
	else if (options.stripTextFragment) urlObject.hash = urlObject.hash.replace(/#?:~:text.*?$/i, "");
	if (urlObject.pathname) {
		const protocolRegex = /\b[a-z][a-z\d+\-.]{1,50}:\/\//g;
		let lastIndex = 0;
		let result = "";
		for (;;) {
			const match = protocolRegex.exec(urlObject.pathname);
			if (!match) break;
			const protocol = match[0];
			const protocolAtIndex = match.index;
			const intermediate = urlObject.pathname.slice(lastIndex, protocolAtIndex);
			result += intermediate.replace(/\/{2,}/g, "/");
			result += protocol;
			lastIndex = protocolAtIndex + protocol.length;
		}
		const remnant = urlObject.pathname.slice(lastIndex, urlObject.pathname.length);
		result += remnant.replace(/\/{2,}/g, "/");
		urlObject.pathname = result;
	}
	if (urlObject.pathname) try {
		urlObject.pathname = decodeURI(urlObject.pathname).replace(/\\/g, "%5C");
	} catch {}
	if (options.removeDirectoryIndex === true) options.removeDirectoryIndex = [/^index\.[a-z]+$/];
	if (Array.isArray(options.removeDirectoryIndex) && options.removeDirectoryIndex.length > 0) {
		const pathComponents = urlObject.pathname.split("/").filter(Boolean);
		const lastComponent = pathComponents.at(-1);
		if (lastComponent && testParameter(lastComponent, options.removeDirectoryIndex)) {
			pathComponents.pop();
			urlObject.pathname = pathComponents.length > 0 ? `/${pathComponents.join("/")}/` : "/";
		}
	}
	if (options.removePath) urlObject.pathname = "/";
	if (options.transformPath && typeof options.transformPath === "function") {
		const pathComponents = urlObject.pathname.split("/").filter(Boolean);
		const newComponents = options.transformPath(pathComponents);
		urlObject.pathname = newComponents?.length > 0 ? `/${newComponents.join("/")}` : "/";
	}
	if (urlObject.hostname) {
		urlObject.hostname = urlObject.hostname.replace(/\.$/, "");
		if (options.stripWWW && /^www\.(?!www\.)[a-z\-\d]{1,63}\.[a-z.\-\d]{2,63}$/.test(urlObject.hostname)) urlObject.hostname = urlObject.hostname.replace(/^www\./, "");
	}
	if (Array.isArray(options.removeQueryParameters)) {
		for (const key of [...urlObject.searchParams.keys()]) if (testParameter(key, options.removeQueryParameters)) urlObject.searchParams.delete(key);
	}
	if (!Array.isArray(options.keepQueryParameters) && options.removeQueryParameters === true) urlObject.search = "";
	if (Array.isArray(options.keepQueryParameters) && options.keepQueryParameters.length > 0) {
		for (const key of [...urlObject.searchParams.keys()]) if (!testParameter(key, options.keepQueryParameters)) urlObject.searchParams.delete(key);
	}
	if (options.sortQueryParameters) {
		const originalSearch = urlObject.search;
		urlObject.searchParams.sort();
		try {
			urlObject.search = decodeURIComponent(urlObject.search);
		} catch {}
		const partsWithoutEquals = originalSearch.slice(1).split("&").filter((p) => p && !p.includes("="));
		for (const part of partsWithoutEquals) {
			const decoded = decodeURIComponent(part);
			urlObject.search = urlObject.search.replace(`?${decoded}=`, `?${decoded}`).replace(`&${decoded}=`, `&${decoded}`);
		}
	}
	if (options.removeTrailingSlash) urlObject.pathname = urlObject.pathname.replace(/\/$/, "");
	if (options.removeExplicitPort && urlObject.port) urlObject.port = "";
	const oldUrlString = urlString;
	urlString = urlObject.toString();
	if (!options.removeSingleSlash && urlObject.pathname === "/" && !oldUrlString.endsWith("/") && urlObject.hash === "") urlString = urlString.replace(/\/$/, "");
	if ((options.removeTrailingSlash || urlObject.pathname === "/") && urlObject.hash === "" && options.removeSingleSlash) urlString = urlString.replace(/\/$/, "");
	if (hasRelativeProtocol && !options.normalizeProtocol) urlString = urlString.replace(/^http:\/\//, "//");
	if (options.stripProtocol) urlString = urlString.replace(/^(?:https?:)?\/\//, "");
	return urlString;
}
var require_escape = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = escape;
	var _assertString = _interopRequireDefault(require_assertString());
	function _interopRequireDefault(e) {
		return e && e.__esModule ? e : { default: e };
	}
	function escape(str) {
		(0, _assertString.default)(str);
		return str.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\//g, "&#x2F;").replace(/\\/g, "&#x5C;").replace(/`/g, "&#96;");
	}
	module.exports = exports.default;
	module.exports.default = exports.default;
}));
var import_normalizeEmail = /* @__PURE__ */ __toESM((/* @__PURE__ */ __commonJSMin(((exports, module) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = normalizeEmail;
	var _merge = _interopRequireDefault(require_merge());
	function _interopRequireDefault(e) {
		return e && e.__esModule ? e : { default: e };
	}
	var default_normalize_email_options = {
		all_lowercase: true,
		gmail_lowercase: true,
		gmail_remove_dots: true,
		gmail_remove_subaddress: true,
		gmail_convert_googlemaildotcom: true,
		outlookdotcom_lowercase: true,
		outlookdotcom_remove_subaddress: true,
		yahoo_lowercase: true,
		yahoo_remove_subaddress: true,
		yandex_lowercase: true,
		yandex_convert_yandexru: true,
		icloud_lowercase: true,
		icloud_remove_subaddress: true
	};
	var icloud_domains = ["icloud.com", "me.com"];
	var outlookdotcom_domains = [
		"hotmail.at",
		"hotmail.be",
		"hotmail.ca",
		"hotmail.cl",
		"hotmail.co.il",
		"hotmail.co.nz",
		"hotmail.co.th",
		"hotmail.co.uk",
		"hotmail.com",
		"hotmail.com.ar",
		"hotmail.com.au",
		"hotmail.com.br",
		"hotmail.com.gr",
		"hotmail.com.mx",
		"hotmail.com.pe",
		"hotmail.com.tr",
		"hotmail.com.vn",
		"hotmail.cz",
		"hotmail.de",
		"hotmail.dk",
		"hotmail.es",
		"hotmail.fr",
		"hotmail.hu",
		"hotmail.id",
		"hotmail.ie",
		"hotmail.in",
		"hotmail.it",
		"hotmail.jp",
		"hotmail.kr",
		"hotmail.lv",
		"hotmail.my",
		"hotmail.ph",
		"hotmail.pt",
		"hotmail.sa",
		"hotmail.sg",
		"hotmail.sk",
		"live.be",
		"live.co.uk",
		"live.com",
		"live.com.ar",
		"live.com.mx",
		"live.de",
		"live.es",
		"live.eu",
		"live.fr",
		"live.it",
		"live.nl",
		"msn.com",
		"outlook.at",
		"outlook.be",
		"outlook.cl",
		"outlook.co.il",
		"outlook.co.nz",
		"outlook.co.th",
		"outlook.com",
		"outlook.com.ar",
		"outlook.com.au",
		"outlook.com.br",
		"outlook.com.gr",
		"outlook.com.pe",
		"outlook.com.tr",
		"outlook.com.vn",
		"outlook.cz",
		"outlook.de",
		"outlook.dk",
		"outlook.es",
		"outlook.fr",
		"outlook.hu",
		"outlook.id",
		"outlook.ie",
		"outlook.in",
		"outlook.it",
		"outlook.jp",
		"outlook.kr",
		"outlook.lv",
		"outlook.my",
		"outlook.ph",
		"outlook.pt",
		"outlook.sa",
		"outlook.sg",
		"outlook.sk",
		"passport.com"
	];
	var yahoo_domains = [
		"rocketmail.com",
		"yahoo.ca",
		"yahoo.co.uk",
		"yahoo.com",
		"yahoo.de",
		"yahoo.fr",
		"yahoo.in",
		"yahoo.it",
		"ymail.com"
	];
	var yandex_domains = [
		"yandex.ru",
		"yandex.ua",
		"yandex.kz",
		"yandex.com",
		"yandex.by",
		"ya.ru"
	];
	function dotsReplacer(match) {
		if (match.length > 1) return match;
		return "";
	}
	function normalizeEmail(email, options) {
		options = (0, _merge.default)(options, default_normalize_email_options);
		var raw_parts = email.split("@");
		var domain = raw_parts.pop();
		var parts = [raw_parts.join("@"), domain];
		parts[1] = parts[1].toLowerCase();
		if (parts[1] === "gmail.com" || parts[1] === "googlemail.com") {
			if (options.gmail_remove_subaddress) parts[0] = parts[0].split("+")[0];
			if (options.gmail_remove_dots) parts[0] = parts[0].replace(/\.+/g, dotsReplacer);
			if (!parts[0].length) return false;
			if (options.all_lowercase || options.gmail_lowercase) parts[0] = parts[0].toLowerCase();
			parts[1] = options.gmail_convert_googlemaildotcom ? "gmail.com" : parts[1];
		} else if (icloud_domains.indexOf(parts[1]) >= 0) {
			if (options.icloud_remove_subaddress) parts[0] = parts[0].split("+")[0];
			if (!parts[0].length) return false;
			if (options.all_lowercase || options.icloud_lowercase) parts[0] = parts[0].toLowerCase();
		} else if (outlookdotcom_domains.indexOf(parts[1]) >= 0) {
			if (options.outlookdotcom_remove_subaddress) parts[0] = parts[0].split("+")[0];
			if (!parts[0].length) return false;
			if (options.all_lowercase || options.outlookdotcom_lowercase) parts[0] = parts[0].toLowerCase();
		} else if (yahoo_domains.indexOf(parts[1]) >= 0) {
			if (options.yahoo_remove_subaddress) {
				var components = parts[0].split("-");
				parts[0] = components.length > 1 ? components.slice(0, -1).join("-") : components[0];
			}
			if (!parts[0].length) return false;
			if (options.all_lowercase || options.yahoo_lowercase) parts[0] = parts[0].toLowerCase();
		} else if (yandex_domains.indexOf(parts[1]) >= 0) {
			if (options.all_lowercase || options.yandex_lowercase) parts[0] = parts[0].toLowerCase();
			parts[1] = options.yandex_convert_yandexru ? "yandex.ru" : parts[1];
		} else if (options.all_lowercase) parts[0] = parts[0].toLowerCase();
		return parts.join("@");
	}
	module.exports = exports.default;
	module.exports.default = exports.default;
})))(), 1);
var import_escape = /* @__PURE__ */ __toESM(require_escape(), 1);
var CompilerBuffer = class CompilerBuffer {
	#content = "";
	newLine = "\n";
	writeStatement(statement) {
		this.#content = `${this.#content}${this.newLine}${statement}`;
	}
	child() {
		return new CompilerBuffer();
	}
	toString() {
		return this.#content;
	}
	flush() {
		this.#content = "";
	}
};
function defineFieldVariables({ parseFnRefId, variableName, wildCardPath, isArrayMember, valueExpression, parentExpression, fieldNameExpression, parentValueExpression }) {
	const inValueExpression = parseFnRefId ? `refs['${parseFnRefId}'](${valueExpression}, {
      data: root,
      meta: meta,
      parent: ${parentValueExpression}
    })` : valueExpression;
	let fieldPathOutputExpression = "";
	if (parentExpression === "root" || parentExpression === "root_item") fieldPathOutputExpression = fieldNameExpression;
	else if (fieldNameExpression !== "''") fieldPathOutputExpression = `${parentExpression}.getFieldPath() + '.' + ${fieldNameExpression}`;
	return `const ${variableName} = defineValue(${inValueExpression}, {
  data: root,
  meta: meta,
  name: ${fieldNameExpression},
  wildCardPath: '${wildCardPath}',
  getFieldPath() {
    return ${fieldPathOutputExpression};
  },
  mutate: defineValue,
  report: report,
  isValid: true,
  isValidDataType: false,
  parent: ${parentValueExpression},
  isArrayMember: ${isArrayMember},
});`;
}
function validateLiteralField({ variableName, validatorFnId }) {
	const rule = `refs['${validatorFnId}']`;
	return `${variableName}.isValidDataType = ${`${rule}.validator(${variableName}.value, ${rule}.options, ${variableName});`}`;
}
var BaseNode = class {
	#node;
	#parentField;
	field;
	constructor(node, compiler, parent, parentField) {
		this.#parentField = parentField;
		this.#node = node;
		if (this.#parentField) this.field = this.#parentField;
		else {
			compiler.variablesCounter++;
			this.field = compiler.createFieldFor(node, parent);
		}
	}
	defineField(buffer) {
		if (!this.#parentField) buffer.writeStatement(defineFieldVariables({
			fieldNameExpression: this.field.fieldNameExpression,
			isArrayMember: this.field.isArrayMember,
			parentExpression: this.field.parentExpression,
			parentValueExpression: this.field.parentValueExpression,
			valueExpression: this.field.valueExpression,
			variableName: this.field.variableName,
			wildCardPath: this.field.wildCardPath,
			parseFnRefId: "parseFnId" in this.#node ? this.#node.parseFnId : void 0
		}));
	}
};
function defineArrayGuard({ variableName, guardedCodeSnippet }) {
	return `if (${variableName}.isValidDataType) {
${guardedCodeSnippet}
}`;
}
function defineIsValidGuard({ variableName, bail, guardedCodeSnippet }) {
	if (!bail) return guardedCodeSnippet;
	return `if (${variableName}.isValid) {
${guardedCodeSnippet}
}`;
}
function defineFieldNullOutput({ allowNull, conditional, variableName, outputExpression, transformFnRefId }) {
	if (!allowNull) return "";
	return `${conditional || "if"}(${variableName}.value === null) {
  ${outputExpression} = ${transformFnRefId ? `refs['${transformFnRefId}'](null, ${variableName});` : "null;"}
}`;
}
function wrapInConditional(conditions, wrappingCode) {
	const [first, second] = conditions;
	if (first && second) return `if (${first} && ${second}) {
  ${wrappingCode}
}`;
	if (first) return `if (${first}) {
  ${wrappingCode}
}`;
	if (second) return `if (${second}) {
  ${wrappingCode}
}`;
	return wrappingCode;
}
function emitValidationSnippet({ isAsync, implicit, ruleFnId }, variableName, bail, dropMissingCheck, existenceCheckExpression) {
	const rule = `refs['${ruleFnId}']`;
	const callable = `${rule}.validator(${variableName}.value, ${rule}.options, ${variableName});`;
	existenceCheckExpression = existenceCheckExpression || `${variableName}.isDefined`;
	return wrapInConditional([bail ? `${variableName}.isValid` : "", implicit || dropMissingCheck ? "" : existenceCheckExpression], isAsync ? `await ${callable}` : `${callable}`);
}
function defineFieldValidations({ bail, validations, variableName, dropMissingCheck, existenceCheckExpression }) {
	return `${validations.map((one) => emitValidationSnippet(one, variableName, bail, dropMissingCheck, existenceCheckExpression)).join("\n")}`;
}
function defineArrayInitialOutput({ variableName, outputExpression, outputValueExpression }) {
	return `const ${variableName}_out = ${outputValueExpression};
${outputExpression} = ${variableName}_out;`;
}
function defineFieldExistenceValidations({ allowNull, isOptional, variableName }) {
	if (isOptional === false) if (allowNull === false) return `ensureExists(${variableName});`;
	else return `ensureIsDefined(${variableName});`;
	return "";
}
function validateArrayField({ variableName }) {
	return `${variableName}.isValidDataType = ensureIsArray(${variableName});`;
}
var TupleNodeCompiler = class extends BaseNode {
	#node;
	#buffer;
	#compiler;
	constructor(node, buffer, compiler, parent, parentField) {
		super(node, compiler, parent, parentField);
		this.#node = node;
		this.#buffer = buffer;
		this.#compiler = compiler;
	}
	#compileTupleChildren() {
		const buffer = this.#buffer.child();
		const parent = {
			type: "tuple",
			fieldPathExpression: this.field.fieldPathExpression,
			outputExpression: this.field.outputExpression,
			variableName: this.field.variableName,
			wildCardPath: this.field.wildCardPath
		};
		this.#node.properties.forEach((child) => {
			this.#compiler.compileNode(child, buffer, parent);
		});
		return buffer.toString();
	}
	compile() {
		this.defineField(this.#buffer);
		this.#buffer.writeStatement(defineFieldExistenceValidations({
			allowNull: this.#node.allowNull,
			isOptional: this.#node.isOptional,
			variableName: this.field.variableName
		}));
		this.#buffer.writeStatement(validateArrayField({ variableName: this.field.variableName }));
		this.#buffer.writeStatement(defineFieldValidations({
			variableName: this.field.variableName,
			validations: this.#node.validations,
			bail: this.#node.bail,
			dropMissingCheck: false,
			existenceCheckExpression: `${this.field.variableName}.isValidDataType`
		}));
		const isArrayValidBlock = defineArrayGuard({
			variableName: this.field.variableName,
			guardedCodeSnippet: `${this.#buffer.newLine}${defineIsValidGuard({
				variableName: this.field.variableName,
				bail: this.#node.bail,
				guardedCodeSnippet: `${defineArrayInitialOutput({
					variableName: this.field.variableName,
					outputExpression: this.field.outputExpression,
					outputValueExpression: this.#node.allowUnknownProperties ? `copyProperties(${this.field.variableName}.value)` : `[]`
				})}${this.#buffer.newLine}${this.#compileTupleChildren()}`
			})}`
		});
		this.#buffer.writeStatement(`${isArrayValidBlock}${this.#buffer.newLine}${defineFieldNullOutput({
			allowNull: this.#node.allowNull,
			outputExpression: this.field.outputExpression,
			variableName: this.field.variableName,
			conditional: "else if"
		})}`);
	}
};
function defineArrayLoop({ variableName, loopCodeSnippet, startingIndex }) {
	startingIndex = startingIndex || 0;
	return `const ${variableName}_items_size = ${variableName}.value.length;
for (let ${variableName}_i = ${startingIndex}; ${variableName}_i < ${variableName}_items_size; ${variableName}_i++) {
${loopCodeSnippet}
}`;
}
var ArrayNodeCompiler = class extends BaseNode {
	#node;
	#buffer;
	#compiler;
	constructor(node, buffer, compiler, parent, parentField) {
		super(node, compiler, parent, parentField);
		this.#node = node;
		this.#buffer = buffer;
		this.#compiler = compiler;
	}
	#compileArrayElements() {
		const arrayElementsBuffer = this.#buffer.child();
		this.#compiler.compileNode(this.#node.each, arrayElementsBuffer, {
			type: "array",
			fieldPathExpression: this.field.fieldPathExpression,
			outputExpression: this.field.outputExpression,
			variableName: this.field.variableName,
			wildCardPath: this.field.wildCardPath
		});
		const buffer = this.#buffer.child();
		buffer.writeStatement(defineArrayLoop({
			variableName: this.field.variableName,
			startingIndex: 0,
			loopCodeSnippet: arrayElementsBuffer.toString()
		}));
		arrayElementsBuffer.flush();
		return buffer.toString();
	}
	compile() {
		this.defineField(this.#buffer);
		this.#buffer.writeStatement(defineFieldExistenceValidations({
			allowNull: this.#node.allowNull,
			isOptional: this.#node.isOptional,
			variableName: this.field.variableName
		}));
		this.#buffer.writeStatement(validateArrayField({ variableName: this.field.variableName }));
		this.#buffer.writeStatement(defineFieldValidations({
			variableName: this.field.variableName,
			validations: this.#node.validations,
			bail: this.#node.bail,
			dropMissingCheck: false,
			existenceCheckExpression: `${this.field.variableName}.isValidDataType`
		}));
		const isArrayValidBlock = defineArrayGuard({
			variableName: this.field.variableName,
			guardedCodeSnippet: `${this.#buffer.newLine}${defineIsValidGuard({
				variableName: this.field.variableName,
				bail: this.#node.bail,
				guardedCodeSnippet: `${defineArrayInitialOutput({
					variableName: this.field.variableName,
					outputExpression: this.field.outputExpression,
					outputValueExpression: `[]`
				})}${this.#buffer.newLine}${this.#compileArrayElements()}`
			})}`
		});
		this.#buffer.writeStatement(`${isArrayValidBlock}${this.#buffer.newLine}${defineFieldNullOutput({
			allowNull: this.#node.allowNull,
			outputExpression: this.field.outputExpression,
			variableName: this.field.variableName,
			conditional: "else if"
		})}`);
	}
};
function callParseFunction({ parseFnRefId, variableName }) {
	if (parseFnRefId) return `${variableName}.value = refs['${parseFnRefId}'](${variableName}.value);`;
	return "";
}
function defineElseCondition({ variableName, conditionalFnRefId }) {
	return `else {
refs['${conditionalFnRefId}'](${variableName}.value, ${variableName});
}`;
}
function defineConditionalGuard({ conditional, variableName, conditionalFnRefId, guardedCodeSnippet }) {
	return `${conditional}(refs['${conditionalFnRefId}'](${variableName}.value, ${variableName})) {
${guardedCodeSnippet}
}`;
}
var UnionNodeCompiler = class extends BaseNode {
	#compiler;
	#node;
	#buffer;
	#parent;
	constructor(node, buffer, compiler, parent, parentField) {
		super(node, compiler, parent, parentField);
		this.#node = node;
		this.#buffer = buffer;
		this.#parent = parent;
		this.#compiler = compiler;
	}
	#compileUnionChildren() {
		const childrenBuffer = this.#buffer.child();
		this.#node.conditions.forEach((child, index) => {
			const conditionalBuffer = this.#buffer.child();
			if ("parseFnId" in child.schema) conditionalBuffer.writeStatement(callParseFunction({
				parseFnRefId: child.schema.parseFnId,
				variableName: this.field.variableName
			}));
			this.#compiler.compileNode(child.schema, conditionalBuffer, this.#parent, this.field);
			childrenBuffer.writeStatement(defineConditionalGuard({
				conditional: index === 0 ? "if" : "else if",
				variableName: this.field.variableName,
				conditionalFnRefId: child.conditionalFnRefId,
				guardedCodeSnippet: conditionalBuffer.toString()
			}));
			conditionalBuffer.flush();
		});
		if (this.#node.elseConditionalFnRefId && this.#node.conditions.length) childrenBuffer.writeStatement(defineElseCondition({
			variableName: this.field.variableName,
			conditionalFnRefId: this.#node.elseConditionalFnRefId
		}));
		return childrenBuffer.toString();
	}
	compile() {
		this.defineField(this.#buffer);
		this.#buffer.writeStatement(this.#compileUnionChildren());
	}
};
function defineRecordLoop({ variableName, loopCodeSnippet }) {
	return `const ${variableName}_keys = Object.keys(${variableName}.value);
const ${variableName}_keys_size = ${variableName}_keys.length;
for (let ${variableName}_key_i = 0; ${variableName}_key_i < ${variableName}_keys_size; ${variableName}_key_i++) {
const ${variableName}_i = ${variableName}_keys[${variableName}_key_i];
${loopCodeSnippet}
}`;
}
function defineObjectGuard({ variableName, guardedCodeSnippet }) {
	return `if (${variableName}.isValidDataType) {
${guardedCodeSnippet}
}`;
}
function defineObjectInitialOutput({ variableName, outputExpression, outputValueExpression }) {
	return `const ${variableName}_out = ${outputValueExpression};
${outputExpression} = ${variableName}_out;`;
}
function validateObjectField({ variableName }) {
	return `${variableName}.isValidDataType = ensureIsObject(${variableName});`;
}
var RecordNodeCompiler = class extends BaseNode {
	#node;
	#buffer;
	#compiler;
	constructor(node, buffer, compiler, parent, parentField) {
		super(node, compiler, parent, parentField);
		this.#node = node;
		this.#buffer = buffer;
		this.#compiler = compiler;
	}
	#compileRecordElements() {
		const buffer = this.#buffer.child();
		const recordElementsBuffer = this.#buffer.child();
		this.#compiler.compileNode(this.#node.each, recordElementsBuffer, {
			type: "record",
			fieldPathExpression: this.field.fieldPathExpression,
			outputExpression: this.field.outputExpression,
			variableName: this.field.variableName,
			wildCardPath: this.field.wildCardPath
		});
		buffer.writeStatement(defineRecordLoop({
			variableName: this.field.variableName,
			loopCodeSnippet: recordElementsBuffer.toString()
		}));
		recordElementsBuffer.flush();
		return buffer.toString();
	}
	compile() {
		this.defineField(this.#buffer);
		this.#buffer.writeStatement(defineFieldExistenceValidations({
			allowNull: this.#node.allowNull,
			isOptional: this.#node.isOptional,
			variableName: this.field.variableName
		}));
		this.#buffer.writeStatement(validateObjectField({ variableName: this.field.variableName }));
		this.#buffer.writeStatement(defineFieldValidations({
			variableName: this.field.variableName,
			validations: this.#node.validations,
			bail: this.#node.bail,
			dropMissingCheck: false,
			existenceCheckExpression: `${this.field.variableName}.isValidDataType`
		}));
		const isObjectValidBlock = defineIsValidGuard({
			variableName: this.field.variableName,
			bail: this.#node.bail,
			guardedCodeSnippet: `${defineObjectInitialOutput({
				variableName: this.field.variableName,
				outputExpression: this.field.outputExpression,
				outputValueExpression: `{}`
			})}${this.#compileRecordElements()}`
		});
		const isValueAnObjectBlock = defineObjectGuard({
			variableName: this.field.variableName,
			guardedCodeSnippet: `${this.#buffer.newLine}${isObjectValidBlock}`
		});
		this.#buffer.writeStatement(`${isValueAnObjectBlock}${this.#buffer.newLine}${defineFieldNullOutput({
			allowNull: this.#node.allowNull,
			outputExpression: this.field.outputExpression,
			variableName: this.field.variableName,
			conditional: "else if"
		})}`);
	}
};
function arrayToString(arr) {
	return `[${arr.map((str) => `"${str}"`).join(", ")}]`;
}
function defineMoveProperties({ variableName, fieldsToIgnore, allowUnknownProperties }) {
	if (!allowUnknownProperties) return "";
	return `moveProperties(${variableName}.value, ${variableName}_out, ${arrayToString(fieldsToIgnore)});`;
}
var ObjectNodeCompiler = class extends BaseNode {
	#node;
	#buffer;
	#compiler;
	constructor(node, buffer, compiler, parent, parentField) {
		super(node, compiler, parent, parentField);
		this.#node = node;
		this.#buffer = buffer;
		this.#compiler = compiler;
	}
	#getFieldNames(node) {
		let fieldNames = node.properties.map((child) => child.fieldName);
		const groupsFieldNames = node.groups.flatMap((group) => this.#getGroupFieldNames(group));
		return fieldNames.concat(groupsFieldNames);
	}
	#getGroupFieldNames(group) {
		return group.conditions.flatMap((condition) => {
			return this.#getFieldNames(condition.schema);
		});
	}
	#compileObjectChildren() {
		const buffer = this.#buffer.child();
		const parent = {
			type: "object",
			fieldPathExpression: this.field.fieldPathExpression,
			outputExpression: this.field.outputExpression,
			variableName: this.field.variableName,
			wildCardPath: this.field.wildCardPath
		};
		this.#node.properties.forEach((child) => this.#compiler.compileNode(child, buffer, parent));
		return buffer.toString();
	}
	#compileObjectGroups() {
		const buffer = this.#buffer.child();
		const parent = {
			type: "object",
			fieldPathExpression: this.field.fieldPathExpression,
			outputExpression: this.field.outputExpression,
			variableName: this.field.variableName,
			wildCardPath: this.field.wildCardPath
		};
		this.#node.groups.forEach((group) => this.#compileObjectGroup(group, buffer, parent));
		return buffer.toString();
	}
	#compileObjectGroup(group, buffer, parent) {
		group.conditions.forEach((condition, index) => {
			const guardBuffer = buffer.child();
			condition.schema.properties.forEach((child) => {
				this.#compiler.compileNode(child, guardBuffer, parent);
			});
			condition.schema.groups.forEach((child) => {
				this.#compileObjectGroup(child, guardBuffer, parent);
			});
			buffer.writeStatement(defineConditionalGuard({
				variableName: this.field.variableName,
				conditional: index === 0 ? "if" : "else if",
				conditionalFnRefId: condition.conditionalFnRefId,
				guardedCodeSnippet: guardBuffer.toString()
			}));
		});
		if (group.elseConditionalFnRefId && group.conditions.length) buffer.writeStatement(defineElseCondition({
			variableName: this.field.variableName,
			conditionalFnRefId: group.elseConditionalFnRefId
		}));
	}
	compile() {
		this.defineField(this.#buffer);
		this.#buffer.writeStatement(defineFieldExistenceValidations({
			allowNull: this.#node.allowNull,
			isOptional: this.#node.isOptional,
			variableName: this.field.variableName
		}));
		this.#buffer.writeStatement(validateObjectField({ variableName: this.field.variableName }));
		this.#buffer.writeStatement(defineFieldValidations({
			variableName: this.field.variableName,
			validations: this.#node.validations,
			bail: this.#node.bail,
			dropMissingCheck: false,
			existenceCheckExpression: `${this.field.variableName}.isValidDataType`
		}));
		const isObjectValidBlock = defineIsValidGuard({
			variableName: this.field.variableName,
			bail: this.#node.bail,
			guardedCodeSnippet: `${defineObjectInitialOutput({
				variableName: this.field.variableName,
				outputExpression: this.field.outputExpression,
				outputValueExpression: "{}"
			})}${this.#buffer.newLine}${this.#compileObjectChildren()}${this.#buffer.newLine}${this.#compileObjectGroups()}${this.#buffer.newLine}${defineMoveProperties({
				variableName: this.field.variableName,
				allowUnknownProperties: this.#node.allowUnknownProperties,
				fieldsToIgnore: this.#node.allowUnknownProperties ? this.#getFieldNames(this.#node) : []
			})}`
		});
		const isValueAnObject = defineObjectGuard({
			variableName: this.field.variableName,
			guardedCodeSnippet: `${isObjectValidBlock}`
		});
		this.#buffer.writeStatement(`${isValueAnObject}${this.#buffer.newLine}${defineFieldNullOutput({
			variableName: this.field.variableName,
			allowNull: this.#node.allowNull,
			outputExpression: this.field.outputExpression,
			conditional: "else if"
		})}`);
	}
};
function createRootField(parent) {
	return {
		parentExpression: parent.variableName,
		parentValueExpression: parent.variableName,
		fieldNameExpression: `''`,
		fieldPathExpression: `''`,
		wildCardPath: "",
		variableName: `${parent.variableName}_item`,
		valueExpression: "root",
		outputExpression: parent.outputExpression,
		isArrayMember: false
	};
}
function defineFieldValueOutput({ variableName, outputExpression, transformFnRefId }) {
	return `if (${variableName}.isDefined && ${variableName}.isValid) {
  ${outputExpression} = ${transformFnRefId ? `refs['${transformFnRefId}'](${variableName}.value, ${variableName})` : `${variableName}.value`};
}`;
}
var LiteralNodeCompiler = class extends BaseNode {
	#node;
	#buffer;
	constructor(node, buffer, compiler, parent, parentField) {
		super(node, compiler, parent, parentField);
		this.#node = node;
		this.#buffer = buffer;
	}
	compile() {
		this.defineField(this.#buffer);
		this.#buffer.writeStatement(defineFieldExistenceValidations({
			allowNull: this.#node.allowNull,
			isOptional: this.#node.isOptional,
			variableName: this.field.variableName
		}));
		if (this.#node.dataTypeValidatorFnId) this.#buffer.writeStatement(validateLiteralField({
			variableName: this.field.variableName,
			validatorFnId: this.#node.dataTypeValidatorFnId
		}));
		this.#buffer.writeStatement(defineFieldValidations({
			variableName: this.field.variableName,
			validations: this.#node.validations,
			bail: this.#node.bail,
			existenceCheckExpression: this.#node.dataTypeValidatorFnId ? `${this.field.variableName}.isValidDataType` : void 0,
			dropMissingCheck: false
		}));
		this.#buffer.writeStatement(`${defineFieldValueOutput({
			variableName: this.field.variableName,
			outputExpression: this.field.outputExpression,
			transformFnRefId: this.#node.transformFnId
		})}${this.#buffer.newLine}${defineFieldNullOutput({
			variableName: this.field.variableName,
			allowNull: this.#node.allowNull,
			outputExpression: this.field.outputExpression,
			transformFnRefId: this.#node.transformFnId,
			conditional: "else if"
		})}`);
	}
};
function createArrayField(parent) {
	const wildCardPath = parent.wildCardPath !== "" ? `${parent.wildCardPath}.*` : `*`;
	return {
		parentExpression: parent.variableName,
		parentValueExpression: `${parent.variableName}.value`,
		fieldNameExpression: `${parent.variableName}_i`,
		fieldPathExpression: wildCardPath,
		wildCardPath,
		variableName: `${parent.variableName}_item`,
		valueExpression: `${parent.variableName}.value[${parent.variableName}_i]`,
		outputExpression: `${parent.variableName}_out[${parent.variableName}_i]`,
		isArrayMember: true
	};
}
function createTupleField(node, parent) {
	const wildCardPath = parent.wildCardPath !== "" ? `${parent.wildCardPath}.${node.fieldName}` : node.fieldName;
	return {
		parentExpression: parent.variableName,
		parentValueExpression: `${parent.variableName}.value`,
		fieldNameExpression: `${node.fieldName}`,
		fieldPathExpression: wildCardPath,
		wildCardPath,
		variableName: `${parent.variableName}_item_${node.fieldName}`,
		valueExpression: `${parent.variableName}.value[${node.fieldName}]`,
		outputExpression: `${parent.variableName}_out[${node.propertyName}]`,
		isArrayMember: true
	};
}
function reportErrors() {
	return `if(errorReporter.hasErrors) {
  throw errorReporter.createError();
}`;
}
const NUMBER_CHAR_RE = /\d/;
const VALID_CHARS = /[A-Za-z0-9]+/;
function isUppercase(char = "") {
	if (NUMBER_CHAR_RE.test(char)) return;
	return char !== char.toLowerCase();
}
function upperFirst(value) {
	return value ? value[0].toUpperCase() + value.slice(1) : "";
}
function lowerFirst(value) {
	return value ? value[0].toLowerCase() + value.slice(1) : "";
}
function splitByCase(value) {
	const parts = [];
	if (!value || typeof value !== "string") return parts;
	let buff = "";
	let previousUpper;
	let previousSplitter;
	for (const char of value) {
		const isSplitter = !VALID_CHARS.test(char);
		if (isSplitter === true) {
			parts.push(buff);
			buff = "";
			previousUpper = void 0;
			continue;
		}
		const isUpper = isUppercase(char);
		if (previousSplitter === false) {
			if (previousUpper === false && isUpper === true) {
				parts.push(buff);
				buff = char;
				previousUpper = isUpper;
				continue;
			}
			if (previousUpper === true && isUpper === false && buff.length > 1) {
				const lastChar = buff.at(-1);
				parts.push(buff.slice(0, Math.max(0, buff.length - 1)));
				buff = lastChar + char;
				previousUpper = isUpper;
				continue;
			}
		}
		buff += char;
		previousUpper = isUpper;
		previousSplitter = isSplitter;
	}
	parts.push(buff);
	return parts;
}
function toVariableName(value) {
	const pascalCase = splitByCase(value).map((p) => upperFirst(p.toLowerCase())).join("");
	return /^[0-9]+/.test(pascalCase) ? `var_${pascalCase}` : lowerFirst(pascalCase);
}
function createObjectField(node, variablesCounter, parent) {
	const wildCardPath = parent.wildCardPath !== "" ? `${parent.wildCardPath}.${node.fieldName}` : node.fieldName;
	return {
		parentExpression: parent.variableName,
		parentValueExpression: `${parent.variableName}.value`,
		fieldNameExpression: `'${node.fieldName}'`,
		fieldPathExpression: wildCardPath,
		wildCardPath,
		variableName: `${toVariableName(node.propertyName)}_${variablesCounter}`,
		valueExpression: `${parent.variableName}.value['${node.fieldName}']`,
		outputExpression: `${parent.variableName}_out['${node.propertyName}']`,
		isArrayMember: false
	};
}
function createRecordField(parent) {
	const wildCardPath = parent.wildCardPath !== "" ? `${parent.wildCardPath}.*` : `*`;
	return {
		parentExpression: parent.variableName,
		parentValueExpression: `${parent.variableName}.value`,
		fieldNameExpression: `${parent.variableName}_i`,
		fieldPathExpression: wildCardPath,
		wildCardPath,
		variableName: `${parent.variableName}_item`,
		valueExpression: `${parent.variableName}.value[${parent.variableName}_i]`,
		outputExpression: `${parent.variableName}_out[${parent.variableName}_i]`,
		isArrayMember: false
	};
}
function defineInlineFunctions(options) {
	return `function report(message, rule, field, args) {
  field.isValid = false;
  errorReporter.report(messagesProvider.getMessage(message, rule, field, args), rule, field, args);
};
function defineValue(value, field) {
  ${options.convertEmptyStringsToNull ? `if (typeof value === 'string' && value.trim() === '') { value = null; }` : ""}
  field.value = value;
  field.isDefined = value !== undefined && value !== null;
  return field;
};
function ensureExists(field) {
  if (field.value === undefined || field.value === null) {
    field.report(REQUIRED, 'required', field);
    return false;
  }
  return true;
};
function ensureIsDefined(field) {
  if (field.value === undefined) {
    field.report(REQUIRED, 'required', field);
    return false;
  }
  return true;
};
function ensureIsObject(field) {
  if (!field.isDefined) {
    return false;
  }
  if (typeof field.value == 'object' && !Array.isArray(field.value)) {
    return true;
  }
  field.report(NOT_AN_OBJECT, 'object', field);
  return false;
};
function ensureIsArray(field) {
  if (!field.isDefined) {
    return false;
  }
  if (Array.isArray(field.value)) {
    return true;
  }
  field.report(NOT_AN_ARRAY, 'array', field);
  return false;
};
function copyProperties(val) {
  let k, out, tmp;

  if (Array.isArray(val)) {
    out = Array((k = val.length))
    while (k--) out[k] = (tmp = val[k]) && typeof tmp == 'object' ? copyProperties(tmp) : tmp
    return out
  }

  if (Object.prototype.toString.call(val) === '[object Object]') {
    out = {} // null
    for (k in val) {
      out[k] = (tmp = val[k]) && typeof tmp == 'object' ? copyProperties(tmp) : tmp
    }
    return out
  }
  return val
};
function moveProperties(source, destination, ignoreKeys) {
  for (let key in source) {
    if (!ignoreKeys.includes(key)) {
      const value = source[key]
      destination[key] = copyProperties(value)
    }
  }
};`;
}
function defineInlineErrorMessages(messages) {
	return `const REQUIRED = '${messages.required}';
const NOT_AN_OBJECT = '${messages.object}';
const NOT_AN_ARRAY = '${messages.array}';`;
}
const AsyncFunction = Object.getPrototypeOf(async function() {}).constructor;
var Compiler = class {
	variablesCounter = 0;
	#rootNode;
	#options;
	#buffer = new CompilerBuffer();
	constructor(rootNode, options) {
		this.#rootNode = rootNode;
		this.#options = options || { convertEmptyStringsToNull: false };
	}
	#initiateJSOutput() {
		this.#buffer.writeStatement(defineInlineErrorMessages({
			required: "value is required",
			object: "value is not a valid object",
			array: "value is not a valid array",
			...this.#options.messages
		}));
		this.#buffer.writeStatement(defineInlineFunctions(this.#options));
		this.#buffer.writeStatement("let out;");
	}
	#finishJSOutput() {
		this.#buffer.writeStatement(reportErrors());
		this.#buffer.writeStatement("return out;");
	}
	#compileNodes() {
		this.compileNode(this.#rootNode.schema, this.#buffer, {
			type: "root",
			variableName: "root",
			outputExpression: "out",
			fieldPathExpression: "out",
			wildCardPath: ""
		});
	}
	#toAsyncFunction() {
		return new AsyncFunction("root", "meta", "refs", "messagesProvider", "errorReporter", this.#buffer.toString());
	}
	createFieldFor(node, parent) {
		switch (parent.type) {
			case "array": return createArrayField(parent);
			case "root": return createRootField(parent);
			case "object": return createObjectField(node, this.variablesCounter, parent);
			case "tuple": return createTupleField(node, parent);
			case "record": return createRecordField(parent);
		}
	}
	compileNode(node, buffer, parent, parentField) {
		switch (node.type) {
			case "literal": return new LiteralNodeCompiler(node, buffer, this, parent, parentField).compile();
			case "array": return new ArrayNodeCompiler(node, buffer, this, parent, parentField).compile();
			case "record": return new RecordNodeCompiler(node, buffer, this, parent, parentField).compile();
			case "object": return new ObjectNodeCompiler(node, buffer, this, parent, parentField).compile();
			case "tuple": return new TupleNodeCompiler(node, buffer, this, parent, parentField).compile();
			case "union": return new UnionNodeCompiler(node, buffer, this, parent, parentField).compile();
		}
	}
	compile() {
		this.#initiateJSOutput();
		this.#compileNodes();
		this.#finishJSOutput();
		const outputFunction = this.#toAsyncFunction();
		this.variablesCounter = 0;
		this.#buffer.flush();
		return outputFunction;
	}
};
function refsBuilder() {
	let counter = 0;
	const refs = {};
	return {
		toJSON() {
			return refs;
		},
		track(value) {
			counter++;
			const ref = `ref://${counter}`;
			refs[ref] = value;
			return ref;
		},
		trackValidation(validation) {
			return this.track(validation);
		},
		trackParser(fn) {
			return this.track(fn);
		},
		trackTransformer(fn) {
			return this.track(fn);
		},
		trackConditional(fn) {
			return this.track(fn);
		}
	};
}
function createRule(validator, metaData) {
	const rule = {
		validator,
		name: metaData?.name ?? validator.name,
		isAsync: metaData?.isAsync || validator.constructor.name === "AsyncFunction",
		implicit: metaData?.implicit ?? false,
		toJSONSchema: metaData?.toJSONSchema
	};
	return function(...options) {
		return {
			rule,
			options: options[0]
		};
	};
}
const UNIQUE_NAME = Symbol.for("schema_name");
const IS_OF_TYPE = Symbol.for("is_of_type");
const PARSE = Symbol.for("parse");
const VALIDATION = Symbol.for("to_validation");
const SUBTYPE = Symbol.for("subtype");
const requiredWhen = createRule(function requiredWhen(_, checker, field) {
	const shouldBeRequired = checker(field);
	if (!field.isDefined && shouldBeRequired) field.report(messages.required, "required", field);
}, { implicit: true });
var ConditionalValidations = class {
	requiredWhen(otherField, operator, expectedValue) {
		if (typeof otherField === "function") return this.use(requiredWhen(otherField));
		let checker;
		switch (operator) {
			case "=":
				checker = (value) => value === expectedValue;
				break;
			case "!=":
				checker = (value) => value !== expectedValue;
				break;
			case "in":
				checker = (value) => expectedValue.includes(value);
				break;
			case "notIn":
				checker = (value) => !expectedValue.includes(value);
				break;
			case ">":
				checker = (value) => value > expectedValue;
				break;
			case "<":
				checker = (value) => value < expectedValue;
				break;
			case ">=":
				checker = (value) => value >= expectedValue;
				break;
			case "<=": checker = (value) => value <= expectedValue;
		}
		return this.use(requiredWhen((field) => {
			const otherFieldValue = helpers.getNestedValue(otherField, field);
			return checker(otherFieldValue);
		}));
	}
	requiredIfExists(fields) {
		const fieldsToExist = Array.isArray(fields) ? fields : [fields];
		return this.use(requiredWhen((field) => {
			return fieldsToExist.every((otherField) => {
				return helpers.exists(helpers.getNestedValue(otherField, field));
			});
		}));
	}
	requiredIfAnyExists(fields) {
		return this.use(requiredWhen((field) => {
			return fields.some((otherField) => helpers.exists(helpers.getNestedValue(otherField, field)));
		}));
	}
	requiredIfMissing(fields) {
		const fieldsToExist = Array.isArray(fields) ? fields : [fields];
		return this.use(requiredWhen((field) => {
			return fieldsToExist.every((otherField) => helpers.isMissing(helpers.getNestedValue(otherField, field)));
		}));
	}
	requiredIfAnyMissing(fields) {
		return this.use(requiredWhen((field) => {
			return fields.some((otherField) => helpers.isMissing(helpers.getNestedValue(otherField, field)));
		}));
	}
};
var NullableModifier$1 = class NullableModifier$1 {
	allowNull = true;
	get isOptional() {
		return this.#parent.isOptional;
	}
	#parent;
	constructor(parent) {
		this.#parent = parent;
	}
	clone() {
		return new NullableModifier$1(this.#parent.clone());
	}
	optional() {
		return new OptionalModifier$1(this);
	}
	transform(transformer) {
		return new TransformModifier(transformer, this);
	}
	meta(meta) {
		return new MetaModifier$1(this, meta);
	}
	toJSONSchema() {
		const schema = this.#parent.toJSONSchema?.() ?? {};
		if (schema.anyOf) {
			schema.anyOf.push({ type: "null" });
			return schema;
		}
		if (schema.enum) return { anyOf: [schema, { type: "null" }] };
		if (schema.type === void 0) {
			schema.type = "null";
			return schema;
		}
		if (typeof schema.type === "string") {
			schema.type = [schema.type, "null"];
			return schema;
		}
		if (Array.isArray(schema.type)) {
			schema.type.push("null");
			return schema;
		}
		return schema;
	}
	[PARSE](propertyName, refs, options) {
		const output = this.#parent[PARSE](propertyName, refs, options);
		output.allowNull = true;
		return output;
	}
};
var MetaModifier$1 = class MetaModifier$1 {
	get isOptional() {
		return this.#parent.isOptional;
	}
	get allowNull() {
		return this.#parent.allowNull;
	}
	#parent;
	#meta;
	constructor(parent, meta) {
		this.#parent = parent;
		this.#meta = meta;
	}
	optional() {
		return new OptionalModifier$1(this);
	}
	transform(transformer) {
		return new TransformModifier(transformer, this);
	}
	nullable() {
		return new NullableModifier$1(this);
	}
	clone() {
		return new MetaModifier$1(this.#parent.clone(), this.#meta);
	}
	toJSONSchema() {
		return {
			...this.#parent.toJSONSchema?.() ?? {},
			...this.#meta
		};
	}
	[PARSE](propertyName, refs, options) {
		const output = this.#parent[PARSE](propertyName, refs, options);
		output.allowNull = true;
		return output;
	}
};
var OptionalModifier$1 = class OptionalModifier$1 extends ConditionalValidations {
	isOptional = true;
	get allowNull() {
		return this.#parent.allowNull;
	}
	#parent;
	validations;
	constructor(parent, validations) {
		super();
		this.#parent = parent;
		this.validations = validations || [];
	}
	cloneValidations() {
		return this.validations.map((validation) => {
			return {
				options: validation.options,
				rule: validation.rule
			};
		});
	}
	compileValidations(refs) {
		return this.validations.map((validation) => {
			return {
				ruleFnId: refs.track({
					validator: validation.rule.validator,
					options: validation.options
				}),
				name: validation.rule.name,
				implicit: validation.rule.implicit,
				isAsync: validation.rule.isAsync
			};
		});
	}
	nullable() {
		return new NullableModifier$1(this);
	}
	transform(transformer) {
		return new TransformModifier(transformer, this);
	}
	use(validation) {
		this.validations.push(VALIDATION in validation ? validation[VALIDATION]() : validation);
		return this;
	}
	clone() {
		return new OptionalModifier$1(this.#parent.clone(), this.cloneValidations());
	}
	meta(meta) {
		return new MetaModifier$1(this, meta);
	}
	toJSONSchema() {
		return { ...this.#parent.toJSONSchema() };
	}
	[PARSE](propertyName, refs, options) {
		const output = this.#parent[PARSE](propertyName, refs, options);
		output.isOptional = true;
		output.validations = output.validations.concat(this.compileValidations(refs));
		return output;
	}
};
var TransformModifier = class TransformModifier {
	get isOptional() {
		return this.#parent.isOptional;
	}
	get allowNull() {
		return this.#parent.allowNull;
	}
	#parent;
	#transform;
	constructor(transform, parent) {
		this.#transform = transform;
		this.#parent = parent;
	}
	clone() {
		return new TransformModifier(this.#transform, this.#parent.clone());
	}
	optional() {
		return new OptionalModifier$1(this);
	}
	nullable() {
		return new NullableModifier$1(this);
	}
	meta(meta) {
		return new MetaModifier$1(this, meta);
	}
	toJSONSchema() {
		return this.#parent.toJSONSchema();
	}
	[PARSE](propertyName, refs, options) {
		const output = this.#parent[PARSE](propertyName, refs, options);
		output.transformFnId = refs.trackTransformer(this.#transform);
		return output;
	}
};
var BaseLiteralType = class extends Macroable {
	dataTypeValidator;
	options;
	validations;
	constructor(options, validations) {
		super();
		this.options = {
			bail: true,
			allowNull: false,
			isOptional: false,
			...options
		};
		this.validations = validations || [];
	}
	cloneValidations() {
		return this.validations.map((validation) => {
			return {
				options: validation.options,
				rule: validation.rule
			};
		});
	}
	cloneOptions() {
		return { ...this.options };
	}
	compileValidation(validation, refs) {
		return {
			ruleFnId: refs.track({
				validator: validation.rule.validator,
				options: validation.options
			}),
			name: validation.rule.name,
			implicit: validation.rule.implicit,
			isAsync: validation.rule.isAsync
		};
	}
	compileValidations(refs) {
		return this.validations.map((validation) => this.compileValidation(validation, refs));
	}
	toJSONSchema() {
		const schema = {};
		if (this.dataTypeValidator?.rule.toJSONSchema) this.dataTypeValidator.rule.toJSONSchema(schema, this.dataTypeValidator.options);
		for (const validation of this.validations) {
			if (!validation.rule.toJSONSchema) continue;
			validation.rule.toJSONSchema(schema, validation.options);
		}
		return schema;
	}
	parse(callback) {
		this.options.parse = callback;
		return this;
	}
	use(validation) {
		this.validations.push(VALIDATION in validation ? validation[VALIDATION]() : validation);
		return this;
	}
	bail(state) {
		this.options.bail = state;
		return this;
	}
	optional() {
		return new OptionalModifier$1(this);
	}
	nullable() {
		return new NullableModifier$1(this);
	}
	meta(meta) {
		return new MetaModifier$1(this, meta);
	}
	transform(transformer) {
		return new TransformModifier(transformer, this);
	}
	[PARSE](propertyName, refs, options) {
		return {
			type: "literal",
			subtype: this[SUBTYPE],
			fieldName: propertyName,
			...this.dataTypeValidator ? { dataTypeValidatorFnId: this.compileValidation(this.dataTypeValidator, refs).ruleFnId } : {},
			propertyName: options.toCamelCase ? camelCase(propertyName) : propertyName,
			bail: this.options.bail,
			allowNull: this.options.allowNull,
			isOptional: this.options.isOptional,
			parseFnId: this.options.parse ? refs.trackParser(this.options.parse) : void 0,
			validations: this.compileValidations(refs)
		};
	}
};
var VineAny = class VineAny extends BaseLiteralType {
	constructor(options, validations) {
		super(options, validations);
	}
	[SUBTYPE] = "any";
	clone() {
		return new VineAny(this.cloneOptions(), this.cloneValidations());
	}
	toJSONSchema() {
		const schema = { anyOf: [
			{ type: "string" },
			{ type: "number" },
			{ type: "boolean" },
			{ type: "array" },
			{ type: "object" }
		] };
		for (const validation of this.validations) {
			if (!validation.rule.toJSONSchema) continue;
			validation.rule.toJSONSchema(schema, validation.options);
		}
		return schema;
	}
};
const enumRule = createRule(function enumList(value, options, field) {
	const choices = typeof options.choices === "function" ? options.choices(field) : options.choices;
	if (!choices.includes(value)) field.report(messages.enum, "enum", field, { choices });
}, { toJSONSchema: (schema, options) => {
	if (typeof options.choices === "function") return;
	schema.enum = options.choices;
} });
var VineEnum = class VineEnum extends BaseLiteralType {
	static rules = { enum: enumRule };
	#values;
	[SUBTYPE] = "enum";
	getChoices() {
		return this.#values;
	}
	constructor(values, options, validations) {
		super(options, validations || [enumRule({ choices: values })]);
		this.#values = values;
	}
	clone() {
		return new VineEnum(this.#values, this.cloneOptions(), this.cloneValidations());
	}
};
const dateRule = createRule(function date(value, options, field) {
	if (!field.isDefined) return false;
	if (typeof value !== "string" && typeof value !== "number") {
		field.report(messages.date, "date", field);
		return false;
	}
	const { dateTime, formats } = helpers.asDayJS(value, options.formats);
	if (!dateTime.isValid()) {
		field.report(messages.date, "date", field);
		return false;
	}
	field.$value = dateTime;
	field.$formats = formats;
	field.mutate(globalTransforms.date ? globalTransforms.date(dateTime.toDate()) : dateTime.toDate(), field);
	return true;
});
const equalsRule$1 = createRule(function equals(_, options, field) {
	const compare = options.compare || "day";
	const format = options.format || field.$formats;
	const dateTime = field.$value;
	const expectedValue = typeof options.expectedValue === "function" ? options.expectedValue(field) : options.expectedValue;
	const { dateTime: expectedDateTime } = helpers.asDayJS(expectedValue, format);
	if (!expectedDateTime.isValid()) throw new Error(`Invalid datetime value "${expectedValue}" provided to the equals rule`);
	if (!dateTime.isSame(expectedDateTime, compare)) field.report(messages["date.equals"], "date.equals", field, {
		expectedValue,
		compare
	});
});
const afterRule = createRule(function after(_, options, field) {
	const compare = options.compare || "day";
	const format = options.format || field.$formats;
	const dateTime = field.$value;
	const expectedValue = typeof options.expectedValue === "function" ? options.expectedValue(field) : options.expectedValue;
	const expectedDateTime = expectedValue === "today" ? (0, import_dayjs_min.default)() : expectedValue === "tomorrow" ? (0, import_dayjs_min.default)().add(1, "day") : helpers.asDayJS(expectedValue, format).dateTime;
	if (!expectedDateTime.isValid()) throw new Error(`Invalid datetime value "${expectedValue}" provided to the after rule`);
	if (!dateTime.isAfter(expectedDateTime, compare)) field.report(messages["date.after"], "date.after", field, {
		expectedValue,
		compare
	});
});
const afterOrEqualRule = createRule(function afterOrEqual(_, options, field) {
	const compare = options.compare || "day";
	const format = options.format || field.$formats;
	const dateTime = field.$value;
	const expectedValue = typeof options.expectedValue === "function" ? options.expectedValue(field) : options.expectedValue;
	const expectedDateTime = expectedValue === "today" ? (0, import_dayjs_min.default)() : expectedValue === "tomorrow" ? (0, import_dayjs_min.default)().add(1, "day") : helpers.asDayJS(expectedValue, format).dateTime;
	if (!expectedDateTime.isValid()) throw new Error(`Invalid datetime value "${expectedValue}" provided to the afterOrEqual rule`);
	if (!dateTime.isSameOrAfter(expectedDateTime, compare)) field.report(messages["date.afterOrEqual"], "date.afterOrEqual", field, {
		expectedValue,
		compare
	});
});
const beforeRule = createRule(function before(_, options, field) {
	const compare = options.compare || "day";
	const format = options.format || field.$formats;
	const dateTime = field.$value;
	const expectedValue = typeof options.expectedValue === "function" ? options.expectedValue(field) : options.expectedValue;
	const expectedDateTime = expectedValue === "today" ? (0, import_dayjs_min.default)() : expectedValue === "yesterday" ? (0, import_dayjs_min.default)().subtract(1, "day") : helpers.asDayJS(expectedValue, format).dateTime;
	if (!expectedDateTime.isValid()) throw new Error(`Invalid datetime value "${expectedValue}" provided to the before rule`);
	if (!dateTime.isBefore(expectedDateTime, compare)) field.report(messages["date.before"], "date.before", field, {
		expectedValue,
		compare
	});
});
const beforeOrEqualRule = createRule(function beforeOrEqual(_, options, field) {
	const compare = options.compare || "day";
	const format = options.format || field.$formats;
	const dateTime = field.$value;
	const expectedValue = typeof options.expectedValue === "function" ? options.expectedValue(field) : options.expectedValue;
	const expectedDateTime = expectedValue === "today" ? (0, import_dayjs_min.default)() : expectedValue === "yesterday" ? (0, import_dayjs_min.default)().subtract(1, "day") : helpers.asDayJS(expectedValue, format).dateTime;
	if (!expectedDateTime.isValid()) throw new Error(`Invalid datetime value "${expectedValue}" provided to the beforeOrEqual rule`);
	if (!dateTime.isSameOrBefore(expectedDateTime, compare)) field.report(messages["date.beforeOrEqual"], "date.beforeOrEqual", field, {
		expectedValue,
		compare
	});
});
const sameAsRule$1 = createRule(function sameAs(_, options, field) {
	const compare = options.compare || "day";
	const dateTime = field.$value;
	const format = options.format || field.$formats;
	const expectedValue = helpers.getNestedValue(options.otherField, field);
	const expectedDateTime = helpers.asDayJS(expectedValue, format).dateTime;
	if (!expectedDateTime.isValid()) return;
	if (!dateTime.isSame(expectedDateTime, compare)) field.report(messages["date.sameAs"], "date.sameAs", field, {
		otherField: options.otherField,
		expectedValue,
		compare
	});
});
const notSameAsRule$1 = createRule(function notSameAs(_, options, field) {
	const compare = options.compare || "day";
	const dateTime = field.$value;
	const format = options.format || field.$formats;
	const expectedValue = helpers.getNestedValue(options.otherField, field);
	const expectedDateTime = helpers.asDayJS(expectedValue, format).dateTime;
	if (!expectedDateTime.isValid()) return;
	if (dateTime.isSame(expectedDateTime, compare)) field.report(messages["date.notSameAs"], "date.notSameAs", field, {
		otherField: options.otherField,
		expectedValue,
		compare
	});
});
const afterFieldRule = createRule(function afterField(_, options, field) {
	const compare = options.compare || "day";
	const dateTime = field.$value;
	const format = options.format || field.$formats;
	const expectedValue = helpers.getNestedValue(options.otherField, field);
	const expectedDateTime = helpers.asDayJS(expectedValue, format).dateTime;
	if (!expectedDateTime.isValid()) return;
	if (!dateTime.isAfter(expectedDateTime, compare)) field.report(messages["date.afterField"], "date.afterField", field, {
		otherField: options.otherField,
		expectedValue,
		compare
	});
});
const afterOrSameAsRule = createRule(function afterOrSameAs(_, options, field) {
	const compare = options.compare || "day";
	const dateTime = field.$value;
	const format = options.format || field.$formats;
	const expectedValue = helpers.getNestedValue(options.otherField, field);
	const expectedDateTime = helpers.asDayJS(expectedValue, format).dateTime;
	if (!expectedDateTime.isValid()) return;
	if (!dateTime.isSameOrAfter(expectedDateTime, compare)) field.report(messages["date.afterOrSameAs"], "date.afterOrSameAs", field, {
		otherField: options.otherField,
		expectedValue,
		compare
	});
});
const beforeFieldRule = createRule(function beforeField(_, options, field) {
	const compare = options.compare || "day";
	const dateTime = field.$value;
	const format = options.format || field.$formats;
	const expectedValue = helpers.getNestedValue(options.otherField, field);
	const expectedDateTime = helpers.asDayJS(expectedValue, format).dateTime;
	if (!expectedDateTime.isValid()) return;
	if (!dateTime.isBefore(expectedDateTime, compare)) field.report(messages["date.beforeField"], "date.beforeField", field, {
		otherField: options.otherField,
		expectedValue,
		compare
	});
});
const beforeOrSameAsRule = createRule(function beforeOrSameAs(_, options, field) {
	const compare = options.compare || "day";
	const dateTime = field.$value;
	const format = options.format || field.$formats;
	const expectedValue = helpers.getNestedValue(options.otherField, field);
	const expectedDateTime = helpers.asDayJS(expectedValue, format).dateTime;
	if (!expectedDateTime.isValid()) return;
	if (!dateTime.isSameOrBefore(expectedDateTime, compare)) field.report(messages["date.beforeOrSameAs"], "date.beforeOrSameAs", field, {
		otherField: options.otherField,
		expectedValue,
		compare
	});
});
const weekendRule = createRule(function weekend(_, __, field) {
	const day = field.$value.day();
	if (day !== 0 && day !== 6) field.report(messages["date.weekend"], "date.weekend", field);
});
const weekdayRule = createRule(function weekday(_, __, field) {
	const day = field.$value.day();
	if (day === 0 || day === 6) field.report(messages["date.weekday"], "date.weekday", field);
});
var VineDate = class VineDate extends BaseLiteralType {
	static transform(transformer) {
		globalTransforms.date = transformer;
	}
	static rules = {
		equals: equalsRule$1,
		after: afterRule,
		afterOrEqual: afterOrEqualRule,
		before: beforeRule,
		beforeOrEqual: beforeOrEqualRule,
		sameAs: sameAsRule$1,
		notSameAs: notSameAsRule$1,
		afterField: afterFieldRule,
		afterOrSameAs: afterOrSameAsRule,
		beforeField: beforeFieldRule,
		beforeOrSameAs: beforeOrSameAsRule,
		weekend: weekendRule,
		weekday: weekdayRule
	};
	[UNIQUE_NAME] = "vine.date";
	[SUBTYPE] = "date";
	[IS_OF_TYPE] = (value) => {
		if (typeof value !== "string") return false;
		return helpers.asDayJS(value, this.options.formats).dateTime.isValid();
	};
	constructor(options, validations) {
		super(options, validations || []);
		this.dataTypeValidator = dateRule(options || {});
	}
	equals(expectedValue, options) {
		return this.use(equalsRule$1({
			expectedValue,
			...options
		}));
	}
	after(expectedValue, options) {
		return this.use(afterRule({
			expectedValue,
			...options
		}));
	}
	afterOrEqual(expectedValue, options) {
		return this.use(afterOrEqualRule({
			expectedValue,
			...options
		}));
	}
	before(expectedValue, options) {
		return this.use(beforeRule({
			expectedValue,
			...options
		}));
	}
	beforeOrEqual(expectedValue, options) {
		return this.use(beforeOrEqualRule({
			expectedValue,
			...options
		}));
	}
	sameAs(otherField, options) {
		return this.use(sameAsRule$1({
			otherField,
			...options
		}));
	}
	notSameAs(otherField, options) {
		return this.use(notSameAsRule$1({
			otherField,
			...options
		}));
	}
	afterField(otherField, options) {
		return this.use(afterFieldRule({
			otherField,
			...options
		}));
	}
	afterOrSameAs(otherField, options) {
		return this.use(afterOrSameAsRule({
			otherField,
			...options
		}));
	}
	beforeField(otherField, options) {
		return this.use(beforeFieldRule({
			otherField,
			...options
		}));
	}
	beforeOrSameAs(otherField, options) {
		return this.use(beforeOrSameAsRule({
			otherField,
			...options
		}));
	}
	weekend() {
		return this.use(weekendRule());
	}
	weekday() {
		return this.use(weekdayRule());
	}
	clone() {
		return new VineDate(this.cloneOptions(), this.cloneValidations());
	}
};
var VineNull = class VineNull {
	[SUBTYPE] = "null";
	[UNIQUE_NAME] = "vine.null";
	[IS_OF_TYPE] = (value) => {
		return value === null;
	};
	options;
	constructor(options) {
		this.options = {
			bail: true,
			allowNull: true,
			isOptional: false,
			...options
		};
	}
	cloneOptions() {
		return { ...this.options };
	}
	clone() {
		return new VineNull(this.cloneOptions());
	}
	toJSONSchema() {
		return { type: "null" };
	}
	[PARSE](propertyName, refs, options) {
		return {
			type: "literal",
			subtype: this[SUBTYPE],
			fieldName: propertyName,
			propertyName: options.toCamelCase ? camelCase(propertyName) : propertyName,
			bail: this.options.bail,
			allowNull: this.options.allowNull,
			isOptional: this.options.isOptional,
			parseFnId: this.options.parse ? refs.trackParser(this.options.parse) : void 0,
			validations: []
		};
	}
};
var UnionConditional = class {
	#schema;
	#conditional;
	constructor(conditional, schema) {
		this.#schema = schema;
		this.#conditional = conditional;
	}
	toJSONSchema() {
		return this.#schema.toJSONSchema?.();
	}
	[PARSE](propertyName, refs, options) {
		return {
			conditionalFnRefId: refs.trackConditional(this.#conditional),
			schema: this.#schema[PARSE](propertyName, refs, options)
		};
	}
};
var VineOptional = class VineOptional extends ConditionalValidations {
	[SUBTYPE] = "optional";
	[UNIQUE_NAME] = "vine.optional";
	[IS_OF_TYPE] = (value) => {
		return value === null || value === void 0;
	};
	options;
	validations;
	constructor(options, validations) {
		super();
		this.options = {
			bail: true,
			allowNull: false,
			isOptional: true,
			...options
		};
		this.validations = validations || [];
	}
	cloneValidations() {
		return this.validations.map((validation) => {
			return {
				options: validation.options,
				rule: validation.rule
			};
		});
	}
	cloneOptions() {
		return { ...this.options };
	}
	compileValidations(refs) {
		return this.validations.map((validation) => {
			return {
				ruleFnId: refs.track({
					validator: validation.rule.validator,
					options: validation.options
				}),
				implicit: validation.rule.implicit,
				isAsync: validation.rule.isAsync
			};
		});
	}
	parse(callback) {
		this.options.parse = callback;
		return this;
	}
	use(validation) {
		this.validations.push(VALIDATION in validation ? validation[VALIDATION]() : validation);
		return this;
	}
	bail(state) {
		this.options.bail = state;
		return this;
	}
	clone() {
		return new VineOptional(this.cloneOptions(), this.cloneValidations());
	}
	nullable() {
		return new VineOptional({
			...this.options,
			allowNull: true
		});
	}
	toJSONSchema() {
		return {};
	}
	[PARSE](propertyName, refs, options) {
		return {
			type: "literal",
			subtype: this[SUBTYPE],
			fieldName: propertyName,
			propertyName: options.toCamelCase ? camelCase(propertyName) : propertyName,
			bail: this.options.bail,
			allowNull: this.options.allowNull,
			isOptional: this.options.isOptional,
			parseFnId: this.options.parse ? refs.trackParser(this.options.parse) : void 0,
			validations: this.compileValidations(refs)
		};
	}
};
var VineUnion = class VineUnion {
	#conditionals;
	#otherwiseCallback = (_, field) => {
		field.report(messages.union, "union", field);
	};
	constructor(conditionals) {
		this.#conditionals = conditionals;
	}
	optional() {
		const optional = new VineOptional();
		return new VineUnion([new UnionConditional(optional[IS_OF_TYPE], optional), ...this.#conditionals]);
	}
	nullable() {
		const nullable = new VineNull();
		return new VineUnion([new UnionConditional(nullable[IS_OF_TYPE], nullable), ...this.#conditionals]);
	}
	otherwise(callback) {
		this.#otherwiseCallback = callback;
		return this;
	}
	toJSONSchema() {
		return { anyOf: this.#conditionals.map((conditional) => conditional.toJSONSchema()).filter(Boolean) };
	}
	clone() {
		const cloned = new VineUnion(this.#conditionals);
		cloned.otherwise(this.#otherwiseCallback);
		return cloned;
	}
	[PARSE](propertyName, refs, options) {
		return {
			type: "union",
			fieldName: propertyName,
			propertyName: options.toCamelCase ? camelCase(propertyName) : propertyName,
			elseConditionalFnRefId: refs.trackConditional(this.#otherwiseCallback),
			conditions: this.#conditionals.map((conditional) => conditional[PARSE](propertyName, refs, options))
		};
	}
};
function union(conditionals) {
	return new VineUnion(conditionals);
}
union.if = function unionIf(conditon, schema) {
	return new UnionConditional(conditon, schema);
};
union.else = function unionElse(schema) {
	return new UnionConditional(() => true, schema);
};
var NullableModifier = class NullableModifier {
	allowNull = true;
	get isOptional() {
		return this.#parent.isOptional;
	}
	#parent;
	constructor(parent) {
		this.#parent = parent;
	}
	optional() {
		return new OptionalModifier(this);
	}
	meta(meta) {
		return new MetaModifier(this, meta);
	}
	clone() {
		return new NullableModifier(this.#parent.clone());
	}
	toJSONSchema() {
		const schema = this.#parent.toJSONSchema?.();
		if (!schema) return { type: "null" };
		if (schema.anyOf) {
			schema.anyOf.push({ type: "null" });
			return schema;
		}
		if (schema.type === void 0) {
			schema.type = "null";
			return schema;
		}
		if (typeof schema.type === "string") {
			schema.type = [schema.type, "null"];
			return schema;
		}
		if (Array.isArray(schema.type)) {
			schema.type.push("null");
			return schema;
		}
		return schema;
	}
	[PARSE](propertyName, refs, options) {
		const output = this.#parent[PARSE](propertyName, refs, options);
		if (output.type !== "union") output.allowNull = true;
		return output;
	}
};
var MetaModifier = class MetaModifier {
	get allowNull() {
		return this.#parent.allowNull;
	}
	get isOptional() {
		return this.#parent.isOptional;
	}
	#parent;
	#meta;
	constructor(parent, meta) {
		this.#parent = parent;
		this.#meta = meta;
	}
	clone() {
		return new MetaModifier(this.#parent.clone(), this.#meta);
	}
	toJSONSchema() {
		return {
			...this.#parent.toJSONSchema?.() ?? {},
			...this.#meta
		};
	}
	[PARSE](propertyName, refs, options) {
		return this.#parent[PARSE](propertyName, refs, options);
	}
};
var OptionalModifier = class OptionalModifier extends ConditionalValidations {
	isOptional = true;
	get allowNull() {
		return this.#parent.allowNull;
	}
	#parent;
	validations;
	constructor(parent, validations) {
		super();
		this.#parent = parent;
		this.validations = validations || [];
	}
	cloneValidations() {
		return this.validations.map((validation) => {
			return {
				options: validation.options,
				rule: validation.rule
			};
		});
	}
	compileValidations(refs) {
		return this.validations.map((validation) => {
			return {
				ruleFnId: refs.track({
					validator: validation.rule.validator,
					options: validation.options
				}),
				name: validation.rule.name,
				implicit: validation.rule.implicit,
				isAsync: validation.rule.isAsync
			};
		});
	}
	nullable() {
		return new NullableModifier(this);
	}
	meta(meta) {
		return new MetaModifier(this, meta);
	}
	use(validation) {
		this.validations.push(VALIDATION in validation ? validation[VALIDATION]() : validation);
		return this;
	}
	clone() {
		return new OptionalModifier(this.#parent.clone(), this.cloneValidations());
	}
	toJSONSchema() {
		return { ...this.#parent.toJSONSchema() };
	}
	[PARSE](propertyName, refs, options) {
		const output = this.#parent[PARSE](propertyName, refs, options);
		if (output.type !== "union") {
			output.isOptional = true;
			output.validations = output.validations.concat(this.compileValidations(refs));
		}
		return output;
	}
};
var BaseType = class extends Macroable {
	toJSONSchema() {
		return {};
	}
	validations;
	options;
	constructor(options, validations) {
		super();
		this.options = options || {
			bail: true,
			allowNull: false,
			isOptional: false
		};
		this.validations = validations || [];
	}
	cloneValidations() {
		return this.validations.map((validation) => {
			return {
				options: validation.options,
				rule: validation.rule
			};
		});
	}
	cloneOptions() {
		return { ...this.options };
	}
	compileValidations(refs) {
		return this.validations.map((validation) => {
			return {
				ruleFnId: refs.track({
					validator: validation.rule.validator,
					options: validation.options
				}),
				name: validation.rule.name,
				implicit: validation.rule.implicit,
				isAsync: validation.rule.isAsync
			};
		});
	}
	parse(callback) {
		this.options.parse = callback;
		return this;
	}
	use(validation) {
		this.validations.push(VALIDATION in validation ? validation[VALIDATION]() : validation);
		return this;
	}
	bail(state) {
		this.options.bail = state;
		return this;
	}
	optional() {
		return new OptionalModifier(this);
	}
	nullable() {
		return new NullableModifier(this);
	}
	meta(meta) {
		return new MetaModifier(this, meta);
	}
};
var VineTuple = class VineTuple extends BaseType {
	#schemas;
	#allowUnknownProperties = false;
	[UNIQUE_NAME] = "vine.array";
	[IS_OF_TYPE] = (value) => {
		return Array.isArray(value);
	};
	constructor(schemas, options, validations) {
		super(options, validations);
		this.#schemas = schemas;
	}
	allowUnknownProperties() {
		this.#allowUnknownProperties = true;
		return this;
	}
	clone() {
		const cloned = new VineTuple(this.#schemas.map((schema) => schema.clone()), this.cloneOptions(), this.cloneValidations());
		if (this.#allowUnknownProperties) cloned.allowUnknownProperties();
		return cloned;
	}
	toJSONSchema() {
		const items = [];
		for (const item of this.#schemas) {
			if (!item.toJSONSchema) continue;
			items.push(item.toJSONSchema());
		}
		const schema = {
			type: "array",
			minItems: this.#schemas.length,
			maxItems: this.#schemas.length,
			additionalItems: false,
			items
		};
		for (const validation of this.validations) {
			if (!validation.rule.toJSONSchema) continue;
			validation.rule.toJSONSchema(schema, validation.options);
		}
		return schema;
	}
	[PARSE](propertyName, refs, options) {
		return {
			type: "tuple",
			fieldName: propertyName,
			propertyName: options.toCamelCase ? camelCase(propertyName) : propertyName,
			bail: this.options.bail,
			allowNull: this.options.allowNull,
			isOptional: this.options.isOptional,
			allowUnknownProperties: this.#allowUnknownProperties,
			parseFnId: this.options.parse ? refs.trackParser(this.options.parse) : void 0,
			validations: this.compileValidations(refs),
			properties: this.#schemas.map((schema, index) => schema[PARSE](String(index), refs, options))
		};
	}
};
const minLengthRule$2 = createRule(function minLength(value, options, field) {
	if (value.length < options.min) field.report(messages["array.minLength"], "array.minLength", field, options);
}, { toJSONSchema: (schema, options) => {
	schema.minItems = options.min;
} });
const maxLengthRule$2 = createRule(function maxLength(value, options, field) {
	if (value.length > options.max) field.report(messages["array.maxLength"], "array.maxLength", field, options);
}, { toJSONSchema: (schema, options) => {
	schema.maxItems = options.max;
} });
const fixedLengthRule$2 = createRule(function fixedLength(value, options, field) {
	if (value.length !== options.size) field.report(messages["array.fixedLength"], "array.fixedLength", field, options);
}, { toJSONSchema: (schema, options) => {
	schema.minItems = options.size;
	schema.maxItems = options.size;
} });
const notEmptyRule = createRule(function notEmpty(value, _, field) {
	if (value.length <= 0) field.report(messages.notEmpty, "notEmpty", field);
}, { toJSONSchema: (schema) => {
	schema.minItems = 1;
} });
const distinctRule = createRule(function distinct(value, options, field) {
	if (!helpers.isDistinct(value, options.fields)) field.report(messages.distinct, "distinct", field, options);
}, { toJSONSchema: (schema) => {
	schema.uniqueItems = true;
} });
const compactRule = createRule(function compact(value, _, field) {
	if (!field.isValid) return;
	field.mutate(value.filter((item) => helpers.exists(item) && item !== ""), field);
});
var VineArray = class VineArray extends BaseType {
	static rules = {
		compact: compactRule,
		notEmpty: notEmptyRule,
		distinct: distinctRule,
		minLength: minLengthRule$2,
		maxLength: maxLengthRule$2,
		fixedLength: fixedLengthRule$2
	};
	#schema;
	[UNIQUE_NAME] = "vine.array";
	[IS_OF_TYPE] = (value) => {
		return Array.isArray(value);
	};
	constructor(schema, options, validations) {
		super(options, validations);
		this.#schema = schema;
	}
	minLength(expectedLength) {
		return this.use(minLengthRule$2({ min: expectedLength }));
	}
	maxLength(expectedLength) {
		return this.use(maxLengthRule$2({ max: expectedLength }));
	}
	fixedLength(expectedLength) {
		return this.use(fixedLengthRule$2({ size: expectedLength }));
	}
	notEmpty() {
		return this.use(notEmptyRule());
	}
	distinct(fields) {
		return this.use(distinctRule({ fields }));
	}
	compact() {
		return this.use(compactRule());
	}
	clone() {
		return new VineArray(this.#schema.clone(), this.cloneOptions(), this.cloneValidations());
	}
	toJSONSchema() {
		const schema = {
			type: "array",
			items: this.#schema.toJSONSchema?.() ?? {}
		};
		for (const validation of this.validations) {
			if (!validation.rule.toJSONSchema) continue;
			validation.rule.toJSONSchema(schema, validation.options);
		}
		return schema;
	}
	[PARSE](propertyName, refs, options) {
		return {
			type: "array",
			fieldName: propertyName,
			propertyName: options.toCamelCase ? camelCase(propertyName) : propertyName,
			bail: this.options.bail,
			allowNull: this.options.allowNull,
			isOptional: this.options.isOptional,
			each: this.#schema[PARSE]("*", refs, options),
			parseFnId: this.options.parse ? refs.trackParser(this.options.parse) : void 0,
			validations: this.compileValidations(refs)
		};
	}
};
var VineCamelCaseObject = class VineCamelCaseObject extends BaseType {
	#schema;
	[UNIQUE_NAME] = "types.object";
	[IS_OF_TYPE] = (value) => {
		return value !== null && typeof value === "object" && !Array.isArray(value);
	};
	constructor(schema) {
		super();
		this.#schema = schema;
	}
	clone() {
		return new VineCamelCaseObject(this.#schema.clone());
	}
	toJSONSchema() {
		return this.#schema.toJSONSchema();
	}
	[PARSE](propertyName, refs, options) {
		options.toCamelCase = true;
		return this.#schema[PARSE](propertyName, refs, options);
	}
};
var VineObject = class VineObject extends BaseType {
	#properties;
	#groups = [];
	#allowUnknownProperties = false;
	[UNIQUE_NAME] = "vine.object";
	[IS_OF_TYPE] = (value) => {
		return value !== null && typeof value === "object" && !Array.isArray(value);
	};
	constructor(properties, options, validations) {
		if (!properties) throw new Error("Missing properties for \"vine.object\". Use an empty object if you do not want to validate any specific fields");
		super(options, validations);
		this.#properties = properties;
	}
	getProperties() {
		return Object.keys(this.#properties).reduce((result, key) => {
			result[key] = this.#properties[key].clone();
			return result;
		}, {});
	}
	pick(keys) {
		const result = {};
		for (const key of keys) result[key] = this.#properties[key].clone();
		return result;
	}
	omit(keys) {
		const result = {};
		for (const key of Object.keys(this.#properties)) if (!keys.includes(key)) result[key] = this.#properties[key].clone();
		return result;
	}
	allowUnknownProperties() {
		this.#allowUnknownProperties = true;
		return this;
	}
	merge(group) {
		this.#groups.push(group);
		return this;
	}
	clone() {
		const cloned = new VineObject(this.getProperties(), this.cloneOptions(), this.cloneValidations());
		this.#groups.forEach((group) => cloned.merge(group));
		if (this.#allowUnknownProperties) cloned.allowUnknownProperties();
		return cloned;
	}
	toCamelCase() {
		return new VineCamelCaseObject(this);
	}
	toJSONSchema() {
		const properties = {};
		const required = [];
		for (const [key, property] of Object.entries(this.getProperties())) {
			if (!property.toJSONSchema) continue;
			properties[key] = property.toJSONSchema();
			if (property.isOptional !== true && property.allowNull !== true) required.push(key);
		}
		const schema = {
			type: "object",
			properties,
			required,
			additionalProperties: this.#allowUnknownProperties
		};
		for (const validation of this.validations) {
			if (!validation.rule.toJSONSchema) continue;
			validation.rule.toJSONSchema(schema, validation.options);
		}
		if (this.#groups.length > 0) return { anyOf: [...this.#groups.map((group) => group.toJSONSchema()), schema] };
		return schema;
	}
	partial(keys) {
		if (this.#groups.length > 0 || this.#allowUnknownProperties) throw new Error("toOptional cannot be used on schemas that have groups or allowUnknownProperties enabled");
		const properties = {};
		for (const key of Object.keys(this.#properties)) {
			let field = this.#properties[key].clone();
			if ((!keys || keys.includes(key)) && "optional" in field && typeof field.optional === "function") field = field.optional();
			properties[key] = field;
		}
		return new VineObject(properties, this.cloneOptions(), this.cloneValidations());
	}
	[PARSE](propertyName, refs, options) {
		return {
			type: "object",
			fieldName: propertyName,
			propertyName: options.toCamelCase ? camelCase(propertyName) : propertyName,
			bail: this.options.bail,
			allowNull: this.options.allowNull,
			isOptional: this.options.isOptional,
			parseFnId: this.options.parse ? refs.trackParser(this.options.parse) : void 0,
			allowUnknownProperties: this.#allowUnknownProperties,
			validations: this.compileValidations(refs),
			properties: Object.keys(this.#properties).map((property) => {
				return this.#properties[property][PARSE](property, refs, options);
			}),
			groups: this.#groups.map((group) => {
				return group[PARSE](refs, options);
			})
		};
	}
};
const minLengthRule$1 = createRule(function minLength(value, options, field) {
	if (Object.keys(value).length < options.min) field.report(messages["record.minLength"], "record.minLength", field, options);
}, { toJSONSchema: (schema, options) => {
	schema.minProperties = options.min;
} });
const maxLengthRule$1 = createRule(function maxLength(value, options, field) {
	if (Object.keys(value).length > options.max) field.report(messages["record.maxLength"], "record.maxLength", field, options);
}, { toJSONSchema: (schema, options) => {
	schema.maxProperties = options.max;
} });
const fixedLengthRule$1 = createRule(function fixedLength(value, options, field) {
	if (Object.keys(value).length !== options.size) field.report(messages["record.fixedLength"], "record.fixedLength", field, options);
}, { toJSONSchema: (schema, options) => {
	schema.minProperties = options.size;
	schema.maxProperties = options.size;
} });
const validateKeysRule = createRule(function validateKeys(value, callback, field) {
	callback(Object.keys(value), field);
});
var VineRecord = class VineRecord extends BaseType {
	static rules = {
		maxLength: maxLengthRule$1,
		minLength: minLengthRule$1,
		fixedLength: fixedLengthRule$1,
		validateKeys: validateKeysRule
	};
	#schema;
	[UNIQUE_NAME] = "vine.object";
	[IS_OF_TYPE] = (value) => {
		return value !== null && typeof value === "object" && !Array.isArray(value);
	};
	constructor(schema, options, validations) {
		super(options, validations);
		this.#schema = schema;
	}
	minLength(expectedLength) {
		return this.use(minLengthRule$1({ min: expectedLength }));
	}
	maxLength(expectedLength) {
		return this.use(maxLengthRule$1({ max: expectedLength }));
	}
	fixedLength(expectedLength) {
		return this.use(fixedLengthRule$1({ size: expectedLength }));
	}
	validateKeys(...args) {
		return this.use(validateKeysRule(...args));
	}
	clone() {
		return new VineRecord(this.#schema.clone(), this.cloneOptions(), this.cloneValidations());
	}
	toJSONSchema() {
		const schema = {
			type: "object",
			additionalProperties: {}
		};
		schema.additionalProperties = this.#schema.toJSONSchema?.() ?? {};
		for (const validation of this.validations) {
			if (!validation.rule.toJSONSchema) continue;
			validation.rule.toJSONSchema(schema, validation.options);
		}
		return schema;
	}
	[PARSE](propertyName, refs, options) {
		return {
			type: "record",
			fieldName: propertyName,
			propertyName: options.toCamelCase ? camelCase(propertyName) : propertyName,
			bail: this.options.bail,
			allowNull: this.options.allowNull,
			isOptional: this.options.isOptional,
			each: this.#schema[PARSE]("*", refs, options),
			parseFnId: this.options.parse ? refs.trackParser(this.options.parse) : void 0,
			validations: this.compileValidations(refs)
		};
	}
};
const stringRule = createRule(function string(value, _, field) {
	if (!field.isDefined) return false;
	if (typeof value === "string") return true;
	field.report(messages.string, "string", field);
	return false;
}, { toJSONSchema: (schema) => {
	schema.type = "string";
} });
const emailRule = createRule(function email(value, options, field) {
	if (!helpers.isEmail(value, options)) field.report(messages.email, "email", field);
}, { toJSONSchema: (schema) => {
	schema.format = "email";
} });
const mobileRule = createRule(function mobile(value, options, field) {
	const normalizedOptions = options && typeof options === "function" ? options(field) : options;
	const locales = normalizedOptions?.locale || "any";
	if (!helpers.isMobilePhone(value, locales, normalizedOptions)) field.report(messages.mobile, "mobile", field);
});
const ipAddressRule = createRule(function ipAddress(value, options, field) {
	if (!helpers.isIP(value, options?.version)) field.report(messages.ipAddress, "ipAddress", field);
}, { toJSONSchema: (schema, options) => {
	schema.format = options?.version === 6 ? "ipv6" : "ipv4";
} });
const regexRule = createRule(function regex(value, expression, field) {
	if (!expression.test(value)) field.report(messages.regex, "regex", field);
}, { toJSONSchema: (schema, options) => {
	schema.pattern = options.source;
} });
const hexCodeRule = createRule(function hexCode(value, _, field) {
	if (!helpers.isHexColor(value)) field.report(messages.hexCode, "hexCode", field);
}, { toJSONSchema: (schema) => {
	schema.pattern = "^#?([0-9a-f]{6}|[0-9a-f]{3}|[0-9a-f]{8})$";
} });
const urlRule = createRule(function url(value, options, field) {
	if (!helpers.isURL(value, options)) field.report(messages.url, "url", field);
}, { toJSONSchema: (schema) => {
	schema.format = "uri";
} });
const activeUrlRule = createRule(async function activeUrl(value, _, field) {
	if (!await helpers.isActiveURL(value)) field.report(messages.activeUrl, "activeUrl", field);
});
const alphaRule = createRule(function alpha(value, options, field) {
	let characterSet = "a-zA-Z";
	if (options) {
		if (options.allowSpaces) characterSet += "\\s";
		if (options.allowDashes) characterSet += "-";
		if (options.allowUnderscores) characterSet += "_";
	}
	if (!new RegExp(`^[${characterSet}]+$`).test(value)) field.report(messages.alpha, "alpha", field);
}, { toJSONSchema: (schema, options) => {
	let characterSet = "a-zA-Z";
	if (options) {
		if (options.allowSpaces) characterSet += "\\s";
		if (options.allowDashes) characterSet += "-";
		if (options.allowUnderscores) characterSet += "_";
	}
	schema.pattern = `^[${characterSet}]+$`;
} });
const alphaNumericRule = createRule(function alphaNumeric(value, options, field) {
	let characterSet = "a-zA-Z0-9";
	if (options) {
		if (options.allowSpaces) characterSet += "\\s";
		if (options.allowDashes) characterSet += "-";
		if (options.allowUnderscores) characterSet += "_";
	}
	if (!new RegExp(`^[${characterSet}]+$`).test(value)) field.report(messages.alphaNumeric, "alphaNumeric", field);
}, { toJSONSchema: (schema, options) => {
	let characterSet = "a-zA-Z0-9";
	if (options) {
		if (options.allowSpaces) characterSet += "\\s";
		if (options.allowDashes) characterSet += "-";
		if (options.allowUnderscores) characterSet += "_";
	}
	schema.pattern = `^[${characterSet}]+$`;
} });
const minLengthRule = createRule(function minLength(value, options, field) {
	if (value.length < options.min) field.report(messages.minLength, "minLength", field, options);
}, { toJSONSchema: (schema, options) => {
	schema.minLength = options.min;
} });
const maxLengthRule = createRule(function maxLength(value, options, field) {
	if (value.length > options.max) field.report(messages.maxLength, "maxLength", field, options);
}, { toJSONSchema: (schema, options) => {
	schema.maxLength = options.max;
} });
const fixedLengthRule = createRule(function fixedLength(value, options, field) {
	if (value.length !== options.size) field.report(messages.fixedLength, "fixedLength", field, options);
}, { toJSONSchema: (schema, options) => {
	schema.minLength = options.size;
	schema.maxLength = options.size;
} });
const endsWithRule = createRule(function endsWith(value, options, field) {
	if (!value.endsWith(options.substring)) field.report(messages.endsWith, "endsWith", field, options);
});
const startsWithRule = createRule(function startsWith(value, options, field) {
	if (!value.startsWith(options.substring)) field.report(messages.startsWith, "startsWith", field, options);
});
const sameAsRule = createRule(function sameAs(value, options, field) {
	if (helpers.getNestedValue(options.otherField, field) !== value) {
		field.report(messages.sameAs, "sameAs", field, options);
		return;
	}
});
const notSameAsRule = createRule(function notSameAs(value, options, field) {
	if (helpers.getNestedValue(options.otherField, field) === value) {
		field.report(messages.notSameAs, "notSameAs", field, options);
		return;
	}
});
const confirmedRule = createRule(function confirmed(value, options, field) {
	const normalizedOptions = options ?? {};
	const otherField = normalizedOptions.as ?? normalizedOptions.confirmationField ?? `${field.name}_confirmation`;
	const input = field.parent[otherField];
	if (input !== value) {
		field.report(messages.confirmed, "confirmed", {
			...field,
			name: otherField,
			wildCardPath: `${field.wildCardPath.replace(String(field.name), otherField)}`,
			isDefined: true,
			isValid: false,
			value: input,
			getFieldPath() {
				return `${field.getFieldPath().replace(String(field.name), otherField)}`;
			}
		}, {
			otherField,
			originalField: field.name
		});
		return;
	}
});
const inRule$1 = createRule(function inList(value, options, field) {
	if (!(typeof options.choices === "function" ? options.choices(field) : options.choices).includes(value)) {
		field.report(messages.in, "in", field, options);
		return;
	}
});
const notInRule = createRule(function notIn(value, options, field) {
	if ((typeof options.list === "function" ? options.list(field) : options.list).includes(value)) {
		field.report(messages.notIn, "notIn", field, options);
		return;
	}
});
const creditCardRule = createRule(function creditCard(value, options, field) {
	const providers = options ? typeof options === "function" ? options(field)?.provider || [] : options.provider : [];
	if (!providers.length) {
		if (!helpers.isCreditCard(value)) field.report(messages.creditCard, "creditCard", field, { providersList: "credit" });
	} else if (!providers.find((provider) => helpers.isCreditCard(value, { provider }))) field.report(messages.creditCard, "creditCard", field, {
		providers,
		providersList: providers.join("/")
	});
});
const passportRule = createRule(function passport(value, options, field) {
	const countryCodes = typeof options === "function" ? options(field).countryCode : options.countryCode;
	if (!countryCodes.find((countryCode) => helpers.isPassportNumber(value, countryCode))) field.report(messages.passport, "passport", field, { countryCodes });
});
const vatRule = createRule(function vat(value, options, field) {
	const countryCodes = typeof options === "function" ? options(field).countryCode : options.countryCode;
	if (!countryCodes.find((countryCode) => helpers.isVAT(value, countryCode))) field.report(messages.vat, "vat", field, { countryCodes });
});
const postalCodeRule = createRule(function postalCode(value, options, field) {
	const countryCodes = options ? typeof options === "function" ? options(field)?.countryCode || [] : options.countryCode : [];
	if (!countryCodes.length) {
		if (!helpers.isPostalCode(value, "any")) field.report(messages.postalCode, "postalCode", field);
	} else if (!countryCodes.find((countryCode) => helpers.isPostalCode(value, countryCode))) field.report(messages.postalCode, "postalCode", field, { countryCodes });
});
const uuidRule = createRule(function uuid(value, options, field) {
	if (!options || !options.version) {
		if (!helpers.isUUID(value)) field.report(messages.uuid, "uuid", field);
	} else if (!options.version.find((version) => helpers.isUUID(value, version))) field.report(messages.uuid, "uuid", field, options);
}, { toJSONSchema: (schema) => {
	schema.format = "uuid";
} });
const ulidRule = createRule(function ulid(value, _, field) {
	if (!helpers.isULID(value)) field.report(messages.ulid, "ulid", field);
}, { toJSONSchema: (schema) => {
	schema.pattern = "^[0-7][0-9A-HJKMNP-TV-Z]{25}$";
} });
const asciiRule = createRule(function ascii(value, _, field) {
	if (!helpers.isAscii(value)) field.report(messages.ascii, "ascii", field);
});
const ibanRule = createRule(function iban(value, _, field) {
	if (!helpers.isIBAN(value)) field.report(messages.iban, "iban", field);
});
const jwtRule = createRule(function jwt(value, _, field) {
	if (!helpers.isJWT(value)) field.report(messages.jwt, "jwt", field);
});
const coordinatesRule = createRule(function coordinates(value, _, field) {
	if (!helpers.isLatLong(value)) field.report(messages.coordinates, "coordinates", field);
});
const trimRule = createRule(function trim(value, _, field) {
	if (!field.isValid) return;
	field.mutate(value.trim(), field);
});
const normalizeEmailRule = createRule(function normalizeEmail(value, options, field) {
	if (!field.isValid) return;
	field.mutate(import_normalizeEmail.default.default(value, options), field);
});
const toUpperCaseRule = createRule(function toUpperCase(value, locales, field) {
	if (!field.isValid) return;
	field.mutate(value.toLocaleUpperCase(locales), field);
});
const toLowerCaseRule = createRule(function toLowerCase(value, locales, field) {
	if (!field.isValid) return;
	field.mutate(value.toLocaleLowerCase(locales), field);
});
const toCamelCaseRule = createRule(function toCamelCase(value, _, field) {
	if (!field.isValid) return;
	field.mutate(camelCase(value), field);
});
const escapeRule = createRule(function escape(value, _, field) {
	if (!field.isValid) return;
	field.mutate(import_escape.default.default(value), field);
});
const normalizeUrlRule = createRule(function normalizeUrlValue(value, options, field) {
	if (!field.isValid) return;
	field.mutate(normalizeUrl(value, options), field);
});
var VineString = class VineString extends BaseLiteralType {
	static rules = {
		in: inRule$1,
		jwt: jwtRule,
		url: urlRule,
		iban: ibanRule,
		uuid: uuidRule,
		ulid: ulidRule,
		trim: trimRule,
		email: emailRule,
		alpha: alphaRule,
		ascii: asciiRule,
		notIn: notInRule,
		regex: regexRule,
		escape: escapeRule,
		sameAs: sameAsRule,
		mobile: mobileRule,
		string: stringRule,
		hexCode: hexCodeRule,
		passport: passportRule,
		endsWith: endsWithRule,
		confirmed: confirmedRule,
		activeUrl: activeUrlRule,
		minLength: minLengthRule,
		notSameAs: notSameAsRule,
		maxLength: maxLengthRule,
		vat: vatRule,
		ipAddress: ipAddressRule,
		creditCard: creditCardRule,
		postalCode: postalCodeRule,
		startsWith: startsWithRule,
		toUpperCase: toUpperCaseRule,
		toLowerCase: toLowerCaseRule,
		toCamelCase: toCamelCaseRule,
		fixedLength: fixedLengthRule,
		coordinates: coordinatesRule,
		normalizeUrl: normalizeUrlRule,
		alphaNumeric: alphaNumericRule,
		normalizeEmail: normalizeEmailRule
	};
	[SUBTYPE] = "string";
	[UNIQUE_NAME] = "vine.string";
	[IS_OF_TYPE] = (value) => {
		return typeof value === "string";
	};
	constructor(options, validations) {
		super(options, validations || []);
		this.dataTypeValidator = stringRule();
	}
	url(...args) {
		return this.use(urlRule(...args));
	}
	activeUrl() {
		return this.use(activeUrlRule());
	}
	email(...args) {
		return this.use(emailRule(...args));
	}
	mobile(...args) {
		return this.use(mobileRule(...args));
	}
	vat(...args) {
		return this.use(vatRule(...args));
	}
	ipAddress(version) {
		return this.use(ipAddressRule(version ? { version } : void 0));
	}
	hexCode() {
		return this.use(hexCodeRule());
	}
	regex(expression) {
		return this.use(regexRule(expression));
	}
	alpha(options) {
		return this.use(alphaRule(options));
	}
	alphaNumeric(options) {
		return this.use(alphaNumericRule(options));
	}
	minLength(expectedLength) {
		return this.use(minLengthRule({ min: expectedLength }));
	}
	maxLength(expectedLength) {
		return this.use(maxLengthRule({ max: expectedLength }));
	}
	fixedLength(expectedLength) {
		return this.use(fixedLengthRule({ size: expectedLength }));
	}
	confirmed(options) {
		return this.use(confirmedRule(options));
	}
	trim() {
		return this.use(trimRule());
	}
	normalizeEmail(options) {
		return this.use(normalizeEmailRule(options));
	}
	toUpperCase() {
		return this.use(toUpperCaseRule());
	}
	toLowerCase() {
		return this.use(toLowerCaseRule());
	}
	toCamelCase() {
		return this.use(toCamelCaseRule());
	}
	escape() {
		return this.use(escapeRule());
	}
	normalizeUrl(...args) {
		return this.use(normalizeUrlRule(...args));
	}
	startsWith(substring) {
		return this.use(startsWithRule({ substring }));
	}
	endsWith(substring) {
		return this.use(endsWithRule({ substring }));
	}
	sameAs(otherField) {
		return this.use(sameAsRule({ otherField }));
	}
	notSameAs(otherField) {
		return this.use(notSameAsRule({ otherField }));
	}
	in(choices) {
		return this.use(inRule$1({ choices }));
	}
	notIn(list) {
		return this.use(notInRule({ list }));
	}
	creditCard(...args) {
		return this.use(creditCardRule(...args));
	}
	passport(...args) {
		return this.use(passportRule(...args));
	}
	postalCode(...args) {
		return this.use(postalCodeRule(...args));
	}
	uuid(...args) {
		return this.use(uuidRule(...args));
	}
	ulid() {
		return this.use(ulidRule());
	}
	ascii() {
		return this.use(asciiRule());
	}
	iban() {
		return this.use(ibanRule());
	}
	jwt() {
		return this.use(jwtRule());
	}
	coordinates() {
		return this.use(coordinatesRule());
	}
	clone() {
		return new VineString(this.cloneOptions(), this.cloneValidations());
	}
};
const numberRule = createRule(function number(value, options, field) {
	if (!field.isDefined) return false;
	const valueAsNumber = options.strict ? value : helpers.asNumber(value);
	if (typeof valueAsNumber !== "number" || Number.isNaN(valueAsNumber) || valueAsNumber === Number.POSITIVE_INFINITY || valueAsNumber === Number.NEGATIVE_INFINITY) {
		field.report(messages.number, "number", field);
		return false;
	}
	field.mutate(valueAsNumber, field);
	return true;
}, { toJSONSchema: (schema) => {
	schema.type = "number";
} });
const minRule = createRule(function min(value, options, field) {
	if (value < options.min) field.report(messages.min, "min", field, options);
}, { toJSONSchema: (schema, options) => {
	schema.minimum = options.min;
} });
const maxRule = createRule(function max(value, options, field) {
	if (value > options.max) field.report(messages.max, "max", field, options);
}, { toJSONSchema: (schema, options) => {
	schema.maximum = options.max;
} });
const rangeRule = createRule(function range(value, options, field) {
	if (value < options.min || value > options.max) field.report(messages.range, "range", field, options);
}, { toJSONSchema: (schema, options) => {
	schema.minimum = options.min;
	schema.maximum = options.max;
} });
const positiveRule = createRule(function positive(value, _, field) {
	if (value > 0) return;
	field.report(messages.positive, "positive", field);
}, { toJSONSchema: (schema) => {
	schema.minimum = 0;
} });
const negativeRule = createRule(function negative(value, _, field) {
	if (value < 0) return;
	field.report(messages.negative, "negative", field);
}, { toJSONSchema: (schema) => {
	schema.exclusiveMaximum = 0;
} });
const nonNegativeRule = createRule(function nonNegative(value, _, field) {
	if (value >= 0) return;
	field.report(messages.nonNegative, "nonNegative", field);
});
const nonPositiveRule = createRule(function nonPositive(value, _, field) {
	if (value <= 0) return;
	field.report(messages.nonPositive, "nonPositive", field);
});
const decimalRule = createRule(function decimal(value, options, field) {
	if (!helpers.isDecimal(String(value), {
		force_decimal: options.range[0] !== 0,
		decimal_digits: options.range.join(",")
	})) field.report(messages.decimal, "decimal", field, { digits: options.range.join("-") });
});
const withoutDecimalsRule = createRule(function withoutDecimals(value, _, field) {
	if (!Number.isInteger(value)) field.report(messages.withoutDecimals, "withoutDecimals", field);
}, { toJSONSchema: (schema) => {
	schema.type = "integer";
} });
const inRule = createRule(function inValues(value, options, field) {
	if (!options.values.includes(value)) field.report(messages["number.in"], "in", field, options);
}, { toJSONSchema: (schema, options) => {
	schema.enum = options.values;
} });
var VineNumber = class VineNumber extends BaseLiteralType {
	static rules = {
		in: inRule,
		max: maxRule,
		min: minRule,
		range: rangeRule,
		number: numberRule,
		decimal: decimalRule,
		negative: negativeRule,
		positive: positiveRule,
		nonNegativeRule,
		nonPositiveRule,
		withoutDecimals: withoutDecimalsRule
	};
	[SUBTYPE] = "number";
	[UNIQUE_NAME] = "vine.number";
	[IS_OF_TYPE] = (value) => {
		const valueAsNumber = helpers.asNumber(value);
		return !Number.isNaN(valueAsNumber);
	};
	constructor(options, validations) {
		super(options, validations || []);
		this.dataTypeValidator = numberRule(options || {});
	}
	min(value) {
		return this.use(minRule({ min: value }));
	}
	max(value) {
		return this.use(maxRule({ max: value }));
	}
	range(value) {
		return this.use(rangeRule({
			min: value[0],
			max: value[1]
		}));
	}
	positive() {
		return this.use(positiveRule());
	}
	negative() {
		return this.use(negativeRule());
	}
	nonNegative() {
		return this.use(nonNegativeRule());
	}
	nonPositive() {
		return this.use(nonPositiveRule());
	}
	decimal(range) {
		return this.use(decimalRule({ range: Array.isArray(range) ? range : [range] }));
	}
	withoutDecimals() {
		return this.use(withoutDecimalsRule());
	}
	clone() {
		return new VineNumber(this.cloneOptions(), this.cloneValidations());
	}
	in(values) {
		return this.use(inRule({ values }));
	}
};
const booleanRule = createRule(function boolean(value, options, field) {
	const valueAsBoolean = options.strict === true ? value : helpers.asBoolean(value);
	if (typeof valueAsBoolean !== "boolean") {
		field.report(messages.boolean, "boolean", field);
		return;
	}
	field.mutate(valueAsBoolean, field);
}, { toJSONSchema: (schema, { strict = false }) => {
	if (strict) schema.type = "boolean";
	else schema.enum = [...BOOLEAN_POSITIVES, ...BOOLEAN_NEGATIVES];
} });
var VineBoolean = class VineBoolean extends BaseLiteralType {
	static rules = { boolean: booleanRule };
	[SUBTYPE] = "boolean";
	[UNIQUE_NAME] = "vine.boolean";
	[IS_OF_TYPE] = (value) => {
		return typeof (this.options.strict === true ? value : helpers.asBoolean(value)) === "boolean";
	};
	constructor(options, validations) {
		super(options, validations || [booleanRule(options || {})]);
	}
	clone() {
		return new VineBoolean(this.cloneOptions(), this.cloneValidations());
	}
};
const equalsRule = createRule(function equals(value, options, field) {
	const comparedValue = helpers.compareValues(value, options.expectedValue);
	if (!comparedValue.isEqual) {
		field.report(messages.literal, "literal", field, options);
		return;
	}
	field.mutate(comparedValue.casted, field);
});
var VineLiteral = class VineLiteral extends BaseLiteralType {
	static rules = { equals: equalsRule };
	#value;
	[SUBTYPE] = "literal";
	[IS_OF_TYPE] = (value) => {
		return helpers.compareValues(value, this.#value).isEqual;
	};
	constructor(value, options, validations) {
		super(options, validations || [equalsRule({ expectedValue: value })]);
		this.#value = value;
		this[UNIQUE_NAME] = `vine.literal.${this.#value}`;
	}
	clone() {
		return new VineLiteral(this.#value, this.cloneOptions(), this.cloneValidations());
	}
	toJSONSchema() {
		const schema = super.toJSONSchema();
		if (typeof this.#value === "string") {
			schema.type = "string";
			schema.enum = [this.#value];
		}
		if (typeof this.#value === "boolean") {
			schema.type = "boolean";
			schema.enum = [this.#value];
		}
		if (typeof this.#value === "number") {
			schema.type = "number";
			schema.enum = [this.#value];
		}
		return schema;
	}
};
const ACCEPTED_VALUES = [
	"on",
	"1",
	"yes",
	"true",
	true,
	1
];
const acceptedRule = createRule(function accepted(value, _, field) {
	if (!ACCEPTED_VALUES.includes(value)) field.report(messages.accepted, "accepted", field);
});
var VineAccepted = class VineAccepted extends BaseLiteralType {
	static rules = { accepted: acceptedRule };
	[SUBTYPE] = "checkbox";
	constructor(options, validations) {
		super(options, validations || [acceptedRule()]);
	}
	clone() {
		return new VineAccepted(this.cloneOptions(), this.cloneValidations());
	}
};
var ObjectGroup = class ObjectGroup {
	#conditionals;
	#otherwiseCallback = (_, field) => {
		field.report(messages.unionGroup, "unionGroup", field);
	};
	constructor(conditionals) {
		this.#conditionals = conditionals;
	}
	toJSONSchema() {
		return { anyOf: this.#conditionals.map((conditional) => conditional.toJSONSchema()) };
	}
	clone() {
		const cloned = new ObjectGroup(this.#conditionals);
		cloned.otherwise(this.#otherwiseCallback);
		return cloned;
	}
	otherwise(callback) {
		this.#otherwiseCallback = callback;
		return this;
	}
	[PARSE](refs, options) {
		return {
			type: "group",
			elseConditionalFnRefId: refs.trackConditional(this.#otherwiseCallback),
			conditions: this.#conditionals.map((conditional) => conditional[PARSE](refs, options))
		};
	}
};
var GroupConditional = class {
	#properties;
	#conditional;
	constructor(conditional, properties) {
		this.#properties = properties;
		this.#conditional = conditional;
	}
	toJSONSchema() {
		const properties = {};
		const required = [];
		for (const [key, property] of Object.entries(this.#properties)) {
			properties[key] = property.toJSONSchema();
			if (!("isOptional" in property) || property.isOptional !== true) required.push(key);
		}
		return {
			type: "object",
			properties,
			required
		};
	}
	[PARSE](refs, options) {
		return {
			schema: {
				type: "sub_object",
				properties: Object.keys(this.#properties).map((property) => {
					return this.#properties[property][PARSE](property, refs, options);
				}),
				groups: []
			},
			conditionalFnRefId: refs.trackConditional(this.#conditional)
		};
	}
};
function group(conditionals) {
	return new ObjectGroup(conditionals);
}
group.if = function groupIf(conditon, properties) {
	return new GroupConditional(conditon, properties);
};
group.else = function groupElse(properties) {
	return new GroupConditional(() => true, properties);
};
var VineNativeEnum = class VineNativeEnum extends BaseLiteralType {
	static rules = { enum: enumRule };
	#values;
	[SUBTYPE] = "enum";
	constructor(values, options, validations) {
		super(options, validations || [enumRule({ choices: Object.values(values) })]);
		this.#values = values;
	}
	clone() {
		return new VineNativeEnum(this.#values, this.cloneOptions(), this.cloneValidations());
	}
};
const isNativeFileRule = createRule(function file(value, _, field) {
	if (!field.isDefined) return false;
	if (value instanceof File === false) {
		field.report(messages.nativeFile, "nativeFile", field);
		return false;
	}
	return true;
});
const minSizeRule = createRule(function minSize(value, options, field) {
	if (value.size < options.min) {
		field.report(messages["nativeFile.minSize"], "nativeFile.minSize", field, options);
		return false;
	}
	return true;
});
const maxSizeRule = createRule(function minSize(value, options, field) {
	if (value.size > options.max) field.report(messages["nativeFile.maxSize"], "nativeFile.maxSize", field, options);
});
const mimeTypesRule = createRule((value, options, field) => {
	const mimeType = value.type;
	if (!options.mimeTypes.includes(mimeType)) field.report(messages["nativeFile.mimeTypes"], "nativeFile.mimeTypes", field, options);
});
var VineNativeFile = class VineNativeFile extends BaseLiteralType {
	static rules = {
		maxSize: maxSizeRule,
		mimeTypes: mimeTypesRule,
		minSize: minSizeRule
	};
	[SUBTYPE] = "nativeFile";
	[UNIQUE_NAME] = "vine.nativeFile";
	[IS_OF_TYPE] = (value) => {
		return value instanceof File;
	};
	constructor(options, validations) {
		super(options, validations || []);
		this.dataTypeValidator = isNativeFileRule();
	}
	clone() {
		return new VineNativeFile(this.cloneOptions(), this.cloneValidations());
	}
	minSize(size) {
		return this.use(minSizeRule({ min: size }));
	}
	maxSize(size) {
		return this.use(maxSizeRule({ max: size }));
	}
	mimeTypes(types) {
		return this.use(mimeTypesRule({ mimeTypes: types }));
	}
};
var VineUnionOfTypes = class VineUnionOfTypes {
	#schemas;
	#otherwiseCallback = (_, field) => {
		field.report(messages.unionOfTypes, "unionOfTypes", field);
	};
	constructor(schemas) {
		this.#schemas = schemas;
	}
	otherwise(callback) {
		this.#otherwiseCallback = callback;
		return this;
	}
	clone() {
		const cloned = new VineUnionOfTypes(this.#schemas.map((schema) => schema.clone()));
		cloned.otherwise(this.#otherwiseCallback);
		return cloned;
	}
	optional() {
		return new VineUnionOfTypes([new VineOptional(), ...this.#schemas]);
	}
	nullable() {
		return new VineUnionOfTypes([new VineNull(), ...this.#schemas]);
	}
	toJSONSchema() {
		return { anyOf: this.#schemas.map((schema) => schema.toJSONSchema?.()).filter(Boolean) };
	}
	[PARSE](propertyName, refs, options) {
		return {
			type: "union",
			fieldName: propertyName,
			propertyName: options.toCamelCase ? camelCase(propertyName) : propertyName,
			elseConditionalFnRefId: refs.trackConditional(this.#otherwiseCallback),
			conditions: this.#schemas.map((schema) => {
				return {
					conditionalFnRefId: refs.trackConditional((value, field) => {
						return schema[IS_OF_TYPE](value, field);
					}),
					schema: schema[PARSE](propertyName, refs, options)
				};
			})
		};
	}
};
var SchemaBuilder = class extends Macroable {
	group = group;
	union = union;
	string() {
		return new VineString();
	}
	boolean(options) {
		return new VineBoolean(options);
	}
	accepted() {
		return new VineAccepted();
	}
	number(options) {
		return new VineNumber(options);
	}
	date(options) {
		return new VineDate(options);
	}
	literal(value) {
		return new VineLiteral(value);
	}
	optional() {
		return new VineOptional();
	}
	null() {
		return new VineNull();
	}
	object(properties) {
		return new VineObject(properties);
	}
	array(schema) {
		return new VineArray(schema);
	}
	tuple(schemas) {
		return new VineTuple(schemas);
	}
	record(schema) {
		return new VineRecord(schema);
	}
	enum(values) {
		if (Array.isArray(values) || typeof values === "function") return new VineEnum(values);
		return new VineNativeEnum(values);
	}
	any() {
		return new VineAny();
	}
	unionOfTypes(schemas) {
		const schemasInUse = /* @__PURE__ */ new Set();
		schemas.forEach((schema) => {
			if (!schema[IS_OF_TYPE] || !schema[UNIQUE_NAME]) throw new Error(`Cannot use "${schema.constructor.name}". The schema type is not compatible for use with "vine.unionOfTypes"`);
			if (schemasInUse.has(schema[UNIQUE_NAME])) throw new Error(`Cannot use duplicate schema "${schema[UNIQUE_NAME]}". "vine.unionOfTypes" needs distinct schema types only`);
			schemasInUse.add(schema[UNIQUE_NAME]);
		});
		schemasInUse.clear();
		return new VineUnionOfTypes(schemas);
	}
	nativeFile() {
		return new VineNativeFile();
	}
};
const COMPILER_ERROR_MESSAGES = {
	required: messages.required,
	array: messages.array,
	object: messages.object
};
const EMPTY_OBJECT = {};
var VineValidator = class {
	#compiled;
	#jsonSchema;
	"messagesProvider";
	"errorReporter";
	#parse(schema) {
		const refs = refsBuilder();
		return {
			compilerNode: {
				type: "root",
				schema: schema[PARSE]("", refs, { toCamelCase: false })
			},
			refs: refs.toJSON()
		};
	}
	"constructor"(schema, options) {
		this.schema = schema;
		this.options = options;
		const { compilerNode, refs } = this.#parse(schema);
		this.#compiled = {
			schema: compilerNode,
			refs
		};
		const metaDataValidator = options.metaDataValidator;
		const validateFn = new Compiler(compilerNode, {
			convertEmptyStringsToNull: options.convertEmptyStringsToNull,
			messages: COMPILER_ERROR_MESSAGES
		}).compile();
		this.errorReporter = options.errorReporter;
		this.messagesProvider = options.messagesProvider;
		if (metaDataValidator) this.validate = (data, validateOptions) => {
			let normalizedOptions = validateOptions ?? EMPTY_OBJECT;
			const meta = normalizedOptions.meta ?? {};
			const errorReporter = normalizedOptions.errorReporter ?? this.errorReporter;
			const messagesProvider = normalizedOptions.messagesProvider ?? this.messagesProvider;
			metaDataValidator(meta);
			return validateFn(data, meta, refs, messagesProvider, errorReporter());
		};
		else this.validate = (data, validateOptions) => {
			let normalizedOptions = validateOptions ?? EMPTY_OBJECT;
			const meta = normalizedOptions.meta ?? {};
			const errorReporter = normalizedOptions.errorReporter ?? this.errorReporter;
			return validateFn(data, meta, refs, normalizedOptions.messagesProvider ?? this.messagesProvider, errorReporter());
		};
	}
	async "tryValidate"(data, ...[options]) {
		try {
			return [null, await this.validate(data, options)];
		} catch (error) {
			if (error instanceof ValidationError) return [error, null];
			throw error;
		}
	}
	"toJSON"() {
		const { schema, refs } = this.#compiled;
		return {
			schema: structuredClone(schema),
			refs
		};
	}
	"toJSONSchema"() {
		if (!this.#jsonSchema) this.#jsonSchema = this.schema.toJSONSchema();
		return this.#jsonSchema;
	}
	"~standard" = {
		version: 1,
		vendor: "vinejs",
		jsonSchema: {
			input: () => {
				return this.toJSONSchema();
			},
			output: () => {
				throw new Error("Vine.js does not support creating validators using JSON Schema.");
			}
		},
		validate: async (data) => {
			const [error, result] = await this.tryValidate(data, {});
			if (result) return { value: result };
			return { issues: error?.messages.map((message) => {
				return {
					...message,
					path: message.field
				};
			}) };
		}
	};
};
var Vine = class extends SchemaBuilder {
	messagesProvider = new SimpleMessagesProvider(messages, fields);
	errorReporter = () => new SimpleErrorReporter();
	convertEmptyStringsToNull = false;
	helpers = helpers;
	createRule = createRule;
	compile(schema) {
		return new VineValidator(schema, {
			convertEmptyStringsToNull: this.convertEmptyStringsToNull,
			messagesProvider: this.messagesProvider,
			errorReporter: this.errorReporter
		});
	}
	create(schemaOrProperties) {
		const validatorOptions = {
			convertEmptyStringsToNull: this.convertEmptyStringsToNull,
			messagesProvider: this.messagesProvider,
			errorReporter: this.errorReporter
		};
		if (PARSE in schemaOrProperties) return new VineValidator(schemaOrProperties, validatorOptions);
		return new VineValidator(new VineObject(schemaOrProperties), validatorOptions);
	}
	withMetaData(callback) {
		return {
			compile: (schema) => {
				return new VineValidator(schema, {
					convertEmptyStringsToNull: this.convertEmptyStringsToNull,
					messagesProvider: this.messagesProvider,
					errorReporter: this.errorReporter,
					metaDataValidator: callback
				});
			},
			create: (schemaOrProperties) => {
				const validatorOptions = {
					convertEmptyStringsToNull: this.convertEmptyStringsToNull,
					messagesProvider: this.messagesProvider,
					errorReporter: this.errorReporter,
					metaDataValidator: callback
				};
				if (PARSE in schemaOrProperties) return new VineValidator(schemaOrProperties, validatorOptions);
				return new VineValidator(new VineObject(schemaOrProperties), validatorOptions);
			}
		};
	}
	validate(options) {
		return this.compile(options.schema).validate(options.data, options);
	}
	tryValidate(options) {
		return this.compile(options.schema).tryValidate(options.data, options);
	}
};
const vine = new Vine();
const imageSchema = vine.object({
	id: vine.number({ strict: true }),
	created: vine.date(),
	title: vine.string().minLength(1).maxLength(100),
	type: vine.enum(["jpg", "png"]),
	size: vine.number({ strict: true }),
	url: vine.string().url()
});
const ratingSchema = vine.object({
	id: vine.number({ strict: true }),
	stars: vine.number({ strict: true }).min(0).max(5),
	title: vine.string().minLength(1).maxLength(100),
	text: vine.string().minLength(1).maxLength(1e3),
	images: vine.array(imageSchema)
});
const productSchema = vine.object({
	id: vine.number({ strict: true }),
	created: vine.date(),
	title: vine.string().minLength(1).maxLength(100),
	brand: vine.string().minLength(1).maxLength(30),
	description: vine.string().minLength(1).maxLength(500),
	price: vine.number({ strict: true }).min(1).max(1e4),
	discount: vine.number({ strict: true }).min(1).max(100).nullable(),
	quantity: vine.number({ strict: true }).min(0).max(10),
	tags: vine.array(vine.string().minLength(1).maxLength(30)),
	images: vine.array(imageSchema),
	ratings: vine.array(ratingSchema)
});
vine.tryValidate({
	schema: productSchema,
	data: {}
});
