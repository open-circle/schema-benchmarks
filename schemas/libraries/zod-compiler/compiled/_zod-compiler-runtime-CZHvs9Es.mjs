import { ZodRealError, config } from "zod";
import * as __zcCore from "zod/v4/core";
// \0zod-compiler-runtime
function __zcUw(m) {
	return typeof m === "string" ? m : m === void 0 || m === null ? void 0 : m.message;
}
var __zcMsg = function(iss) {
	var c = config(), m;
	if (c.customError) {
		m = __zcUw(c.customError(iss));
		if (m !== void 0 && m !== null) return m;
	}
	if (c.localeError) {
		m = __zcUw(c.localeError(iss));
		if (m !== void 0 && m !== null) return m;
	}
	return "Invalid input";
};
var __ZcFail = /* @__PURE__ */ (function() {
	function __ZcFail(e, f, i) {
		this.success = false;
		this._e = e;
		this._f = f;
		this._i = i;
		this._c = void 0;
	}
	Object.defineProperty(__ZcFail.prototype, "error", {
		configurable: true,
		get: function() {
			if (this._c) return this._c;
			var e = this._f !== null ? this._f(this._i) : this._e;
			for (var i = 0; i < e.length; i++) {
				var s = e[i], o = {}, k;
				if (s.message === void 0 && typeof __zcMsg === "function") s.message = __zcMsg(s);
				for (k in s) if (k !== "input" && k !== "continue" && Object.prototype.hasOwnProperty.call(s, k)) o[k] = s[k];
				e[i] = o;
			}
			return this._c = new ZodRealError(e);
		}
	});
	return __ZcFail;
})();
var __ZcFailC = /* @__PURE__ */ (function() {
	function __ZcFailC(e, f, i) {
		this.success = false;
		this._e = e;
		this._f = f;
		this._i = i;
		this._c = void 0;
	}
	Object.defineProperty(__ZcFailC.prototype, "error", {
		configurable: true,
		get: function() {
			if (this._c) return this._c;
			var e = this._f !== null ? this._f(this._i) : this._e;
			for (var i = 0; i < e.length; i++) {
				var s = e[i], o = {}, k;
				if (s.message === void 0 && typeof __zcMsg === "function") s.message = __zcMsg(s);
				for (k in s) if (k !== "input" && k !== "continue" && Object.prototype.hasOwnProperty.call(s, k)) o[k] = s[k];
				e[i] = o;
			}
			return this._c = new __zcCore.$ZodRealError(e);
		}
	});
	return __ZcFailC;
})();
function __ZcFailZ(z, r, i) {
	this.success = false;
	this._z = z;
	this._r = r;
	this._i = i;
	this._c = void 0;
}
Object.defineProperty(__ZcFailZ.prototype, "error", {
	configurable: true,
	get: function() {
		if (this._c) return this._c;
		var p = {};
		p[Symbol.for("zod.compile.fallback")] = true;
		return this._c = this._z.call(this._r, this._i, p).error;
	}
});
function __zcMkv(fn, schema, fc, is, p, v) {
	var w = schema || {};
	var zpa = w.parseAsync, zspa = w.safeParseAsync;
	w.parse = p || (fc ? function parse(input) {
		if (fc(input)) return input;
		var r = fn(input);
		if (r.success) return r.data;
		throw __zcSt(r.error, parse);
	} : function parse(input) {
		var r = fn(input);
		if (r.success) return r.data;
		throw __zcSt(r.error, parse);
	});
	w.safeParse = fn;
	w.safeParseAsync = function(input) {
		try {
			return Promise.resolve(fn(input));
		} catch (e) {
			if (zspa) return zspa(input);
			throw e;
		}
	};
	w.parseAsync = fc ? function parseAsync(input) {
		try {
			if (fc(input)) return Promise.resolve(input);
			var r = fn(input);
			if (r.success) return Promise.resolve(r.data);
			return Promise.reject(__zcSt(r.error, parseAsync));
		} catch (e) {
			if (zpa) return zpa(input);
			throw e;
		}
	} : function parseAsync(input) {
		try {
			var r = fn(input);
			if (r.success) return Promise.resolve(r.data);
			return Promise.reject(__zcSt(r.error, parseAsync));
		} catch (e) {
			if (zpa) return zpa(input);
			throw e;
		}
	};
	w.is = is || function(input) {
		return fn(input).success;
	};
	if (v) v.a = zspa;
	Object.defineProperty(w, "~standard", {
		configurable: true,
		value: {
			version: 1,
			vendor: "zod",
			validate: v || function(input) {
				var r;
				try {
					if (fc && fc(input)) return { value: input };
					r = fn(input);
				} catch (e) {
					if (zspa) return zspa(input).then(function(q) {
						return q.success ? { value: q.data } : { issues: q.error.issues };
					});
					throw e;
				}
				return r.success ? { value: r.data } : { issues: r.error.issues };
			}
		}
	});
	return w;
}
function __zcSt(e, c) {
	var t = Error.captureStackTrace;
	if (typeof t === "function") t(e, c);
	return e;
}
function __zcPu(r, c) {
	if (r.success) return r.data;
	throw __zcSt(r.error, c);
}
function __zcVr(r) {
	return r.success ? { value: r.data } : { issues: r.error.issues };
}
function __zcVc(e, i, v) {
	var a = v.a;
	if (a) return a(i).then(__zcVr);
	throw e;
}
function __zcZr(w, fn, a, v, f) {
	var z = w._zod, l = z.run, o = l.__originalRun || l, p = o === z.parse, k = Symbol.for("zod.compile.fallback"), b = __zcCore.isBackEdge;
	function run(q, c) {
		if (c && (a || c.async === false) && c.direction !== "backward" && !c.skipChecks && !c[k] && !(b && b(c, q.value))) {
			var r;
			if (v) {
				r = v(q.value, 1);
				if (r !== f) {
					q.value = r;
					return q;
				}
			} else {
				r = fn(q.value);
				if (r.success) {
					q.value = r.data;
					return q;
				}
			}
			c[k] = true;
			r = p ? z.parse(q, c) : o(q, c);
			if (!(r instanceof Promise)) c[k] = false;
			return r;
		}
		return p ? z.parse(q, c) : o(q, c);
	}
	run.__originalRun = o;
	z.run = run;
	return w;
}
function __zcFinD(f, inp) {
	return new __ZcFail(null, f, inp);
}
function __zcFinDC(f, inp) {
	return new __ZcFailC(null, f, inp);
}
function __zcTS(m, o, i, inp, p, msg) {
	var r = {
		origin: o,
		code: "too_small",
		minimum: m,
		inclusive: i,
		input: inp,
		path: p
	};
	if (msg !== void 0) r.message = msg;
	return r;
}
function __zcTB(m, o, i, inp, p, msg) {
	var r = {
		origin: o,
		code: "too_big",
		maximum: m,
		inclusive: i,
		input: inp,
		path: p
	};
	if (msg !== void 0) r.message = msg;
	return r;
}
function __zcIT(e, inp, p, msg) {
	var r = {
		expected: e,
		code: "invalid_type",
		input: inp,
		path: p
	};
	if (msg !== void 0) r.message = msg;
	return r;
}
function __zcIF(o, f, inp, p, extra, msg) {
	var r = o === void 0 ? {
		code: "invalid_format",
		format: f
	} : {
		origin: o,
		code: "invalid_format",
		format: f
	};
	if (extra) Object.assign(r, extra);
	r.input = inp;
	r.path = p;
	if (msg !== void 0) r.message = msg;
	return r;
}
function __zcIV(values, inp, p, extra, msg) {
	var r = { code: "invalid_value" };
	if (extra) Object.assign(r, extra);
	r.values = values;
	r.input = inp;
	r.path = p;
	if (msg !== void 0) r.message = msg;
	return r;
}
function __zcLo(v) {
	return Array.isArray(v) ? "array" : typeof v === "string" ? "string" : "unknown";
}
function __zcCpl(s) {
	var n = s.length;
	if (!/[\uD800-\uDBFF]/.test(s)) return n;
	var c = n;
	for (var i = 0; i < n - 1; i++) if ((s.charCodeAt(i) & 64512) === 55296 && (s.charCodeAt(i + 1) & 64512) === 56320) {
		c--;
		i++;
	}
	return c;
}
function __zcUrl(s) {
	if (typeof URL === "function" && typeof URL.canParse === "function") return URL.canParse(s);
	try {
		new URL(s);
		return true;
	} catch (_) {
		return false;
	}
}
function __zcPa(p, k) {
	var n = p.length, r = new Array(n + 1);
	for (var i = 0; i < n; i++) r[i] = p[i];
	r[n] = k;
	return r;
}
export { __zcIT as a, __zcMkv as c, __zcTB as d, __zcTS as f, __zcZr as g, __zcVr as h, __zcIF as i, __zcPa as l, __zcVc as m, __zcFinD as n, __zcIV as o, __zcUrl as p, __zcFinDC as r, __zcLo as s, __zcCpl as t, __zcPu as u };
