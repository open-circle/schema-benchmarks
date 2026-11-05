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
		return this._c || (this._c = this._z.call(this._r, this._i).error);
	}
});
function __zcMkv(fn, schema, fc, is) {
	var w = schema || {};
	var zpa = w.parseAsync, zspa = w.safeParseAsync;
	w.parse = fc ? function(input) {
		if (fc(input)) return input;
		var r = fn(input);
		if (r.success) return r.data;
		throw r.error;
	} : function(input) {
		var r = fn(input);
		if (r.success) return r.data;
		throw r.error;
	};
	w.safeParse = fn;
	w.safeParseAsync = function(input) {
		try {
			return Promise.resolve(fn(input));
		} catch (e) {
			if (zspa) return zspa(input);
			throw e;
		}
	};
	w.parseAsync = fc ? function(input) {
		try {
			if (fc(input)) return Promise.resolve(input);
			var r = fn(input);
			if (r.success) return Promise.resolve(r.data);
			return Promise.reject(r.error);
		} catch (e) {
			if (zpa) return zpa(input);
			throw e;
		}
	} : function(input) {
		try {
			var r = fn(input);
			if (r.success) return Promise.resolve(r.data);
			return Promise.reject(r.error);
		} catch (e) {
			if (zpa) return zpa(input);
			throw e;
		}
	};
	w.is = is || function(input) {
		return fn(input).success;
	};
	Object.defineProperty(w, "~standard", {
		configurable: true,
		value: {
			version: 1,
			vendor: "zod",
			validate: function(input) {
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
export { __zcIT as a, __zcMkv as c, __zcTS as d, __zcUrl as f, __zcIF as i, __zcPa as l, __zcFinD as n, __zcIV as o, __zcFinDC as r, __zcLo as s, __zcCpl as t, __zcTB as u };
