import "zod";
import "zod/v4/core";
// \0zod-compiler-runtime
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
function __zcFinZ(z, r, i) {
	return new __ZcFailZ(z, r, i);
}
function __zcSrQ(v, i) {
	this.value = v;
	this.issues = i;
}
__zcSrQ.prototype = Object.prototype;
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
export { __zcUrl as a, __zcPu as i, __zcFinZ as n, __zcVc as o, __zcMkv as r, __zcVr as s, __zcCpl as t };
