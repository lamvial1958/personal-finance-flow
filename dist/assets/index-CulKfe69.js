import { g as Oa, c as Jc } from "./sql.js-Cpj98o6Y.js";
(function() {
  const t = document.createElement("link").relList;
  if (t && t.supports && t.supports("modulepreload")) return;
  for (const l of document.querySelectorAll('link[rel="modulepreload"]')) r(l);
  new MutationObserver((l) => {
    for (const s of l) if (s.type === "childList") for (const o of s.addedNodes) o.tagName === "LINK" && o.rel === "modulepreload" && r(o);
  }).observe(document, { childList: true, subtree: true });
  function n(l) {
    const s = {};
    return l.integrity && (s.integrity = l.integrity), l.referrerPolicy && (s.referrerPolicy = l.referrerPolicy), l.crossOrigin === "use-credentials" ? s.credentials = "include" : l.crossOrigin === "anonymous" ? s.credentials = "omit" : s.credentials = "same-origin", s;
  }
  function r(l) {
    if (l.ep) return;
    l.ep = true;
    const s = n(l);
    fetch(l.href, s);
  }
})();
var Ra = { exports: {} }, Ql = {}, Pa = { exports: {} }, G = {};
/**
* @license React
* react.production.min.js
*
* Copyright (c) Facebook, Inc. and its affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/
var br = Symbol.for("react.element"), qc = Symbol.for("react.portal"), Zc = Symbol.for("react.fragment"), ed = Symbol.for("react.strict_mode"), td = Symbol.for("react.profiler"), nd = Symbol.for("react.provider"), rd = Symbol.for("react.context"), ld = Symbol.for("react.forward_ref"), sd = Symbol.for("react.suspense"), od = Symbol.for("react.memo"), id = Symbol.for("react.lazy"), Ei = Symbol.iterator;
function ad(e) {
  return e === null || typeof e != "object" ? null : (e = Ei && e[Ei] || e["@@iterator"], typeof e == "function" ? e : null);
}
var Ia = { isMounted: function() {
  return false;
}, enqueueForceUpdate: function() {
}, enqueueReplaceState: function() {
}, enqueueSetState: function() {
} }, za = Object.assign, Ma = {};
function Zn(e, t, n) {
  this.props = e, this.context = t, this.refs = Ma, this.updater = n || Ia;
}
Zn.prototype.isReactComponent = {};
Zn.prototype.setState = function(e, t) {
  if (typeof e != "object" && typeof e != "function" && e != null) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
  this.updater.enqueueSetState(this, e, t, "setState");
};
Zn.prototype.forceUpdate = function(e) {
  this.updater.enqueueForceUpdate(this, e, "forceUpdate");
};
function Aa() {
}
Aa.prototype = Zn.prototype;
function To(e, t, n) {
  this.props = e, this.context = t, this.refs = Ma, this.updater = n || Ia;
}
var Do = To.prototype = new Aa();
Do.constructor = To;
za(Do, Zn.prototype);
Do.isPureReactComponent = true;
var ki = Array.isArray, Fa = Object.prototype.hasOwnProperty, Lo = { current: null }, Ua = { key: true, ref: true, __self: true, __source: true };
function Ba(e, t, n) {
  var r, l = {}, s = null, o = null;
  if (t != null) for (r in t.ref !== void 0 && (o = t.ref), t.key !== void 0 && (s = "" + t.key), t) Fa.call(t, r) && !Ua.hasOwnProperty(r) && (l[r] = t[r]);
  var u = arguments.length - 2;
  if (u === 1) l.children = n;
  else if (1 < u) {
    for (var a = Array(u), p = 0; p < u; p++) a[p] = arguments[p + 2];
    l.children = a;
  }
  if (e && e.defaultProps) for (r in u = e.defaultProps, u) l[r] === void 0 && (l[r] = u[r]);
  return { $$typeof: br, type: e, key: s, ref: o, props: l, _owner: Lo.current };
}
function ud(e, t) {
  return { $$typeof: br, type: e.type, key: t, ref: e.ref, props: e.props, _owner: e._owner };
}
function Oo(e) {
  return typeof e == "object" && e !== null && e.$$typeof === br;
}
function cd(e) {
  var t = { "=": "=0", ":": "=2" };
  return "$" + e.replace(/[=:]/g, function(n) {
    return t[n];
  });
}
var Ni = /\/+/g;
function as(e, t) {
  return typeof e == "object" && e !== null && e.key != null ? cd("" + e.key) : t.toString(36);
}
function cl(e, t, n, r, l) {
  var s = typeof e;
  (s === "undefined" || s === "boolean") && (e = null);
  var o = false;
  if (e === null) o = true;
  else switch (s) {
    case "string":
    case "number":
      o = true;
      break;
    case "object":
      switch (e.$$typeof) {
        case br:
        case qc:
          o = true;
      }
  }
  if (o) return o = e, l = l(o), e = r === "" ? "." + as(o, 0) : r, ki(l) ? (n = "", e != null && (n = e.replace(Ni, "$&/") + "/"), cl(l, t, n, "", function(p) {
    return p;
  })) : l != null && (Oo(l) && (l = ud(l, n + (!l.key || o && o.key === l.key ? "" : ("" + l.key).replace(Ni, "$&/") + "/") + e)), t.push(l)), 1;
  if (o = 0, r = r === "" ? "." : r + ":", ki(e)) for (var u = 0; u < e.length; u++) {
    s = e[u];
    var a = r + as(s, u);
    o += cl(s, t, n, a, l);
  }
  else if (a = ad(e), typeof a == "function") for (e = a.call(e), u = 0; !(s = e.next()).done; ) s = s.value, a = r + as(s, u++), o += cl(s, t, n, a, l);
  else if (s === "object") throw t = String(e), Error("Objects are not valid as a React child (found: " + (t === "[object Object]" ? "object with keys {" + Object.keys(e).join(", ") + "}" : t) + "). If you meant to render a collection of children, use an array instead.");
  return o;
}
function Kr(e, t, n) {
  if (e == null) return e;
  var r = [], l = 0;
  return cl(e, r, "", "", function(s) {
    return t.call(n, s, l++);
  }), r;
}
function dd(e) {
  if (e._status === -1) {
    var t = e._result;
    t = t(), t.then(function(n) {
      (e._status === 0 || e._status === -1) && (e._status = 1, e._result = n);
    }, function(n) {
      (e._status === 0 || e._status === -1) && (e._status = 2, e._result = n);
    }), e._status === -1 && (e._status = 0, e._result = t);
  }
  if (e._status === 1) return e._result.default;
  throw e._result;
}
var Qe = { current: null }, dl = { transition: null }, fd = { ReactCurrentDispatcher: Qe, ReactCurrentBatchConfig: dl, ReactCurrentOwner: Lo };
function ba() {
  throw Error("act(...) is not supported in production builds of React.");
}
G.Children = { map: Kr, forEach: function(e, t, n) {
  Kr(e, function() {
    t.apply(this, arguments);
  }, n);
}, count: function(e) {
  var t = 0;
  return Kr(e, function() {
    t++;
  }), t;
}, toArray: function(e) {
  return Kr(e, function(t) {
    return t;
  }) || [];
}, only: function(e) {
  if (!Oo(e)) throw Error("React.Children.only expected to receive a single React element child.");
  return e;
} };
G.Component = Zn;
G.Fragment = Zc;
G.Profiler = td;
G.PureComponent = To;
G.StrictMode = ed;
G.Suspense = sd;
G.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = fd;
G.act = ba;
G.cloneElement = function(e, t, n) {
  if (e == null) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + e + ".");
  var r = za({}, e.props), l = e.key, s = e.ref, o = e._owner;
  if (t != null) {
    if (t.ref !== void 0 && (s = t.ref, o = Lo.current), t.key !== void 0 && (l = "" + t.key), e.type && e.type.defaultProps) var u = e.type.defaultProps;
    for (a in t) Fa.call(t, a) && !Ua.hasOwnProperty(a) && (r[a] = t[a] === void 0 && u !== void 0 ? u[a] : t[a]);
  }
  var a = arguments.length - 2;
  if (a === 1) r.children = n;
  else if (1 < a) {
    u = Array(a);
    for (var p = 0; p < a; p++) u[p] = arguments[p + 2];
    r.children = u;
  }
  return { $$typeof: br, type: e.type, key: l, ref: s, props: r, _owner: o };
};
G.createContext = function(e) {
  return e = { $$typeof: rd, _currentValue: e, _currentValue2: e, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null }, e.Provider = { $$typeof: nd, _context: e }, e.Consumer = e;
};
G.createElement = Ba;
G.createFactory = function(e) {
  var t = Ba.bind(null, e);
  return t.type = e, t;
};
G.createRef = function() {
  return { current: null };
};
G.forwardRef = function(e) {
  return { $$typeof: ld, render: e };
};
G.isValidElement = Oo;
G.lazy = function(e) {
  return { $$typeof: id, _payload: { _status: -1, _result: e }, _init: dd };
};
G.memo = function(e, t) {
  return { $$typeof: od, type: e, compare: t === void 0 ? null : t };
};
G.startTransition = function(e) {
  var t = dl.transition;
  dl.transition = {};
  try {
    e();
  } finally {
    dl.transition = t;
  }
};
G.unstable_act = ba;
G.useCallback = function(e, t) {
  return Qe.current.useCallback(e, t);
};
G.useContext = function(e) {
  return Qe.current.useContext(e);
};
G.useDebugValue = function() {
};
G.useDeferredValue = function(e) {
  return Qe.current.useDeferredValue(e);
};
G.useEffect = function(e, t) {
  return Qe.current.useEffect(e, t);
};
G.useId = function() {
  return Qe.current.useId();
};
G.useImperativeHandle = function(e, t, n) {
  return Qe.current.useImperativeHandle(e, t, n);
};
G.useInsertionEffect = function(e, t) {
  return Qe.current.useInsertionEffect(e, t);
};
G.useLayoutEffect = function(e, t) {
  return Qe.current.useLayoutEffect(e, t);
};
G.useMemo = function(e, t) {
  return Qe.current.useMemo(e, t);
};
G.useReducer = function(e, t, n) {
  return Qe.current.useReducer(e, t, n);
};
G.useRef = function(e) {
  return Qe.current.useRef(e);
};
G.useState = function(e) {
  return Qe.current.useState(e);
};
G.useSyncExternalStore = function(e, t, n) {
  return Qe.current.useSyncExternalStore(e, t, n);
};
G.useTransition = function() {
  return Qe.current.useTransition();
};
G.version = "18.3.1";
Pa.exports = G;
var H = Pa.exports;
const fn = Oa(H);
/**
* @license React
* react-jsx-runtime.production.min.js
*
* Copyright (c) Facebook, Inc. and its affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/
var pd = H, md = Symbol.for("react.element"), hd = Symbol.for("react.fragment"), gd = Object.prototype.hasOwnProperty, vd = pd.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, yd = { key: true, ref: true, __self: true, __source: true };
function $a(e, t, n) {
  var r, l = {}, s = null, o = null;
  n !== void 0 && (s = "" + n), t.key !== void 0 && (s = "" + t.key), t.ref !== void 0 && (o = t.ref);
  for (r in t) gd.call(t, r) && !yd.hasOwnProperty(r) && (l[r] = t[r]);
  if (e && e.defaultProps) for (r in t = e.defaultProps, t) l[r] === void 0 && (l[r] = t[r]);
  return { $$typeof: md, type: e, key: s, ref: o, props: l, _owner: vd.current };
}
Ql.Fragment = hd;
Ql.jsx = $a;
Ql.jsxs = $a;
Ra.exports = Ql;
var i = Ra.exports, Is = {}, Va = { exports: {} }, ot = {}, Wa = { exports: {} }, Ha = {};
/**
* @license React
* scheduler.production.min.js
*
* Copyright (c) Facebook, Inc. and its affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/
(function(e) {
  function t(_, k) {
    var $ = _.length;
    _.push(k);
    e: for (; 0 < $; ) {
      var Q = $ - 1 >>> 1, j = _[Q];
      if (0 < l(j, k)) _[Q] = k, _[$] = j, $ = Q;
      else break e;
    }
  }
  function n(_) {
    return _.length === 0 ? null : _[0];
  }
  function r(_) {
    if (_.length === 0) return null;
    var k = _[0], $ = _.pop();
    if ($ !== k) {
      _[0] = $;
      e: for (var Q = 0, j = _.length, Z = j >>> 1; Q < Z; ) {
        var se = 2 * (Q + 1) - 1, oe = _[se], ee = se + 1, de = _[ee];
        if (0 > l(oe, $)) ee < j && 0 > l(de, oe) ? (_[Q] = de, _[ee] = $, Q = ee) : (_[Q] = oe, _[se] = $, Q = se);
        else if (ee < j && 0 > l(de, $)) _[Q] = de, _[ee] = $, Q = ee;
        else break e;
      }
    }
    return k;
  }
  function l(_, k) {
    var $ = _.sortIndex - k.sortIndex;
    return $ !== 0 ? $ : _.id - k.id;
  }
  if (typeof performance == "object" && typeof performance.now == "function") {
    var s = performance;
    e.unstable_now = function() {
      return s.now();
    };
  } else {
    var o = Date, u = o.now();
    e.unstable_now = function() {
      return o.now() - u;
    };
  }
  var a = [], p = [], g = 1, v = null, y = 3, C = false, T = false, R = false, J = typeof setTimeout == "function" ? setTimeout : null, m = typeof clearTimeout == "function" ? clearTimeout : null, d = typeof setImmediate < "u" ? setImmediate : null;
  typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);
  function h(_) {
    for (var k = n(p); k !== null; ) {
      if (k.callback === null) r(p);
      else if (k.startTime <= _) r(p), k.sortIndex = k.expirationTime, t(a, k);
      else break;
      k = n(p);
    }
  }
  function S(_) {
    if (R = false, h(_), !T) if (n(a) !== null) T = true, le(L);
    else {
      var k = n(p);
      k !== null && I(S, k.startTime - _);
    }
  }
  function L(_, k) {
    T = false, R && (R = false, m(c), c = -1), C = true;
    var $ = y;
    try {
      for (h(k), v = n(a); v !== null && (!(v.expirationTime > k) || _ && !D()); ) {
        var Q = v.callback;
        if (typeof Q == "function") {
          v.callback = null, y = v.priorityLevel;
          var j = Q(v.expirationTime <= k);
          k = e.unstable_now(), typeof j == "function" ? v.callback = j : v === n(a) && r(a), h(k);
        } else r(a);
        v = n(a);
      }
      if (v !== null) var Z = true;
      else {
        var se = n(p);
        se !== null && I(S, se.startTime - k), Z = false;
      }
      return Z;
    } finally {
      v = null, y = $, C = false;
    }
  }
  var O = false, N = null, c = -1, f = 5, x = -1;
  function D() {
    return !(e.unstable_now() - x < f);
  }
  function z() {
    if (N !== null) {
      var _ = e.unstable_now();
      x = _;
      var k = true;
      try {
        k = N(true, _);
      } finally {
        k ? B() : (O = false, N = null);
      }
    } else O = false;
  }
  var B;
  if (typeof d == "function") B = function() {
    d(z);
  };
  else if (typeof MessageChannel < "u") {
    var K = new MessageChannel(), Se = K.port2;
    K.port1.onmessage = z, B = function() {
      Se.postMessage(null);
    };
  } else B = function() {
    J(z, 0);
  };
  function le(_) {
    N = _, O || (O = true, B());
  }
  function I(_, k) {
    c = J(function() {
      _(e.unstable_now());
    }, k);
  }
  e.unstable_IdlePriority = 5, e.unstable_ImmediatePriority = 1, e.unstable_LowPriority = 4, e.unstable_NormalPriority = 3, e.unstable_Profiling = null, e.unstable_UserBlockingPriority = 2, e.unstable_cancelCallback = function(_) {
    _.callback = null;
  }, e.unstable_continueExecution = function() {
    T || C || (T = true, le(L));
  }, e.unstable_forceFrameRate = function(_) {
    0 > _ || 125 < _ ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : f = 0 < _ ? Math.floor(1e3 / _) : 5;
  }, e.unstable_getCurrentPriorityLevel = function() {
    return y;
  }, e.unstable_getFirstCallbackNode = function() {
    return n(a);
  }, e.unstable_next = function(_) {
    switch (y) {
      case 1:
      case 2:
      case 3:
        var k = 3;
        break;
      default:
        k = y;
    }
    var $ = y;
    y = k;
    try {
      return _();
    } finally {
      y = $;
    }
  }, e.unstable_pauseExecution = function() {
  }, e.unstable_requestPaint = function() {
  }, e.unstable_runWithPriority = function(_, k) {
    switch (_) {
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
        break;
      default:
        _ = 3;
    }
    var $ = y;
    y = _;
    try {
      return k();
    } finally {
      y = $;
    }
  }, e.unstable_scheduleCallback = function(_, k, $) {
    var Q = e.unstable_now();
    switch (typeof $ == "object" && $ !== null ? ($ = $.delay, $ = typeof $ == "number" && 0 < $ ? Q + $ : Q) : $ = Q, _) {
      case 1:
        var j = -1;
        break;
      case 2:
        j = 250;
        break;
      case 5:
        j = 1073741823;
        break;
      case 4:
        j = 1e4;
        break;
      default:
        j = 5e3;
    }
    return j = $ + j, _ = { id: g++, callback: k, priorityLevel: _, startTime: $, expirationTime: j, sortIndex: -1 }, $ > Q ? (_.sortIndex = $, t(p, _), n(a) === null && _ === n(p) && (R ? (m(c), c = -1) : R = true, I(S, $ - Q))) : (_.sortIndex = j, t(a, _), T || C || (T = true, le(L))), _;
  }, e.unstable_shouldYield = D, e.unstable_wrapCallback = function(_) {
    var k = y;
    return function() {
      var $ = y;
      y = k;
      try {
        return _.apply(this, arguments);
      } finally {
        y = $;
      }
    };
  };
})(Ha);
Wa.exports = Ha;
var xd = Wa.exports;
/**
* @license React
* react-dom.production.min.js
*
* Copyright (c) Facebook, Inc. and its affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/
var wd = H, st = xd;
function E(e) {
  for (var t = "https://reactjs.org/docs/error-decoder.html?invariant=" + e, n = 1; n < arguments.length; n++) t += "&args[]=" + encodeURIComponent(arguments[n]);
  return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
}
var Qa = /* @__PURE__ */ new Set(), Nr = {};
function _n(e, t) {
  Qn(e, t), Qn(e + "Capture", t);
}
function Qn(e, t) {
  for (Nr[e] = t, e = 0; e < t.length; e++) Qa.add(t[e]);
}
var At = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), zs = Object.prototype.hasOwnProperty, Sd = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, _i = {}, ji = {};
function Ed(e) {
  return zs.call(ji, e) ? true : zs.call(_i, e) ? false : Sd.test(e) ? ji[e] = true : (_i[e] = true, false);
}
function kd(e, t, n, r) {
  if (n !== null && n.type === 0) return false;
  switch (typeof t) {
    case "function":
    case "symbol":
      return true;
    case "boolean":
      return r ? false : n !== null ? !n.acceptsBooleans : (e = e.toLowerCase().slice(0, 5), e !== "data-" && e !== "aria-");
    default:
      return false;
  }
}
function Nd(e, t, n, r) {
  if (t === null || typeof t > "u" || kd(e, t, n, r)) return true;
  if (r) return false;
  if (n !== null) switch (n.type) {
    case 3:
      return !t;
    case 4:
      return t === false;
    case 5:
      return isNaN(t);
    case 6:
      return isNaN(t) || 1 > t;
  }
  return false;
}
function Ke(e, t, n, r, l, s, o) {
  this.acceptsBooleans = t === 2 || t === 3 || t === 4, this.attributeName = r, this.attributeNamespace = l, this.mustUseProperty = n, this.propertyName = e, this.type = t, this.sanitizeURL = s, this.removeEmptyString = o;
}
var Ae = {};
"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e) {
  Ae[e] = new Ke(e, 0, false, e, null, false, false);
});
[["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(e) {
  var t = e[0];
  Ae[t] = new Ke(t, 1, false, e[1], null, false, false);
});
["contentEditable", "draggable", "spellCheck", "value"].forEach(function(e) {
  Ae[e] = new Ke(e, 2, false, e.toLowerCase(), null, false, false);
});
["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(e) {
  Ae[e] = new Ke(e, 2, false, e, null, false, false);
});
"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e) {
  Ae[e] = new Ke(e, 3, false, e.toLowerCase(), null, false, false);
});
["checked", "multiple", "muted", "selected"].forEach(function(e) {
  Ae[e] = new Ke(e, 3, true, e, null, false, false);
});
["capture", "download"].forEach(function(e) {
  Ae[e] = new Ke(e, 4, false, e, null, false, false);
});
["cols", "rows", "size", "span"].forEach(function(e) {
  Ae[e] = new Ke(e, 6, false, e, null, false, false);
});
["rowSpan", "start"].forEach(function(e) {
  Ae[e] = new Ke(e, 5, false, e.toLowerCase(), null, false, false);
});
var Ro = /[\-:]([a-z])/g;
function Po(e) {
  return e[1].toUpperCase();
}
"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e) {
  var t = e.replace(Ro, Po);
  Ae[t] = new Ke(t, 1, false, e, null, false, false);
});
"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e) {
  var t = e.replace(Ro, Po);
  Ae[t] = new Ke(t, 1, false, e, "http://www.w3.org/1999/xlink", false, false);
});
["xml:base", "xml:lang", "xml:space"].forEach(function(e) {
  var t = e.replace(Ro, Po);
  Ae[t] = new Ke(t, 1, false, e, "http://www.w3.org/XML/1998/namespace", false, false);
});
["tabIndex", "crossOrigin"].forEach(function(e) {
  Ae[e] = new Ke(e, 1, false, e.toLowerCase(), null, false, false);
});
Ae.xlinkHref = new Ke("xlinkHref", 1, false, "xlink:href", "http://www.w3.org/1999/xlink", true, false);
["src", "href", "action", "formAction"].forEach(function(e) {
  Ae[e] = new Ke(e, 1, false, e.toLowerCase(), null, true, true);
});
function Io(e, t, n, r) {
  var l = Ae.hasOwnProperty(t) ? Ae[t] : null;
  (l !== null ? l.type !== 0 : r || !(2 < t.length) || t[0] !== "o" && t[0] !== "O" || t[1] !== "n" && t[1] !== "N") && (Nd(t, n, l, r) && (n = null), r || l === null ? Ed(t) && (n === null ? e.removeAttribute(t) : e.setAttribute(t, "" + n)) : l.mustUseProperty ? e[l.propertyName] = n === null ? l.type === 3 ? false : "" : n : (t = l.attributeName, r = l.attributeNamespace, n === null ? e.removeAttribute(t) : (l = l.type, n = l === 3 || l === 4 && n === true ? "" : "" + n, r ? e.setAttributeNS(r, t, n) : e.setAttribute(t, n))));
}
var bt = wd.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, Yr = Symbol.for("react.element"), Tn = Symbol.for("react.portal"), Dn = Symbol.for("react.fragment"), zo = Symbol.for("react.strict_mode"), Ms = Symbol.for("react.profiler"), Ka = Symbol.for("react.provider"), Ya = Symbol.for("react.context"), Mo = Symbol.for("react.forward_ref"), As = Symbol.for("react.suspense"), Fs = Symbol.for("react.suspense_list"), Ao = Symbol.for("react.memo"), Ht = Symbol.for("react.lazy"), Xa = Symbol.for("react.offscreen"), Ci = Symbol.iterator;
function rr(e) {
  return e === null || typeof e != "object" ? null : (e = Ci && e[Ci] || e["@@iterator"], typeof e == "function" ? e : null);
}
var we = Object.assign, us;
function dr(e) {
  if (us === void 0) try {
    throw Error();
  } catch (n) {
    var t = n.stack.trim().match(/\n( *(at )?)/);
    us = t && t[1] || "";
  }
  return `
` + us + e;
}
var cs = false;
function ds(e, t) {
  if (!e || cs) return "";
  cs = true;
  var n = Error.prepareStackTrace;
  Error.prepareStackTrace = void 0;
  try {
    if (t) if (t = function() {
      throw Error();
    }, Object.defineProperty(t.prototype, "props", { set: function() {
      throw Error();
    } }), typeof Reflect == "object" && Reflect.construct) {
      try {
        Reflect.construct(t, []);
      } catch (p) {
        var r = p;
      }
      Reflect.construct(e, [], t);
    } else {
      try {
        t.call();
      } catch (p) {
        r = p;
      }
      e.call(t.prototype);
    }
    else {
      try {
        throw Error();
      } catch (p) {
        r = p;
      }
      e();
    }
  } catch (p) {
    if (p && r && typeof p.stack == "string") {
      for (var l = p.stack.split(`
`), s = r.stack.split(`
`), o = l.length - 1, u = s.length - 1; 1 <= o && 0 <= u && l[o] !== s[u]; ) u--;
      for (; 1 <= o && 0 <= u; o--, u--) if (l[o] !== s[u]) {
        if (o !== 1 || u !== 1) do
          if (o--, u--, 0 > u || l[o] !== s[u]) {
            var a = `
` + l[o].replace(" at new ", " at ");
            return e.displayName && a.includes("<anonymous>") && (a = a.replace("<anonymous>", e.displayName)), a;
          }
        while (1 <= o && 0 <= u);
        break;
      }
    }
  } finally {
    cs = false, Error.prepareStackTrace = n;
  }
  return (e = e ? e.displayName || e.name : "") ? dr(e) : "";
}
function _d(e) {
  switch (e.tag) {
    case 5:
      return dr(e.type);
    case 16:
      return dr("Lazy");
    case 13:
      return dr("Suspense");
    case 19:
      return dr("SuspenseList");
    case 0:
    case 2:
    case 15:
      return e = ds(e.type, false), e;
    case 11:
      return e = ds(e.type.render, false), e;
    case 1:
      return e = ds(e.type, true), e;
    default:
      return "";
  }
}
function Us(e) {
  if (e == null) return null;
  if (typeof e == "function") return e.displayName || e.name || null;
  if (typeof e == "string") return e;
  switch (e) {
    case Dn:
      return "Fragment";
    case Tn:
      return "Portal";
    case Ms:
      return "Profiler";
    case zo:
      return "StrictMode";
    case As:
      return "Suspense";
    case Fs:
      return "SuspenseList";
  }
  if (typeof e == "object") switch (e.$$typeof) {
    case Ya:
      return (e.displayName || "Context") + ".Consumer";
    case Ka:
      return (e._context.displayName || "Context") + ".Provider";
    case Mo:
      var t = e.render;
      return e = e.displayName, e || (e = t.displayName || t.name || "", e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef"), e;
    case Ao:
      return t = e.displayName || null, t !== null ? t : Us(e.type) || "Memo";
    case Ht:
      t = e._payload, e = e._init;
      try {
        return Us(e(t));
      } catch {
      }
  }
  return null;
}
function jd(e) {
  var t = e.type;
  switch (e.tag) {
    case 24:
      return "Cache";
    case 9:
      return (t.displayName || "Context") + ".Consumer";
    case 10:
      return (t._context.displayName || "Context") + ".Provider";
    case 18:
      return "DehydratedFragment";
    case 11:
      return e = t.render, e = e.displayName || e.name || "", t.displayName || (e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef");
    case 7:
      return "Fragment";
    case 5:
      return t;
    case 4:
      return "Portal";
    case 3:
      return "Root";
    case 6:
      return "Text";
    case 16:
      return Us(t);
    case 8:
      return t === zo ? "StrictMode" : "Mode";
    case 22:
      return "Offscreen";
    case 12:
      return "Profiler";
    case 21:
      return "Scope";
    case 13:
      return "Suspense";
    case 19:
      return "SuspenseList";
    case 25:
      return "TracingMarker";
    case 1:
    case 0:
    case 17:
    case 2:
    case 14:
    case 15:
      if (typeof t == "function") return t.displayName || t.name || null;
      if (typeof t == "string") return t;
  }
  return null;
}
function sn(e) {
  switch (typeof e) {
    case "boolean":
    case "number":
    case "string":
    case "undefined":
      return e;
    case "object":
      return e;
    default:
      return "";
  }
}
function Ga(e) {
  var t = e.type;
  return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
}
function Cd(e) {
  var t = Ga(e) ? "checked" : "value", n = Object.getOwnPropertyDescriptor(e.constructor.prototype, t), r = "" + e[t];
  if (!e.hasOwnProperty(t) && typeof n < "u" && typeof n.get == "function" && typeof n.set == "function") {
    var l = n.get, s = n.set;
    return Object.defineProperty(e, t, { configurable: true, get: function() {
      return l.call(this);
    }, set: function(o) {
      r = "" + o, s.call(this, o);
    } }), Object.defineProperty(e, t, { enumerable: n.enumerable }), { getValue: function() {
      return r;
    }, setValue: function(o) {
      r = "" + o;
    }, stopTracking: function() {
      e._valueTracker = null, delete e[t];
    } };
  }
}
function Xr(e) {
  e._valueTracker || (e._valueTracker = Cd(e));
}
function Ja(e) {
  if (!e) return false;
  var t = e._valueTracker;
  if (!t) return true;
  var n = t.getValue(), r = "";
  return e && (r = Ga(e) ? e.checked ? "true" : "false" : e.value), e = r, e !== n ? (t.setValue(e), true) : false;
}
function El(e) {
  if (e = e || (typeof document < "u" ? document : void 0), typeof e > "u") return null;
  try {
    return e.activeElement || e.body;
  } catch {
    return e.body;
  }
}
function Bs(e, t) {
  var n = t.checked;
  return we({}, t, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: n ?? e._wrapperState.initialChecked });
}
function Ti(e, t) {
  var n = t.defaultValue == null ? "" : t.defaultValue, r = t.checked != null ? t.checked : t.defaultChecked;
  n = sn(t.value != null ? t.value : n), e._wrapperState = { initialChecked: r, initialValue: n, controlled: t.type === "checkbox" || t.type === "radio" ? t.checked != null : t.value != null };
}
function qa(e, t) {
  t = t.checked, t != null && Io(e, "checked", t, false);
}
function bs(e, t) {
  qa(e, t);
  var n = sn(t.value), r = t.type;
  if (n != null) r === "number" ? (n === 0 && e.value === "" || e.value != n) && (e.value = "" + n) : e.value !== "" + n && (e.value = "" + n);
  else if (r === "submit" || r === "reset") {
    e.removeAttribute("value");
    return;
  }
  t.hasOwnProperty("value") ? $s(e, t.type, n) : t.hasOwnProperty("defaultValue") && $s(e, t.type, sn(t.defaultValue)), t.checked == null && t.defaultChecked != null && (e.defaultChecked = !!t.defaultChecked);
}
function Di(e, t, n) {
  if (t.hasOwnProperty("value") || t.hasOwnProperty("defaultValue")) {
    var r = t.type;
    if (!(r !== "submit" && r !== "reset" || t.value !== void 0 && t.value !== null)) return;
    t = "" + e._wrapperState.initialValue, n || t === e.value || (e.value = t), e.defaultValue = t;
  }
  n = e.name, n !== "" && (e.name = ""), e.defaultChecked = !!e._wrapperState.initialChecked, n !== "" && (e.name = n);
}
function $s(e, t, n) {
  (t !== "number" || El(e.ownerDocument) !== e) && (n == null ? e.defaultValue = "" + e._wrapperState.initialValue : e.defaultValue !== "" + n && (e.defaultValue = "" + n));
}
var fr = Array.isArray;
function Bn(e, t, n, r) {
  if (e = e.options, t) {
    t = {};
    for (var l = 0; l < n.length; l++) t["$" + n[l]] = true;
    for (n = 0; n < e.length; n++) l = t.hasOwnProperty("$" + e[n].value), e[n].selected !== l && (e[n].selected = l), l && r && (e[n].defaultSelected = true);
  } else {
    for (n = "" + sn(n), t = null, l = 0; l < e.length; l++) {
      if (e[l].value === n) {
        e[l].selected = true, r && (e[l].defaultSelected = true);
        return;
      }
      t !== null || e[l].disabled || (t = e[l]);
    }
    t !== null && (t.selected = true);
  }
}
function Vs(e, t) {
  if (t.dangerouslySetInnerHTML != null) throw Error(E(91));
  return we({}, t, { value: void 0, defaultValue: void 0, children: "" + e._wrapperState.initialValue });
}
function Li(e, t) {
  var n = t.value;
  if (n == null) {
    if (n = t.children, t = t.defaultValue, n != null) {
      if (t != null) throw Error(E(92));
      if (fr(n)) {
        if (1 < n.length) throw Error(E(93));
        n = n[0];
      }
      t = n;
    }
    t == null && (t = ""), n = t;
  }
  e._wrapperState = { initialValue: sn(n) };
}
function Za(e, t) {
  var n = sn(t.value), r = sn(t.defaultValue);
  n != null && (n = "" + n, n !== e.value && (e.value = n), t.defaultValue == null && e.defaultValue !== n && (e.defaultValue = n)), r != null && (e.defaultValue = "" + r);
}
function Oi(e) {
  var t = e.textContent;
  t === e._wrapperState.initialValue && t !== "" && t !== null && (e.value = t);
}
function eu(e) {
  switch (e) {
    case "svg":
      return "http://www.w3.org/2000/svg";
    case "math":
      return "http://www.w3.org/1998/Math/MathML";
    default:
      return "http://www.w3.org/1999/xhtml";
  }
}
function Ws(e, t) {
  return e == null || e === "http://www.w3.org/1999/xhtml" ? eu(t) : e === "http://www.w3.org/2000/svg" && t === "foreignObject" ? "http://www.w3.org/1999/xhtml" : e;
}
var Gr, tu = function(e) {
  return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction ? function(t, n, r, l) {
    MSApp.execUnsafeLocalFunction(function() {
      return e(t, n, r, l);
    });
  } : e;
}(function(e, t) {
  if (e.namespaceURI !== "http://www.w3.org/2000/svg" || "innerHTML" in e) e.innerHTML = t;
  else {
    for (Gr = Gr || document.createElement("div"), Gr.innerHTML = "<svg>" + t.valueOf().toString() + "</svg>", t = Gr.firstChild; e.firstChild; ) e.removeChild(e.firstChild);
    for (; t.firstChild; ) e.appendChild(t.firstChild);
  }
});
function _r(e, t) {
  if (t) {
    var n = e.firstChild;
    if (n && n === e.lastChild && n.nodeType === 3) {
      n.nodeValue = t;
      return;
    }
  }
  e.textContent = t;
}
var hr = { animationIterationCount: true, aspectRatio: true, borderImageOutset: true, borderImageSlice: true, borderImageWidth: true, boxFlex: true, boxFlexGroup: true, boxOrdinalGroup: true, columnCount: true, columns: true, flex: true, flexGrow: true, flexPositive: true, flexShrink: true, flexNegative: true, flexOrder: true, gridArea: true, gridRow: true, gridRowEnd: true, gridRowSpan: true, gridRowStart: true, gridColumn: true, gridColumnEnd: true, gridColumnSpan: true, gridColumnStart: true, fontWeight: true, lineClamp: true, lineHeight: true, opacity: true, order: true, orphans: true, tabSize: true, widows: true, zIndex: true, zoom: true, fillOpacity: true, floodOpacity: true, stopOpacity: true, strokeDasharray: true, strokeDashoffset: true, strokeMiterlimit: true, strokeOpacity: true, strokeWidth: true }, Td = ["Webkit", "ms", "Moz", "O"];
Object.keys(hr).forEach(function(e) {
  Td.forEach(function(t) {
    t = t + e.charAt(0).toUpperCase() + e.substring(1), hr[t] = hr[e];
  });
});
function nu(e, t, n) {
  return t == null || typeof t == "boolean" || t === "" ? "" : n || typeof t != "number" || t === 0 || hr.hasOwnProperty(e) && hr[e] ? ("" + t).trim() : t + "px";
}
function ru(e, t) {
  e = e.style;
  for (var n in t) if (t.hasOwnProperty(n)) {
    var r = n.indexOf("--") === 0, l = nu(n, t[n], r);
    n === "float" && (n = "cssFloat"), r ? e.setProperty(n, l) : e[n] = l;
  }
}
var Dd = we({ menuitem: true }, { area: true, base: true, br: true, col: true, embed: true, hr: true, img: true, input: true, keygen: true, link: true, meta: true, param: true, source: true, track: true, wbr: true });
function Hs(e, t) {
  if (t) {
    if (Dd[e] && (t.children != null || t.dangerouslySetInnerHTML != null)) throw Error(E(137, e));
    if (t.dangerouslySetInnerHTML != null) {
      if (t.children != null) throw Error(E(60));
      if (typeof t.dangerouslySetInnerHTML != "object" || !("__html" in t.dangerouslySetInnerHTML)) throw Error(E(61));
    }
    if (t.style != null && typeof t.style != "object") throw Error(E(62));
  }
}
function Qs(e, t) {
  if (e.indexOf("-") === -1) return typeof t.is == "string";
  switch (e) {
    case "annotation-xml":
    case "color-profile":
    case "font-face":
    case "font-face-src":
    case "font-face-uri":
    case "font-face-format":
    case "font-face-name":
    case "missing-glyph":
      return false;
    default:
      return true;
  }
}
var Ks = null;
function Fo(e) {
  return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
}
var Ys = null, bn = null, $n = null;
function Ri(e) {
  if (e = Wr(e)) {
    if (typeof Ys != "function") throw Error(E(280));
    var t = e.stateNode;
    t && (t = Jl(t), Ys(e.stateNode, e.type, t));
  }
}
function lu(e) {
  bn ? $n ? $n.push(e) : $n = [e] : bn = e;
}
function su() {
  if (bn) {
    var e = bn, t = $n;
    if ($n = bn = null, Ri(e), t) for (e = 0; e < t.length; e++) Ri(t[e]);
  }
}
function ou(e, t) {
  return e(t);
}
function iu() {
}
var fs = false;
function au(e, t, n) {
  if (fs) return e(t, n);
  fs = true;
  try {
    return ou(e, t, n);
  } finally {
    fs = false, (bn !== null || $n !== null) && (iu(), su());
  }
}
function jr(e, t) {
  var n = e.stateNode;
  if (n === null) return null;
  var r = Jl(n);
  if (r === null) return null;
  n = r[t];
  e: switch (t) {
    case "onClick":
    case "onClickCapture":
    case "onDoubleClick":
    case "onDoubleClickCapture":
    case "onMouseDown":
    case "onMouseDownCapture":
    case "onMouseMove":
    case "onMouseMoveCapture":
    case "onMouseUp":
    case "onMouseUpCapture":
    case "onMouseEnter":
      (r = !r.disabled) || (e = e.type, r = !(e === "button" || e === "input" || e === "select" || e === "textarea")), e = !r;
      break e;
    default:
      e = false;
  }
  if (e) return null;
  if (n && typeof n != "function") throw Error(E(231, t, typeof n));
  return n;
}
var Xs = false;
if (At) try {
  var lr = {};
  Object.defineProperty(lr, "passive", { get: function() {
    Xs = true;
  } }), window.addEventListener("test", lr, lr), window.removeEventListener("test", lr, lr);
} catch {
  Xs = false;
}
function Ld(e, t, n, r, l, s, o, u, a) {
  var p = Array.prototype.slice.call(arguments, 3);
  try {
    t.apply(n, p);
  } catch (g) {
    this.onError(g);
  }
}
var gr = false, kl = null, Nl = false, Gs = null, Od = { onError: function(e) {
  gr = true, kl = e;
} };
function Rd(e, t, n, r, l, s, o, u, a) {
  gr = false, kl = null, Ld.apply(Od, arguments);
}
function Pd(e, t, n, r, l, s, o, u, a) {
  if (Rd.apply(this, arguments), gr) {
    if (gr) {
      var p = kl;
      gr = false, kl = null;
    } else throw Error(E(198));
    Nl || (Nl = true, Gs = p);
  }
}
function jn(e) {
  var t = e, n = e;
  if (e.alternate) for (; t.return; ) t = t.return;
  else {
    e = t;
    do
      t = e, t.flags & 4098 && (n = t.return), e = t.return;
    while (e);
  }
  return t.tag === 3 ? n : null;
}
function uu(e) {
  if (e.tag === 13) {
    var t = e.memoizedState;
    if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
  }
  return null;
}
function Pi(e) {
  if (jn(e) !== e) throw Error(E(188));
}
function Id(e) {
  var t = e.alternate;
  if (!t) {
    if (t = jn(e), t === null) throw Error(E(188));
    return t !== e ? null : e;
  }
  for (var n = e, r = t; ; ) {
    var l = n.return;
    if (l === null) break;
    var s = l.alternate;
    if (s === null) {
      if (r = l.return, r !== null) {
        n = r;
        continue;
      }
      break;
    }
    if (l.child === s.child) {
      for (s = l.child; s; ) {
        if (s === n) return Pi(l), e;
        if (s === r) return Pi(l), t;
        s = s.sibling;
      }
      throw Error(E(188));
    }
    if (n.return !== r.return) n = l, r = s;
    else {
      for (var o = false, u = l.child; u; ) {
        if (u === n) {
          o = true, n = l, r = s;
          break;
        }
        if (u === r) {
          o = true, r = l, n = s;
          break;
        }
        u = u.sibling;
      }
      if (!o) {
        for (u = s.child; u; ) {
          if (u === n) {
            o = true, n = s, r = l;
            break;
          }
          if (u === r) {
            o = true, r = s, n = l;
            break;
          }
          u = u.sibling;
        }
        if (!o) throw Error(E(189));
      }
    }
    if (n.alternate !== r) throw Error(E(190));
  }
  if (n.tag !== 3) throw Error(E(188));
  return n.stateNode.current === n ? e : t;
}
function cu(e) {
  return e = Id(e), e !== null ? du(e) : null;
}
function du(e) {
  if (e.tag === 5 || e.tag === 6) return e;
  for (e = e.child; e !== null; ) {
    var t = du(e);
    if (t !== null) return t;
    e = e.sibling;
  }
  return null;
}
var fu = st.unstable_scheduleCallback, Ii = st.unstable_cancelCallback, zd = st.unstable_shouldYield, Md = st.unstable_requestPaint, _e = st.unstable_now, Ad = st.unstable_getCurrentPriorityLevel, Uo = st.unstable_ImmediatePriority, pu = st.unstable_UserBlockingPriority, _l = st.unstable_NormalPriority, Fd = st.unstable_LowPriority, mu = st.unstable_IdlePriority, Kl = null, Dt = null;
function Ud(e) {
  if (Dt && typeof Dt.onCommitFiberRoot == "function") try {
    Dt.onCommitFiberRoot(Kl, e, void 0, (e.current.flags & 128) === 128);
  } catch {
  }
}
var wt = Math.clz32 ? Math.clz32 : $d, Bd = Math.log, bd = Math.LN2;
function $d(e) {
  return e >>>= 0, e === 0 ? 32 : 31 - (Bd(e) / bd | 0) | 0;
}
var Jr = 64, qr = 4194304;
function pr(e) {
  switch (e & -e) {
    case 1:
      return 1;
    case 2:
      return 2;
    case 4:
      return 4;
    case 8:
      return 8;
    case 16:
      return 16;
    case 32:
      return 32;
    case 64:
    case 128:
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
      return e & 4194240;
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
    case 67108864:
      return e & 130023424;
    case 134217728:
      return 134217728;
    case 268435456:
      return 268435456;
    case 536870912:
      return 536870912;
    case 1073741824:
      return 1073741824;
    default:
      return e;
  }
}
function jl(e, t) {
  var n = e.pendingLanes;
  if (n === 0) return 0;
  var r = 0, l = e.suspendedLanes, s = e.pingedLanes, o = n & 268435455;
  if (o !== 0) {
    var u = o & ~l;
    u !== 0 ? r = pr(u) : (s &= o, s !== 0 && (r = pr(s)));
  } else o = n & ~l, o !== 0 ? r = pr(o) : s !== 0 && (r = pr(s));
  if (r === 0) return 0;
  if (t !== 0 && t !== r && !(t & l) && (l = r & -r, s = t & -t, l >= s || l === 16 && (s & 4194240) !== 0)) return t;
  if (r & 4 && (r |= n & 16), t = e.entangledLanes, t !== 0) for (e = e.entanglements, t &= r; 0 < t; ) n = 31 - wt(t), l = 1 << n, r |= e[n], t &= ~l;
  return r;
}
function Vd(e, t) {
  switch (e) {
    case 1:
    case 2:
    case 4:
      return t + 250;
    case 8:
    case 16:
    case 32:
    case 64:
    case 128:
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
      return t + 5e3;
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
    case 67108864:
      return -1;
    case 134217728:
    case 268435456:
    case 536870912:
    case 1073741824:
      return -1;
    default:
      return -1;
  }
}
function Wd(e, t) {
  for (var n = e.suspendedLanes, r = e.pingedLanes, l = e.expirationTimes, s = e.pendingLanes; 0 < s; ) {
    var o = 31 - wt(s), u = 1 << o, a = l[o];
    a === -1 ? (!(u & n) || u & r) && (l[o] = Vd(u, t)) : a <= t && (e.expiredLanes |= u), s &= ~u;
  }
}
function Js(e) {
  return e = e.pendingLanes & -1073741825, e !== 0 ? e : e & 1073741824 ? 1073741824 : 0;
}
function hu() {
  var e = Jr;
  return Jr <<= 1, !(Jr & 4194240) && (Jr = 64), e;
}
function ps(e) {
  for (var t = [], n = 0; 31 > n; n++) t.push(e);
  return t;
}
function $r(e, t, n) {
  e.pendingLanes |= t, t !== 536870912 && (e.suspendedLanes = 0, e.pingedLanes = 0), e = e.eventTimes, t = 31 - wt(t), e[t] = n;
}
function Hd(e, t) {
  var n = e.pendingLanes & ~t;
  e.pendingLanes = t, e.suspendedLanes = 0, e.pingedLanes = 0, e.expiredLanes &= t, e.mutableReadLanes &= t, e.entangledLanes &= t, t = e.entanglements;
  var r = e.eventTimes;
  for (e = e.expirationTimes; 0 < n; ) {
    var l = 31 - wt(n), s = 1 << l;
    t[l] = 0, r[l] = -1, e[l] = -1, n &= ~s;
  }
}
function Bo(e, t) {
  var n = e.entangledLanes |= t;
  for (e = e.entanglements; n; ) {
    var r = 31 - wt(n), l = 1 << r;
    l & t | e[r] & t && (e[r] |= t), n &= ~l;
  }
}
var re = 0;
function gu(e) {
  return e &= -e, 1 < e ? 4 < e ? e & 268435455 ? 16 : 536870912 : 4 : 1;
}
var vu, bo, yu, xu, wu, qs = false, Zr = [], Jt = null, qt = null, Zt = null, Cr = /* @__PURE__ */ new Map(), Tr = /* @__PURE__ */ new Map(), Kt = [], Qd = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
function zi(e, t) {
  switch (e) {
    case "focusin":
    case "focusout":
      Jt = null;
      break;
    case "dragenter":
    case "dragleave":
      qt = null;
      break;
    case "mouseover":
    case "mouseout":
      Zt = null;
      break;
    case "pointerover":
    case "pointerout":
      Cr.delete(t.pointerId);
      break;
    case "gotpointercapture":
    case "lostpointercapture":
      Tr.delete(t.pointerId);
  }
}
function sr(e, t, n, r, l, s) {
  return e === null || e.nativeEvent !== s ? (e = { blockedOn: t, domEventName: n, eventSystemFlags: r, nativeEvent: s, targetContainers: [l] }, t !== null && (t = Wr(t), t !== null && bo(t)), e) : (e.eventSystemFlags |= r, t = e.targetContainers, l !== null && t.indexOf(l) === -1 && t.push(l), e);
}
function Kd(e, t, n, r, l) {
  switch (t) {
    case "focusin":
      return Jt = sr(Jt, e, t, n, r, l), true;
    case "dragenter":
      return qt = sr(qt, e, t, n, r, l), true;
    case "mouseover":
      return Zt = sr(Zt, e, t, n, r, l), true;
    case "pointerover":
      var s = l.pointerId;
      return Cr.set(s, sr(Cr.get(s) || null, e, t, n, r, l)), true;
    case "gotpointercapture":
      return s = l.pointerId, Tr.set(s, sr(Tr.get(s) || null, e, t, n, r, l)), true;
  }
  return false;
}
function Su(e) {
  var t = hn(e.target);
  if (t !== null) {
    var n = jn(t);
    if (n !== null) {
      if (t = n.tag, t === 13) {
        if (t = uu(n), t !== null) {
          e.blockedOn = t, wu(e.priority, function() {
            yu(n);
          });
          return;
        }
      } else if (t === 3 && n.stateNode.current.memoizedState.isDehydrated) {
        e.blockedOn = n.tag === 3 ? n.stateNode.containerInfo : null;
        return;
      }
    }
  }
  e.blockedOn = null;
}
function fl(e) {
  if (e.blockedOn !== null) return false;
  for (var t = e.targetContainers; 0 < t.length; ) {
    var n = Zs(e.domEventName, e.eventSystemFlags, t[0], e.nativeEvent);
    if (n === null) {
      n = e.nativeEvent;
      var r = new n.constructor(n.type, n);
      Ks = r, n.target.dispatchEvent(r), Ks = null;
    } else return t = Wr(n), t !== null && bo(t), e.blockedOn = n, false;
    t.shift();
  }
  return true;
}
function Mi(e, t, n) {
  fl(e) && n.delete(t);
}
function Yd() {
  qs = false, Jt !== null && fl(Jt) && (Jt = null), qt !== null && fl(qt) && (qt = null), Zt !== null && fl(Zt) && (Zt = null), Cr.forEach(Mi), Tr.forEach(Mi);
}
function or(e, t) {
  e.blockedOn === t && (e.blockedOn = null, qs || (qs = true, st.unstable_scheduleCallback(st.unstable_NormalPriority, Yd)));
}
function Dr(e) {
  function t(l) {
    return or(l, e);
  }
  if (0 < Zr.length) {
    or(Zr[0], e);
    for (var n = 1; n < Zr.length; n++) {
      var r = Zr[n];
      r.blockedOn === e && (r.blockedOn = null);
    }
  }
  for (Jt !== null && or(Jt, e), qt !== null && or(qt, e), Zt !== null && or(Zt, e), Cr.forEach(t), Tr.forEach(t), n = 0; n < Kt.length; n++) r = Kt[n], r.blockedOn === e && (r.blockedOn = null);
  for (; 0 < Kt.length && (n = Kt[0], n.blockedOn === null); ) Su(n), n.blockedOn === null && Kt.shift();
}
var Vn = bt.ReactCurrentBatchConfig, Cl = true;
function Xd(e, t, n, r) {
  var l = re, s = Vn.transition;
  Vn.transition = null;
  try {
    re = 1, $o(e, t, n, r);
  } finally {
    re = l, Vn.transition = s;
  }
}
function Gd(e, t, n, r) {
  var l = re, s = Vn.transition;
  Vn.transition = null;
  try {
    re = 4, $o(e, t, n, r);
  } finally {
    re = l, Vn.transition = s;
  }
}
function $o(e, t, n, r) {
  if (Cl) {
    var l = Zs(e, t, n, r);
    if (l === null) ks(e, t, r, Tl, n), zi(e, r);
    else if (Kd(l, e, t, n, r)) r.stopPropagation();
    else if (zi(e, r), t & 4 && -1 < Qd.indexOf(e)) {
      for (; l !== null; ) {
        var s = Wr(l);
        if (s !== null && vu(s), s = Zs(e, t, n, r), s === null && ks(e, t, r, Tl, n), s === l) break;
        l = s;
      }
      l !== null && r.stopPropagation();
    } else ks(e, t, r, null, n);
  }
}
var Tl = null;
function Zs(e, t, n, r) {
  if (Tl = null, e = Fo(r), e = hn(e), e !== null) if (t = jn(e), t === null) e = null;
  else if (n = t.tag, n === 13) {
    if (e = uu(t), e !== null) return e;
    e = null;
  } else if (n === 3) {
    if (t.stateNode.current.memoizedState.isDehydrated) return t.tag === 3 ? t.stateNode.containerInfo : null;
    e = null;
  } else t !== e && (e = null);
  return Tl = e, null;
}
function Eu(e) {
  switch (e) {
    case "cancel":
    case "click":
    case "close":
    case "contextmenu":
    case "copy":
    case "cut":
    case "auxclick":
    case "dblclick":
    case "dragend":
    case "dragstart":
    case "drop":
    case "focusin":
    case "focusout":
    case "input":
    case "invalid":
    case "keydown":
    case "keypress":
    case "keyup":
    case "mousedown":
    case "mouseup":
    case "paste":
    case "pause":
    case "play":
    case "pointercancel":
    case "pointerdown":
    case "pointerup":
    case "ratechange":
    case "reset":
    case "resize":
    case "seeked":
    case "submit":
    case "touchcancel":
    case "touchend":
    case "touchstart":
    case "volumechange":
    case "change":
    case "selectionchange":
    case "textInput":
    case "compositionstart":
    case "compositionend":
    case "compositionupdate":
    case "beforeblur":
    case "afterblur":
    case "beforeinput":
    case "blur":
    case "fullscreenchange":
    case "focus":
    case "hashchange":
    case "popstate":
    case "select":
    case "selectstart":
      return 1;
    case "drag":
    case "dragenter":
    case "dragexit":
    case "dragleave":
    case "dragover":
    case "mousemove":
    case "mouseout":
    case "mouseover":
    case "pointermove":
    case "pointerout":
    case "pointerover":
    case "scroll":
    case "toggle":
    case "touchmove":
    case "wheel":
    case "mouseenter":
    case "mouseleave":
    case "pointerenter":
    case "pointerleave":
      return 4;
    case "message":
      switch (Ad()) {
        case Uo:
          return 1;
        case pu:
          return 4;
        case _l:
        case Fd:
          return 16;
        case mu:
          return 536870912;
        default:
          return 16;
      }
    default:
      return 16;
  }
}
var Xt = null, Vo = null, pl = null;
function ku() {
  if (pl) return pl;
  var e, t = Vo, n = t.length, r, l = "value" in Xt ? Xt.value : Xt.textContent, s = l.length;
  for (e = 0; e < n && t[e] === l[e]; e++) ;
  var o = n - e;
  for (r = 1; r <= o && t[n - r] === l[s - r]; r++) ;
  return pl = l.slice(e, 1 < r ? 1 - r : void 0);
}
function ml(e) {
  var t = e.keyCode;
  return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
}
function el() {
  return true;
}
function Ai() {
  return false;
}
function it(e) {
  function t(n, r, l, s, o) {
    this._reactName = n, this._targetInst = l, this.type = r, this.nativeEvent = s, this.target = o, this.currentTarget = null;
    for (var u in e) e.hasOwnProperty(u) && (n = e[u], this[u] = n ? n(s) : s[u]);
    return this.isDefaultPrevented = (s.defaultPrevented != null ? s.defaultPrevented : s.returnValue === false) ? el : Ai, this.isPropagationStopped = Ai, this;
  }
  return we(t.prototype, { preventDefault: function() {
    this.defaultPrevented = true;
    var n = this.nativeEvent;
    n && (n.preventDefault ? n.preventDefault() : typeof n.returnValue != "unknown" && (n.returnValue = false), this.isDefaultPrevented = el);
  }, stopPropagation: function() {
    var n = this.nativeEvent;
    n && (n.stopPropagation ? n.stopPropagation() : typeof n.cancelBubble != "unknown" && (n.cancelBubble = true), this.isPropagationStopped = el);
  }, persist: function() {
  }, isPersistent: el }), t;
}
var er = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function(e) {
  return e.timeStamp || Date.now();
}, defaultPrevented: 0, isTrusted: 0 }, Wo = it(er), Vr = we({}, er, { view: 0, detail: 0 }), Jd = it(Vr), ms, hs, ir, Yl = we({}, Vr, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: Ho, button: 0, buttons: 0, relatedTarget: function(e) {
  return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
}, movementX: function(e) {
  return "movementX" in e ? e.movementX : (e !== ir && (ir && e.type === "mousemove" ? (ms = e.screenX - ir.screenX, hs = e.screenY - ir.screenY) : hs = ms = 0, ir = e), ms);
}, movementY: function(e) {
  return "movementY" in e ? e.movementY : hs;
} }), Fi = it(Yl), qd = we({}, Yl, { dataTransfer: 0 }), Zd = it(qd), ef = we({}, Vr, { relatedTarget: 0 }), gs = it(ef), tf = we({}, er, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }), nf = it(tf), rf = we({}, er, { clipboardData: function(e) {
  return "clipboardData" in e ? e.clipboardData : window.clipboardData;
} }), lf = it(rf), sf = we({}, er, { data: 0 }), Ui = it(sf), of = { Esc: "Escape", Spacebar: " ", Left: "ArrowLeft", Up: "ArrowUp", Right: "ArrowRight", Down: "ArrowDown", Del: "Delete", Win: "OS", Menu: "ContextMenu", Apps: "ContextMenu", Scroll: "ScrollLock", MozPrintableKey: "Unidentified" }, af = { 8: "Backspace", 9: "Tab", 12: "Clear", 13: "Enter", 16: "Shift", 17: "Control", 18: "Alt", 19: "Pause", 20: "CapsLock", 27: "Escape", 32: " ", 33: "PageUp", 34: "PageDown", 35: "End", 36: "Home", 37: "ArrowLeft", 38: "ArrowUp", 39: "ArrowRight", 40: "ArrowDown", 45: "Insert", 46: "Delete", 112: "F1", 113: "F2", 114: "F3", 115: "F4", 116: "F5", 117: "F6", 118: "F7", 119: "F8", 120: "F9", 121: "F10", 122: "F11", 123: "F12", 144: "NumLock", 145: "ScrollLock", 224: "Meta" }, uf = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
function cf(e) {
  var t = this.nativeEvent;
  return t.getModifierState ? t.getModifierState(e) : (e = uf[e]) ? !!t[e] : false;
}
function Ho() {
  return cf;
}
var df = we({}, Vr, { key: function(e) {
  if (e.key) {
    var t = of[e.key] || e.key;
    if (t !== "Unidentified") return t;
  }
  return e.type === "keypress" ? (e = ml(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? af[e.keyCode] || "Unidentified" : "";
}, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: Ho, charCode: function(e) {
  return e.type === "keypress" ? ml(e) : 0;
}, keyCode: function(e) {
  return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
}, which: function(e) {
  return e.type === "keypress" ? ml(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
} }), ff = it(df), pf = we({}, Yl, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }), Bi = it(pf), mf = we({}, Vr, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: Ho }), hf = it(mf), gf = we({}, er, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }), vf = it(gf), yf = we({}, Yl, { deltaX: function(e) {
  return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
}, deltaY: function(e) {
  return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
}, deltaZ: 0, deltaMode: 0 }), xf = it(yf), wf = [9, 13, 27, 32], Qo = At && "CompositionEvent" in window, vr = null;
At && "documentMode" in document && (vr = document.documentMode);
var Sf = At && "TextEvent" in window && !vr, Nu = At && (!Qo || vr && 8 < vr && 11 >= vr), bi = " ", $i = false;
function _u(e, t) {
  switch (e) {
    case "keyup":
      return wf.indexOf(t.keyCode) !== -1;
    case "keydown":
      return t.keyCode !== 229;
    case "keypress":
    case "mousedown":
    case "focusout":
      return true;
    default:
      return false;
  }
}
function ju(e) {
  return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
}
var Ln = false;
function Ef(e, t) {
  switch (e) {
    case "compositionend":
      return ju(t);
    case "keypress":
      return t.which !== 32 ? null : ($i = true, bi);
    case "textInput":
      return e = t.data, e === bi && $i ? null : e;
    default:
      return null;
  }
}
function kf(e, t) {
  if (Ln) return e === "compositionend" || !Qo && _u(e, t) ? (e = ku(), pl = Vo = Xt = null, Ln = false, e) : null;
  switch (e) {
    case "paste":
      return null;
    case "keypress":
      if (!(t.ctrlKey || t.altKey || t.metaKey) || t.ctrlKey && t.altKey) {
        if (t.char && 1 < t.char.length) return t.char;
        if (t.which) return String.fromCharCode(t.which);
      }
      return null;
    case "compositionend":
      return Nu && t.locale !== "ko" ? null : t.data;
    default:
      return null;
  }
}
var Nf = { color: true, date: true, datetime: true, "datetime-local": true, email: true, month: true, number: true, password: true, range: true, search: true, tel: true, text: true, time: true, url: true, week: true };
function Vi(e) {
  var t = e && e.nodeName && e.nodeName.toLowerCase();
  return t === "input" ? !!Nf[e.type] : t === "textarea";
}
function Cu(e, t, n, r) {
  lu(r), t = Dl(t, "onChange"), 0 < t.length && (n = new Wo("onChange", "change", null, n, r), e.push({ event: n, listeners: t }));
}
var yr = null, Lr = null;
function _f(e) {
  Fu(e, 0);
}
function Xl(e) {
  var t = Pn(e);
  if (Ja(t)) return e;
}
function jf(e, t) {
  if (e === "change") return t;
}
var Tu = false;
if (At) {
  var vs;
  if (At) {
    var ys = "oninput" in document;
    if (!ys) {
      var Wi = document.createElement("div");
      Wi.setAttribute("oninput", "return;"), ys = typeof Wi.oninput == "function";
    }
    vs = ys;
  } else vs = false;
  Tu = vs && (!document.documentMode || 9 < document.documentMode);
}
function Hi() {
  yr && (yr.detachEvent("onpropertychange", Du), Lr = yr = null);
}
function Du(e) {
  if (e.propertyName === "value" && Xl(Lr)) {
    var t = [];
    Cu(t, Lr, e, Fo(e)), au(_f, t);
  }
}
function Cf(e, t, n) {
  e === "focusin" ? (Hi(), yr = t, Lr = n, yr.attachEvent("onpropertychange", Du)) : e === "focusout" && Hi();
}
function Tf(e) {
  if (e === "selectionchange" || e === "keyup" || e === "keydown") return Xl(Lr);
}
function Df(e, t) {
  if (e === "click") return Xl(t);
}
function Lf(e, t) {
  if (e === "input" || e === "change") return Xl(t);
}
function Of(e, t) {
  return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
}
var Et = typeof Object.is == "function" ? Object.is : Of;
function Or(e, t) {
  if (Et(e, t)) return true;
  if (typeof e != "object" || e === null || typeof t != "object" || t === null) return false;
  var n = Object.keys(e), r = Object.keys(t);
  if (n.length !== r.length) return false;
  for (r = 0; r < n.length; r++) {
    var l = n[r];
    if (!zs.call(t, l) || !Et(e[l], t[l])) return false;
  }
  return true;
}
function Qi(e) {
  for (; e && e.firstChild; ) e = e.firstChild;
  return e;
}
function Ki(e, t) {
  var n = Qi(e);
  e = 0;
  for (var r; n; ) {
    if (n.nodeType === 3) {
      if (r = e + n.textContent.length, e <= t && r >= t) return { node: n, offset: t - e };
      e = r;
    }
    e: {
      for (; n; ) {
        if (n.nextSibling) {
          n = n.nextSibling;
          break e;
        }
        n = n.parentNode;
      }
      n = void 0;
    }
    n = Qi(n);
  }
}
function Lu(e, t) {
  return e && t ? e === t ? true : e && e.nodeType === 3 ? false : t && t.nodeType === 3 ? Lu(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : false : false;
}
function Ou() {
  for (var e = window, t = El(); t instanceof e.HTMLIFrameElement; ) {
    try {
      var n = typeof t.contentWindow.location.href == "string";
    } catch {
      n = false;
    }
    if (n) e = t.contentWindow;
    else break;
    t = El(e.document);
  }
  return t;
}
function Ko(e) {
  var t = e && e.nodeName && e.nodeName.toLowerCase();
  return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
}
function Rf(e) {
  var t = Ou(), n = e.focusedElem, r = e.selectionRange;
  if (t !== n && n && n.ownerDocument && Lu(n.ownerDocument.documentElement, n)) {
    if (r !== null && Ko(n)) {
      if (t = r.start, e = r.end, e === void 0 && (e = t), "selectionStart" in n) n.selectionStart = t, n.selectionEnd = Math.min(e, n.value.length);
      else if (e = (t = n.ownerDocument || document) && t.defaultView || window, e.getSelection) {
        e = e.getSelection();
        var l = n.textContent.length, s = Math.min(r.start, l);
        r = r.end === void 0 ? s : Math.min(r.end, l), !e.extend && s > r && (l = r, r = s, s = l), l = Ki(n, s);
        var o = Ki(n, r);
        l && o && (e.rangeCount !== 1 || e.anchorNode !== l.node || e.anchorOffset !== l.offset || e.focusNode !== o.node || e.focusOffset !== o.offset) && (t = t.createRange(), t.setStart(l.node, l.offset), e.removeAllRanges(), s > r ? (e.addRange(t), e.extend(o.node, o.offset)) : (t.setEnd(o.node, o.offset), e.addRange(t)));
      }
    }
    for (t = [], e = n; e = e.parentNode; ) e.nodeType === 1 && t.push({ element: e, left: e.scrollLeft, top: e.scrollTop });
    for (typeof n.focus == "function" && n.focus(), n = 0; n < t.length; n++) e = t[n], e.element.scrollLeft = e.left, e.element.scrollTop = e.top;
  }
}
var Pf = At && "documentMode" in document && 11 >= document.documentMode, On = null, eo = null, xr = null, to = false;
function Yi(e, t, n) {
  var r = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
  to || On == null || On !== El(r) || (r = On, "selectionStart" in r && Ko(r) ? r = { start: r.selectionStart, end: r.selectionEnd } : (r = (r.ownerDocument && r.ownerDocument.defaultView || window).getSelection(), r = { anchorNode: r.anchorNode, anchorOffset: r.anchorOffset, focusNode: r.focusNode, focusOffset: r.focusOffset }), xr && Or(xr, r) || (xr = r, r = Dl(eo, "onSelect"), 0 < r.length && (t = new Wo("onSelect", "select", null, t, n), e.push({ event: t, listeners: r }), t.target = On)));
}
function tl(e, t) {
  var n = {};
  return n[e.toLowerCase()] = t.toLowerCase(), n["Webkit" + e] = "webkit" + t, n["Moz" + e] = "moz" + t, n;
}
var Rn = { animationend: tl("Animation", "AnimationEnd"), animationiteration: tl("Animation", "AnimationIteration"), animationstart: tl("Animation", "AnimationStart"), transitionend: tl("Transition", "TransitionEnd") }, xs = {}, Ru = {};
At && (Ru = document.createElement("div").style, "AnimationEvent" in window || (delete Rn.animationend.animation, delete Rn.animationiteration.animation, delete Rn.animationstart.animation), "TransitionEvent" in window || delete Rn.transitionend.transition);
function Gl(e) {
  if (xs[e]) return xs[e];
  if (!Rn[e]) return e;
  var t = Rn[e], n;
  for (n in t) if (t.hasOwnProperty(n) && n in Ru) return xs[e] = t[n];
  return e;
}
var Pu = Gl("animationend"), Iu = Gl("animationiteration"), zu = Gl("animationstart"), Mu = Gl("transitionend"), Au = /* @__PURE__ */ new Map(), Xi = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
function an(e, t) {
  Au.set(e, t), _n(t, [e]);
}
for (var ws = 0; ws < Xi.length; ws++) {
  var Ss = Xi[ws], If = Ss.toLowerCase(), zf = Ss[0].toUpperCase() + Ss.slice(1);
  an(If, "on" + zf);
}
an(Pu, "onAnimationEnd");
an(Iu, "onAnimationIteration");
an(zu, "onAnimationStart");
an("dblclick", "onDoubleClick");
an("focusin", "onFocus");
an("focusout", "onBlur");
an(Mu, "onTransitionEnd");
Qn("onMouseEnter", ["mouseout", "mouseover"]);
Qn("onMouseLeave", ["mouseout", "mouseover"]);
Qn("onPointerEnter", ["pointerout", "pointerover"]);
Qn("onPointerLeave", ["pointerout", "pointerover"]);
_n("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" "));
_n("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));
_n("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]);
_n("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" "));
_n("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" "));
_n("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
var mr = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), Mf = new Set("cancel close invalid load scroll toggle".split(" ").concat(mr));
function Gi(e, t, n) {
  var r = e.type || "unknown-event";
  e.currentTarget = n, Pd(r, t, void 0, e), e.currentTarget = null;
}
function Fu(e, t) {
  t = (t & 4) !== 0;
  for (var n = 0; n < e.length; n++) {
    var r = e[n], l = r.event;
    r = r.listeners;
    e: {
      var s = void 0;
      if (t) for (var o = r.length - 1; 0 <= o; o--) {
        var u = r[o], a = u.instance, p = u.currentTarget;
        if (u = u.listener, a !== s && l.isPropagationStopped()) break e;
        Gi(l, u, p), s = a;
      }
      else for (o = 0; o < r.length; o++) {
        if (u = r[o], a = u.instance, p = u.currentTarget, u = u.listener, a !== s && l.isPropagationStopped()) break e;
        Gi(l, u, p), s = a;
      }
    }
  }
  if (Nl) throw e = Gs, Nl = false, Gs = null, e;
}
function me(e, t) {
  var n = t[oo];
  n === void 0 && (n = t[oo] = /* @__PURE__ */ new Set());
  var r = e + "__bubble";
  n.has(r) || (Uu(t, e, 2, false), n.add(r));
}
function Es(e, t, n) {
  var r = 0;
  t && (r |= 4), Uu(n, e, r, t);
}
var nl = "_reactListening" + Math.random().toString(36).slice(2);
function Rr(e) {
  if (!e[nl]) {
    e[nl] = true, Qa.forEach(function(n) {
      n !== "selectionchange" && (Mf.has(n) || Es(n, false, e), Es(n, true, e));
    });
    var t = e.nodeType === 9 ? e : e.ownerDocument;
    t === null || t[nl] || (t[nl] = true, Es("selectionchange", false, t));
  }
}
function Uu(e, t, n, r) {
  switch (Eu(t)) {
    case 1:
      var l = Xd;
      break;
    case 4:
      l = Gd;
      break;
    default:
      l = $o;
  }
  n = l.bind(null, t, n, e), l = void 0, !Xs || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (l = true), r ? l !== void 0 ? e.addEventListener(t, n, { capture: true, passive: l }) : e.addEventListener(t, n, true) : l !== void 0 ? e.addEventListener(t, n, { passive: l }) : e.addEventListener(t, n, false);
}
function ks(e, t, n, r, l) {
  var s = r;
  if (!(t & 1) && !(t & 2) && r !== null) e: for (; ; ) {
    if (r === null) return;
    var o = r.tag;
    if (o === 3 || o === 4) {
      var u = r.stateNode.containerInfo;
      if (u === l || u.nodeType === 8 && u.parentNode === l) break;
      if (o === 4) for (o = r.return; o !== null; ) {
        var a = o.tag;
        if ((a === 3 || a === 4) && (a = o.stateNode.containerInfo, a === l || a.nodeType === 8 && a.parentNode === l)) return;
        o = o.return;
      }
      for (; u !== null; ) {
        if (o = hn(u), o === null) return;
        if (a = o.tag, a === 5 || a === 6) {
          r = s = o;
          continue e;
        }
        u = u.parentNode;
      }
    }
    r = r.return;
  }
  au(function() {
    var p = s, g = Fo(n), v = [];
    e: {
      var y = Au.get(e);
      if (y !== void 0) {
        var C = Wo, T = e;
        switch (e) {
          case "keypress":
            if (ml(n) === 0) break e;
          case "keydown":
          case "keyup":
            C = ff;
            break;
          case "focusin":
            T = "focus", C = gs;
            break;
          case "focusout":
            T = "blur", C = gs;
            break;
          case "beforeblur":
          case "afterblur":
            C = gs;
            break;
          case "click":
            if (n.button === 2) break e;
          case "auxclick":
          case "dblclick":
          case "mousedown":
          case "mousemove":
          case "mouseup":
          case "mouseout":
          case "mouseover":
          case "contextmenu":
            C = Fi;
            break;
          case "drag":
          case "dragend":
          case "dragenter":
          case "dragexit":
          case "dragleave":
          case "dragover":
          case "dragstart":
          case "drop":
            C = Zd;
            break;
          case "touchcancel":
          case "touchend":
          case "touchmove":
          case "touchstart":
            C = hf;
            break;
          case Pu:
          case Iu:
          case zu:
            C = nf;
            break;
          case Mu:
            C = vf;
            break;
          case "scroll":
            C = Jd;
            break;
          case "wheel":
            C = xf;
            break;
          case "copy":
          case "cut":
          case "paste":
            C = lf;
            break;
          case "gotpointercapture":
          case "lostpointercapture":
          case "pointercancel":
          case "pointerdown":
          case "pointermove":
          case "pointerout":
          case "pointerover":
          case "pointerup":
            C = Bi;
        }
        var R = (t & 4) !== 0, J = !R && e === "scroll", m = R ? y !== null ? y + "Capture" : null : y;
        R = [];
        for (var d = p, h; d !== null; ) {
          h = d;
          var S = h.stateNode;
          if (h.tag === 5 && S !== null && (h = S, m !== null && (S = jr(d, m), S != null && R.push(Pr(d, S, h)))), J) break;
          d = d.return;
        }
        0 < R.length && (y = new C(y, T, null, n, g), v.push({ event: y, listeners: R }));
      }
    }
    if (!(t & 7)) {
      e: {
        if (y = e === "mouseover" || e === "pointerover", C = e === "mouseout" || e === "pointerout", y && n !== Ks && (T = n.relatedTarget || n.fromElement) && (hn(T) || T[Ft])) break e;
        if ((C || y) && (y = g.window === g ? g : (y = g.ownerDocument) ? y.defaultView || y.parentWindow : window, C ? (T = n.relatedTarget || n.toElement, C = p, T = T ? hn(T) : null, T !== null && (J = jn(T), T !== J || T.tag !== 5 && T.tag !== 6) && (T = null)) : (C = null, T = p), C !== T)) {
          if (R = Fi, S = "onMouseLeave", m = "onMouseEnter", d = "mouse", (e === "pointerout" || e === "pointerover") && (R = Bi, S = "onPointerLeave", m = "onPointerEnter", d = "pointer"), J = C == null ? y : Pn(C), h = T == null ? y : Pn(T), y = new R(S, d + "leave", C, n, g), y.target = J, y.relatedTarget = h, S = null, hn(g) === p && (R = new R(m, d + "enter", T, n, g), R.target = h, R.relatedTarget = J, S = R), J = S, C && T) t: {
            for (R = C, m = T, d = 0, h = R; h; h = Cn(h)) d++;
            for (h = 0, S = m; S; S = Cn(S)) h++;
            for (; 0 < d - h; ) R = Cn(R), d--;
            for (; 0 < h - d; ) m = Cn(m), h--;
            for (; d--; ) {
              if (R === m || m !== null && R === m.alternate) break t;
              R = Cn(R), m = Cn(m);
            }
            R = null;
          }
          else R = null;
          C !== null && Ji(v, y, C, R, false), T !== null && J !== null && Ji(v, J, T, R, true);
        }
      }
      e: {
        if (y = p ? Pn(p) : window, C = y.nodeName && y.nodeName.toLowerCase(), C === "select" || C === "input" && y.type === "file") var L = jf;
        else if (Vi(y)) if (Tu) L = Lf;
        else {
          L = Tf;
          var O = Cf;
        }
        else (C = y.nodeName) && C.toLowerCase() === "input" && (y.type === "checkbox" || y.type === "radio") && (L = Df);
        if (L && (L = L(e, p))) {
          Cu(v, L, n, g);
          break e;
        }
        O && O(e, y, p), e === "focusout" && (O = y._wrapperState) && O.controlled && y.type === "number" && $s(y, "number", y.value);
      }
      switch (O = p ? Pn(p) : window, e) {
        case "focusin":
          (Vi(O) || O.contentEditable === "true") && (On = O, eo = p, xr = null);
          break;
        case "focusout":
          xr = eo = On = null;
          break;
        case "mousedown":
          to = true;
          break;
        case "contextmenu":
        case "mouseup":
        case "dragend":
          to = false, Yi(v, n, g);
          break;
        case "selectionchange":
          if (Pf) break;
        case "keydown":
        case "keyup":
          Yi(v, n, g);
      }
      var N;
      if (Qo) e: {
        switch (e) {
          case "compositionstart":
            var c = "onCompositionStart";
            break e;
          case "compositionend":
            c = "onCompositionEnd";
            break e;
          case "compositionupdate":
            c = "onCompositionUpdate";
            break e;
        }
        c = void 0;
      }
      else Ln ? _u(e, n) && (c = "onCompositionEnd") : e === "keydown" && n.keyCode === 229 && (c = "onCompositionStart");
      c && (Nu && n.locale !== "ko" && (Ln || c !== "onCompositionStart" ? c === "onCompositionEnd" && Ln && (N = ku()) : (Xt = g, Vo = "value" in Xt ? Xt.value : Xt.textContent, Ln = true)), O = Dl(p, c), 0 < O.length && (c = new Ui(c, e, null, n, g), v.push({ event: c, listeners: O }), N ? c.data = N : (N = ju(n), N !== null && (c.data = N)))), (N = Sf ? Ef(e, n) : kf(e, n)) && (p = Dl(p, "onBeforeInput"), 0 < p.length && (g = new Ui("onBeforeInput", "beforeinput", null, n, g), v.push({ event: g, listeners: p }), g.data = N));
    }
    Fu(v, t);
  });
}
function Pr(e, t, n) {
  return { instance: e, listener: t, currentTarget: n };
}
function Dl(e, t) {
  for (var n = t + "Capture", r = []; e !== null; ) {
    var l = e, s = l.stateNode;
    l.tag === 5 && s !== null && (l = s, s = jr(e, n), s != null && r.unshift(Pr(e, s, l)), s = jr(e, t), s != null && r.push(Pr(e, s, l))), e = e.return;
  }
  return r;
}
function Cn(e) {
  if (e === null) return null;
  do
    e = e.return;
  while (e && e.tag !== 5);
  return e || null;
}
function Ji(e, t, n, r, l) {
  for (var s = t._reactName, o = []; n !== null && n !== r; ) {
    var u = n, a = u.alternate, p = u.stateNode;
    if (a !== null && a === r) break;
    u.tag === 5 && p !== null && (u = p, l ? (a = jr(n, s), a != null && o.unshift(Pr(n, a, u))) : l || (a = jr(n, s), a != null && o.push(Pr(n, a, u)))), n = n.return;
  }
  o.length !== 0 && e.push({ event: t, listeners: o });
}
var Af = /\r\n?/g, Ff = /\u0000|\uFFFD/g;
function qi(e) {
  return (typeof e == "string" ? e : "" + e).replace(Af, `
`).replace(Ff, "");
}
function rl(e, t, n) {
  if (t = qi(t), qi(e) !== t && n) throw Error(E(425));
}
function Ll() {
}
var no = null, ro = null;
function lo(e, t) {
  return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
}
var so = typeof setTimeout == "function" ? setTimeout : void 0, Uf = typeof clearTimeout == "function" ? clearTimeout : void 0, Zi = typeof Promise == "function" ? Promise : void 0, Bf = typeof queueMicrotask == "function" ? queueMicrotask : typeof Zi < "u" ? function(e) {
  return Zi.resolve(null).then(e).catch(bf);
} : so;
function bf(e) {
  setTimeout(function() {
    throw e;
  });
}
function Ns(e, t) {
  var n = t, r = 0;
  do {
    var l = n.nextSibling;
    if (e.removeChild(n), l && l.nodeType === 8) if (n = l.data, n === "/$") {
      if (r === 0) {
        e.removeChild(l), Dr(t);
        return;
      }
      r--;
    } else n !== "$" && n !== "$?" && n !== "$!" || r++;
    n = l;
  } while (n);
  Dr(t);
}
function en(e) {
  for (; e != null; e = e.nextSibling) {
    var t = e.nodeType;
    if (t === 1 || t === 3) break;
    if (t === 8) {
      if (t = e.data, t === "$" || t === "$!" || t === "$?") break;
      if (t === "/$") return null;
    }
  }
  return e;
}
function ea(e) {
  e = e.previousSibling;
  for (var t = 0; e; ) {
    if (e.nodeType === 8) {
      var n = e.data;
      if (n === "$" || n === "$!" || n === "$?") {
        if (t === 0) return e;
        t--;
      } else n === "/$" && t++;
    }
    e = e.previousSibling;
  }
  return null;
}
var tr = Math.random().toString(36).slice(2), Tt = "__reactFiber$" + tr, Ir = "__reactProps$" + tr, Ft = "__reactContainer$" + tr, oo = "__reactEvents$" + tr, $f = "__reactListeners$" + tr, Vf = "__reactHandles$" + tr;
function hn(e) {
  var t = e[Tt];
  if (t) return t;
  for (var n = e.parentNode; n; ) {
    if (t = n[Ft] || n[Tt]) {
      if (n = t.alternate, t.child !== null || n !== null && n.child !== null) for (e = ea(e); e !== null; ) {
        if (n = e[Tt]) return n;
        e = ea(e);
      }
      return t;
    }
    e = n, n = e.parentNode;
  }
  return null;
}
function Wr(e) {
  return e = e[Tt] || e[Ft], !e || e.tag !== 5 && e.tag !== 6 && e.tag !== 13 && e.tag !== 3 ? null : e;
}
function Pn(e) {
  if (e.tag === 5 || e.tag === 6) return e.stateNode;
  throw Error(E(33));
}
function Jl(e) {
  return e[Ir] || null;
}
var io = [], In = -1;
function un(e) {
  return { current: e };
}
function he(e) {
  0 > In || (e.current = io[In], io[In] = null, In--);
}
function ce(e, t) {
  In++, io[In] = e.current, e.current = t;
}
var on = {}, be = un(on), qe = un(false), wn = on;
function Kn(e, t) {
  var n = e.type.contextTypes;
  if (!n) return on;
  var r = e.stateNode;
  if (r && r.__reactInternalMemoizedUnmaskedChildContext === t) return r.__reactInternalMemoizedMaskedChildContext;
  var l = {}, s;
  for (s in n) l[s] = t[s];
  return r && (e = e.stateNode, e.__reactInternalMemoizedUnmaskedChildContext = t, e.__reactInternalMemoizedMaskedChildContext = l), l;
}
function Ze(e) {
  return e = e.childContextTypes, e != null;
}
function Ol() {
  he(qe), he(be);
}
function ta(e, t, n) {
  if (be.current !== on) throw Error(E(168));
  ce(be, t), ce(qe, n);
}
function Bu(e, t, n) {
  var r = e.stateNode;
  if (t = t.childContextTypes, typeof r.getChildContext != "function") return n;
  r = r.getChildContext();
  for (var l in r) if (!(l in t)) throw Error(E(108, jd(e) || "Unknown", l));
  return we({}, n, r);
}
function Rl(e) {
  return e = (e = e.stateNode) && e.__reactInternalMemoizedMergedChildContext || on, wn = be.current, ce(be, e), ce(qe, qe.current), true;
}
function na(e, t, n) {
  var r = e.stateNode;
  if (!r) throw Error(E(169));
  n ? (e = Bu(e, t, wn), r.__reactInternalMemoizedMergedChildContext = e, he(qe), he(be), ce(be, e)) : he(qe), ce(qe, n);
}
var Pt = null, ql = false, _s = false;
function bu(e) {
  Pt === null ? Pt = [e] : Pt.push(e);
}
function Wf(e) {
  ql = true, bu(e);
}
function cn() {
  if (!_s && Pt !== null) {
    _s = true;
    var e = 0, t = re;
    try {
      var n = Pt;
      for (re = 1; e < n.length; e++) {
        var r = n[e];
        do
          r = r(true);
        while (r !== null);
      }
      Pt = null, ql = false;
    } catch (l) {
      throw Pt !== null && (Pt = Pt.slice(e + 1)), fu(Uo, cn), l;
    } finally {
      re = t, _s = false;
    }
  }
  return null;
}
var zn = [], Mn = 0, Pl = null, Il = 0, ut = [], ct = 0, Sn = null, It = 1, zt = "";
function pn(e, t) {
  zn[Mn++] = Il, zn[Mn++] = Pl, Pl = e, Il = t;
}
function $u(e, t, n) {
  ut[ct++] = It, ut[ct++] = zt, ut[ct++] = Sn, Sn = e;
  var r = It;
  e = zt;
  var l = 32 - wt(r) - 1;
  r &= ~(1 << l), n += 1;
  var s = 32 - wt(t) + l;
  if (30 < s) {
    var o = l - l % 5;
    s = (r & (1 << o) - 1).toString(32), r >>= o, l -= o, It = 1 << 32 - wt(t) + l | n << l | r, zt = s + e;
  } else It = 1 << s | n << l | r, zt = e;
}
function Yo(e) {
  e.return !== null && (pn(e, 1), $u(e, 1, 0));
}
function Xo(e) {
  for (; e === Pl; ) Pl = zn[--Mn], zn[Mn] = null, Il = zn[--Mn], zn[Mn] = null;
  for (; e === Sn; ) Sn = ut[--ct], ut[ct] = null, zt = ut[--ct], ut[ct] = null, It = ut[--ct], ut[ct] = null;
}
var lt = null, rt = null, ge = false, xt = null;
function Vu(e, t) {
  var n = dt(5, null, null, 0);
  n.elementType = "DELETED", n.stateNode = t, n.return = e, t = e.deletions, t === null ? (e.deletions = [n], e.flags |= 16) : t.push(n);
}
function ra(e, t) {
  switch (e.tag) {
    case 5:
      var n = e.type;
      return t = t.nodeType !== 1 || n.toLowerCase() !== t.nodeName.toLowerCase() ? null : t, t !== null ? (e.stateNode = t, lt = e, rt = en(t.firstChild), true) : false;
    case 6:
      return t = e.pendingProps === "" || t.nodeType !== 3 ? null : t, t !== null ? (e.stateNode = t, lt = e, rt = null, true) : false;
    case 13:
      return t = t.nodeType !== 8 ? null : t, t !== null ? (n = Sn !== null ? { id: It, overflow: zt } : null, e.memoizedState = { dehydrated: t, treeContext: n, retryLane: 1073741824 }, n = dt(18, null, null, 0), n.stateNode = t, n.return = e, e.child = n, lt = e, rt = null, true) : false;
    default:
      return false;
  }
}
function ao(e) {
  return (e.mode & 1) !== 0 && (e.flags & 128) === 0;
}
function uo(e) {
  if (ge) {
    var t = rt;
    if (t) {
      var n = t;
      if (!ra(e, t)) {
        if (ao(e)) throw Error(E(418));
        t = en(n.nextSibling);
        var r = lt;
        t && ra(e, t) ? Vu(r, n) : (e.flags = e.flags & -4097 | 2, ge = false, lt = e);
      }
    } else {
      if (ao(e)) throw Error(E(418));
      e.flags = e.flags & -4097 | 2, ge = false, lt = e;
    }
  }
}
function la(e) {
  for (e = e.return; e !== null && e.tag !== 5 && e.tag !== 3 && e.tag !== 13; ) e = e.return;
  lt = e;
}
function ll(e) {
  if (e !== lt) return false;
  if (!ge) return la(e), ge = true, false;
  var t;
  if ((t = e.tag !== 3) && !(t = e.tag !== 5) && (t = e.type, t = t !== "head" && t !== "body" && !lo(e.type, e.memoizedProps)), t && (t = rt)) {
    if (ao(e)) throw Wu(), Error(E(418));
    for (; t; ) Vu(e, t), t = en(t.nextSibling);
  }
  if (la(e), e.tag === 13) {
    if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(E(317));
    e: {
      for (e = e.nextSibling, t = 0; e; ) {
        if (e.nodeType === 8) {
          var n = e.data;
          if (n === "/$") {
            if (t === 0) {
              rt = en(e.nextSibling);
              break e;
            }
            t--;
          } else n !== "$" && n !== "$!" && n !== "$?" || t++;
        }
        e = e.nextSibling;
      }
      rt = null;
    }
  } else rt = lt ? en(e.stateNode.nextSibling) : null;
  return true;
}
function Wu() {
  for (var e = rt; e; ) e = en(e.nextSibling);
}
function Yn() {
  rt = lt = null, ge = false;
}
function Go(e) {
  xt === null ? xt = [e] : xt.push(e);
}
var Hf = bt.ReactCurrentBatchConfig;
function ar(e, t, n) {
  if (e = n.ref, e !== null && typeof e != "function" && typeof e != "object") {
    if (n._owner) {
      if (n = n._owner, n) {
        if (n.tag !== 1) throw Error(E(309));
        var r = n.stateNode;
      }
      if (!r) throw Error(E(147, e));
      var l = r, s = "" + e;
      return t !== null && t.ref !== null && typeof t.ref == "function" && t.ref._stringRef === s ? t.ref : (t = function(o) {
        var u = l.refs;
        o === null ? delete u[s] : u[s] = o;
      }, t._stringRef = s, t);
    }
    if (typeof e != "string") throw Error(E(284));
    if (!n._owner) throw Error(E(290, e));
  }
  return e;
}
function sl(e, t) {
  throw e = Object.prototype.toString.call(t), Error(E(31, e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e));
}
function sa(e) {
  var t = e._init;
  return t(e._payload);
}
function Hu(e) {
  function t(m, d) {
    if (e) {
      var h = m.deletions;
      h === null ? (m.deletions = [d], m.flags |= 16) : h.push(d);
    }
  }
  function n(m, d) {
    if (!e) return null;
    for (; d !== null; ) t(m, d), d = d.sibling;
    return null;
  }
  function r(m, d) {
    for (m = /* @__PURE__ */ new Map(); d !== null; ) d.key !== null ? m.set(d.key, d) : m.set(d.index, d), d = d.sibling;
    return m;
  }
  function l(m, d) {
    return m = ln(m, d), m.index = 0, m.sibling = null, m;
  }
  function s(m, d, h) {
    return m.index = h, e ? (h = m.alternate, h !== null ? (h = h.index, h < d ? (m.flags |= 2, d) : h) : (m.flags |= 2, d)) : (m.flags |= 1048576, d);
  }
  function o(m) {
    return e && m.alternate === null && (m.flags |= 2), m;
  }
  function u(m, d, h, S) {
    return d === null || d.tag !== 6 ? (d = Rs(h, m.mode, S), d.return = m, d) : (d = l(d, h), d.return = m, d);
  }
  function a(m, d, h, S) {
    var L = h.type;
    return L === Dn ? g(m, d, h.props.children, S, h.key) : d !== null && (d.elementType === L || typeof L == "object" && L !== null && L.$$typeof === Ht && sa(L) === d.type) ? (S = l(d, h.props), S.ref = ar(m, d, h), S.return = m, S) : (S = Sl(h.type, h.key, h.props, null, m.mode, S), S.ref = ar(m, d, h), S.return = m, S);
  }
  function p(m, d, h, S) {
    return d === null || d.tag !== 4 || d.stateNode.containerInfo !== h.containerInfo || d.stateNode.implementation !== h.implementation ? (d = Ps(h, m.mode, S), d.return = m, d) : (d = l(d, h.children || []), d.return = m, d);
  }
  function g(m, d, h, S, L) {
    return d === null || d.tag !== 7 ? (d = xn(h, m.mode, S, L), d.return = m, d) : (d = l(d, h), d.return = m, d);
  }
  function v(m, d, h) {
    if (typeof d == "string" && d !== "" || typeof d == "number") return d = Rs("" + d, m.mode, h), d.return = m, d;
    if (typeof d == "object" && d !== null) {
      switch (d.$$typeof) {
        case Yr:
          return h = Sl(d.type, d.key, d.props, null, m.mode, h), h.ref = ar(m, null, d), h.return = m, h;
        case Tn:
          return d = Ps(d, m.mode, h), d.return = m, d;
        case Ht:
          var S = d._init;
          return v(m, S(d._payload), h);
      }
      if (fr(d) || rr(d)) return d = xn(d, m.mode, h, null), d.return = m, d;
      sl(m, d);
    }
    return null;
  }
  function y(m, d, h, S) {
    var L = d !== null ? d.key : null;
    if (typeof h == "string" && h !== "" || typeof h == "number") return L !== null ? null : u(m, d, "" + h, S);
    if (typeof h == "object" && h !== null) {
      switch (h.$$typeof) {
        case Yr:
          return h.key === L ? a(m, d, h, S) : null;
        case Tn:
          return h.key === L ? p(m, d, h, S) : null;
        case Ht:
          return L = h._init, y(m, d, L(h._payload), S);
      }
      if (fr(h) || rr(h)) return L !== null ? null : g(m, d, h, S, null);
      sl(m, h);
    }
    return null;
  }
  function C(m, d, h, S, L) {
    if (typeof S == "string" && S !== "" || typeof S == "number") return m = m.get(h) || null, u(d, m, "" + S, L);
    if (typeof S == "object" && S !== null) {
      switch (S.$$typeof) {
        case Yr:
          return m = m.get(S.key === null ? h : S.key) || null, a(d, m, S, L);
        case Tn:
          return m = m.get(S.key === null ? h : S.key) || null, p(d, m, S, L);
        case Ht:
          var O = S._init;
          return C(m, d, h, O(S._payload), L);
      }
      if (fr(S) || rr(S)) return m = m.get(h) || null, g(d, m, S, L, null);
      sl(d, S);
    }
    return null;
  }
  function T(m, d, h, S) {
    for (var L = null, O = null, N = d, c = d = 0, f = null; N !== null && c < h.length; c++) {
      N.index > c ? (f = N, N = null) : f = N.sibling;
      var x = y(m, N, h[c], S);
      if (x === null) {
        N === null && (N = f);
        break;
      }
      e && N && x.alternate === null && t(m, N), d = s(x, d, c), O === null ? L = x : O.sibling = x, O = x, N = f;
    }
    if (c === h.length) return n(m, N), ge && pn(m, c), L;
    if (N === null) {
      for (; c < h.length; c++) N = v(m, h[c], S), N !== null && (d = s(N, d, c), O === null ? L = N : O.sibling = N, O = N);
      return ge && pn(m, c), L;
    }
    for (N = r(m, N); c < h.length; c++) f = C(N, m, c, h[c], S), f !== null && (e && f.alternate !== null && N.delete(f.key === null ? c : f.key), d = s(f, d, c), O === null ? L = f : O.sibling = f, O = f);
    return e && N.forEach(function(D) {
      return t(m, D);
    }), ge && pn(m, c), L;
  }
  function R(m, d, h, S) {
    var L = rr(h);
    if (typeof L != "function") throw Error(E(150));
    if (h = L.call(h), h == null) throw Error(E(151));
    for (var O = L = null, N = d, c = d = 0, f = null, x = h.next(); N !== null && !x.done; c++, x = h.next()) {
      N.index > c ? (f = N, N = null) : f = N.sibling;
      var D = y(m, N, x.value, S);
      if (D === null) {
        N === null && (N = f);
        break;
      }
      e && N && D.alternate === null && t(m, N), d = s(D, d, c), O === null ? L = D : O.sibling = D, O = D, N = f;
    }
    if (x.done) return n(m, N), ge && pn(m, c), L;
    if (N === null) {
      for (; !x.done; c++, x = h.next()) x = v(m, x.value, S), x !== null && (d = s(x, d, c), O === null ? L = x : O.sibling = x, O = x);
      return ge && pn(m, c), L;
    }
    for (N = r(m, N); !x.done; c++, x = h.next()) x = C(N, m, c, x.value, S), x !== null && (e && x.alternate !== null && N.delete(x.key === null ? c : x.key), d = s(x, d, c), O === null ? L = x : O.sibling = x, O = x);
    return e && N.forEach(function(z) {
      return t(m, z);
    }), ge && pn(m, c), L;
  }
  function J(m, d, h, S) {
    if (typeof h == "object" && h !== null && h.type === Dn && h.key === null && (h = h.props.children), typeof h == "object" && h !== null) {
      switch (h.$$typeof) {
        case Yr:
          e: {
            for (var L = h.key, O = d; O !== null; ) {
              if (O.key === L) {
                if (L = h.type, L === Dn) {
                  if (O.tag === 7) {
                    n(m, O.sibling), d = l(O, h.props.children), d.return = m, m = d;
                    break e;
                  }
                } else if (O.elementType === L || typeof L == "object" && L !== null && L.$$typeof === Ht && sa(L) === O.type) {
                  n(m, O.sibling), d = l(O, h.props), d.ref = ar(m, O, h), d.return = m, m = d;
                  break e;
                }
                n(m, O);
                break;
              } else t(m, O);
              O = O.sibling;
            }
            h.type === Dn ? (d = xn(h.props.children, m.mode, S, h.key), d.return = m, m = d) : (S = Sl(h.type, h.key, h.props, null, m.mode, S), S.ref = ar(m, d, h), S.return = m, m = S);
          }
          return o(m);
        case Tn:
          e: {
            for (O = h.key; d !== null; ) {
              if (d.key === O) if (d.tag === 4 && d.stateNode.containerInfo === h.containerInfo && d.stateNode.implementation === h.implementation) {
                n(m, d.sibling), d = l(d, h.children || []), d.return = m, m = d;
                break e;
              } else {
                n(m, d);
                break;
              }
              else t(m, d);
              d = d.sibling;
            }
            d = Ps(h, m.mode, S), d.return = m, m = d;
          }
          return o(m);
        case Ht:
          return O = h._init, J(m, d, O(h._payload), S);
      }
      if (fr(h)) return T(m, d, h, S);
      if (rr(h)) return R(m, d, h, S);
      sl(m, h);
    }
    return typeof h == "string" && h !== "" || typeof h == "number" ? (h = "" + h, d !== null && d.tag === 6 ? (n(m, d.sibling), d = l(d, h), d.return = m, m = d) : (n(m, d), d = Rs(h, m.mode, S), d.return = m, m = d), o(m)) : n(m, d);
  }
  return J;
}
var Xn = Hu(true), Qu = Hu(false), zl = un(null), Ml = null, An = null, Jo = null;
function qo() {
  Jo = An = Ml = null;
}
function Zo(e) {
  var t = zl.current;
  he(zl), e._currentValue = t;
}
function co(e, t, n) {
  for (; e !== null; ) {
    var r = e.alternate;
    if ((e.childLanes & t) !== t ? (e.childLanes |= t, r !== null && (r.childLanes |= t)) : r !== null && (r.childLanes & t) !== t && (r.childLanes |= t), e === n) break;
    e = e.return;
  }
}
function Wn(e, t) {
  Ml = e, Jo = An = null, e = e.dependencies, e !== null && e.firstContext !== null && (e.lanes & t && (Je = true), e.firstContext = null);
}
function pt(e) {
  var t = e._currentValue;
  if (Jo !== e) if (e = { context: e, memoizedValue: t, next: null }, An === null) {
    if (Ml === null) throw Error(E(308));
    An = e, Ml.dependencies = { lanes: 0, firstContext: e };
  } else An = An.next = e;
  return t;
}
var gn = null;
function ei(e) {
  gn === null ? gn = [e] : gn.push(e);
}
function Ku(e, t, n, r) {
  var l = t.interleaved;
  return l === null ? (n.next = n, ei(t)) : (n.next = l.next, l.next = n), t.interleaved = n, Ut(e, r);
}
function Ut(e, t) {
  e.lanes |= t;
  var n = e.alternate;
  for (n !== null && (n.lanes |= t), n = e, e = e.return; e !== null; ) e.childLanes |= t, n = e.alternate, n !== null && (n.childLanes |= t), n = e, e = e.return;
  return n.tag === 3 ? n.stateNode : null;
}
var Qt = false;
function ti(e) {
  e.updateQueue = { baseState: e.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
}
function Yu(e, t) {
  e = e.updateQueue, t.updateQueue === e && (t.updateQueue = { baseState: e.baseState, firstBaseUpdate: e.firstBaseUpdate, lastBaseUpdate: e.lastBaseUpdate, shared: e.shared, effects: e.effects });
}
function Mt(e, t) {
  return { eventTime: e, lane: t, tag: 0, payload: null, callback: null, next: null };
}
function tn(e, t, n) {
  var r = e.updateQueue;
  if (r === null) return null;
  if (r = r.shared, q & 2) {
    var l = r.pending;
    return l === null ? t.next = t : (t.next = l.next, l.next = t), r.pending = t, Ut(e, n);
  }
  return l = r.interleaved, l === null ? (t.next = t, ei(r)) : (t.next = l.next, l.next = t), r.interleaved = t, Ut(e, n);
}
function hl(e, t, n) {
  if (t = t.updateQueue, t !== null && (t = t.shared, (n & 4194240) !== 0)) {
    var r = t.lanes;
    r &= e.pendingLanes, n |= r, t.lanes = n, Bo(e, n);
  }
}
function oa(e, t) {
  var n = e.updateQueue, r = e.alternate;
  if (r !== null && (r = r.updateQueue, n === r)) {
    var l = null, s = null;
    if (n = n.firstBaseUpdate, n !== null) {
      do {
        var o = { eventTime: n.eventTime, lane: n.lane, tag: n.tag, payload: n.payload, callback: n.callback, next: null };
        s === null ? l = s = o : s = s.next = o, n = n.next;
      } while (n !== null);
      s === null ? l = s = t : s = s.next = t;
    } else l = s = t;
    n = { baseState: r.baseState, firstBaseUpdate: l, lastBaseUpdate: s, shared: r.shared, effects: r.effects }, e.updateQueue = n;
    return;
  }
  e = n.lastBaseUpdate, e === null ? n.firstBaseUpdate = t : e.next = t, n.lastBaseUpdate = t;
}
function Al(e, t, n, r) {
  var l = e.updateQueue;
  Qt = false;
  var s = l.firstBaseUpdate, o = l.lastBaseUpdate, u = l.shared.pending;
  if (u !== null) {
    l.shared.pending = null;
    var a = u, p = a.next;
    a.next = null, o === null ? s = p : o.next = p, o = a;
    var g = e.alternate;
    g !== null && (g = g.updateQueue, u = g.lastBaseUpdate, u !== o && (u === null ? g.firstBaseUpdate = p : u.next = p, g.lastBaseUpdate = a));
  }
  if (s !== null) {
    var v = l.baseState;
    o = 0, g = p = a = null, u = s;
    do {
      var y = u.lane, C = u.eventTime;
      if ((r & y) === y) {
        g !== null && (g = g.next = { eventTime: C, lane: 0, tag: u.tag, payload: u.payload, callback: u.callback, next: null });
        e: {
          var T = e, R = u;
          switch (y = t, C = n, R.tag) {
            case 1:
              if (T = R.payload, typeof T == "function") {
                v = T.call(C, v, y);
                break e;
              }
              v = T;
              break e;
            case 3:
              T.flags = T.flags & -65537 | 128;
            case 0:
              if (T = R.payload, y = typeof T == "function" ? T.call(C, v, y) : T, y == null) break e;
              v = we({}, v, y);
              break e;
            case 2:
              Qt = true;
          }
        }
        u.callback !== null && u.lane !== 0 && (e.flags |= 64, y = l.effects, y === null ? l.effects = [u] : y.push(u));
      } else C = { eventTime: C, lane: y, tag: u.tag, payload: u.payload, callback: u.callback, next: null }, g === null ? (p = g = C, a = v) : g = g.next = C, o |= y;
      if (u = u.next, u === null) {
        if (u = l.shared.pending, u === null) break;
        y = u, u = y.next, y.next = null, l.lastBaseUpdate = y, l.shared.pending = null;
      }
    } while (true);
    if (g === null && (a = v), l.baseState = a, l.firstBaseUpdate = p, l.lastBaseUpdate = g, t = l.shared.interleaved, t !== null) {
      l = t;
      do
        o |= l.lane, l = l.next;
      while (l !== t);
    } else s === null && (l.shared.lanes = 0);
    kn |= o, e.lanes = o, e.memoizedState = v;
  }
}
function ia(e, t, n) {
  if (e = t.effects, t.effects = null, e !== null) for (t = 0; t < e.length; t++) {
    var r = e[t], l = r.callback;
    if (l !== null) {
      if (r.callback = null, r = n, typeof l != "function") throw Error(E(191, l));
      l.call(r);
    }
  }
}
var Hr = {}, Lt = un(Hr), zr = un(Hr), Mr = un(Hr);
function vn(e) {
  if (e === Hr) throw Error(E(174));
  return e;
}
function ni(e, t) {
  switch (ce(Mr, t), ce(zr, e), ce(Lt, Hr), e = t.nodeType, e) {
    case 9:
    case 11:
      t = (t = t.documentElement) ? t.namespaceURI : Ws(null, "");
      break;
    default:
      e = e === 8 ? t.parentNode : t, t = e.namespaceURI || null, e = e.tagName, t = Ws(t, e);
  }
  he(Lt), ce(Lt, t);
}
function Gn() {
  he(Lt), he(zr), he(Mr);
}
function Xu(e) {
  vn(Mr.current);
  var t = vn(Lt.current), n = Ws(t, e.type);
  t !== n && (ce(zr, e), ce(Lt, n));
}
function ri(e) {
  zr.current === e && (he(Lt), he(zr));
}
var ye = un(0);
function Fl(e) {
  for (var t = e; t !== null; ) {
    if (t.tag === 13) {
      var n = t.memoizedState;
      if (n !== null && (n = n.dehydrated, n === null || n.data === "$?" || n.data === "$!")) return t;
    } else if (t.tag === 19 && t.memoizedProps.revealOrder !== void 0) {
      if (t.flags & 128) return t;
    } else if (t.child !== null) {
      t.child.return = t, t = t.child;
      continue;
    }
    if (t === e) break;
    for (; t.sibling === null; ) {
      if (t.return === null || t.return === e) return null;
      t = t.return;
    }
    t.sibling.return = t.return, t = t.sibling;
  }
  return null;
}
var js = [];
function li() {
  for (var e = 0; e < js.length; e++) js[e]._workInProgressVersionPrimary = null;
  js.length = 0;
}
var gl = bt.ReactCurrentDispatcher, Cs = bt.ReactCurrentBatchConfig, En = 0, xe = null, De = null, Pe = null, Ul = false, wr = false, Ar = 0, Qf = 0;
function Fe() {
  throw Error(E(321));
}
function si(e, t) {
  if (t === null) return false;
  for (var n = 0; n < t.length && n < e.length; n++) if (!Et(e[n], t[n])) return false;
  return true;
}
function oi(e, t, n, r, l, s) {
  if (En = s, xe = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, gl.current = e === null || e.memoizedState === null ? Gf : Jf, e = n(r, l), wr) {
    s = 0;
    do {
      if (wr = false, Ar = 0, 25 <= s) throw Error(E(301));
      s += 1, Pe = De = null, t.updateQueue = null, gl.current = qf, e = n(r, l);
    } while (wr);
  }
  if (gl.current = Bl, t = De !== null && De.next !== null, En = 0, Pe = De = xe = null, Ul = false, t) throw Error(E(300));
  return e;
}
function ii() {
  var e = Ar !== 0;
  return Ar = 0, e;
}
function Ct() {
  var e = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
  return Pe === null ? xe.memoizedState = Pe = e : Pe = Pe.next = e, Pe;
}
function mt() {
  if (De === null) {
    var e = xe.alternate;
    e = e !== null ? e.memoizedState : null;
  } else e = De.next;
  var t = Pe === null ? xe.memoizedState : Pe.next;
  if (t !== null) Pe = t, De = e;
  else {
    if (e === null) throw Error(E(310));
    De = e, e = { memoizedState: De.memoizedState, baseState: De.baseState, baseQueue: De.baseQueue, queue: De.queue, next: null }, Pe === null ? xe.memoizedState = Pe = e : Pe = Pe.next = e;
  }
  return Pe;
}
function Fr(e, t) {
  return typeof t == "function" ? t(e) : t;
}
function Ts(e) {
  var t = mt(), n = t.queue;
  if (n === null) throw Error(E(311));
  n.lastRenderedReducer = e;
  var r = De, l = r.baseQueue, s = n.pending;
  if (s !== null) {
    if (l !== null) {
      var o = l.next;
      l.next = s.next, s.next = o;
    }
    r.baseQueue = l = s, n.pending = null;
  }
  if (l !== null) {
    s = l.next, r = r.baseState;
    var u = o = null, a = null, p = s;
    do {
      var g = p.lane;
      if ((En & g) === g) a !== null && (a = a.next = { lane: 0, action: p.action, hasEagerState: p.hasEagerState, eagerState: p.eagerState, next: null }), r = p.hasEagerState ? p.eagerState : e(r, p.action);
      else {
        var v = { lane: g, action: p.action, hasEagerState: p.hasEagerState, eagerState: p.eagerState, next: null };
        a === null ? (u = a = v, o = r) : a = a.next = v, xe.lanes |= g, kn |= g;
      }
      p = p.next;
    } while (p !== null && p !== s);
    a === null ? o = r : a.next = u, Et(r, t.memoizedState) || (Je = true), t.memoizedState = r, t.baseState = o, t.baseQueue = a, n.lastRenderedState = r;
  }
  if (e = n.interleaved, e !== null) {
    l = e;
    do
      s = l.lane, xe.lanes |= s, kn |= s, l = l.next;
    while (l !== e);
  } else l === null && (n.lanes = 0);
  return [t.memoizedState, n.dispatch];
}
function Ds(e) {
  var t = mt(), n = t.queue;
  if (n === null) throw Error(E(311));
  n.lastRenderedReducer = e;
  var r = n.dispatch, l = n.pending, s = t.memoizedState;
  if (l !== null) {
    n.pending = null;
    var o = l = l.next;
    do
      s = e(s, o.action), o = o.next;
    while (o !== l);
    Et(s, t.memoizedState) || (Je = true), t.memoizedState = s, t.baseQueue === null && (t.baseState = s), n.lastRenderedState = s;
  }
  return [s, r];
}
function Gu() {
}
function Ju(e, t) {
  var n = xe, r = mt(), l = t(), s = !Et(r.memoizedState, l);
  if (s && (r.memoizedState = l, Je = true), r = r.queue, ai(ec.bind(null, n, r, e), [e]), r.getSnapshot !== t || s || Pe !== null && Pe.memoizedState.tag & 1) {
    if (n.flags |= 2048, Ur(9, Zu.bind(null, n, r, l, t), void 0, null), Ie === null) throw Error(E(349));
    En & 30 || qu(n, t, l);
  }
  return l;
}
function qu(e, t, n) {
  e.flags |= 16384, e = { getSnapshot: t, value: n }, t = xe.updateQueue, t === null ? (t = { lastEffect: null, stores: null }, xe.updateQueue = t, t.stores = [e]) : (n = t.stores, n === null ? t.stores = [e] : n.push(e));
}
function Zu(e, t, n, r) {
  t.value = n, t.getSnapshot = r, tc(t) && nc(e);
}
function ec(e, t, n) {
  return n(function() {
    tc(t) && nc(e);
  });
}
function tc(e) {
  var t = e.getSnapshot;
  e = e.value;
  try {
    var n = t();
    return !Et(e, n);
  } catch {
    return true;
  }
}
function nc(e) {
  var t = Ut(e, 1);
  t !== null && St(t, e, 1, -1);
}
function aa(e) {
  var t = Ct();
  return typeof e == "function" && (e = e()), t.memoizedState = t.baseState = e, e = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: Fr, lastRenderedState: e }, t.queue = e, e = e.dispatch = Xf.bind(null, xe, e), [t.memoizedState, e];
}
function Ur(e, t, n, r) {
  return e = { tag: e, create: t, destroy: n, deps: r, next: null }, t = xe.updateQueue, t === null ? (t = { lastEffect: null, stores: null }, xe.updateQueue = t, t.lastEffect = e.next = e) : (n = t.lastEffect, n === null ? t.lastEffect = e.next = e : (r = n.next, n.next = e, e.next = r, t.lastEffect = e)), e;
}
function rc() {
  return mt().memoizedState;
}
function vl(e, t, n, r) {
  var l = Ct();
  xe.flags |= e, l.memoizedState = Ur(1 | t, n, void 0, r === void 0 ? null : r);
}
function Zl(e, t, n, r) {
  var l = mt();
  r = r === void 0 ? null : r;
  var s = void 0;
  if (De !== null) {
    var o = De.memoizedState;
    if (s = o.destroy, r !== null && si(r, o.deps)) {
      l.memoizedState = Ur(t, n, s, r);
      return;
    }
  }
  xe.flags |= e, l.memoizedState = Ur(1 | t, n, s, r);
}
function ua(e, t) {
  return vl(8390656, 8, e, t);
}
function ai(e, t) {
  return Zl(2048, 8, e, t);
}
function lc(e, t) {
  return Zl(4, 2, e, t);
}
function sc(e, t) {
  return Zl(4, 4, e, t);
}
function oc(e, t) {
  if (typeof t == "function") return e = e(), t(e), function() {
    t(null);
  };
  if (t != null) return e = e(), t.current = e, function() {
    t.current = null;
  };
}
function ic(e, t, n) {
  return n = n != null ? n.concat([e]) : null, Zl(4, 4, oc.bind(null, t, e), n);
}
function ui() {
}
function ac(e, t) {
  var n = mt();
  t = t === void 0 ? null : t;
  var r = n.memoizedState;
  return r !== null && t !== null && si(t, r[1]) ? r[0] : (n.memoizedState = [e, t], e);
}
function uc(e, t) {
  var n = mt();
  t = t === void 0 ? null : t;
  var r = n.memoizedState;
  return r !== null && t !== null && si(t, r[1]) ? r[0] : (e = e(), n.memoizedState = [e, t], e);
}
function cc(e, t, n) {
  return En & 21 ? (Et(n, t) || (n = hu(), xe.lanes |= n, kn |= n, e.baseState = true), t) : (e.baseState && (e.baseState = false, Je = true), e.memoizedState = n);
}
function Kf(e, t) {
  var n = re;
  re = n !== 0 && 4 > n ? n : 4, e(true);
  var r = Cs.transition;
  Cs.transition = {};
  try {
    e(false), t();
  } finally {
    re = n, Cs.transition = r;
  }
}
function dc() {
  return mt().memoizedState;
}
function Yf(e, t, n) {
  var r = rn(e);
  if (n = { lane: r, action: n, hasEagerState: false, eagerState: null, next: null }, fc(e)) pc(t, n);
  else if (n = Ku(e, t, n, r), n !== null) {
    var l = He();
    St(n, e, r, l), mc(n, t, r);
  }
}
function Xf(e, t, n) {
  var r = rn(e), l = { lane: r, action: n, hasEagerState: false, eagerState: null, next: null };
  if (fc(e)) pc(t, l);
  else {
    var s = e.alternate;
    if (e.lanes === 0 && (s === null || s.lanes === 0) && (s = t.lastRenderedReducer, s !== null)) try {
      var o = t.lastRenderedState, u = s(o, n);
      if (l.hasEagerState = true, l.eagerState = u, Et(u, o)) {
        var a = t.interleaved;
        a === null ? (l.next = l, ei(t)) : (l.next = a.next, a.next = l), t.interleaved = l;
        return;
      }
    } catch {
    } finally {
    }
    n = Ku(e, t, l, r), n !== null && (l = He(), St(n, e, r, l), mc(n, t, r));
  }
}
function fc(e) {
  var t = e.alternate;
  return e === xe || t !== null && t === xe;
}
function pc(e, t) {
  wr = Ul = true;
  var n = e.pending;
  n === null ? t.next = t : (t.next = n.next, n.next = t), e.pending = t;
}
function mc(e, t, n) {
  if (n & 4194240) {
    var r = t.lanes;
    r &= e.pendingLanes, n |= r, t.lanes = n, Bo(e, n);
  }
}
var Bl = { readContext: pt, useCallback: Fe, useContext: Fe, useEffect: Fe, useImperativeHandle: Fe, useInsertionEffect: Fe, useLayoutEffect: Fe, useMemo: Fe, useReducer: Fe, useRef: Fe, useState: Fe, useDebugValue: Fe, useDeferredValue: Fe, useTransition: Fe, useMutableSource: Fe, useSyncExternalStore: Fe, useId: Fe, unstable_isNewReconciler: false }, Gf = { readContext: pt, useCallback: function(e, t) {
  return Ct().memoizedState = [e, t === void 0 ? null : t], e;
}, useContext: pt, useEffect: ua, useImperativeHandle: function(e, t, n) {
  return n = n != null ? n.concat([e]) : null, vl(4194308, 4, oc.bind(null, t, e), n);
}, useLayoutEffect: function(e, t) {
  return vl(4194308, 4, e, t);
}, useInsertionEffect: function(e, t) {
  return vl(4, 2, e, t);
}, useMemo: function(e, t) {
  var n = Ct();
  return t = t === void 0 ? null : t, e = e(), n.memoizedState = [e, t], e;
}, useReducer: function(e, t, n) {
  var r = Ct();
  return t = n !== void 0 ? n(t) : t, r.memoizedState = r.baseState = t, e = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: e, lastRenderedState: t }, r.queue = e, e = e.dispatch = Yf.bind(null, xe, e), [r.memoizedState, e];
}, useRef: function(e) {
  var t = Ct();
  return e = { current: e }, t.memoizedState = e;
}, useState: aa, useDebugValue: ui, useDeferredValue: function(e) {
  return Ct().memoizedState = e;
}, useTransition: function() {
  var e = aa(false), t = e[0];
  return e = Kf.bind(null, e[1]), Ct().memoizedState = e, [t, e];
}, useMutableSource: function() {
}, useSyncExternalStore: function(e, t, n) {
  var r = xe, l = Ct();
  if (ge) {
    if (n === void 0) throw Error(E(407));
    n = n();
  } else {
    if (n = t(), Ie === null) throw Error(E(349));
    En & 30 || qu(r, t, n);
  }
  l.memoizedState = n;
  var s = { value: n, getSnapshot: t };
  return l.queue = s, ua(ec.bind(null, r, s, e), [e]), r.flags |= 2048, Ur(9, Zu.bind(null, r, s, n, t), void 0, null), n;
}, useId: function() {
  var e = Ct(), t = Ie.identifierPrefix;
  if (ge) {
    var n = zt, r = It;
    n = (r & ~(1 << 32 - wt(r) - 1)).toString(32) + n, t = ":" + t + "R" + n, n = Ar++, 0 < n && (t += "H" + n.toString(32)), t += ":";
  } else n = Qf++, t = ":" + t + "r" + n.toString(32) + ":";
  return e.memoizedState = t;
}, unstable_isNewReconciler: false }, Jf = { readContext: pt, useCallback: ac, useContext: pt, useEffect: ai, useImperativeHandle: ic, useInsertionEffect: lc, useLayoutEffect: sc, useMemo: uc, useReducer: Ts, useRef: rc, useState: function() {
  return Ts(Fr);
}, useDebugValue: ui, useDeferredValue: function(e) {
  var t = mt();
  return cc(t, De.memoizedState, e);
}, useTransition: function() {
  var e = Ts(Fr)[0], t = mt().memoizedState;
  return [e, t];
}, useMutableSource: Gu, useSyncExternalStore: Ju, useId: dc, unstable_isNewReconciler: false }, qf = { readContext: pt, useCallback: ac, useContext: pt, useEffect: ai, useImperativeHandle: ic, useInsertionEffect: lc, useLayoutEffect: sc, useMemo: uc, useReducer: Ds, useRef: rc, useState: function() {
  return Ds(Fr);
}, useDebugValue: ui, useDeferredValue: function(e) {
  var t = mt();
  return De === null ? t.memoizedState = e : cc(t, De.memoizedState, e);
}, useTransition: function() {
  var e = Ds(Fr)[0], t = mt().memoizedState;
  return [e, t];
}, useMutableSource: Gu, useSyncExternalStore: Ju, useId: dc, unstable_isNewReconciler: false };
function vt(e, t) {
  if (e && e.defaultProps) {
    t = we({}, t), e = e.defaultProps;
    for (var n in e) t[n] === void 0 && (t[n] = e[n]);
    return t;
  }
  return t;
}
function fo(e, t, n, r) {
  t = e.memoizedState, n = n(r, t), n = n == null ? t : we({}, t, n), e.memoizedState = n, e.lanes === 0 && (e.updateQueue.baseState = n);
}
var es = { isMounted: function(e) {
  return (e = e._reactInternals) ? jn(e) === e : false;
}, enqueueSetState: function(e, t, n) {
  e = e._reactInternals;
  var r = He(), l = rn(e), s = Mt(r, l);
  s.payload = t, n != null && (s.callback = n), t = tn(e, s, l), t !== null && (St(t, e, l, r), hl(t, e, l));
}, enqueueReplaceState: function(e, t, n) {
  e = e._reactInternals;
  var r = He(), l = rn(e), s = Mt(r, l);
  s.tag = 1, s.payload = t, n != null && (s.callback = n), t = tn(e, s, l), t !== null && (St(t, e, l, r), hl(t, e, l));
}, enqueueForceUpdate: function(e, t) {
  e = e._reactInternals;
  var n = He(), r = rn(e), l = Mt(n, r);
  l.tag = 2, t != null && (l.callback = t), t = tn(e, l, r), t !== null && (St(t, e, r, n), hl(t, e, r));
} };
function ca(e, t, n, r, l, s, o) {
  return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(r, s, o) : t.prototype && t.prototype.isPureReactComponent ? !Or(n, r) || !Or(l, s) : true;
}
function hc(e, t, n) {
  var r = false, l = on, s = t.contextType;
  return typeof s == "object" && s !== null ? s = pt(s) : (l = Ze(t) ? wn : be.current, r = t.contextTypes, s = (r = r != null) ? Kn(e, l) : on), t = new t(n, s), e.memoizedState = t.state !== null && t.state !== void 0 ? t.state : null, t.updater = es, e.stateNode = t, t._reactInternals = e, r && (e = e.stateNode, e.__reactInternalMemoizedUnmaskedChildContext = l, e.__reactInternalMemoizedMaskedChildContext = s), t;
}
function da(e, t, n, r) {
  e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(n, r), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(n, r), t.state !== e && es.enqueueReplaceState(t, t.state, null);
}
function po(e, t, n, r) {
  var l = e.stateNode;
  l.props = n, l.state = e.memoizedState, l.refs = {}, ti(e);
  var s = t.contextType;
  typeof s == "object" && s !== null ? l.context = pt(s) : (s = Ze(t) ? wn : be.current, l.context = Kn(e, s)), l.state = e.memoizedState, s = t.getDerivedStateFromProps, typeof s == "function" && (fo(e, t, s, n), l.state = e.memoizedState), typeof t.getDerivedStateFromProps == "function" || typeof l.getSnapshotBeforeUpdate == "function" || typeof l.UNSAFE_componentWillMount != "function" && typeof l.componentWillMount != "function" || (t = l.state, typeof l.componentWillMount == "function" && l.componentWillMount(), typeof l.UNSAFE_componentWillMount == "function" && l.UNSAFE_componentWillMount(), t !== l.state && es.enqueueReplaceState(l, l.state, null), Al(e, n, l, r), l.state = e.memoizedState), typeof l.componentDidMount == "function" && (e.flags |= 4194308);
}
function Jn(e, t) {
  try {
    var n = "", r = t;
    do
      n += _d(r), r = r.return;
    while (r);
    var l = n;
  } catch (s) {
    l = `
Error generating stack: ` + s.message + `
` + s.stack;
  }
  return { value: e, source: t, stack: l, digest: null };
}
function Ls(e, t, n) {
  return { value: e, source: null, stack: n ?? null, digest: t ?? null };
}
function mo(e, t) {
  try {
    console.error(t.value);
  } catch (n) {
    setTimeout(function() {
      throw n;
    });
  }
}
var Zf = typeof WeakMap == "function" ? WeakMap : Map;
function gc(e, t, n) {
  n = Mt(-1, n), n.tag = 3, n.payload = { element: null };
  var r = t.value;
  return n.callback = function() {
    $l || ($l = true, No = r), mo(e, t);
  }, n;
}
function vc(e, t, n) {
  n = Mt(-1, n), n.tag = 3;
  var r = e.type.getDerivedStateFromError;
  if (typeof r == "function") {
    var l = t.value;
    n.payload = function() {
      return r(l);
    }, n.callback = function() {
      mo(e, t);
    };
  }
  var s = e.stateNode;
  return s !== null && typeof s.componentDidCatch == "function" && (n.callback = function() {
    mo(e, t), typeof r != "function" && (nn === null ? nn = /* @__PURE__ */ new Set([this]) : nn.add(this));
    var o = t.stack;
    this.componentDidCatch(t.value, { componentStack: o !== null ? o : "" });
  }), n;
}
function fa(e, t, n) {
  var r = e.pingCache;
  if (r === null) {
    r = e.pingCache = new Zf();
    var l = /* @__PURE__ */ new Set();
    r.set(t, l);
  } else l = r.get(t), l === void 0 && (l = /* @__PURE__ */ new Set(), r.set(t, l));
  l.has(n) || (l.add(n), e = pp.bind(null, e, t, n), t.then(e, e));
}
function pa(e) {
  do {
    var t;
    if ((t = e.tag === 13) && (t = e.memoizedState, t = t !== null ? t.dehydrated !== null : true), t) return e;
    e = e.return;
  } while (e !== null);
  return null;
}
function ma(e, t, n, r, l) {
  return e.mode & 1 ? (e.flags |= 65536, e.lanes = l, e) : (e === t ? e.flags |= 65536 : (e.flags |= 128, n.flags |= 131072, n.flags &= -52805, n.tag === 1 && (n.alternate === null ? n.tag = 17 : (t = Mt(-1, 1), t.tag = 2, tn(n, t, 1))), n.lanes |= 1), e);
}
var ep = bt.ReactCurrentOwner, Je = false;
function We(e, t, n, r) {
  t.child = e === null ? Qu(t, null, n, r) : Xn(t, e.child, n, r);
}
function ha(e, t, n, r, l) {
  n = n.render;
  var s = t.ref;
  return Wn(t, l), r = oi(e, t, n, r, s, l), n = ii(), e !== null && !Je ? (t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~l, Bt(e, t, l)) : (ge && n && Yo(t), t.flags |= 1, We(e, t, r, l), t.child);
}
function ga(e, t, n, r, l) {
  if (e === null) {
    var s = n.type;
    return typeof s == "function" && !vi(s) && s.defaultProps === void 0 && n.compare === null && n.defaultProps === void 0 ? (t.tag = 15, t.type = s, yc(e, t, s, r, l)) : (e = Sl(n.type, null, r, t, t.mode, l), e.ref = t.ref, e.return = t, t.child = e);
  }
  if (s = e.child, !(e.lanes & l)) {
    var o = s.memoizedProps;
    if (n = n.compare, n = n !== null ? n : Or, n(o, r) && e.ref === t.ref) return Bt(e, t, l);
  }
  return t.flags |= 1, e = ln(s, r), e.ref = t.ref, e.return = t, t.child = e;
}
function yc(e, t, n, r, l) {
  if (e !== null) {
    var s = e.memoizedProps;
    if (Or(s, r) && e.ref === t.ref) if (Je = false, t.pendingProps = r = s, (e.lanes & l) !== 0) e.flags & 131072 && (Je = true);
    else return t.lanes = e.lanes, Bt(e, t, l);
  }
  return ho(e, t, n, r, l);
}
function xc(e, t, n) {
  var r = t.pendingProps, l = r.children, s = e !== null ? e.memoizedState : null;
  if (r.mode === "hidden") if (!(t.mode & 1)) t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, ce(Un, nt), nt |= n;
  else {
    if (!(n & 1073741824)) return e = s !== null ? s.baseLanes | n : n, t.lanes = t.childLanes = 1073741824, t.memoizedState = { baseLanes: e, cachePool: null, transitions: null }, t.updateQueue = null, ce(Un, nt), nt |= e, null;
    t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, r = s !== null ? s.baseLanes : n, ce(Un, nt), nt |= r;
  }
  else s !== null ? (r = s.baseLanes | n, t.memoizedState = null) : r = n, ce(Un, nt), nt |= r;
  return We(e, t, l, n), t.child;
}
function wc(e, t) {
  var n = t.ref;
  (e === null && n !== null || e !== null && e.ref !== n) && (t.flags |= 512, t.flags |= 2097152);
}
function ho(e, t, n, r, l) {
  var s = Ze(n) ? wn : be.current;
  return s = Kn(t, s), Wn(t, l), n = oi(e, t, n, r, s, l), r = ii(), e !== null && !Je ? (t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~l, Bt(e, t, l)) : (ge && r && Yo(t), t.flags |= 1, We(e, t, n, l), t.child);
}
function va(e, t, n, r, l) {
  if (Ze(n)) {
    var s = true;
    Rl(t);
  } else s = false;
  if (Wn(t, l), t.stateNode === null) yl(e, t), hc(t, n, r), po(t, n, r, l), r = true;
  else if (e === null) {
    var o = t.stateNode, u = t.memoizedProps;
    o.props = u;
    var a = o.context, p = n.contextType;
    typeof p == "object" && p !== null ? p = pt(p) : (p = Ze(n) ? wn : be.current, p = Kn(t, p));
    var g = n.getDerivedStateFromProps, v = typeof g == "function" || typeof o.getSnapshotBeforeUpdate == "function";
    v || typeof o.UNSAFE_componentWillReceiveProps != "function" && typeof o.componentWillReceiveProps != "function" || (u !== r || a !== p) && da(t, o, r, p), Qt = false;
    var y = t.memoizedState;
    o.state = y, Al(t, r, o, l), a = t.memoizedState, u !== r || y !== a || qe.current || Qt ? (typeof g == "function" && (fo(t, n, g, r), a = t.memoizedState), (u = Qt || ca(t, n, u, r, y, a, p)) ? (v || typeof o.UNSAFE_componentWillMount != "function" && typeof o.componentWillMount != "function" || (typeof o.componentWillMount == "function" && o.componentWillMount(), typeof o.UNSAFE_componentWillMount == "function" && o.UNSAFE_componentWillMount()), typeof o.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof o.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = r, t.memoizedState = a), o.props = r, o.state = a, o.context = p, r = u) : (typeof o.componentDidMount == "function" && (t.flags |= 4194308), r = false);
  } else {
    o = t.stateNode, Yu(e, t), u = t.memoizedProps, p = t.type === t.elementType ? u : vt(t.type, u), o.props = p, v = t.pendingProps, y = o.context, a = n.contextType, typeof a == "object" && a !== null ? a = pt(a) : (a = Ze(n) ? wn : be.current, a = Kn(t, a));
    var C = n.getDerivedStateFromProps;
    (g = typeof C == "function" || typeof o.getSnapshotBeforeUpdate == "function") || typeof o.UNSAFE_componentWillReceiveProps != "function" && typeof o.componentWillReceiveProps != "function" || (u !== v || y !== a) && da(t, o, r, a), Qt = false, y = t.memoizedState, o.state = y, Al(t, r, o, l);
    var T = t.memoizedState;
    u !== v || y !== T || qe.current || Qt ? (typeof C == "function" && (fo(t, n, C, r), T = t.memoizedState), (p = Qt || ca(t, n, p, r, y, T, a) || false) ? (g || typeof o.UNSAFE_componentWillUpdate != "function" && typeof o.componentWillUpdate != "function" || (typeof o.componentWillUpdate == "function" && o.componentWillUpdate(r, T, a), typeof o.UNSAFE_componentWillUpdate == "function" && o.UNSAFE_componentWillUpdate(r, T, a)), typeof o.componentDidUpdate == "function" && (t.flags |= 4), typeof o.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof o.componentDidUpdate != "function" || u === e.memoizedProps && y === e.memoizedState || (t.flags |= 4), typeof o.getSnapshotBeforeUpdate != "function" || u === e.memoizedProps && y === e.memoizedState || (t.flags |= 1024), t.memoizedProps = r, t.memoizedState = T), o.props = r, o.state = T, o.context = a, r = p) : (typeof o.componentDidUpdate != "function" || u === e.memoizedProps && y === e.memoizedState || (t.flags |= 4), typeof o.getSnapshotBeforeUpdate != "function" || u === e.memoizedProps && y === e.memoizedState || (t.flags |= 1024), r = false);
  }
  return go(e, t, n, r, s, l);
}
function go(e, t, n, r, l, s) {
  wc(e, t);
  var o = (t.flags & 128) !== 0;
  if (!r && !o) return l && na(t, n, false), Bt(e, t, s);
  r = t.stateNode, ep.current = t;
  var u = o && typeof n.getDerivedStateFromError != "function" ? null : r.render();
  return t.flags |= 1, e !== null && o ? (t.child = Xn(t, e.child, null, s), t.child = Xn(t, null, u, s)) : We(e, t, u, s), t.memoizedState = r.state, l && na(t, n, true), t.child;
}
function Sc(e) {
  var t = e.stateNode;
  t.pendingContext ? ta(e, t.pendingContext, t.pendingContext !== t.context) : t.context && ta(e, t.context, false), ni(e, t.containerInfo);
}
function ya(e, t, n, r, l) {
  return Yn(), Go(l), t.flags |= 256, We(e, t, n, r), t.child;
}
var vo = { dehydrated: null, treeContext: null, retryLane: 0 };
function yo(e) {
  return { baseLanes: e, cachePool: null, transitions: null };
}
function Ec(e, t, n) {
  var r = t.pendingProps, l = ye.current, s = false, o = (t.flags & 128) !== 0, u;
  if ((u = o) || (u = e !== null && e.memoizedState === null ? false : (l & 2) !== 0), u ? (s = true, t.flags &= -129) : (e === null || e.memoizedState !== null) && (l |= 1), ce(ye, l & 1), e === null) return uo(t), e = t.memoizedState, e !== null && (e = e.dehydrated, e !== null) ? (t.mode & 1 ? e.data === "$!" ? t.lanes = 8 : t.lanes = 1073741824 : t.lanes = 1, null) : (o = r.children, e = r.fallback, s ? (r = t.mode, s = t.child, o = { mode: "hidden", children: o }, !(r & 1) && s !== null ? (s.childLanes = 0, s.pendingProps = o) : s = rs(o, r, 0, null), e = xn(e, r, n, null), s.return = t, e.return = t, s.sibling = e, t.child = s, t.child.memoizedState = yo(n), t.memoizedState = vo, e) : ci(t, o));
  if (l = e.memoizedState, l !== null && (u = l.dehydrated, u !== null)) return tp(e, t, o, r, u, l, n);
  if (s) {
    s = r.fallback, o = t.mode, l = e.child, u = l.sibling;
    var a = { mode: "hidden", children: r.children };
    return !(o & 1) && t.child !== l ? (r = t.child, r.childLanes = 0, r.pendingProps = a, t.deletions = null) : (r = ln(l, a), r.subtreeFlags = l.subtreeFlags & 14680064), u !== null ? s = ln(u, s) : (s = xn(s, o, n, null), s.flags |= 2), s.return = t, r.return = t, r.sibling = s, t.child = r, r = s, s = t.child, o = e.child.memoizedState, o = o === null ? yo(n) : { baseLanes: o.baseLanes | n, cachePool: null, transitions: o.transitions }, s.memoizedState = o, s.childLanes = e.childLanes & ~n, t.memoizedState = vo, r;
  }
  return s = e.child, e = s.sibling, r = ln(s, { mode: "visible", children: r.children }), !(t.mode & 1) && (r.lanes = n), r.return = t, r.sibling = null, e !== null && (n = t.deletions, n === null ? (t.deletions = [e], t.flags |= 16) : n.push(e)), t.child = r, t.memoizedState = null, r;
}
function ci(e, t) {
  return t = rs({ mode: "visible", children: t }, e.mode, 0, null), t.return = e, e.child = t;
}
function ol(e, t, n, r) {
  return r !== null && Go(r), Xn(t, e.child, null, n), e = ci(t, t.pendingProps.children), e.flags |= 2, t.memoizedState = null, e;
}
function tp(e, t, n, r, l, s, o) {
  if (n) return t.flags & 256 ? (t.flags &= -257, r = Ls(Error(E(422))), ol(e, t, o, r)) : t.memoizedState !== null ? (t.child = e.child, t.flags |= 128, null) : (s = r.fallback, l = t.mode, r = rs({ mode: "visible", children: r.children }, l, 0, null), s = xn(s, l, o, null), s.flags |= 2, r.return = t, s.return = t, r.sibling = s, t.child = r, t.mode & 1 && Xn(t, e.child, null, o), t.child.memoizedState = yo(o), t.memoizedState = vo, s);
  if (!(t.mode & 1)) return ol(e, t, o, null);
  if (l.data === "$!") {
    if (r = l.nextSibling && l.nextSibling.dataset, r) var u = r.dgst;
    return r = u, s = Error(E(419)), r = Ls(s, r, void 0), ol(e, t, o, r);
  }
  if (u = (o & e.childLanes) !== 0, Je || u) {
    if (r = Ie, r !== null) {
      switch (o & -o) {
        case 4:
          l = 2;
          break;
        case 16:
          l = 8;
          break;
        case 64:
        case 128:
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
        case 67108864:
          l = 32;
          break;
        case 536870912:
          l = 268435456;
          break;
        default:
          l = 0;
      }
      l = l & (r.suspendedLanes | o) ? 0 : l, l !== 0 && l !== s.retryLane && (s.retryLane = l, Ut(e, l), St(r, e, l, -1));
    }
    return gi(), r = Ls(Error(E(421))), ol(e, t, o, r);
  }
  return l.data === "$?" ? (t.flags |= 128, t.child = e.child, t = mp.bind(null, e), l._reactRetry = t, null) : (e = s.treeContext, rt = en(l.nextSibling), lt = t, ge = true, xt = null, e !== null && (ut[ct++] = It, ut[ct++] = zt, ut[ct++] = Sn, It = e.id, zt = e.overflow, Sn = t), t = ci(t, r.children), t.flags |= 4096, t);
}
function xa(e, t, n) {
  e.lanes |= t;
  var r = e.alternate;
  r !== null && (r.lanes |= t), co(e.return, t, n);
}
function Os(e, t, n, r, l) {
  var s = e.memoizedState;
  s === null ? e.memoizedState = { isBackwards: t, rendering: null, renderingStartTime: 0, last: r, tail: n, tailMode: l } : (s.isBackwards = t, s.rendering = null, s.renderingStartTime = 0, s.last = r, s.tail = n, s.tailMode = l);
}
function kc(e, t, n) {
  var r = t.pendingProps, l = r.revealOrder, s = r.tail;
  if (We(e, t, r.children, n), r = ye.current, r & 2) r = r & 1 | 2, t.flags |= 128;
  else {
    if (e !== null && e.flags & 128) e: for (e = t.child; e !== null; ) {
      if (e.tag === 13) e.memoizedState !== null && xa(e, n, t);
      else if (e.tag === 19) xa(e, n, t);
      else if (e.child !== null) {
        e.child.return = e, e = e.child;
        continue;
      }
      if (e === t) break e;
      for (; e.sibling === null; ) {
        if (e.return === null || e.return === t) break e;
        e = e.return;
      }
      e.sibling.return = e.return, e = e.sibling;
    }
    r &= 1;
  }
  if (ce(ye, r), !(t.mode & 1)) t.memoizedState = null;
  else switch (l) {
    case "forwards":
      for (n = t.child, l = null; n !== null; ) e = n.alternate, e !== null && Fl(e) === null && (l = n), n = n.sibling;
      n = l, n === null ? (l = t.child, t.child = null) : (l = n.sibling, n.sibling = null), Os(t, false, l, n, s);
      break;
    case "backwards":
      for (n = null, l = t.child, t.child = null; l !== null; ) {
        if (e = l.alternate, e !== null && Fl(e) === null) {
          t.child = l;
          break;
        }
        e = l.sibling, l.sibling = n, n = l, l = e;
      }
      Os(t, true, n, null, s);
      break;
    case "together":
      Os(t, false, null, null, void 0);
      break;
    default:
      t.memoizedState = null;
  }
  return t.child;
}
function yl(e, t) {
  !(t.mode & 1) && e !== null && (e.alternate = null, t.alternate = null, t.flags |= 2);
}
function Bt(e, t, n) {
  if (e !== null && (t.dependencies = e.dependencies), kn |= t.lanes, !(n & t.childLanes)) return null;
  if (e !== null && t.child !== e.child) throw Error(E(153));
  if (t.child !== null) {
    for (e = t.child, n = ln(e, e.pendingProps), t.child = n, n.return = t; e.sibling !== null; ) e = e.sibling, n = n.sibling = ln(e, e.pendingProps), n.return = t;
    n.sibling = null;
  }
  return t.child;
}
function np(e, t, n) {
  switch (t.tag) {
    case 3:
      Sc(t), Yn();
      break;
    case 5:
      Xu(t);
      break;
    case 1:
      Ze(t.type) && Rl(t);
      break;
    case 4:
      ni(t, t.stateNode.containerInfo);
      break;
    case 10:
      var r = t.type._context, l = t.memoizedProps.value;
      ce(zl, r._currentValue), r._currentValue = l;
      break;
    case 13:
      if (r = t.memoizedState, r !== null) return r.dehydrated !== null ? (ce(ye, ye.current & 1), t.flags |= 128, null) : n & t.child.childLanes ? Ec(e, t, n) : (ce(ye, ye.current & 1), e = Bt(e, t, n), e !== null ? e.sibling : null);
      ce(ye, ye.current & 1);
      break;
    case 19:
      if (r = (n & t.childLanes) !== 0, e.flags & 128) {
        if (r) return kc(e, t, n);
        t.flags |= 128;
      }
      if (l = t.memoizedState, l !== null && (l.rendering = null, l.tail = null, l.lastEffect = null), ce(ye, ye.current), r) break;
      return null;
    case 22:
    case 23:
      return t.lanes = 0, xc(e, t, n);
  }
  return Bt(e, t, n);
}
var Nc, xo, _c, jc;
Nc = function(e, t) {
  for (var n = t.child; n !== null; ) {
    if (n.tag === 5 || n.tag === 6) e.appendChild(n.stateNode);
    else if (n.tag !== 4 && n.child !== null) {
      n.child.return = n, n = n.child;
      continue;
    }
    if (n === t) break;
    for (; n.sibling === null; ) {
      if (n.return === null || n.return === t) return;
      n = n.return;
    }
    n.sibling.return = n.return, n = n.sibling;
  }
};
xo = function() {
};
_c = function(e, t, n, r) {
  var l = e.memoizedProps;
  if (l !== r) {
    e = t.stateNode, vn(Lt.current);
    var s = null;
    switch (n) {
      case "input":
        l = Bs(e, l), r = Bs(e, r), s = [];
        break;
      case "select":
        l = we({}, l, { value: void 0 }), r = we({}, r, { value: void 0 }), s = [];
        break;
      case "textarea":
        l = Vs(e, l), r = Vs(e, r), s = [];
        break;
      default:
        typeof l.onClick != "function" && typeof r.onClick == "function" && (e.onclick = Ll);
    }
    Hs(n, r);
    var o;
    n = null;
    for (p in l) if (!r.hasOwnProperty(p) && l.hasOwnProperty(p) && l[p] != null) if (p === "style") {
      var u = l[p];
      for (o in u) u.hasOwnProperty(o) && (n || (n = {}), n[o] = "");
    } else p !== "dangerouslySetInnerHTML" && p !== "children" && p !== "suppressContentEditableWarning" && p !== "suppressHydrationWarning" && p !== "autoFocus" && (Nr.hasOwnProperty(p) ? s || (s = []) : (s = s || []).push(p, null));
    for (p in r) {
      var a = r[p];
      if (u = l == null ? void 0 : l[p], r.hasOwnProperty(p) && a !== u && (a != null || u != null)) if (p === "style") if (u) {
        for (o in u) !u.hasOwnProperty(o) || a && a.hasOwnProperty(o) || (n || (n = {}), n[o] = "");
        for (o in a) a.hasOwnProperty(o) && u[o] !== a[o] && (n || (n = {}), n[o] = a[o]);
      } else n || (s || (s = []), s.push(p, n)), n = a;
      else p === "dangerouslySetInnerHTML" ? (a = a ? a.__html : void 0, u = u ? u.__html : void 0, a != null && u !== a && (s = s || []).push(p, a)) : p === "children" ? typeof a != "string" && typeof a != "number" || (s = s || []).push(p, "" + a) : p !== "suppressContentEditableWarning" && p !== "suppressHydrationWarning" && (Nr.hasOwnProperty(p) ? (a != null && p === "onScroll" && me("scroll", e), s || u === a || (s = [])) : (s = s || []).push(p, a));
    }
    n && (s = s || []).push("style", n);
    var p = s;
    (t.updateQueue = p) && (t.flags |= 4);
  }
};
jc = function(e, t, n, r) {
  n !== r && (t.flags |= 4);
};
function ur(e, t) {
  if (!ge) switch (e.tailMode) {
    case "hidden":
      t = e.tail;
      for (var n = null; t !== null; ) t.alternate !== null && (n = t), t = t.sibling;
      n === null ? e.tail = null : n.sibling = null;
      break;
    case "collapsed":
      n = e.tail;
      for (var r = null; n !== null; ) n.alternate !== null && (r = n), n = n.sibling;
      r === null ? t || e.tail === null ? e.tail = null : e.tail.sibling = null : r.sibling = null;
  }
}
function Ue(e) {
  var t = e.alternate !== null && e.alternate.child === e.child, n = 0, r = 0;
  if (t) for (var l = e.child; l !== null; ) n |= l.lanes | l.childLanes, r |= l.subtreeFlags & 14680064, r |= l.flags & 14680064, l.return = e, l = l.sibling;
  else for (l = e.child; l !== null; ) n |= l.lanes | l.childLanes, r |= l.subtreeFlags, r |= l.flags, l.return = e, l = l.sibling;
  return e.subtreeFlags |= r, e.childLanes = n, t;
}
function rp(e, t, n) {
  var r = t.pendingProps;
  switch (Xo(t), t.tag) {
    case 2:
    case 16:
    case 15:
    case 0:
    case 11:
    case 7:
    case 8:
    case 12:
    case 9:
    case 14:
      return Ue(t), null;
    case 1:
      return Ze(t.type) && Ol(), Ue(t), null;
    case 3:
      return r = t.stateNode, Gn(), he(qe), he(be), li(), r.pendingContext && (r.context = r.pendingContext, r.pendingContext = null), (e === null || e.child === null) && (ll(t) ? t.flags |= 4 : e === null || e.memoizedState.isDehydrated && !(t.flags & 256) || (t.flags |= 1024, xt !== null && (Co(xt), xt = null))), xo(e, t), Ue(t), null;
    case 5:
      ri(t);
      var l = vn(Mr.current);
      if (n = t.type, e !== null && t.stateNode != null) _c(e, t, n, r, l), e.ref !== t.ref && (t.flags |= 512, t.flags |= 2097152);
      else {
        if (!r) {
          if (t.stateNode === null) throw Error(E(166));
          return Ue(t), null;
        }
        if (e = vn(Lt.current), ll(t)) {
          r = t.stateNode, n = t.type;
          var s = t.memoizedProps;
          switch (r[Tt] = t, r[Ir] = s, e = (t.mode & 1) !== 0, n) {
            case "dialog":
              me("cancel", r), me("close", r);
              break;
            case "iframe":
            case "object":
            case "embed":
              me("load", r);
              break;
            case "video":
            case "audio":
              for (l = 0; l < mr.length; l++) me(mr[l], r);
              break;
            case "source":
              me("error", r);
              break;
            case "img":
            case "image":
            case "link":
              me("error", r), me("load", r);
              break;
            case "details":
              me("toggle", r);
              break;
            case "input":
              Ti(r, s), me("invalid", r);
              break;
            case "select":
              r._wrapperState = { wasMultiple: !!s.multiple }, me("invalid", r);
              break;
            case "textarea":
              Li(r, s), me("invalid", r);
          }
          Hs(n, s), l = null;
          for (var o in s) if (s.hasOwnProperty(o)) {
            var u = s[o];
            o === "children" ? typeof u == "string" ? r.textContent !== u && (s.suppressHydrationWarning !== true && rl(r.textContent, u, e), l = ["children", u]) : typeof u == "number" && r.textContent !== "" + u && (s.suppressHydrationWarning !== true && rl(r.textContent, u, e), l = ["children", "" + u]) : Nr.hasOwnProperty(o) && u != null && o === "onScroll" && me("scroll", r);
          }
          switch (n) {
            case "input":
              Xr(r), Di(r, s, true);
              break;
            case "textarea":
              Xr(r), Oi(r);
              break;
            case "select":
            case "option":
              break;
            default:
              typeof s.onClick == "function" && (r.onclick = Ll);
          }
          r = l, t.updateQueue = r, r !== null && (t.flags |= 4);
        } else {
          o = l.nodeType === 9 ? l : l.ownerDocument, e === "http://www.w3.org/1999/xhtml" && (e = eu(n)), e === "http://www.w3.org/1999/xhtml" ? n === "script" ? (e = o.createElement("div"), e.innerHTML = "<script><\/script>", e = e.removeChild(e.firstChild)) : typeof r.is == "string" ? e = o.createElement(n, { is: r.is }) : (e = o.createElement(n), n === "select" && (o = e, r.multiple ? o.multiple = true : r.size && (o.size = r.size))) : e = o.createElementNS(e, n), e[Tt] = t, e[Ir] = r, Nc(e, t, false, false), t.stateNode = e;
          e: {
            switch (o = Qs(n, r), n) {
              case "dialog":
                me("cancel", e), me("close", e), l = r;
                break;
              case "iframe":
              case "object":
              case "embed":
                me("load", e), l = r;
                break;
              case "video":
              case "audio":
                for (l = 0; l < mr.length; l++) me(mr[l], e);
                l = r;
                break;
              case "source":
                me("error", e), l = r;
                break;
              case "img":
              case "image":
              case "link":
                me("error", e), me("load", e), l = r;
                break;
              case "details":
                me("toggle", e), l = r;
                break;
              case "input":
                Ti(e, r), l = Bs(e, r), me("invalid", e);
                break;
              case "option":
                l = r;
                break;
              case "select":
                e._wrapperState = { wasMultiple: !!r.multiple }, l = we({}, r, { value: void 0 }), me("invalid", e);
                break;
              case "textarea":
                Li(e, r), l = Vs(e, r), me("invalid", e);
                break;
              default:
                l = r;
            }
            Hs(n, l), u = l;
            for (s in u) if (u.hasOwnProperty(s)) {
              var a = u[s];
              s === "style" ? ru(e, a) : s === "dangerouslySetInnerHTML" ? (a = a ? a.__html : void 0, a != null && tu(e, a)) : s === "children" ? typeof a == "string" ? (n !== "textarea" || a !== "") && _r(e, a) : typeof a == "number" && _r(e, "" + a) : s !== "suppressContentEditableWarning" && s !== "suppressHydrationWarning" && s !== "autoFocus" && (Nr.hasOwnProperty(s) ? a != null && s === "onScroll" && me("scroll", e) : a != null && Io(e, s, a, o));
            }
            switch (n) {
              case "input":
                Xr(e), Di(e, r, false);
                break;
              case "textarea":
                Xr(e), Oi(e);
                break;
              case "option":
                r.value != null && e.setAttribute("value", "" + sn(r.value));
                break;
              case "select":
                e.multiple = !!r.multiple, s = r.value, s != null ? Bn(e, !!r.multiple, s, false) : r.defaultValue != null && Bn(e, !!r.multiple, r.defaultValue, true);
                break;
              default:
                typeof l.onClick == "function" && (e.onclick = Ll);
            }
            switch (n) {
              case "button":
              case "input":
              case "select":
              case "textarea":
                r = !!r.autoFocus;
                break e;
              case "img":
                r = true;
                break e;
              default:
                r = false;
            }
          }
          r && (t.flags |= 4);
        }
        t.ref !== null && (t.flags |= 512, t.flags |= 2097152);
      }
      return Ue(t), null;
    case 6:
      if (e && t.stateNode != null) jc(e, t, e.memoizedProps, r);
      else {
        if (typeof r != "string" && t.stateNode === null) throw Error(E(166));
        if (n = vn(Mr.current), vn(Lt.current), ll(t)) {
          if (r = t.stateNode, n = t.memoizedProps, r[Tt] = t, (s = r.nodeValue !== n) && (e = lt, e !== null)) switch (e.tag) {
            case 3:
              rl(r.nodeValue, n, (e.mode & 1) !== 0);
              break;
            case 5:
              e.memoizedProps.suppressHydrationWarning !== true && rl(r.nodeValue, n, (e.mode & 1) !== 0);
          }
          s && (t.flags |= 4);
        } else r = (n.nodeType === 9 ? n : n.ownerDocument).createTextNode(r), r[Tt] = t, t.stateNode = r;
      }
      return Ue(t), null;
    case 13:
      if (he(ye), r = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
        if (ge && rt !== null && t.mode & 1 && !(t.flags & 128)) Wu(), Yn(), t.flags |= 98560, s = false;
        else if (s = ll(t), r !== null && r.dehydrated !== null) {
          if (e === null) {
            if (!s) throw Error(E(318));
            if (s = t.memoizedState, s = s !== null ? s.dehydrated : null, !s) throw Error(E(317));
            s[Tt] = t;
          } else Yn(), !(t.flags & 128) && (t.memoizedState = null), t.flags |= 4;
          Ue(t), s = false;
        } else xt !== null && (Co(xt), xt = null), s = true;
        if (!s) return t.flags & 65536 ? t : null;
      }
      return t.flags & 128 ? (t.lanes = n, t) : (r = r !== null, r !== (e !== null && e.memoizedState !== null) && r && (t.child.flags |= 8192, t.mode & 1 && (e === null || ye.current & 1 ? Le === 0 && (Le = 3) : gi())), t.updateQueue !== null && (t.flags |= 4), Ue(t), null);
    case 4:
      return Gn(), xo(e, t), e === null && Rr(t.stateNode.containerInfo), Ue(t), null;
    case 10:
      return Zo(t.type._context), Ue(t), null;
    case 17:
      return Ze(t.type) && Ol(), Ue(t), null;
    case 19:
      if (he(ye), s = t.memoizedState, s === null) return Ue(t), null;
      if (r = (t.flags & 128) !== 0, o = s.rendering, o === null) if (r) ur(s, false);
      else {
        if (Le !== 0 || e !== null && e.flags & 128) for (e = t.child; e !== null; ) {
          if (o = Fl(e), o !== null) {
            for (t.flags |= 128, ur(s, false), r = o.updateQueue, r !== null && (t.updateQueue = r, t.flags |= 4), t.subtreeFlags = 0, r = n, n = t.child; n !== null; ) s = n, e = r, s.flags &= 14680066, o = s.alternate, o === null ? (s.childLanes = 0, s.lanes = e, s.child = null, s.subtreeFlags = 0, s.memoizedProps = null, s.memoizedState = null, s.updateQueue = null, s.dependencies = null, s.stateNode = null) : (s.childLanes = o.childLanes, s.lanes = o.lanes, s.child = o.child, s.subtreeFlags = 0, s.deletions = null, s.memoizedProps = o.memoizedProps, s.memoizedState = o.memoizedState, s.updateQueue = o.updateQueue, s.type = o.type, e = o.dependencies, s.dependencies = e === null ? null : { lanes: e.lanes, firstContext: e.firstContext }), n = n.sibling;
            return ce(ye, ye.current & 1 | 2), t.child;
          }
          e = e.sibling;
        }
        s.tail !== null && _e() > qn && (t.flags |= 128, r = true, ur(s, false), t.lanes = 4194304);
      }
      else {
        if (!r) if (e = Fl(o), e !== null) {
          if (t.flags |= 128, r = true, n = e.updateQueue, n !== null && (t.updateQueue = n, t.flags |= 4), ur(s, true), s.tail === null && s.tailMode === "hidden" && !o.alternate && !ge) return Ue(t), null;
        } else 2 * _e() - s.renderingStartTime > qn && n !== 1073741824 && (t.flags |= 128, r = true, ur(s, false), t.lanes = 4194304);
        s.isBackwards ? (o.sibling = t.child, t.child = o) : (n = s.last, n !== null ? n.sibling = o : t.child = o, s.last = o);
      }
      return s.tail !== null ? (t = s.tail, s.rendering = t, s.tail = t.sibling, s.renderingStartTime = _e(), t.sibling = null, n = ye.current, ce(ye, r ? n & 1 | 2 : n & 1), t) : (Ue(t), null);
    case 22:
    case 23:
      return hi(), r = t.memoizedState !== null, e !== null && e.memoizedState !== null !== r && (t.flags |= 8192), r && t.mode & 1 ? nt & 1073741824 && (Ue(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : Ue(t), null;
    case 24:
      return null;
    case 25:
      return null;
  }
  throw Error(E(156, t.tag));
}
function lp(e, t) {
  switch (Xo(t), t.tag) {
    case 1:
      return Ze(t.type) && Ol(), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
    case 3:
      return Gn(), he(qe), he(be), li(), e = t.flags, e & 65536 && !(e & 128) ? (t.flags = e & -65537 | 128, t) : null;
    case 5:
      return ri(t), null;
    case 13:
      if (he(ye), e = t.memoizedState, e !== null && e.dehydrated !== null) {
        if (t.alternate === null) throw Error(E(340));
        Yn();
      }
      return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
    case 19:
      return he(ye), null;
    case 4:
      return Gn(), null;
    case 10:
      return Zo(t.type._context), null;
    case 22:
    case 23:
      return hi(), null;
    case 24:
      return null;
    default:
      return null;
  }
}
var il = false, Be = false, sp = typeof WeakSet == "function" ? WeakSet : Set, P = null;
function Fn(e, t) {
  var n = e.ref;
  if (n !== null) if (typeof n == "function") try {
    n(null);
  } catch (r) {
    ke(e, t, r);
  }
  else n.current = null;
}
function wo(e, t, n) {
  try {
    n();
  } catch (r) {
    ke(e, t, r);
  }
}
var wa = false;
function op(e, t) {
  if (no = Cl, e = Ou(), Ko(e)) {
    if ("selectionStart" in e) var n = { start: e.selectionStart, end: e.selectionEnd };
    else e: {
      n = (n = e.ownerDocument) && n.defaultView || window;
      var r = n.getSelection && n.getSelection();
      if (r && r.rangeCount !== 0) {
        n = r.anchorNode;
        var l = r.anchorOffset, s = r.focusNode;
        r = r.focusOffset;
        try {
          n.nodeType, s.nodeType;
        } catch {
          n = null;
          break e;
        }
        var o = 0, u = -1, a = -1, p = 0, g = 0, v = e, y = null;
        t: for (; ; ) {
          for (var C; v !== n || l !== 0 && v.nodeType !== 3 || (u = o + l), v !== s || r !== 0 && v.nodeType !== 3 || (a = o + r), v.nodeType === 3 && (o += v.nodeValue.length), (C = v.firstChild) !== null; ) y = v, v = C;
          for (; ; ) {
            if (v === e) break t;
            if (y === n && ++p === l && (u = o), y === s && ++g === r && (a = o), (C = v.nextSibling) !== null) break;
            v = y, y = v.parentNode;
          }
          v = C;
        }
        n = u === -1 || a === -1 ? null : { start: u, end: a };
      } else n = null;
    }
    n = n || { start: 0, end: 0 };
  } else n = null;
  for (ro = { focusedElem: e, selectionRange: n }, Cl = false, P = t; P !== null; ) if (t = P, e = t.child, (t.subtreeFlags & 1028) !== 0 && e !== null) e.return = t, P = e;
  else for (; P !== null; ) {
    t = P;
    try {
      var T = t.alternate;
      if (t.flags & 1024) switch (t.tag) {
        case 0:
        case 11:
        case 15:
          break;
        case 1:
          if (T !== null) {
            var R = T.memoizedProps, J = T.memoizedState, m = t.stateNode, d = m.getSnapshotBeforeUpdate(t.elementType === t.type ? R : vt(t.type, R), J);
            m.__reactInternalSnapshotBeforeUpdate = d;
          }
          break;
        case 3:
          var h = t.stateNode.containerInfo;
          h.nodeType === 1 ? h.textContent = "" : h.nodeType === 9 && h.documentElement && h.removeChild(h.documentElement);
          break;
        case 5:
        case 6:
        case 4:
        case 17:
          break;
        default:
          throw Error(E(163));
      }
    } catch (S) {
      ke(t, t.return, S);
    }
    if (e = t.sibling, e !== null) {
      e.return = t.return, P = e;
      break;
    }
    P = t.return;
  }
  return T = wa, wa = false, T;
}
function Sr(e, t, n) {
  var r = t.updateQueue;
  if (r = r !== null ? r.lastEffect : null, r !== null) {
    var l = r = r.next;
    do {
      if ((l.tag & e) === e) {
        var s = l.destroy;
        l.destroy = void 0, s !== void 0 && wo(t, n, s);
      }
      l = l.next;
    } while (l !== r);
  }
}
function ts(e, t) {
  if (t = t.updateQueue, t = t !== null ? t.lastEffect : null, t !== null) {
    var n = t = t.next;
    do {
      if ((n.tag & e) === e) {
        var r = n.create;
        n.destroy = r();
      }
      n = n.next;
    } while (n !== t);
  }
}
function So(e) {
  var t = e.ref;
  if (t !== null) {
    var n = e.stateNode;
    switch (e.tag) {
      case 5:
        e = n;
        break;
      default:
        e = n;
    }
    typeof t == "function" ? t(e) : t.current = e;
  }
}
function Cc(e) {
  var t = e.alternate;
  t !== null && (e.alternate = null, Cc(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && (delete t[Tt], delete t[Ir], delete t[oo], delete t[$f], delete t[Vf])), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
}
function Tc(e) {
  return e.tag === 5 || e.tag === 3 || e.tag === 4;
}
function Sa(e) {
  e: for (; ; ) {
    for (; e.sibling === null; ) {
      if (e.return === null || Tc(e.return)) return null;
      e = e.return;
    }
    for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18; ) {
      if (e.flags & 2 || e.child === null || e.tag === 4) continue e;
      e.child.return = e, e = e.child;
    }
    if (!(e.flags & 2)) return e.stateNode;
  }
}
function Eo(e, t, n) {
  var r = e.tag;
  if (r === 5 || r === 6) e = e.stateNode, t ? n.nodeType === 8 ? n.parentNode.insertBefore(e, t) : n.insertBefore(e, t) : (n.nodeType === 8 ? (t = n.parentNode, t.insertBefore(e, n)) : (t = n, t.appendChild(e)), n = n._reactRootContainer, n != null || t.onclick !== null || (t.onclick = Ll));
  else if (r !== 4 && (e = e.child, e !== null)) for (Eo(e, t, n), e = e.sibling; e !== null; ) Eo(e, t, n), e = e.sibling;
}
function ko(e, t, n) {
  var r = e.tag;
  if (r === 5 || r === 6) e = e.stateNode, t ? n.insertBefore(e, t) : n.appendChild(e);
  else if (r !== 4 && (e = e.child, e !== null)) for (ko(e, t, n), e = e.sibling; e !== null; ) ko(e, t, n), e = e.sibling;
}
var ze = null, yt = false;
function Wt(e, t, n) {
  for (n = n.child; n !== null; ) Dc(e, t, n), n = n.sibling;
}
function Dc(e, t, n) {
  if (Dt && typeof Dt.onCommitFiberUnmount == "function") try {
    Dt.onCommitFiberUnmount(Kl, n);
  } catch {
  }
  switch (n.tag) {
    case 5:
      Be || Fn(n, t);
    case 6:
      var r = ze, l = yt;
      ze = null, Wt(e, t, n), ze = r, yt = l, ze !== null && (yt ? (e = ze, n = n.stateNode, e.nodeType === 8 ? e.parentNode.removeChild(n) : e.removeChild(n)) : ze.removeChild(n.stateNode));
      break;
    case 18:
      ze !== null && (yt ? (e = ze, n = n.stateNode, e.nodeType === 8 ? Ns(e.parentNode, n) : e.nodeType === 1 && Ns(e, n), Dr(e)) : Ns(ze, n.stateNode));
      break;
    case 4:
      r = ze, l = yt, ze = n.stateNode.containerInfo, yt = true, Wt(e, t, n), ze = r, yt = l;
      break;
    case 0:
    case 11:
    case 14:
    case 15:
      if (!Be && (r = n.updateQueue, r !== null && (r = r.lastEffect, r !== null))) {
        l = r = r.next;
        do {
          var s = l, o = s.destroy;
          s = s.tag, o !== void 0 && (s & 2 || s & 4) && wo(n, t, o), l = l.next;
        } while (l !== r);
      }
      Wt(e, t, n);
      break;
    case 1:
      if (!Be && (Fn(n, t), r = n.stateNode, typeof r.componentWillUnmount == "function")) try {
        r.props = n.memoizedProps, r.state = n.memoizedState, r.componentWillUnmount();
      } catch (u) {
        ke(n, t, u);
      }
      Wt(e, t, n);
      break;
    case 21:
      Wt(e, t, n);
      break;
    case 22:
      n.mode & 1 ? (Be = (r = Be) || n.memoizedState !== null, Wt(e, t, n), Be = r) : Wt(e, t, n);
      break;
    default:
      Wt(e, t, n);
  }
}
function Ea(e) {
  var t = e.updateQueue;
  if (t !== null) {
    e.updateQueue = null;
    var n = e.stateNode;
    n === null && (n = e.stateNode = new sp()), t.forEach(function(r) {
      var l = hp.bind(null, e, r);
      n.has(r) || (n.add(r), r.then(l, l));
    });
  }
}
function gt(e, t) {
  var n = t.deletions;
  if (n !== null) for (var r = 0; r < n.length; r++) {
    var l = n[r];
    try {
      var s = e, o = t, u = o;
      e: for (; u !== null; ) {
        switch (u.tag) {
          case 5:
            ze = u.stateNode, yt = false;
            break e;
          case 3:
            ze = u.stateNode.containerInfo, yt = true;
            break e;
          case 4:
            ze = u.stateNode.containerInfo, yt = true;
            break e;
        }
        u = u.return;
      }
      if (ze === null) throw Error(E(160));
      Dc(s, o, l), ze = null, yt = false;
      var a = l.alternate;
      a !== null && (a.return = null), l.return = null;
    } catch (p) {
      ke(l, t, p);
    }
  }
  if (t.subtreeFlags & 12854) for (t = t.child; t !== null; ) Lc(t, e), t = t.sibling;
}
function Lc(e, t) {
  var n = e.alternate, r = e.flags;
  switch (e.tag) {
    case 0:
    case 11:
    case 14:
    case 15:
      if (gt(t, e), jt(e), r & 4) {
        try {
          Sr(3, e, e.return), ts(3, e);
        } catch (R) {
          ke(e, e.return, R);
        }
        try {
          Sr(5, e, e.return);
        } catch (R) {
          ke(e, e.return, R);
        }
      }
      break;
    case 1:
      gt(t, e), jt(e), r & 512 && n !== null && Fn(n, n.return);
      break;
    case 5:
      if (gt(t, e), jt(e), r & 512 && n !== null && Fn(n, n.return), e.flags & 32) {
        var l = e.stateNode;
        try {
          _r(l, "");
        } catch (R) {
          ke(e, e.return, R);
        }
      }
      if (r & 4 && (l = e.stateNode, l != null)) {
        var s = e.memoizedProps, o = n !== null ? n.memoizedProps : s, u = e.type, a = e.updateQueue;
        if (e.updateQueue = null, a !== null) try {
          u === "input" && s.type === "radio" && s.name != null && qa(l, s), Qs(u, o);
          var p = Qs(u, s);
          for (o = 0; o < a.length; o += 2) {
            var g = a[o], v = a[o + 1];
            g === "style" ? ru(l, v) : g === "dangerouslySetInnerHTML" ? tu(l, v) : g === "children" ? _r(l, v) : Io(l, g, v, p);
          }
          switch (u) {
            case "input":
              bs(l, s);
              break;
            case "textarea":
              Za(l, s);
              break;
            case "select":
              var y = l._wrapperState.wasMultiple;
              l._wrapperState.wasMultiple = !!s.multiple;
              var C = s.value;
              C != null ? Bn(l, !!s.multiple, C, false) : y !== !!s.multiple && (s.defaultValue != null ? Bn(l, !!s.multiple, s.defaultValue, true) : Bn(l, !!s.multiple, s.multiple ? [] : "", false));
          }
          l[Ir] = s;
        } catch (R) {
          ke(e, e.return, R);
        }
      }
      break;
    case 6:
      if (gt(t, e), jt(e), r & 4) {
        if (e.stateNode === null) throw Error(E(162));
        l = e.stateNode, s = e.memoizedProps;
        try {
          l.nodeValue = s;
        } catch (R) {
          ke(e, e.return, R);
        }
      }
      break;
    case 3:
      if (gt(t, e), jt(e), r & 4 && n !== null && n.memoizedState.isDehydrated) try {
        Dr(t.containerInfo);
      } catch (R) {
        ke(e, e.return, R);
      }
      break;
    case 4:
      gt(t, e), jt(e);
      break;
    case 13:
      gt(t, e), jt(e), l = e.child, l.flags & 8192 && (s = l.memoizedState !== null, l.stateNode.isHidden = s, !s || l.alternate !== null && l.alternate.memoizedState !== null || (pi = _e())), r & 4 && Ea(e);
      break;
    case 22:
      if (g = n !== null && n.memoizedState !== null, e.mode & 1 ? (Be = (p = Be) || g, gt(t, e), Be = p) : gt(t, e), jt(e), r & 8192) {
        if (p = e.memoizedState !== null, (e.stateNode.isHidden = p) && !g && e.mode & 1) for (P = e, g = e.child; g !== null; ) {
          for (v = P = g; P !== null; ) {
            switch (y = P, C = y.child, y.tag) {
              case 0:
              case 11:
              case 14:
              case 15:
                Sr(4, y, y.return);
                break;
              case 1:
                Fn(y, y.return);
                var T = y.stateNode;
                if (typeof T.componentWillUnmount == "function") {
                  r = y, n = y.return;
                  try {
                    t = r, T.props = t.memoizedProps, T.state = t.memoizedState, T.componentWillUnmount();
                  } catch (R) {
                    ke(r, n, R);
                  }
                }
                break;
              case 5:
                Fn(y, y.return);
                break;
              case 22:
                if (y.memoizedState !== null) {
                  Na(v);
                  continue;
                }
            }
            C !== null ? (C.return = y, P = C) : Na(v);
          }
          g = g.sibling;
        }
        e: for (g = null, v = e; ; ) {
          if (v.tag === 5) {
            if (g === null) {
              g = v;
              try {
                l = v.stateNode, p ? (s = l.style, typeof s.setProperty == "function" ? s.setProperty("display", "none", "important") : s.display = "none") : (u = v.stateNode, a = v.memoizedProps.style, o = a != null && a.hasOwnProperty("display") ? a.display : null, u.style.display = nu("display", o));
              } catch (R) {
                ke(e, e.return, R);
              }
            }
          } else if (v.tag === 6) {
            if (g === null) try {
              v.stateNode.nodeValue = p ? "" : v.memoizedProps;
            } catch (R) {
              ke(e, e.return, R);
            }
          } else if ((v.tag !== 22 && v.tag !== 23 || v.memoizedState === null || v === e) && v.child !== null) {
            v.child.return = v, v = v.child;
            continue;
          }
          if (v === e) break e;
          for (; v.sibling === null; ) {
            if (v.return === null || v.return === e) break e;
            g === v && (g = null), v = v.return;
          }
          g === v && (g = null), v.sibling.return = v.return, v = v.sibling;
        }
      }
      break;
    case 19:
      gt(t, e), jt(e), r & 4 && Ea(e);
      break;
    case 21:
      break;
    default:
      gt(t, e), jt(e);
  }
}
function jt(e) {
  var t = e.flags;
  if (t & 2) {
    try {
      e: {
        for (var n = e.return; n !== null; ) {
          if (Tc(n)) {
            var r = n;
            break e;
          }
          n = n.return;
        }
        throw Error(E(160));
      }
      switch (r.tag) {
        case 5:
          var l = r.stateNode;
          r.flags & 32 && (_r(l, ""), r.flags &= -33);
          var s = Sa(e);
          ko(e, s, l);
          break;
        case 3:
        case 4:
          var o = r.stateNode.containerInfo, u = Sa(e);
          Eo(e, u, o);
          break;
        default:
          throw Error(E(161));
      }
    } catch (a) {
      ke(e, e.return, a);
    }
    e.flags &= -3;
  }
  t & 4096 && (e.flags &= -4097);
}
function ip(e, t, n) {
  P = e, Oc(e);
}
function Oc(e, t, n) {
  for (var r = (e.mode & 1) !== 0; P !== null; ) {
    var l = P, s = l.child;
    if (l.tag === 22 && r) {
      var o = l.memoizedState !== null || il;
      if (!o) {
        var u = l.alternate, a = u !== null && u.memoizedState !== null || Be;
        u = il;
        var p = Be;
        if (il = o, (Be = a) && !p) for (P = l; P !== null; ) o = P, a = o.child, o.tag === 22 && o.memoizedState !== null ? _a(l) : a !== null ? (a.return = o, P = a) : _a(l);
        for (; s !== null; ) P = s, Oc(s), s = s.sibling;
        P = l, il = u, Be = p;
      }
      ka(e);
    } else l.subtreeFlags & 8772 && s !== null ? (s.return = l, P = s) : ka(e);
  }
}
function ka(e) {
  for (; P !== null; ) {
    var t = P;
    if (t.flags & 8772) {
      var n = t.alternate;
      try {
        if (t.flags & 8772) switch (t.tag) {
          case 0:
          case 11:
          case 15:
            Be || ts(5, t);
            break;
          case 1:
            var r = t.stateNode;
            if (t.flags & 4 && !Be) if (n === null) r.componentDidMount();
            else {
              var l = t.elementType === t.type ? n.memoizedProps : vt(t.type, n.memoizedProps);
              r.componentDidUpdate(l, n.memoizedState, r.__reactInternalSnapshotBeforeUpdate);
            }
            var s = t.updateQueue;
            s !== null && ia(t, s, r);
            break;
          case 3:
            var o = t.updateQueue;
            if (o !== null) {
              if (n = null, t.child !== null) switch (t.child.tag) {
                case 5:
                  n = t.child.stateNode;
                  break;
                case 1:
                  n = t.child.stateNode;
              }
              ia(t, o, n);
            }
            break;
          case 5:
            var u = t.stateNode;
            if (n === null && t.flags & 4) {
              n = u;
              var a = t.memoizedProps;
              switch (t.type) {
                case "button":
                case "input":
                case "select":
                case "textarea":
                  a.autoFocus && n.focus();
                  break;
                case "img":
                  a.src && (n.src = a.src);
              }
            }
            break;
          case 6:
            break;
          case 4:
            break;
          case 12:
            break;
          case 13:
            if (t.memoizedState === null) {
              var p = t.alternate;
              if (p !== null) {
                var g = p.memoizedState;
                if (g !== null) {
                  var v = g.dehydrated;
                  v !== null && Dr(v);
                }
              }
            }
            break;
          case 19:
          case 17:
          case 21:
          case 22:
          case 23:
          case 25:
            break;
          default:
            throw Error(E(163));
        }
        Be || t.flags & 512 && So(t);
      } catch (y) {
        ke(t, t.return, y);
      }
    }
    if (t === e) {
      P = null;
      break;
    }
    if (n = t.sibling, n !== null) {
      n.return = t.return, P = n;
      break;
    }
    P = t.return;
  }
}
function Na(e) {
  for (; P !== null; ) {
    var t = P;
    if (t === e) {
      P = null;
      break;
    }
    var n = t.sibling;
    if (n !== null) {
      n.return = t.return, P = n;
      break;
    }
    P = t.return;
  }
}
function _a(e) {
  for (; P !== null; ) {
    var t = P;
    try {
      switch (t.tag) {
        case 0:
        case 11:
        case 15:
          var n = t.return;
          try {
            ts(4, t);
          } catch (a) {
            ke(t, n, a);
          }
          break;
        case 1:
          var r = t.stateNode;
          if (typeof r.componentDidMount == "function") {
            var l = t.return;
            try {
              r.componentDidMount();
            } catch (a) {
              ke(t, l, a);
            }
          }
          var s = t.return;
          try {
            So(t);
          } catch (a) {
            ke(t, s, a);
          }
          break;
        case 5:
          var o = t.return;
          try {
            So(t);
          } catch (a) {
            ke(t, o, a);
          }
      }
    } catch (a) {
      ke(t, t.return, a);
    }
    if (t === e) {
      P = null;
      break;
    }
    var u = t.sibling;
    if (u !== null) {
      u.return = t.return, P = u;
      break;
    }
    P = t.return;
  }
}
var ap = Math.ceil, bl = bt.ReactCurrentDispatcher, di = bt.ReactCurrentOwner, ft = bt.ReactCurrentBatchConfig, q = 0, Ie = null, Te = null, Me = 0, nt = 0, Un = un(0), Le = 0, Br = null, kn = 0, ns = 0, fi = 0, Er = null, Ge = null, pi = 0, qn = 1 / 0, Rt = null, $l = false, No = null, nn = null, al = false, Gt = null, Vl = 0, kr = 0, _o = null, xl = -1, wl = 0;
function He() {
  return q & 6 ? _e() : xl !== -1 ? xl : xl = _e();
}
function rn(e) {
  return e.mode & 1 ? q & 2 && Me !== 0 ? Me & -Me : Hf.transition !== null ? (wl === 0 && (wl = hu()), wl) : (e = re, e !== 0 || (e = window.event, e = e === void 0 ? 16 : Eu(e.type)), e) : 1;
}
function St(e, t, n, r) {
  if (50 < kr) throw kr = 0, _o = null, Error(E(185));
  $r(e, n, r), (!(q & 2) || e !== Ie) && (e === Ie && (!(q & 2) && (ns |= n), Le === 4 && Yt(e, Me)), et(e, r), n === 1 && q === 0 && !(t.mode & 1) && (qn = _e() + 500, ql && cn()));
}
function et(e, t) {
  var n = e.callbackNode;
  Wd(e, t);
  var r = jl(e, e === Ie ? Me : 0);
  if (r === 0) n !== null && Ii(n), e.callbackNode = null, e.callbackPriority = 0;
  else if (t = r & -r, e.callbackPriority !== t) {
    if (n != null && Ii(n), t === 1) e.tag === 0 ? Wf(ja.bind(null, e)) : bu(ja.bind(null, e)), Bf(function() {
      !(q & 6) && cn();
    }), n = null;
    else {
      switch (gu(r)) {
        case 1:
          n = Uo;
          break;
        case 4:
          n = pu;
          break;
        case 16:
          n = _l;
          break;
        case 536870912:
          n = mu;
          break;
        default:
          n = _l;
      }
      n = Uc(n, Rc.bind(null, e));
    }
    e.callbackPriority = t, e.callbackNode = n;
  }
}
function Rc(e, t) {
  if (xl = -1, wl = 0, q & 6) throw Error(E(327));
  var n = e.callbackNode;
  if (Hn() && e.callbackNode !== n) return null;
  var r = jl(e, e === Ie ? Me : 0);
  if (r === 0) return null;
  if (r & 30 || r & e.expiredLanes || t) t = Wl(e, r);
  else {
    t = r;
    var l = q;
    q |= 2;
    var s = Ic();
    (Ie !== e || Me !== t) && (Rt = null, qn = _e() + 500, yn(e, t));
    do
      try {
        dp();
        break;
      } catch (u) {
        Pc(e, u);
      }
    while (true);
    qo(), bl.current = s, q = l, Te !== null ? t = 0 : (Ie = null, Me = 0, t = Le);
  }
  if (t !== 0) {
    if (t === 2 && (l = Js(e), l !== 0 && (r = l, t = jo(e, l))), t === 1) throw n = Br, yn(e, 0), Yt(e, r), et(e, _e()), n;
    if (t === 6) Yt(e, r);
    else {
      if (l = e.current.alternate, !(r & 30) && !up(l) && (t = Wl(e, r), t === 2 && (s = Js(e), s !== 0 && (r = s, t = jo(e, s))), t === 1)) throw n = Br, yn(e, 0), Yt(e, r), et(e, _e()), n;
      switch (e.finishedWork = l, e.finishedLanes = r, t) {
        case 0:
        case 1:
          throw Error(E(345));
        case 2:
          mn(e, Ge, Rt);
          break;
        case 3:
          if (Yt(e, r), (r & 130023424) === r && (t = pi + 500 - _e(), 10 < t)) {
            if (jl(e, 0) !== 0) break;
            if (l = e.suspendedLanes, (l & r) !== r) {
              He(), e.pingedLanes |= e.suspendedLanes & l;
              break;
            }
            e.timeoutHandle = so(mn.bind(null, e, Ge, Rt), t);
            break;
          }
          mn(e, Ge, Rt);
          break;
        case 4:
          if (Yt(e, r), (r & 4194240) === r) break;
          for (t = e.eventTimes, l = -1; 0 < r; ) {
            var o = 31 - wt(r);
            s = 1 << o, o = t[o], o > l && (l = o), r &= ~s;
          }
          if (r = l, r = _e() - r, r = (120 > r ? 120 : 480 > r ? 480 : 1080 > r ? 1080 : 1920 > r ? 1920 : 3e3 > r ? 3e3 : 4320 > r ? 4320 : 1960 * ap(r / 1960)) - r, 10 < r) {
            e.timeoutHandle = so(mn.bind(null, e, Ge, Rt), r);
            break;
          }
          mn(e, Ge, Rt);
          break;
        case 5:
          mn(e, Ge, Rt);
          break;
        default:
          throw Error(E(329));
      }
    }
  }
  return et(e, _e()), e.callbackNode === n ? Rc.bind(null, e) : null;
}
function jo(e, t) {
  var n = Er;
  return e.current.memoizedState.isDehydrated && (yn(e, t).flags |= 256), e = Wl(e, t), e !== 2 && (t = Ge, Ge = n, t !== null && Co(t)), e;
}
function Co(e) {
  Ge === null ? Ge = e : Ge.push.apply(Ge, e);
}
function up(e) {
  for (var t = e; ; ) {
    if (t.flags & 16384) {
      var n = t.updateQueue;
      if (n !== null && (n = n.stores, n !== null)) for (var r = 0; r < n.length; r++) {
        var l = n[r], s = l.getSnapshot;
        l = l.value;
        try {
          if (!Et(s(), l)) return false;
        } catch {
          return false;
        }
      }
    }
    if (n = t.child, t.subtreeFlags & 16384 && n !== null) n.return = t, t = n;
    else {
      if (t === e) break;
      for (; t.sibling === null; ) {
        if (t.return === null || t.return === e) return true;
        t = t.return;
      }
      t.sibling.return = t.return, t = t.sibling;
    }
  }
  return true;
}
function Yt(e, t) {
  for (t &= ~fi, t &= ~ns, e.suspendedLanes |= t, e.pingedLanes &= ~t, e = e.expirationTimes; 0 < t; ) {
    var n = 31 - wt(t), r = 1 << n;
    e[n] = -1, t &= ~r;
  }
}
function ja(e) {
  if (q & 6) throw Error(E(327));
  Hn();
  var t = jl(e, 0);
  if (!(t & 1)) return et(e, _e()), null;
  var n = Wl(e, t);
  if (e.tag !== 0 && n === 2) {
    var r = Js(e);
    r !== 0 && (t = r, n = jo(e, r));
  }
  if (n === 1) throw n = Br, yn(e, 0), Yt(e, t), et(e, _e()), n;
  if (n === 6) throw Error(E(345));
  return e.finishedWork = e.current.alternate, e.finishedLanes = t, mn(e, Ge, Rt), et(e, _e()), null;
}
function mi(e, t) {
  var n = q;
  q |= 1;
  try {
    return e(t);
  } finally {
    q = n, q === 0 && (qn = _e() + 500, ql && cn());
  }
}
function Nn(e) {
  Gt !== null && Gt.tag === 0 && !(q & 6) && Hn();
  var t = q;
  q |= 1;
  var n = ft.transition, r = re;
  try {
    if (ft.transition = null, re = 1, e) return e();
  } finally {
    re = r, ft.transition = n, q = t, !(q & 6) && cn();
  }
}
function hi() {
  nt = Un.current, he(Un);
}
function yn(e, t) {
  e.finishedWork = null, e.finishedLanes = 0;
  var n = e.timeoutHandle;
  if (n !== -1 && (e.timeoutHandle = -1, Uf(n)), Te !== null) for (n = Te.return; n !== null; ) {
    var r = n;
    switch (Xo(r), r.tag) {
      case 1:
        r = r.type.childContextTypes, r != null && Ol();
        break;
      case 3:
        Gn(), he(qe), he(be), li();
        break;
      case 5:
        ri(r);
        break;
      case 4:
        Gn();
        break;
      case 13:
        he(ye);
        break;
      case 19:
        he(ye);
        break;
      case 10:
        Zo(r.type._context);
        break;
      case 22:
      case 23:
        hi();
    }
    n = n.return;
  }
  if (Ie = e, Te = e = ln(e.current, null), Me = nt = t, Le = 0, Br = null, fi = ns = kn = 0, Ge = Er = null, gn !== null) {
    for (t = 0; t < gn.length; t++) if (n = gn[t], r = n.interleaved, r !== null) {
      n.interleaved = null;
      var l = r.next, s = n.pending;
      if (s !== null) {
        var o = s.next;
        s.next = l, r.next = o;
      }
      n.pending = r;
    }
    gn = null;
  }
  return e;
}
function Pc(e, t) {
  do {
    var n = Te;
    try {
      if (qo(), gl.current = Bl, Ul) {
        for (var r = xe.memoizedState; r !== null; ) {
          var l = r.queue;
          l !== null && (l.pending = null), r = r.next;
        }
        Ul = false;
      }
      if (En = 0, Pe = De = xe = null, wr = false, Ar = 0, di.current = null, n === null || n.return === null) {
        Le = 1, Br = t, Te = null;
        break;
      }
      e: {
        var s = e, o = n.return, u = n, a = t;
        if (t = Me, u.flags |= 32768, a !== null && typeof a == "object" && typeof a.then == "function") {
          var p = a, g = u, v = g.tag;
          if (!(g.mode & 1) && (v === 0 || v === 11 || v === 15)) {
            var y = g.alternate;
            y ? (g.updateQueue = y.updateQueue, g.memoizedState = y.memoizedState, g.lanes = y.lanes) : (g.updateQueue = null, g.memoizedState = null);
          }
          var C = pa(o);
          if (C !== null) {
            C.flags &= -257, ma(C, o, u, s, t), C.mode & 1 && fa(s, p, t), t = C, a = p;
            var T = t.updateQueue;
            if (T === null) {
              var R = /* @__PURE__ */ new Set();
              R.add(a), t.updateQueue = R;
            } else T.add(a);
            break e;
          } else {
            if (!(t & 1)) {
              fa(s, p, t), gi();
              break e;
            }
            a = Error(E(426));
          }
        } else if (ge && u.mode & 1) {
          var J = pa(o);
          if (J !== null) {
            !(J.flags & 65536) && (J.flags |= 256), ma(J, o, u, s, t), Go(Jn(a, u));
            break e;
          }
        }
        s = a = Jn(a, u), Le !== 4 && (Le = 2), Er === null ? Er = [s] : Er.push(s), s = o;
        do {
          switch (s.tag) {
            case 3:
              s.flags |= 65536, t &= -t, s.lanes |= t;
              var m = gc(s, a, t);
              oa(s, m);
              break e;
            case 1:
              u = a;
              var d = s.type, h = s.stateNode;
              if (!(s.flags & 128) && (typeof d.getDerivedStateFromError == "function" || h !== null && typeof h.componentDidCatch == "function" && (nn === null || !nn.has(h)))) {
                s.flags |= 65536, t &= -t, s.lanes |= t;
                var S = vc(s, u, t);
                oa(s, S);
                break e;
              }
          }
          s = s.return;
        } while (s !== null);
      }
      Mc(n);
    } catch (L) {
      t = L, Te === n && n !== null && (Te = n = n.return);
      continue;
    }
    break;
  } while (true);
}
function Ic() {
  var e = bl.current;
  return bl.current = Bl, e === null ? Bl : e;
}
function gi() {
  (Le === 0 || Le === 3 || Le === 2) && (Le = 4), Ie === null || !(kn & 268435455) && !(ns & 268435455) || Yt(Ie, Me);
}
function Wl(e, t) {
  var n = q;
  q |= 2;
  var r = Ic();
  (Ie !== e || Me !== t) && (Rt = null, yn(e, t));
  do
    try {
      cp();
      break;
    } catch (l) {
      Pc(e, l);
    }
  while (true);
  if (qo(), q = n, bl.current = r, Te !== null) throw Error(E(261));
  return Ie = null, Me = 0, Le;
}
function cp() {
  for (; Te !== null; ) zc(Te);
}
function dp() {
  for (; Te !== null && !zd(); ) zc(Te);
}
function zc(e) {
  var t = Fc(e.alternate, e, nt);
  e.memoizedProps = e.pendingProps, t === null ? Mc(e) : Te = t, di.current = null;
}
function Mc(e) {
  var t = e;
  do {
    var n = t.alternate;
    if (e = t.return, t.flags & 32768) {
      if (n = lp(n, t), n !== null) {
        n.flags &= 32767, Te = n;
        return;
      }
      if (e !== null) e.flags |= 32768, e.subtreeFlags = 0, e.deletions = null;
      else {
        Le = 6, Te = null;
        return;
      }
    } else if (n = rp(n, t, nt), n !== null) {
      Te = n;
      return;
    }
    if (t = t.sibling, t !== null) {
      Te = t;
      return;
    }
    Te = t = e;
  } while (t !== null);
  Le === 0 && (Le = 5);
}
function mn(e, t, n) {
  var r = re, l = ft.transition;
  try {
    ft.transition = null, re = 1, fp(e, t, n, r);
  } finally {
    ft.transition = l, re = r;
  }
  return null;
}
function fp(e, t, n, r) {
  do
    Hn();
  while (Gt !== null);
  if (q & 6) throw Error(E(327));
  n = e.finishedWork;
  var l = e.finishedLanes;
  if (n === null) return null;
  if (e.finishedWork = null, e.finishedLanes = 0, n === e.current) throw Error(E(177));
  e.callbackNode = null, e.callbackPriority = 0;
  var s = n.lanes | n.childLanes;
  if (Hd(e, s), e === Ie && (Te = Ie = null, Me = 0), !(n.subtreeFlags & 2064) && !(n.flags & 2064) || al || (al = true, Uc(_l, function() {
    return Hn(), null;
  })), s = (n.flags & 15990) !== 0, n.subtreeFlags & 15990 || s) {
    s = ft.transition, ft.transition = null;
    var o = re;
    re = 1;
    var u = q;
    q |= 4, di.current = null, op(e, n), Lc(n, e), Rf(ro), Cl = !!no, ro = no = null, e.current = n, ip(n), Md(), q = u, re = o, ft.transition = s;
  } else e.current = n;
  if (al && (al = false, Gt = e, Vl = l), s = e.pendingLanes, s === 0 && (nn = null), Ud(n.stateNode), et(e, _e()), t !== null) for (r = e.onRecoverableError, n = 0; n < t.length; n++) l = t[n], r(l.value, { componentStack: l.stack, digest: l.digest });
  if ($l) throw $l = false, e = No, No = null, e;
  return Vl & 1 && e.tag !== 0 && Hn(), s = e.pendingLanes, s & 1 ? e === _o ? kr++ : (kr = 0, _o = e) : kr = 0, cn(), null;
}
function Hn() {
  if (Gt !== null) {
    var e = gu(Vl), t = ft.transition, n = re;
    try {
      if (ft.transition = null, re = 16 > e ? 16 : e, Gt === null) var r = false;
      else {
        if (e = Gt, Gt = null, Vl = 0, q & 6) throw Error(E(331));
        var l = q;
        for (q |= 4, P = e.current; P !== null; ) {
          var s = P, o = s.child;
          if (P.flags & 16) {
            var u = s.deletions;
            if (u !== null) {
              for (var a = 0; a < u.length; a++) {
                var p = u[a];
                for (P = p; P !== null; ) {
                  var g = P;
                  switch (g.tag) {
                    case 0:
                    case 11:
                    case 15:
                      Sr(8, g, s);
                  }
                  var v = g.child;
                  if (v !== null) v.return = g, P = v;
                  else for (; P !== null; ) {
                    g = P;
                    var y = g.sibling, C = g.return;
                    if (Cc(g), g === p) {
                      P = null;
                      break;
                    }
                    if (y !== null) {
                      y.return = C, P = y;
                      break;
                    }
                    P = C;
                  }
                }
              }
              var T = s.alternate;
              if (T !== null) {
                var R = T.child;
                if (R !== null) {
                  T.child = null;
                  do {
                    var J = R.sibling;
                    R.sibling = null, R = J;
                  } while (R !== null);
                }
              }
              P = s;
            }
          }
          if (s.subtreeFlags & 2064 && o !== null) o.return = s, P = o;
          else e: for (; P !== null; ) {
            if (s = P, s.flags & 2048) switch (s.tag) {
              case 0:
              case 11:
              case 15:
                Sr(9, s, s.return);
            }
            var m = s.sibling;
            if (m !== null) {
              m.return = s.return, P = m;
              break e;
            }
            P = s.return;
          }
        }
        var d = e.current;
        for (P = d; P !== null; ) {
          o = P;
          var h = o.child;
          if (o.subtreeFlags & 2064 && h !== null) h.return = o, P = h;
          else e: for (o = d; P !== null; ) {
            if (u = P, u.flags & 2048) try {
              switch (u.tag) {
                case 0:
                case 11:
                case 15:
                  ts(9, u);
              }
            } catch (L) {
              ke(u, u.return, L);
            }
            if (u === o) {
              P = null;
              break e;
            }
            var S = u.sibling;
            if (S !== null) {
              S.return = u.return, P = S;
              break e;
            }
            P = u.return;
          }
        }
        if (q = l, cn(), Dt && typeof Dt.onPostCommitFiberRoot == "function") try {
          Dt.onPostCommitFiberRoot(Kl, e);
        } catch {
        }
        r = true;
      }
      return r;
    } finally {
      re = n, ft.transition = t;
    }
  }
  return false;
}
function Ca(e, t, n) {
  t = Jn(n, t), t = gc(e, t, 1), e = tn(e, t, 1), t = He(), e !== null && ($r(e, 1, t), et(e, t));
}
function ke(e, t, n) {
  if (e.tag === 3) Ca(e, e, n);
  else for (; t !== null; ) {
    if (t.tag === 3) {
      Ca(t, e, n);
      break;
    } else if (t.tag === 1) {
      var r = t.stateNode;
      if (typeof t.type.getDerivedStateFromError == "function" || typeof r.componentDidCatch == "function" && (nn === null || !nn.has(r))) {
        e = Jn(n, e), e = vc(t, e, 1), t = tn(t, e, 1), e = He(), t !== null && ($r(t, 1, e), et(t, e));
        break;
      }
    }
    t = t.return;
  }
}
function pp(e, t, n) {
  var r = e.pingCache;
  r !== null && r.delete(t), t = He(), e.pingedLanes |= e.suspendedLanes & n, Ie === e && (Me & n) === n && (Le === 4 || Le === 3 && (Me & 130023424) === Me && 500 > _e() - pi ? yn(e, 0) : fi |= n), et(e, t);
}
function Ac(e, t) {
  t === 0 && (e.mode & 1 ? (t = qr, qr <<= 1, !(qr & 130023424) && (qr = 4194304)) : t = 1);
  var n = He();
  e = Ut(e, t), e !== null && ($r(e, t, n), et(e, n));
}
function mp(e) {
  var t = e.memoizedState, n = 0;
  t !== null && (n = t.retryLane), Ac(e, n);
}
function hp(e, t) {
  var n = 0;
  switch (e.tag) {
    case 13:
      var r = e.stateNode, l = e.memoizedState;
      l !== null && (n = l.retryLane);
      break;
    case 19:
      r = e.stateNode;
      break;
    default:
      throw Error(E(314));
  }
  r !== null && r.delete(t), Ac(e, n);
}
var Fc;
Fc = function(e, t, n) {
  if (e !== null) if (e.memoizedProps !== t.pendingProps || qe.current) Je = true;
  else {
    if (!(e.lanes & n) && !(t.flags & 128)) return Je = false, np(e, t, n);
    Je = !!(e.flags & 131072);
  }
  else Je = false, ge && t.flags & 1048576 && $u(t, Il, t.index);
  switch (t.lanes = 0, t.tag) {
    case 2:
      var r = t.type;
      yl(e, t), e = t.pendingProps;
      var l = Kn(t, be.current);
      Wn(t, n), l = oi(null, t, r, e, l, n);
      var s = ii();
      return t.flags |= 1, typeof l == "object" && l !== null && typeof l.render == "function" && l.$$typeof === void 0 ? (t.tag = 1, t.memoizedState = null, t.updateQueue = null, Ze(r) ? (s = true, Rl(t)) : s = false, t.memoizedState = l.state !== null && l.state !== void 0 ? l.state : null, ti(t), l.updater = es, t.stateNode = l, l._reactInternals = t, po(t, r, e, n), t = go(null, t, r, true, s, n)) : (t.tag = 0, ge && s && Yo(t), We(null, t, l, n), t = t.child), t;
    case 16:
      r = t.elementType;
      e: {
        switch (yl(e, t), e = t.pendingProps, l = r._init, r = l(r._payload), t.type = r, l = t.tag = vp(r), e = vt(r, e), l) {
          case 0:
            t = ho(null, t, r, e, n);
            break e;
          case 1:
            t = va(null, t, r, e, n);
            break e;
          case 11:
            t = ha(null, t, r, e, n);
            break e;
          case 14:
            t = ga(null, t, r, vt(r.type, e), n);
            break e;
        }
        throw Error(E(306, r, ""));
      }
      return t;
    case 0:
      return r = t.type, l = t.pendingProps, l = t.elementType === r ? l : vt(r, l), ho(e, t, r, l, n);
    case 1:
      return r = t.type, l = t.pendingProps, l = t.elementType === r ? l : vt(r, l), va(e, t, r, l, n);
    case 3:
      e: {
        if (Sc(t), e === null) throw Error(E(387));
        r = t.pendingProps, s = t.memoizedState, l = s.element, Yu(e, t), Al(t, r, null, n);
        var o = t.memoizedState;
        if (r = o.element, s.isDehydrated) if (s = { element: r, isDehydrated: false, cache: o.cache, pendingSuspenseBoundaries: o.pendingSuspenseBoundaries, transitions: o.transitions }, t.updateQueue.baseState = s, t.memoizedState = s, t.flags & 256) {
          l = Jn(Error(E(423)), t), t = ya(e, t, r, n, l);
          break e;
        } else if (r !== l) {
          l = Jn(Error(E(424)), t), t = ya(e, t, r, n, l);
          break e;
        } else for (rt = en(t.stateNode.containerInfo.firstChild), lt = t, ge = true, xt = null, n = Qu(t, null, r, n), t.child = n; n; ) n.flags = n.flags & -3 | 4096, n = n.sibling;
        else {
          if (Yn(), r === l) {
            t = Bt(e, t, n);
            break e;
          }
          We(e, t, r, n);
        }
        t = t.child;
      }
      return t;
    case 5:
      return Xu(t), e === null && uo(t), r = t.type, l = t.pendingProps, s = e !== null ? e.memoizedProps : null, o = l.children, lo(r, l) ? o = null : s !== null && lo(r, s) && (t.flags |= 32), wc(e, t), We(e, t, o, n), t.child;
    case 6:
      return e === null && uo(t), null;
    case 13:
      return Ec(e, t, n);
    case 4:
      return ni(t, t.stateNode.containerInfo), r = t.pendingProps, e === null ? t.child = Xn(t, null, r, n) : We(e, t, r, n), t.child;
    case 11:
      return r = t.type, l = t.pendingProps, l = t.elementType === r ? l : vt(r, l), ha(e, t, r, l, n);
    case 7:
      return We(e, t, t.pendingProps, n), t.child;
    case 8:
      return We(e, t, t.pendingProps.children, n), t.child;
    case 12:
      return We(e, t, t.pendingProps.children, n), t.child;
    case 10:
      e: {
        if (r = t.type._context, l = t.pendingProps, s = t.memoizedProps, o = l.value, ce(zl, r._currentValue), r._currentValue = o, s !== null) if (Et(s.value, o)) {
          if (s.children === l.children && !qe.current) {
            t = Bt(e, t, n);
            break e;
          }
        } else for (s = t.child, s !== null && (s.return = t); s !== null; ) {
          var u = s.dependencies;
          if (u !== null) {
            o = s.child;
            for (var a = u.firstContext; a !== null; ) {
              if (a.context === r) {
                if (s.tag === 1) {
                  a = Mt(-1, n & -n), a.tag = 2;
                  var p = s.updateQueue;
                  if (p !== null) {
                    p = p.shared;
                    var g = p.pending;
                    g === null ? a.next = a : (a.next = g.next, g.next = a), p.pending = a;
                  }
                }
                s.lanes |= n, a = s.alternate, a !== null && (a.lanes |= n), co(s.return, n, t), u.lanes |= n;
                break;
              }
              a = a.next;
            }
          } else if (s.tag === 10) o = s.type === t.type ? null : s.child;
          else if (s.tag === 18) {
            if (o = s.return, o === null) throw Error(E(341));
            o.lanes |= n, u = o.alternate, u !== null && (u.lanes |= n), co(o, n, t), o = s.sibling;
          } else o = s.child;
          if (o !== null) o.return = s;
          else for (o = s; o !== null; ) {
            if (o === t) {
              o = null;
              break;
            }
            if (s = o.sibling, s !== null) {
              s.return = o.return, o = s;
              break;
            }
            o = o.return;
          }
          s = o;
        }
        We(e, t, l.children, n), t = t.child;
      }
      return t;
    case 9:
      return l = t.type, r = t.pendingProps.children, Wn(t, n), l = pt(l), r = r(l), t.flags |= 1, We(e, t, r, n), t.child;
    case 14:
      return r = t.type, l = vt(r, t.pendingProps), l = vt(r.type, l), ga(e, t, r, l, n);
    case 15:
      return yc(e, t, t.type, t.pendingProps, n);
    case 17:
      return r = t.type, l = t.pendingProps, l = t.elementType === r ? l : vt(r, l), yl(e, t), t.tag = 1, Ze(r) ? (e = true, Rl(t)) : e = false, Wn(t, n), hc(t, r, l), po(t, r, l, n), go(null, t, r, true, e, n);
    case 19:
      return kc(e, t, n);
    case 22:
      return xc(e, t, n);
  }
  throw Error(E(156, t.tag));
};
function Uc(e, t) {
  return fu(e, t);
}
function gp(e, t, n, r) {
  this.tag = e, this.key = n, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = r, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
}
function dt(e, t, n, r) {
  return new gp(e, t, n, r);
}
function vi(e) {
  return e = e.prototype, !(!e || !e.isReactComponent);
}
function vp(e) {
  if (typeof e == "function") return vi(e) ? 1 : 0;
  if (e != null) {
    if (e = e.$$typeof, e === Mo) return 11;
    if (e === Ao) return 14;
  }
  return 2;
}
function ln(e, t) {
  var n = e.alternate;
  return n === null ? (n = dt(e.tag, t, e.key, e.mode), n.elementType = e.elementType, n.type = e.type, n.stateNode = e.stateNode, n.alternate = e, e.alternate = n) : (n.pendingProps = t, n.type = e.type, n.flags = 0, n.subtreeFlags = 0, n.deletions = null), n.flags = e.flags & 14680064, n.childLanes = e.childLanes, n.lanes = e.lanes, n.child = e.child, n.memoizedProps = e.memoizedProps, n.memoizedState = e.memoizedState, n.updateQueue = e.updateQueue, t = e.dependencies, n.dependencies = t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }, n.sibling = e.sibling, n.index = e.index, n.ref = e.ref, n;
}
function Sl(e, t, n, r, l, s) {
  var o = 2;
  if (r = e, typeof e == "function") vi(e) && (o = 1);
  else if (typeof e == "string") o = 5;
  else e: switch (e) {
    case Dn:
      return xn(n.children, l, s, t);
    case zo:
      o = 8, l |= 8;
      break;
    case Ms:
      return e = dt(12, n, t, l | 2), e.elementType = Ms, e.lanes = s, e;
    case As:
      return e = dt(13, n, t, l), e.elementType = As, e.lanes = s, e;
    case Fs:
      return e = dt(19, n, t, l), e.elementType = Fs, e.lanes = s, e;
    case Xa:
      return rs(n, l, s, t);
    default:
      if (typeof e == "object" && e !== null) switch (e.$$typeof) {
        case Ka:
          o = 10;
          break e;
        case Ya:
          o = 9;
          break e;
        case Mo:
          o = 11;
          break e;
        case Ao:
          o = 14;
          break e;
        case Ht:
          o = 16, r = null;
          break e;
      }
      throw Error(E(130, e == null ? e : typeof e, ""));
  }
  return t = dt(o, n, t, l), t.elementType = e, t.type = r, t.lanes = s, t;
}
function xn(e, t, n, r) {
  return e = dt(7, e, r, t), e.lanes = n, e;
}
function rs(e, t, n, r) {
  return e = dt(22, e, r, t), e.elementType = Xa, e.lanes = n, e.stateNode = { isHidden: false }, e;
}
function Rs(e, t, n) {
  return e = dt(6, e, null, t), e.lanes = n, e;
}
function Ps(e, t, n) {
  return t = dt(4, e.children !== null ? e.children : [], e.key, t), t.lanes = n, t.stateNode = { containerInfo: e.containerInfo, pendingChildren: null, implementation: e.implementation }, t;
}
function yp(e, t, n, r, l) {
  this.tag = t, this.containerInfo = e, this.finishedWork = this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.pendingContext = this.context = null, this.callbackPriority = 0, this.eventTimes = ps(0), this.expirationTimes = ps(-1), this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = ps(0), this.identifierPrefix = r, this.onRecoverableError = l, this.mutableSourceEagerHydrationData = null;
}
function yi(e, t, n, r, l, s, o, u, a) {
  return e = new yp(e, t, n, u, a), t === 1 ? (t = 1, s === true && (t |= 8)) : t = 0, s = dt(3, null, null, t), e.current = s, s.stateNode = e, s.memoizedState = { element: r, isDehydrated: n, cache: null, transitions: null, pendingSuspenseBoundaries: null }, ti(s), e;
}
function xp(e, t, n) {
  var r = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
  return { $$typeof: Tn, key: r == null ? null : "" + r, children: e, containerInfo: t, implementation: n };
}
function Bc(e) {
  if (!e) return on;
  e = e._reactInternals;
  e: {
    if (jn(e) !== e || e.tag !== 1) throw Error(E(170));
    var t = e;
    do {
      switch (t.tag) {
        case 3:
          t = t.stateNode.context;
          break e;
        case 1:
          if (Ze(t.type)) {
            t = t.stateNode.__reactInternalMemoizedMergedChildContext;
            break e;
          }
      }
      t = t.return;
    } while (t !== null);
    throw Error(E(171));
  }
  if (e.tag === 1) {
    var n = e.type;
    if (Ze(n)) return Bu(e, n, t);
  }
  return t;
}
function bc(e, t, n, r, l, s, o, u, a) {
  return e = yi(n, r, true, e, l, s, o, u, a), e.context = Bc(null), n = e.current, r = He(), l = rn(n), s = Mt(r, l), s.callback = t ?? null, tn(n, s, l), e.current.lanes = l, $r(e, l, r), et(e, r), e;
}
function ls(e, t, n, r) {
  var l = t.current, s = He(), o = rn(l);
  return n = Bc(n), t.context === null ? t.context = n : t.pendingContext = n, t = Mt(s, o), t.payload = { element: e }, r = r === void 0 ? null : r, r !== null && (t.callback = r), e = tn(l, t, o), e !== null && (St(e, l, o, s), hl(e, l, o)), o;
}
function Hl(e) {
  if (e = e.current, !e.child) return null;
  switch (e.child.tag) {
    case 5:
      return e.child.stateNode;
    default:
      return e.child.stateNode;
  }
}
function Ta(e, t) {
  if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
    var n = e.retryLane;
    e.retryLane = n !== 0 && n < t ? n : t;
  }
}
function xi(e, t) {
  Ta(e, t), (e = e.alternate) && Ta(e, t);
}
function wp() {
  return null;
}
var $c = typeof reportError == "function" ? reportError : function(e) {
  console.error(e);
};
function wi(e) {
  this._internalRoot = e;
}
ss.prototype.render = wi.prototype.render = function(e) {
  var t = this._internalRoot;
  if (t === null) throw Error(E(409));
  ls(e, t, null, null);
};
ss.prototype.unmount = wi.prototype.unmount = function() {
  var e = this._internalRoot;
  if (e !== null) {
    this._internalRoot = null;
    var t = e.containerInfo;
    Nn(function() {
      ls(null, e, null, null);
    }), t[Ft] = null;
  }
};
function ss(e) {
  this._internalRoot = e;
}
ss.prototype.unstable_scheduleHydration = function(e) {
  if (e) {
    var t = xu();
    e = { blockedOn: null, target: e, priority: t };
    for (var n = 0; n < Kt.length && t !== 0 && t < Kt[n].priority; n++) ;
    Kt.splice(n, 0, e), n === 0 && Su(e);
  }
};
function Si(e) {
  return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11);
}
function os(e) {
  return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11 && (e.nodeType !== 8 || e.nodeValue !== " react-mount-point-unstable "));
}
function Da() {
}
function Sp(e, t, n, r, l) {
  if (l) {
    if (typeof r == "function") {
      var s = r;
      r = function() {
        var p = Hl(o);
        s.call(p);
      };
    }
    var o = bc(t, r, e, 0, null, false, false, "", Da);
    return e._reactRootContainer = o, e[Ft] = o.current, Rr(e.nodeType === 8 ? e.parentNode : e), Nn(), o;
  }
  for (; l = e.lastChild; ) e.removeChild(l);
  if (typeof r == "function") {
    var u = r;
    r = function() {
      var p = Hl(a);
      u.call(p);
    };
  }
  var a = yi(e, 0, false, null, null, false, false, "", Da);
  return e._reactRootContainer = a, e[Ft] = a.current, Rr(e.nodeType === 8 ? e.parentNode : e), Nn(function() {
    ls(t, a, n, r);
  }), a;
}
function is(e, t, n, r, l) {
  var s = n._reactRootContainer;
  if (s) {
    var o = s;
    if (typeof l == "function") {
      var u = l;
      l = function() {
        var a = Hl(o);
        u.call(a);
      };
    }
    ls(t, o, e, l);
  } else o = Sp(n, t, e, l, r);
  return Hl(o);
}
vu = function(e) {
  switch (e.tag) {
    case 3:
      var t = e.stateNode;
      if (t.current.memoizedState.isDehydrated) {
        var n = pr(t.pendingLanes);
        n !== 0 && (Bo(t, n | 1), et(t, _e()), !(q & 6) && (qn = _e() + 500, cn()));
      }
      break;
    case 13:
      Nn(function() {
        var r = Ut(e, 1);
        if (r !== null) {
          var l = He();
          St(r, e, 1, l);
        }
      }), xi(e, 1);
  }
};
bo = function(e) {
  if (e.tag === 13) {
    var t = Ut(e, 134217728);
    if (t !== null) {
      var n = He();
      St(t, e, 134217728, n);
    }
    xi(e, 134217728);
  }
};
yu = function(e) {
  if (e.tag === 13) {
    var t = rn(e), n = Ut(e, t);
    if (n !== null) {
      var r = He();
      St(n, e, t, r);
    }
    xi(e, t);
  }
};
xu = function() {
  return re;
};
wu = function(e, t) {
  var n = re;
  try {
    return re = e, t();
  } finally {
    re = n;
  }
};
Ys = function(e, t, n) {
  switch (t) {
    case "input":
      if (bs(e, n), t = n.name, n.type === "radio" && t != null) {
        for (n = e; n.parentNode; ) n = n.parentNode;
        for (n = n.querySelectorAll("input[name=" + JSON.stringify("" + t) + '][type="radio"]'), t = 0; t < n.length; t++) {
          var r = n[t];
          if (r !== e && r.form === e.form) {
            var l = Jl(r);
            if (!l) throw Error(E(90));
            Ja(r), bs(r, l);
          }
        }
      }
      break;
    case "textarea":
      Za(e, n);
      break;
    case "select":
      t = n.value, t != null && Bn(e, !!n.multiple, t, false);
  }
};
ou = mi;
iu = Nn;
var Ep = { usingClientEntryPoint: false, Events: [Wr, Pn, Jl, lu, su, mi] }, cr = { findFiberByHostInstance: hn, bundleType: 0, version: "18.3.1", rendererPackageName: "react-dom" }, kp = { bundleType: cr.bundleType, version: cr.version, rendererPackageName: cr.rendererPackageName, rendererConfig: cr.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: bt.ReactCurrentDispatcher, findHostInstanceByFiber: function(e) {
  return e = cu(e), e === null ? null : e.stateNode;
}, findFiberByHostInstance: cr.findFiberByHostInstance || wp, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.3.1-next-f1338f8080-20240426" };
if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
  var ul = __REACT_DEVTOOLS_GLOBAL_HOOK__;
  if (!ul.isDisabled && ul.supportsFiber) try {
    Kl = ul.inject(kp), Dt = ul;
  } catch {
  }
}
ot.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = Ep;
ot.createPortal = function(e, t) {
  var n = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
  if (!Si(t)) throw Error(E(200));
  return xp(e, t, null, n);
};
ot.createRoot = function(e, t) {
  if (!Si(e)) throw Error(E(299));
  var n = false, r = "", l = $c;
  return t != null && (t.unstable_strictMode === true && (n = true), t.identifierPrefix !== void 0 && (r = t.identifierPrefix), t.onRecoverableError !== void 0 && (l = t.onRecoverableError)), t = yi(e, 1, false, null, null, n, false, r, l), e[Ft] = t.current, Rr(e.nodeType === 8 ? e.parentNode : e), new wi(t);
};
ot.findDOMNode = function(e) {
  if (e == null) return null;
  if (e.nodeType === 1) return e;
  var t = e._reactInternals;
  if (t === void 0) throw typeof e.render == "function" ? Error(E(188)) : (e = Object.keys(e).join(","), Error(E(268, e)));
  return e = cu(t), e = e === null ? null : e.stateNode, e;
};
ot.flushSync = function(e) {
  return Nn(e);
};
ot.hydrate = function(e, t, n) {
  if (!os(t)) throw Error(E(200));
  return is(null, e, t, true, n);
};
ot.hydrateRoot = function(e, t, n) {
  if (!Si(e)) throw Error(E(405));
  var r = n != null && n.hydratedSources || null, l = false, s = "", o = $c;
  if (n != null && (n.unstable_strictMode === true && (l = true), n.identifierPrefix !== void 0 && (s = n.identifierPrefix), n.onRecoverableError !== void 0 && (o = n.onRecoverableError)), t = bc(t, null, e, 1, n ?? null, l, false, s, o), e[Ft] = t.current, Rr(e), r) for (e = 0; e < r.length; e++) n = r[e], l = n._getVersion, l = l(n._source), t.mutableSourceEagerHydrationData == null ? t.mutableSourceEagerHydrationData = [n, l] : t.mutableSourceEagerHydrationData.push(n, l);
  return new ss(t);
};
ot.render = function(e, t, n) {
  if (!os(t)) throw Error(E(200));
  return is(null, e, t, false, n);
};
ot.unmountComponentAtNode = function(e) {
  if (!os(e)) throw Error(E(40));
  return e._reactRootContainer ? (Nn(function() {
    is(null, null, e, false, function() {
      e._reactRootContainer = null, e[Ft] = null;
    });
  }), true) : false;
};
ot.unstable_batchedUpdates = mi;
ot.unstable_renderSubtreeIntoContainer = function(e, t, n, r) {
  if (!os(n)) throw Error(E(200));
  if (e == null || e._reactInternals === void 0) throw Error(E(38));
  return is(e, t, n, false, r);
};
ot.version = "18.3.1-next-f1338f8080-20240426";
function Vc() {
  if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function")) try {
    __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(Vc);
  } catch (e) {
    console.error(e);
  }
}
Vc(), Va.exports = ot;
var Np = Va.exports, La = Np;
Is.createRoot = La.createRoot, Is.hydrateRoot = La.hydrateRoot;
var Wc = { exports: {} };
/* @license
Papa Parse
v5.4.1
https://github.com/mholt/PapaParse
License: MIT
*/
(function(e, t) {
  (function(n, r) {
    e.exports = r();
  })(Jc, function n() {
    var r = typeof self < "u" ? self : typeof window < "u" ? window : r !== void 0 ? r : {}, l = !r.document && !!r.postMessage, s = r.IS_PAPA_WORKER || false, o = {}, u = 0, a = { parse: function(c, f) {
      var x = (f = f || {}).dynamicTyping || false;
      if (N(x) && (f.dynamicTypingFunction = x, x = {}), f.dynamicTyping = x, f.transform = !!N(f.transform) && f.transform, f.worker && a.WORKERS_SUPPORTED) {
        var D = function() {
          if (!a.WORKERS_SUPPORTED) return false;
          var B = (Se = r.URL || r.webkitURL || null, le = n.toString(), a.BLOB_URL || (a.BLOB_URL = Se.createObjectURL(new Blob(["var global = (function() { if (typeof self !== 'undefined') { return self; } if (typeof window !== 'undefined') { return window; } if (typeof global !== 'undefined') { return global; } return {}; })(); global.IS_PAPA_WORKER=true; ", "(", le, ")();"], { type: "text/javascript" })))), K = new r.Worker(B), Se, le;
          return K.onmessage = d, K.id = u++, o[K.id] = K;
        }();
        return D.userStep = f.step, D.userChunk = f.chunk, D.userComplete = f.complete, D.userError = f.error, f.step = N(f.step), f.chunk = N(f.chunk), f.complete = N(f.complete), f.error = N(f.error), delete f.worker, void D.postMessage({ input: c, config: f, workerId: D.id });
      }
      var z = null;
      return a.NODE_STREAM_INPUT, typeof c == "string" ? (c = function(B) {
        return B.charCodeAt(0) === 65279 ? B.slice(1) : B;
      }(c), z = f.download ? new v(f) : new C(f)) : c.readable === true && N(c.read) && N(c.on) ? z = new T(f) : (r.File && c instanceof File || c instanceof Object) && (z = new y(f)), z.stream(c);
    }, unparse: function(c, f) {
      var x = false, D = true, z = ",", B = `\r
`, K = '"', Se = K + K, le = false, I = null, _ = false;
      (function() {
        if (typeof f == "object") {
          if (typeof f.delimiter != "string" || a.BAD_DELIMITERS.filter(function(j) {
            return f.delimiter.indexOf(j) !== -1;
          }).length || (z = f.delimiter), (typeof f.quotes == "boolean" || typeof f.quotes == "function" || Array.isArray(f.quotes)) && (x = f.quotes), typeof f.skipEmptyLines != "boolean" && typeof f.skipEmptyLines != "string" || (le = f.skipEmptyLines), typeof f.newline == "string" && (B = f.newline), typeof f.quoteChar == "string" && (K = f.quoteChar), typeof f.header == "boolean" && (D = f.header), Array.isArray(f.columns)) {
            if (f.columns.length === 0) throw new Error("Option columns is empty");
            I = f.columns;
          }
          f.escapeChar !== void 0 && (Se = f.escapeChar + K), (typeof f.escapeFormulae == "boolean" || f.escapeFormulae instanceof RegExp) && (_ = f.escapeFormulae instanceof RegExp ? f.escapeFormulae : /^[=+\-@\t\r].*$/);
        }
      })();
      var k = new RegExp(J(K), "g");
      if (typeof c == "string" && (c = JSON.parse(c)), Array.isArray(c)) {
        if (!c.length || Array.isArray(c[0])) return $(null, c, le);
        if (typeof c[0] == "object") return $(I || Object.keys(c[0]), c, le);
      } else if (typeof c == "object") return typeof c.data == "string" && (c.data = JSON.parse(c.data)), Array.isArray(c.data) && (c.fields || (c.fields = c.meta && c.meta.fields || I), c.fields || (c.fields = Array.isArray(c.data[0]) ? c.fields : typeof c.data[0] == "object" ? Object.keys(c.data[0]) : []), Array.isArray(c.data[0]) || typeof c.data[0] == "object" || (c.data = [c.data])), $(c.fields || [], c.data || [], le);
      throw new Error("Unable to serialize unrecognized input");
      function $(j, Z, se) {
        var oe = "";
        typeof j == "string" && (j = JSON.parse(j)), typeof Z == "string" && (Z = JSON.parse(Z));
        var ee = Array.isArray(j) && 0 < j.length, de = !Array.isArray(Z[0]);
        if (ee && D) {
          for (var je = 0; je < j.length; je++) 0 < je && (oe += z), oe += Q(j[je], je);
          0 < Z.length && (oe += B);
        }
        for (var U = 0; U < Z.length; U++) {
          var X = ee ? j.length : Z[U].length, ae = false, Ne = ee ? Object.keys(Z[U]).length === 0 : Z[U].length === 0;
          if (se && !ee && (ae = se === "greedy" ? Z[U].join("").trim() === "" : Z[U].length === 1 && Z[U][0].length === 0), se === "greedy" && ee) {
            for (var ie = [], Oe = 0; Oe < X; Oe++) {
              var ve = de ? j[Oe] : Oe;
              ie.push(Z[U][ve]);
            }
            ae = ie.join("").trim() === "";
          }
          if (!ae) {
            for (var ue = 0; ue < X; ue++) {
              0 < ue && !Ne && (oe += z);
              var Ye = ee && de ? j[ue] : ue;
              oe += Q(Z[U][Ye], ue);
            }
            U < Z.length - 1 && (!se || 0 < X && !Ne) && (oe += B);
          }
        }
        return oe;
      }
      function Q(j, Z) {
        if (j == null) return "";
        if (j.constructor === Date) return JSON.stringify(j).slice(1, 25);
        var se = false;
        _ && typeof j == "string" && _.test(j) && (j = "'" + j, se = true);
        var oe = j.toString().replace(k, Se);
        return (se = se || x === true || typeof x == "function" && x(j, Z) || Array.isArray(x) && x[Z] || function(ee, de) {
          for (var je = 0; je < de.length; je++) if (-1 < ee.indexOf(de[je])) return true;
          return false;
        }(oe, a.BAD_DELIMITERS) || -1 < oe.indexOf(z) || oe.charAt(0) === " " || oe.charAt(oe.length - 1) === " ") ? K + oe + K : oe;
      }
    } };
    if (a.RECORD_SEP = "", a.UNIT_SEP = "", a.BYTE_ORDER_MARK = "\uFEFF", a.BAD_DELIMITERS = ["\r", `
`, '"', a.BYTE_ORDER_MARK], a.WORKERS_SUPPORTED = !l && !!r.Worker, a.NODE_STREAM_INPUT = 1, a.LocalChunkSize = 10485760, a.RemoteChunkSize = 5242880, a.DefaultDelimiter = ",", a.Parser = m, a.ParserHandle = R, a.NetworkStreamer = v, a.FileStreamer = y, a.StringStreamer = C, a.ReadableStreamStreamer = T, r.jQuery) {
      var p = r.jQuery;
      p.fn.parse = function(c) {
        var f = c.config || {}, x = [];
        return this.each(function(B) {
          if (!(p(this).prop("tagName").toUpperCase() === "INPUT" && p(this).attr("type").toLowerCase() === "file" && r.FileReader) || !this.files || this.files.length === 0) return true;
          for (var K = 0; K < this.files.length; K++) x.push({ file: this.files[K], inputElem: this, instanceConfig: p.extend({}, f) });
        }), D(), this;
        function D() {
          if (x.length !== 0) {
            var B, K, Se, le, I = x[0];
            if (N(c.before)) {
              var _ = c.before(I.file, I.inputElem);
              if (typeof _ == "object") {
                if (_.action === "abort") return B = "AbortError", K = I.file, Se = I.inputElem, le = _.reason, void (N(c.error) && c.error({ name: B }, K, Se, le));
                if (_.action === "skip") return void z();
                typeof _.config == "object" && (I.instanceConfig = p.extend(I.instanceConfig, _.config));
              } else if (_ === "skip") return void z();
            }
            var k = I.instanceConfig.complete;
            I.instanceConfig.complete = function($) {
              N(k) && k($, I.file, I.inputElem), z();
            }, a.parse(I.file, I.instanceConfig);
          } else N(c.complete) && c.complete();
        }
        function z() {
          x.splice(0, 1), D();
        }
      };
    }
    function g(c) {
      this._handle = null, this._finished = false, this._completed = false, this._halted = false, this._input = null, this._baseIndex = 0, this._partialLine = "", this._rowCount = 0, this._start = 0, this._nextChunk = null, this.isFirstChunk = true, this._completeResults = { data: [], errors: [], meta: {} }, (function(f) {
        var x = L(f);
        x.chunkSize = parseInt(x.chunkSize), f.step || f.chunk || (x.chunkSize = null), this._handle = new R(x), (this._handle.streamer = this)._config = x;
      }).call(this, c), this.parseChunk = function(f, x) {
        if (this.isFirstChunk && N(this._config.beforeFirstChunk)) {
          var D = this._config.beforeFirstChunk(f);
          D !== void 0 && (f = D);
        }
        this.isFirstChunk = false, this._halted = false;
        var z = this._partialLine + f;
        this._partialLine = "";
        var B = this._handle.parse(z, this._baseIndex, !this._finished);
        if (!this._handle.paused() && !this._handle.aborted()) {
          var K = B.meta.cursor;
          this._finished || (this._partialLine = z.substring(K - this._baseIndex), this._baseIndex = K), B && B.data && (this._rowCount += B.data.length);
          var Se = this._finished || this._config.preview && this._rowCount >= this._config.preview;
          if (s) r.postMessage({ results: B, workerId: a.WORKER_ID, finished: Se });
          else if (N(this._config.chunk) && !x) {
            if (this._config.chunk(B, this._handle), this._handle.paused() || this._handle.aborted()) return void (this._halted = true);
            B = void 0, this._completeResults = void 0;
          }
          return this._config.step || this._config.chunk || (this._completeResults.data = this._completeResults.data.concat(B.data), this._completeResults.errors = this._completeResults.errors.concat(B.errors), this._completeResults.meta = B.meta), this._completed || !Se || !N(this._config.complete) || B && B.meta.aborted || (this._config.complete(this._completeResults, this._input), this._completed = true), Se || B && B.meta.paused || this._nextChunk(), B;
        }
        this._halted = true;
      }, this._sendError = function(f) {
        N(this._config.error) ? this._config.error(f) : s && this._config.error && r.postMessage({ workerId: a.WORKER_ID, error: f, finished: false });
      };
    }
    function v(c) {
      var f;
      (c = c || {}).chunkSize || (c.chunkSize = a.RemoteChunkSize), g.call(this, c), this._nextChunk = l ? function() {
        this._readChunk(), this._chunkLoaded();
      } : function() {
        this._readChunk();
      }, this.stream = function(x) {
        this._input = x, this._nextChunk();
      }, this._readChunk = function() {
        if (this._finished) this._chunkLoaded();
        else {
          if (f = new XMLHttpRequest(), this._config.withCredentials && (f.withCredentials = this._config.withCredentials), l || (f.onload = O(this._chunkLoaded, this), f.onerror = O(this._chunkError, this)), f.open(this._config.downloadRequestBody ? "POST" : "GET", this._input, !l), this._config.downloadRequestHeaders) {
            var x = this._config.downloadRequestHeaders;
            for (var D in x) f.setRequestHeader(D, x[D]);
          }
          if (this._config.chunkSize) {
            var z = this._start + this._config.chunkSize - 1;
            f.setRequestHeader("Range", "bytes=" + this._start + "-" + z);
          }
          try {
            f.send(this._config.downloadRequestBody);
          } catch (B) {
            this._chunkError(B.message);
          }
          l && f.status === 0 && this._chunkError();
        }
      }, this._chunkLoaded = function() {
        f.readyState === 4 && (f.status < 200 || 400 <= f.status ? this._chunkError() : (this._start += this._config.chunkSize ? this._config.chunkSize : f.responseText.length, this._finished = !this._config.chunkSize || this._start >= function(x) {
          var D = x.getResponseHeader("Content-Range");
          return D === null ? -1 : parseInt(D.substring(D.lastIndexOf("/") + 1));
        }(f), this.parseChunk(f.responseText)));
      }, this._chunkError = function(x) {
        var D = f.statusText || x;
        this._sendError(new Error(D));
      };
    }
    function y(c) {
      var f, x;
      (c = c || {}).chunkSize || (c.chunkSize = a.LocalChunkSize), g.call(this, c);
      var D = typeof FileReader < "u";
      this.stream = function(z) {
        this._input = z, x = z.slice || z.webkitSlice || z.mozSlice, D ? ((f = new FileReader()).onload = O(this._chunkLoaded, this), f.onerror = O(this._chunkError, this)) : f = new FileReaderSync(), this._nextChunk();
      }, this._nextChunk = function() {
        this._finished || this._config.preview && !(this._rowCount < this._config.preview) || this._readChunk();
      }, this._readChunk = function() {
        var z = this._input;
        if (this._config.chunkSize) {
          var B = Math.min(this._start + this._config.chunkSize, this._input.size);
          z = x.call(z, this._start, B);
        }
        var K = f.readAsText(z, this._config.encoding);
        D || this._chunkLoaded({ target: { result: K } });
      }, this._chunkLoaded = function(z) {
        this._start += this._config.chunkSize, this._finished = !this._config.chunkSize || this._start >= this._input.size, this.parseChunk(z.target.result);
      }, this._chunkError = function() {
        this._sendError(f.error);
      };
    }
    function C(c) {
      var f;
      g.call(this, c = c || {}), this.stream = function(x) {
        return f = x, this._nextChunk();
      }, this._nextChunk = function() {
        if (!this._finished) {
          var x, D = this._config.chunkSize;
          return D ? (x = f.substring(0, D), f = f.substring(D)) : (x = f, f = ""), this._finished = !f, this.parseChunk(x);
        }
      };
    }
    function T(c) {
      g.call(this, c = c || {});
      var f = [], x = true, D = false;
      this.pause = function() {
        g.prototype.pause.apply(this, arguments), this._input.pause();
      }, this.resume = function() {
        g.prototype.resume.apply(this, arguments), this._input.resume();
      }, this.stream = function(z) {
        this._input = z, this._input.on("data", this._streamData), this._input.on("end", this._streamEnd), this._input.on("error", this._streamError);
      }, this._checkIsFinished = function() {
        D && f.length === 1 && (this._finished = true);
      }, this._nextChunk = function() {
        this._checkIsFinished(), f.length ? this.parseChunk(f.shift()) : x = true;
      }, this._streamData = O(function(z) {
        try {
          f.push(typeof z == "string" ? z : z.toString(this._config.encoding)), x && (x = false, this._checkIsFinished(), this.parseChunk(f.shift()));
        } catch (B) {
          this._streamError(B);
        }
      }, this), this._streamError = O(function(z) {
        this._streamCleanUp(), this._sendError(z);
      }, this), this._streamEnd = O(function() {
        this._streamCleanUp(), D = true, this._streamData("");
      }, this), this._streamCleanUp = O(function() {
        this._input.removeListener("data", this._streamData), this._input.removeListener("end", this._streamEnd), this._input.removeListener("error", this._streamError);
      }, this);
    }
    function R(c) {
      var f, x, D, z = Math.pow(2, 53), B = -z, K = /^\s*-?(\d+\.?|\.\d+|\d+\.\d+)([eE][-+]?\d+)?\s*$/, Se = /^((\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z)))$/, le = this, I = 0, _ = 0, k = false, $ = false, Q = [], j = { data: [], errors: [], meta: {} };
      if (N(c.step)) {
        var Z = c.step;
        c.step = function(U) {
          if (j = U, ee()) oe();
          else {
            if (oe(), j.data.length === 0) return;
            I += U.data.length, c.preview && I > c.preview ? x.abort() : (j.data = j.data[0], Z(j, le));
          }
        };
      }
      function se(U) {
        return c.skipEmptyLines === "greedy" ? U.join("").trim() === "" : U.length === 1 && U[0].length === 0;
      }
      function oe() {
        return j && D && (je("Delimiter", "UndetectableDelimiter", "Unable to auto-detect delimiting character; defaulted to '" + a.DefaultDelimiter + "'"), D = false), c.skipEmptyLines && (j.data = j.data.filter(function(U) {
          return !se(U);
        })), ee() && function() {
          if (!j) return;
          function U(ae, Ne) {
            N(c.transformHeader) && (ae = c.transformHeader(ae, Ne)), Q.push(ae);
          }
          if (Array.isArray(j.data[0])) {
            for (var X = 0; ee() && X < j.data.length; X++) j.data[X].forEach(U);
            j.data.splice(0, 1);
          } else j.data.forEach(U);
        }(), function() {
          if (!j || !c.header && !c.dynamicTyping && !c.transform) return j;
          function U(ae, Ne) {
            var ie, Oe = c.header ? {} : [];
            for (ie = 0; ie < ae.length; ie++) {
              var ve = ie, ue = ae[ie];
              c.header && (ve = ie >= Q.length ? "__parsed_extra" : Q[ie]), c.transform && (ue = c.transform(ue, ve)), ue = de(ve, ue), ve === "__parsed_extra" ? (Oe[ve] = Oe[ve] || [], Oe[ve].push(ue)) : Oe[ve] = ue;
            }
            return c.header && (ie > Q.length ? je("FieldMismatch", "TooManyFields", "Too many fields: expected " + Q.length + " fields but parsed " + ie, _ + Ne) : ie < Q.length && je("FieldMismatch", "TooFewFields", "Too few fields: expected " + Q.length + " fields but parsed " + ie, _ + Ne)), Oe;
          }
          var X = 1;
          return !j.data.length || Array.isArray(j.data[0]) ? (j.data = j.data.map(U), X = j.data.length) : j.data = U(j.data, 0), c.header && j.meta && (j.meta.fields = Q), _ += X, j;
        }();
      }
      function ee() {
        return c.header && Q.length === 0;
      }
      function de(U, X) {
        return ae = U, c.dynamicTypingFunction && c.dynamicTyping[ae] === void 0 && (c.dynamicTyping[ae] = c.dynamicTypingFunction(ae)), (c.dynamicTyping[ae] || c.dynamicTyping) === true ? X === "true" || X === "TRUE" || X !== "false" && X !== "FALSE" && (function(Ne) {
          if (K.test(Ne)) {
            var ie = parseFloat(Ne);
            if (B < ie && ie < z) return true;
          }
          return false;
        }(X) ? parseFloat(X) : Se.test(X) ? new Date(X) : X === "" ? null : X) : X;
        var ae;
      }
      function je(U, X, ae, Ne) {
        var ie = { type: U, code: X, message: ae };
        Ne !== void 0 && (ie.row = Ne), j.errors.push(ie);
      }
      this.parse = function(U, X, ae) {
        var Ne = c.quoteChar || '"';
        if (c.newline || (c.newline = function(ve, ue) {
          ve = ve.substring(0, 1048576);
          var Ye = new RegExp(J(ue) + "([^]*?)" + J(ue), "gm"), $e = (ve = ve.replace(Ye, "")).split("\r"), tt = ve.split(`
`), ht = 1 < tt.length && tt[0].length < $e[0].length;
          if ($e.length === 1 || ht) return `
`;
          for (var Ve = 0, fe = 0; fe < $e.length; fe++) $e[fe][0] === `
` && Ve++;
          return Ve >= $e.length / 2 ? `\r
` : "\r";
        }(U, Ne)), D = false, c.delimiter) N(c.delimiter) && (c.delimiter = c.delimiter(U), j.meta.delimiter = c.delimiter);
        else {
          var ie = function(ve, ue, Ye, $e, tt) {
            var ht, Ve, fe, Ee;
            tt = tt || [",", "	", "|", ";", a.RECORD_SEP, a.UNIT_SEP];
            for (var Ot = 0; Ot < tt.length; Ot++) {
              var te = tt[Ot], $t = 0, pe = 0, at = 0;
              fe = void 0;
              for (var kt = new m({ comments: $e, delimiter: te, newline: ue, preview: 10 }).parse(ve), Nt = 0; Nt < kt.data.length; Nt++) if (Ye && se(kt.data[Nt])) at++;
              else {
                var _t = kt.data[Nt].length;
                pe += _t, fe !== void 0 ? 0 < _t && ($t += Math.abs(_t - fe), fe = _t) : fe = _t;
              }
              0 < kt.data.length && (pe /= kt.data.length - at), (Ve === void 0 || $t <= Ve) && (Ee === void 0 || Ee < pe) && 1.99 < pe && (Ve = $t, ht = te, Ee = pe);
            }
            return { successful: !!(c.delimiter = ht), bestDelimiter: ht };
          }(U, c.newline, c.skipEmptyLines, c.comments, c.delimitersToGuess);
          ie.successful ? c.delimiter = ie.bestDelimiter : (D = true, c.delimiter = a.DefaultDelimiter), j.meta.delimiter = c.delimiter;
        }
        var Oe = L(c);
        return c.preview && c.header && Oe.preview++, f = U, x = new m(Oe), j = x.parse(f, X, ae), oe(), k ? { meta: { paused: true } } : j || { meta: { paused: false } };
      }, this.paused = function() {
        return k;
      }, this.pause = function() {
        k = true, x.abort(), f = N(c.chunk) ? "" : f.substring(x.getCharIndex());
      }, this.resume = function() {
        le.streamer._halted ? (k = false, le.streamer.parseChunk(f, true)) : setTimeout(le.resume, 3);
      }, this.aborted = function() {
        return $;
      }, this.abort = function() {
        $ = true, x.abort(), j.meta.aborted = true, N(c.complete) && c.complete(j), f = "";
      };
    }
    function J(c) {
      return c.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }
    function m(c) {
      var f, x = (c = c || {}).delimiter, D = c.newline, z = c.comments, B = c.step, K = c.preview, Se = c.fastMode, le = f = c.quoteChar === void 0 || c.quoteChar === null ? '"' : c.quoteChar;
      if (c.escapeChar !== void 0 && (le = c.escapeChar), (typeof x != "string" || -1 < a.BAD_DELIMITERS.indexOf(x)) && (x = ","), z === x) throw new Error("Comment character same as delimiter");
      z === true ? z = "#" : (typeof z != "string" || -1 < a.BAD_DELIMITERS.indexOf(z)) && (z = false), D !== `
` && D !== "\r" && D !== `\r
` && (D = `
`);
      var I = 0, _ = false;
      this.parse = function(k, $, Q) {
        if (typeof k != "string") throw new Error("Input must be a string");
        var j = k.length, Z = x.length, se = D.length, oe = z.length, ee = N(B), de = [], je = [], U = [], X = I = 0;
        if (!k) return Ce();
        if (c.header && !$) {
          var ae = k.split(D)[0].split(x), Ne = [], ie = {}, Oe = false;
          for (var ve in ae) {
            var ue = ae[ve];
            N(c.transformHeader) && (ue = c.transformHeader(ue, ve));
            var Ye = ue, $e = ie[ue] || 0;
            for (0 < $e && (Oe = true, Ye = ue + "_" + $e), ie[ue] = $e + 1; Ne.includes(Ye); ) Ye = Ye + "_" + $e;
            Ne.push(Ye);
          }
          if (Oe) {
            var tt = k.split(D);
            tt[0] = Ne.join(x), k = tt.join(D);
          }
        }
        if (Se || Se !== false && k.indexOf(f) === -1) {
          for (var ht = k.split(D), Ve = 0; Ve < ht.length; Ve++) {
            if (U = ht[Ve], I += U.length, Ve !== ht.length - 1) I += D.length;
            else if (Q) return Ce();
            if (!z || U.substring(0, oe) !== z) {
              if (ee) {
                if (de = [], at(U.split(x)), dn(), _) return Ce();
              } else at(U.split(x));
              if (K && K <= Ve) return de = de.slice(0, K), Ce(true);
            }
          }
          return Ce();
        }
        for (var fe = k.indexOf(x, I), Ee = k.indexOf(D, I), Ot = new RegExp(J(le) + J(f), "g"), te = k.indexOf(f, I); ; ) if (k[I] !== f) if (z && U.length === 0 && k.substring(I, I + oe) === z) {
          if (Ee === -1) return Ce();
          I = Ee + se, Ee = k.indexOf(D, I), fe = k.indexOf(x, I);
        } else if (fe !== -1 && (fe < Ee || Ee === -1)) U.push(k.substring(I, fe)), I = fe + Z, fe = k.indexOf(x, I);
        else {
          if (Ee === -1) break;
          if (U.push(k.substring(I, Ee)), _t(Ee + se), ee && (dn(), _)) return Ce();
          if (K && de.length >= K) return Ce(true);
        }
        else for (te = I, I++; ; ) {
          if ((te = k.indexOf(f, te + 1)) === -1) return Q || je.push({ type: "Quotes", code: "MissingQuotes", message: "Quoted field unterminated", row: de.length, index: I }), Nt();
          if (te === j - 1) return Nt(k.substring(I, te).replace(Ot, f));
          if (f !== le || k[te + 1] !== le) {
            if (f === le || te === 0 || k[te - 1] !== le) {
              fe !== -1 && fe < te + 1 && (fe = k.indexOf(x, te + 1)), Ee !== -1 && Ee < te + 1 && (Ee = k.indexOf(D, te + 1));
              var $t = kt(Ee === -1 ? fe : Math.min(fe, Ee));
              if (k.substr(te + 1 + $t, Z) === x) {
                U.push(k.substring(I, te).replace(Ot, f)), k[I = te + 1 + $t + Z] !== f && (te = k.indexOf(f, I)), fe = k.indexOf(x, I), Ee = k.indexOf(D, I);
                break;
              }
              var pe = kt(Ee);
              if (k.substring(te + 1 + pe, te + 1 + pe + se) === D) {
                if (U.push(k.substring(I, te).replace(Ot, f)), _t(te + 1 + pe + se), fe = k.indexOf(x, I), te = k.indexOf(f, I), ee && (dn(), _)) return Ce();
                if (K && de.length >= K) return Ce(true);
                break;
              }
              je.push({ type: "Quotes", code: "InvalidQuotes", message: "Trailing quote on quoted field is malformed", row: de.length, index: I }), te++;
            }
          } else te++;
        }
        return Nt();
        function at(Xe) {
          de.push(Xe), X = I;
        }
        function kt(Xe) {
          var Qr = 0;
          if (Xe !== -1) {
            var nr = k.substring(te + 1, Xe);
            nr && nr.trim() === "" && (Qr = nr.length);
          }
          return Qr;
        }
        function Nt(Xe) {
          return Q || (Xe === void 0 && (Xe = k.substring(I)), U.push(Xe), I = j, at(U), ee && dn()), Ce();
        }
        function _t(Xe) {
          I = Xe, at(U), U = [], Ee = k.indexOf(D, I);
        }
        function Ce(Xe) {
          return { data: de, errors: je, meta: { delimiter: x, linebreak: D, aborted: _, truncated: !!Xe, cursor: X + ($ || 0) } };
        }
        function dn() {
          B(Ce()), de = [], je = [];
        }
      }, this.abort = function() {
        _ = true;
      }, this.getCharIndex = function() {
        return I;
      };
    }
    function d(c) {
      var f = c.data, x = o[f.workerId], D = false;
      if (f.error) x.userError(f.error, f.file);
      else if (f.results && f.results.data) {
        var z = { abort: function() {
          D = true, h(f.workerId, { data: [], errors: [], meta: { aborted: true } });
        }, pause: S, resume: S };
        if (N(x.userStep)) {
          for (var B = 0; B < f.results.data.length && (x.userStep({ data: f.results.data[B], errors: f.results.errors, meta: f.results.meta }, z), !D); B++) ;
          delete f.results;
        } else N(x.userChunk) && (x.userChunk(f.results, z, f.file), delete f.results);
      }
      f.finished && !D && h(f.workerId, f.results);
    }
    function h(c, f) {
      var x = o[c];
      N(x.userComplete) && x.userComplete(f), x.terminate(), delete o[c];
    }
    function S() {
      throw new Error("Not implemented.");
    }
    function L(c) {
      if (typeof c != "object" || c === null) return c;
      var f = Array.isArray(c) ? [] : {};
      for (var x in c) f[x] = L(c[x]);
      return f;
    }
    function O(c, f) {
      return function() {
        c.apply(f, arguments);
      };
    }
    function N(c) {
      return typeof c == "function";
    }
    return s && (r.onmessage = function(c) {
      var f = c.data;
      if (a.WORKER_ID === void 0 && f && (a.WORKER_ID = f.workerId), typeof f.input == "string") r.postMessage({ workerId: a.WORKER_ID, results: a.parse(f.input, f.config), finished: true });
      else if (r.File && f.input instanceof File || f.input instanceof Object) {
        var x = a.parse(f.input, f.config);
        x && r.postMessage({ workerId: a.WORKER_ID, results: x, finished: true });
      }
    }), (v.prototype = Object.create(g.prototype)).constructor = v, (y.prototype = Object.create(g.prototype)).constructor = y, (C.prototype = Object.create(C.prototype)).constructor = C, (T.prototype = Object.create(g.prototype)).constructor = T, a;
  });
})(Wc);
var _p = Wc.exports;
const jp = Oa(_p);
class Cp {
  constructor() {
    this.db = null, this.SQL = null, this.isInitialized = false;
  }
  async initialize() {
    if (!this.isInitialized) try {
      window.initSqlJs || await this.loadSqlJsScript(), this.SQL = await window.initSqlJs({ locateFile: (n) => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${n}` });
      const t = await this.loadFromIndexedDB();
      t ? (this.db = new this.SQL.Database(t), console.log("\u2705 Banco de dados carregado do armazenamento local")) : (this.db = new this.SQL.Database(), console.log("\u2705 Novo banco de dados criado")), await this.createTables(), await this.saveToIndexedDB(), this.isInitialized = true, console.log("\u2705 Database Manager inicializado com script loading");
    } catch (t) {
      throw console.error("\u274C Erro ao inicializar banco de dados:", t), t;
    }
  }
  async loadSqlJsScript() {
    return new Promise((t, n) => {
      const r = document.createElement("script");
      r.src = "https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/sql-wasm.js", r.onload = () => {
        console.log("\u2705 sql.js script carregado via CDN"), t();
      }, r.onerror = (l) => {
        console.error("\u274C Erro ao carregar sql.js script:", l), n(l);
      }, document.head.appendChild(r);
    });
  }
  async createTables() {
    [`CREATE TABLE IF NOT EXISTS app_auth (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        password_hash TEXT NOT NULL,
        salt TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`, `CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL,
        type TEXT NOT NULL,
        amount REAL NOT NULL,
        description TEXT NOT NULL,
        category TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`, `CREATE TABLE IF NOT EXISTS initial_balances (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        investment_type TEXT UNIQUE NOT NULL,
        amount REAL NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`, `CREATE TABLE IF NOT EXISTS investment_movements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL,
        investment_type TEXT NOT NULL,
        amount REAL NOT NULL,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`].forEach((n) => {
      this.db.run(n);
    }), console.log("\u2705 Tabelas criadas/verificadas");
  }
  async saveToIndexedDB() {
    try {
      const t = this.db.export(), n = await this.getCurrentDBVersion(), r = indexedDB.open("PersonalFinanceDB", n || 1);
      return new Promise((l, s) => {
        r.onerror = () => s(r.error), r.onupgradeneeded = () => {
          const o = r.result;
          o.objectStoreNames.contains("database") || o.createObjectStore("database");
        }, r.onsuccess = () => {
          const o = r.result;
          if (o.objectStoreNames.contains("database")) {
            const u = o.transaction(["database"], "readwrite");
            u.objectStore("database").put(t, "main"), u.oncomplete = () => {
              o.close(), l();
            }, u.onerror = () => s(u.error);
          } else {
            o.close();
            const u = indexedDB.open("PersonalFinanceDB", o.version + 1);
            u.onupgradeneeded = () => {
              const a = u.result;
              a.objectStoreNames.contains("database") || a.createObjectStore("database");
            }, u.onsuccess = () => {
              const a = u.result, p = a.transaction(["database"], "readwrite");
              p.objectStore("database").put(t, "main"), p.oncomplete = () => {
                a.close(), l();
              }, p.onerror = () => s(p.error);
            }, u.onerror = () => s(u.error);
          }
        };
      });
    } catch (t) {
      console.error("\u274C Erro ao salvar no IndexedDB:", t);
    }
  }
  async getCurrentDBVersion() {
    return new Promise((t) => {
      const n = indexedDB.open("PersonalFinanceDB");
      n.onsuccess = () => {
        const r = n.result, l = r.version;
        r.close(), t(l);
      }, n.onerror = () => t(1);
    });
  }
  async loadFromIndexedDB() {
    try {
      const t = await this.getCurrentDBVersion(), n = indexedDB.open("PersonalFinanceDB", t || 1);
      return new Promise((r, l) => {
        n.onerror = () => r(null), n.onupgradeneeded = () => {
          const s = n.result;
          s.objectStoreNames.contains("database") || s.createObjectStore("database");
        }, n.onsuccess = () => {
          const s = n.result;
          if (!s.objectStoreNames.contains("database")) {
            s.close(), r(null);
            return;
          }
          const a = s.transaction(["database"], "readonly").objectStore("database").get("main");
          a.onsuccess = () => {
            s.close(), r(a.result || null);
          }, a.onerror = () => {
            s.close(), r(null);
          };
        };
      });
    } catch (t) {
      return console.error("\u274C Erro ao carregar do IndexedDB:", t), null;
    }
  }
  async checkSetup() {
    const t = this.db.prepare("SELECT id FROM app_auth WHERE id = 1");
    let n = {};
    return t.step() && (n = t.getAsObject()), t.free(), console.log("\u{1F50D} checkSetup result JSON:", JSON.stringify(n)), console.log("\u{1F50D} isSetup:", !!n.id), await this.saveToIndexedDB(), { isSetup: !!n.id };
  }
  async setupAuth(t) {
    const n = this.db.prepare("SELECT id FROM app_auth WHERE id = 1");
    let r = {};
    if (n.step() && (r = n.getAsObject()), n.free(), console.log("\u{1F50D} setupAuth - existing JSON:", JSON.stringify(r)), r.id) throw new Error("Sistema j\xE1 foi configurado");
    const l = this.generateSalt(), s = await this.hashPassword(t, l);
    console.log("\u{1F50D} setupAuth - salvando senha...");
    try {
      this.db.run("INSERT INTO app_auth (id, password_hash, salt) VALUES (1, ?, ?)", [s, l]), console.log("\u{1F50D} setupAuth - INSERT executado com sucesso");
    } catch (a) {
      console.log("\u{1F50D} setupAuth - erro no INSERT:", a), this.db.run("UPDATE app_auth SET password_hash = ?, salt = ? WHERE id = 1", [s, l]), console.log("\u{1F50D} setupAuth - UPDATE executado");
    }
    const o = this.db.prepare("SELECT * FROM app_auth WHERE id = 1");
    let u = {};
    return o.step() && (u = o.getAsObject()), o.free(), console.log("\u{1F50D} setupAuth - verifica\xE7\xE3o JSON:", JSON.stringify(u)), await this.saveToIndexedDB(), { success: true, message: "Senha configurada com sucesso" };
  }
  async login(t) {
    console.log("\u{1F50D} login - iniciando...");
    const n = this.db.prepare("SELECT password_hash, salt FROM app_auth WHERE id = 1");
    let r = {};
    if (n.step() && (r = n.getAsObject()), n.free(), console.log("\u{1F50D} login - dados encontrados JSON:", JSON.stringify(r)), !r.password_hash) throw console.log("\u274C login - password_hash n\xE3o encontrado"), new Error("Sistema n\xE3o configurado");
    const l = await this.hashPassword(t, r.salt);
    if (console.log("\u{1F50D} login - hash calculado"), l !== r.password_hash) throw new Error("Senha incorreta");
    return console.log("\u2705 login - sucesso!"), { success: true, message: "Login realizado com sucesso" };
  }
  async changePassword(t, n) {
    const r = this.db.prepare("SELECT password_hash, salt FROM app_auth WHERE id = 1");
    let l = {};
    if (r.step() && (l = r.getAsObject()), r.free(), !l.password_hash) throw new Error("Sistema n\xE3o configurado");
    if (await this.hashPassword(t, l.salt) !== l.password_hash) throw new Error("Senha atual incorreta");
    const o = this.generateSalt(), u = await this.hashPassword(n, o);
    return this.db.run("UPDATE app_auth SET password_hash = ?, salt = ?, updated_at = CURRENT_TIMESTAMP WHERE id = 1", [u, o]), await this.saveToIndexedDB(), { success: true, message: "Senha alterada com sucesso" };
  }
  async getTransactions() {
    const t = this.db.prepare("SELECT * FROM transactions ORDER BY date DESC, created_at DESC"), n = [];
    for (; t.step(); ) n.push(t.getAsObject());
    t.free();
    const r = {};
    return n.forEach((l) => {
      r[l.date] || (r[l.date] = { income: {}, expenses: {} }), r[l.date][l.type][l.id] = { amount: l.amount, description: l.description, category: l.category, timestamp: l.created_at };
    }), r;
  }
  async addTransaction(t, n, r, l, s) {
    return this.db.run("INSERT INTO transactions (date, type, amount, description, category) VALUES (?, ?, ?, ?, ?)", [t, n, r, l, s]), await this.saveToIndexedDB(), { message: "Transaction added successfully" };
  }
  async deleteTransaction(t) {
    console.log("\u{1F50D} DEBUG deleteTransaction - ID recebido:", t, "tipo:", typeof t);
    const n = this.db.prepare("SELECT * FROM transactions"), r = [];
    for (; n.step(); ) r.push(n.getAsObject());
    n.free(), console.log("\u{1F50D} DEBUG - TODAS as transa\xE7\xF5es no banco:", r);
    const l = this.db.prepare("SELECT * FROM transactions WHERE id = ?");
    l.bind([t]);
    let s = null;
    if (l.step() && (s = l.getAsObject()), l.free(), console.log("\u{1F50D} DEBUG - Transa\xE7\xE3o com ID", t, "existe?", s), !s) throw new Error("Transaction not found");
    try {
      const o = `DELETE FROM transactions WHERE id = ${t}`;
      console.log("\u{1F50D} DEBUG - SQL executado:", o), this.db.exec(o);
      const u = this.db.prepare("SELECT * FROM transactions WHERE id = ?");
      u.bind([t]);
      let a = false;
      if (u.step() && (a = u.getAsObject()), u.free(), console.log("\u{1F50D} DEBUG - Transa\xE7\xE3o ainda existe ap\xF3s DELETE?", a), a) throw new Error("Failed to delete transaction");
      return await this.saveToIndexedDB(), console.log("\u2705 DEBUG - Transa\xE7\xE3o deletada com sucesso!"), { message: "Transaction deleted successfully" };
    } catch (o) {
      throw console.error("\u274C DEBUG - Erro no DELETE:", o), new Error("Failed to delete transaction: " + o.message);
    }
  }
  async getInitialBalances() {
    const t = this.db.prepare("SELECT * FROM initial_balances"), n = {};
    for (; t.step(); ) {
      const r = t.getAsObject();
      n[r.investment_type] = r.amount;
    }
    return t.free(), n;
  }
  async updateInitialBalances(t) {
    return this.db.run("DELETE FROM initial_balances"), Object.entries(t).forEach(([n, r]) => {
      r && r > 0 && this.db.run("INSERT INTO initial_balances (investment_type, amount) VALUES (?, ?)", [n, r]);
    }), await this.saveToIndexedDB(), { message: "Initial balances updated successfully" };
  }
  async getInvestmentMovements() {
    const t = this.db.prepare("SELECT * FROM investment_movements ORDER BY date DESC, created_at DESC"), n = {};
    for (; t.step(); ) {
      const r = t.getAsObject();
      n[r.date] || (n[r.date] = {}), n[r.date][r.id] = { investmentType: r.investment_type, amount: r.amount, description: r.description, timestamp: r.created_at };
    }
    return t.free(), n;
  }
  async addInvestmentMovement(t, n, r, l) {
    return this.db.run("INSERT INTO investment_movements (date, investment_type, amount, description) VALUES (?, ?, ?, ?)", [t, n, r, l]), await this.saveToIndexedDB(), { message: "Investment movement added successfully" };
  }
  async deleteInvestmentMovement(t) {
    const n = this.db.run("DELETE FROM investment_movements WHERE id = ?", [t]);
    if (await this.saveToIndexedDB(), n.changes > 0) return { message: "Investment movement deleted successfully" };
    throw new Error("Investment movement not found");
  }
  async getAnnualReport(t) {
    const n = this.db.prepare("SELECT * FROM transactions WHERE substr(date, 1, 4) = ? ORDER BY date"), r = [];
    for (n.bind([t.toString()]); n.step(); ) r.push(n.getAsObject());
    n.free();
    const l = this.db.prepare("SELECT * FROM initial_balances"), s = [];
    for (; l.step(); ) s.push(l.getAsObject());
    l.free();
    const o = this.db.prepare("SELECT * FROM investment_movements WHERE substr(date, 1, 4) = ? ORDER BY date"), u = [];
    for (o.bind([t.toString()]); o.step(); ) u.push(o.getAsObject());
    o.free();
    const a = {};
    for (let g = 1; g <= 12; g++) {
      const v = g.toString().padStart(2, "0");
      a[v] = { income: 0, expenses: 0, investmentMovements: 0, transactions: [] };
    }
    r.forEach((g) => {
      const v = g.date.substring(5, 7);
      g.type === "income" ? a[v].income += g.amount : a[v].expenses += g.amount, a[v].transactions.push(g);
    }), u.forEach((g) => {
      const v = g.date.substring(5, 7);
      a[v].investmentMovements += g.amount;
    });
    const p = s.reduce((g, v) => g + v.amount, 0);
    return { year: parseInt(t), initialPatrimony: p, monthlyData: a, summary: { totalIncome: Object.values(a).reduce((g, v) => g + v.income, 0), totalExpenses: Object.values(a).reduce((g, v) => g + v.expenses, 0), totalInvestmentMovements: Object.values(a).reduce((g, v) => g + v.investmentMovements, 0) } };
  }
  async exportData() {
    const [t, n, r] = await Promise.all([this.getAllTableData("transactions"), this.getAllTableData("initial_balances"), this.getAllTableData("investment_movements")]);
    return { timestamp: (/* @__PURE__ */ new Date()).toISOString(), database: "SQLite WebAssembly", data: { transactions: t, initialBalances: n, investmentMovements: r } };
  }
  async getAllTableData(t) {
    const n = this.db.prepare(`SELECT * FROM ${t}`), r = [];
    for (; n.step(); ) r.push(n.getAsObject());
    return n.free(), r;
  }
  generateSalt() {
    const t = new Uint8Array(32);
    return crypto.getRandomValues(t), Array.from(t, (n) => n.toString(16).padStart(2, "0")).join("");
  }
  async hashPassword(t, n) {
    const l = new TextEncoder().encode(t + n), s = await crypto.subtle.digest("SHA-256", l), o = new Uint8Array(s);
    return Array.from(o, (u) => u.toString(16).padStart(2, "0")).join("");
  }
  async downloadBackup() {
    const t = this.db.export(), n = new Blob([t], { type: "application/octet-stream" }), r = URL.createObjectURL(n), l = document.createElement("a");
    l.href = r, l.download = `personal_finance_backup_${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.db`, l.click(), URL.revokeObjectURL(r);
  }
  async uploadBackup(t) {
    return new Promise((n, r) => {
      const l = new FileReader();
      l.onload = (s) => {
        try {
          const o = new Uint8Array(s.target.result);
          this.db = new this.SQL.Database(o), this.saveToIndexedDB().then(() => {
            n({ success: true, message: "Backup restaurado com sucesso" });
          });
        } catch {
          r(new Error("Arquivo de backup inv\xE1lido"));
        }
      }, l.onerror = () => r(new Error("Erro ao ler arquivo")), l.readAsArrayBuffer(t);
    });
  }
}
const Re = new Cp();
function Tp() {
  const [e, t] = H.useState(false), [n, r] = H.useState(null), [l, s] = H.useState("login"), [o, u] = H.useState({}), [a, p] = H.useState({}), [g, v] = H.useState({}), [y, C] = H.useState("dashboard"), [T, R] = H.useState(false), [J, m] = H.useState((/* @__PURE__ */ new Date()).getFullYear()), [d, h] = H.useState(true), [S, L] = H.useState("Inicializando..."), [O, N] = H.useState(0), [c, f] = H.useState(""), [x, D] = H.useState(""), [z, B] = H.useState(""), [K, Se] = H.useState(""), [le, I] = H.useState(false), [_, k] = H.useState(null), [$, Q] = H.useState(false), [j, Z] = H.useState(""), [se, oe] = H.useState("date"), [ee, de] = H.useState("desc"), [je, U] = H.useState(false), [X, ae] = H.useState(null), Ne = { income: ["Sal\xE1rio", "Freelance", "Investimentos", "Vendas", "Pr\xEAmio", "Outros"], expenses: ["Alimenta\xE7\xE3o", "Transporte", "Moradia", "Sa\xFAde", "Educa\xE7\xE3o", "Lazer", "Compras", "Outros"] };
  H.useEffect(() => {
    (async () => {
      try {
        L("Inicializando banco de dados..."), await Re.initialize();
        const M = sessionStorage.getItem("finance-app-authenticated") === "true", A = await Re.checkSetup();
        r(A.isSetup), M && A.isSetup ? (t(true), L("Conectado")) : L("Aguardando autentica\xE7\xE3o"), h(false);
      } catch (M) {
        console.error("Erro ao inicializar aplicativo:", M), L("Erro de inicializa\xE7\xE3o"), h(false);
      }
    })();
  }, []), H.useEffect(() => {
    if (e) {
      const w = setTimeout(() => {
        ie();
      }, 5e3);
      return () => clearTimeout(w);
    }
  }, [e]), H.useEffect(() => {
    if (e) {
      const w = setTimeout(() => {
        Oe();
      }, 7e3);
      return () => clearTimeout(w);
    }
  }, [e]);
  const ie = () => {
    const w = localStorage.getItem("app_first_use"), M = JSON.parse(localStorage.getItem("donation_status") || "{}");
    if (!w) {
      localStorage.setItem("app_first_use", (/* @__PURE__ */ new Date()).toISOString());
      return;
    }
    const A = new Date(w), F = Math.floor((/* @__PURE__ */ new Date() - A) / (1e3 * 60 * 60 * 24));
    if (F >= 60 && !M.day60_dismissed) {
      const b = M.day60_last_shown ? new Date(M.day60_last_shown) : null;
      (!b || (/* @__PURE__ */ new Date() - b) / (1e3 * 60 * 60 * 24) >= 7) && (k(60), I(true), localStorage.setItem("donation_status", JSON.stringify({ ...M, day60_last_shown: (/* @__PURE__ */ new Date()).toISOString() })));
    } else if (F >= 90 && !M.day90_dismissed) {
      const b = M.day90_last_shown ? new Date(M.day90_last_shown) : null;
      (!b || (/* @__PURE__ */ new Date() - b) / (1e3 * 60 * 60 * 24) >= 7) && (k(90), I(true), localStorage.setItem("donation_status", JSON.stringify({ ...M, day90_last_shown: (/* @__PURE__ */ new Date()).toISOString() })));
    }
  }, Oe = () => {
    const w = localStorage.getItem("app_first_use"), M = JSON.parse(localStorage.getItem("rating_status") || "{}");
    if (!w) return;
    const A = new Date(w);
    if (Math.floor((/* @__PURE__ */ new Date() - A) / (1e3 * 60 * 60 * 24)) >= 30 && !M.dismissed) {
      const b = M.last_shown ? new Date(M.last_shown) : null;
      (!b || (/* @__PURE__ */ new Date() - b) / (1e3 * 60 * 60 * 24) >= 7) && (Q(true), localStorage.setItem("rating_status", JSON.stringify({ ...M, last_shown: (/* @__PURE__ */ new Date()).toISOString() })));
    }
  }, ve = () => {
    const w = JSON.parse(localStorage.getItem("donation_status") || "{}");
    localStorage.setItem("donation_status", JSON.stringify({ ...w, [`day${_}_dismissed`]: true })), I(false);
  }, ue = () => {
    const w = JSON.parse(localStorage.getItem("rating_status") || "{}");
    localStorage.setItem("rating_status", JSON.stringify({ ...w, dismissed: true })), Q(false);
  }, Ye = () => {
    window.open("https://github.com/lamvial1958/personal-finance-flow", "_blank");
  }, $e = async () => {
    try {
      await navigator.clipboard.writeText("lamvial@outlook.com"), alert("PIX copiado para a \xE1rea de transfer\xEAncia!");
    } catch {
      const M = document.createElement("textarea");
      M.value = "lamvial@outlook.com", document.body.appendChild(M), M.select(), document.execCommand("copy"), document.body.removeChild(M), alert("PIX copiado para a \xE1rea de transfer\xEAncia!");
    }
  }, tt = H.useCallback(async () => {
    try {
      L("Carregando dados...");
      const [w, M, A] = await Promise.all([Re.getTransactions(), Re.getInitialBalances(), Re.getInvestmentMovements()]);
      fn.startTransition(() => {
        u(w || {}), p(M || {}), v(A || {}), N((F) => F + 1), L("Conectado");
      }), console.log("\u2705 Dados carregados do SQLite WebAssembly");
    } catch (w) {
      console.error("\u26A0\uFE0F Erro ao carregar dados:", w), L("Erro ao carregar dados"), fn.startTransition(() => {
        u({}), p({}), v({});
      });
    }
  }, []);
  H.useEffect(() => {
    e && tt();
  }, [e, tt]);
  const ht = async () => {
    if (c !== x) {
      alert("Senhas n\xE3o coincidem");
      return;
    }
    if (c.length < 6) {
      alert("Senha deve ter pelo menos 6 caracteres");
      return;
    }
    try {
      await Re.setupAuth(c), alert("Sistema configurado com sucesso!"), r(true), s("login"), f(""), D("");
    } catch (w) {
      alert("Erro ao configurar: " + w.message);
    }
  }, Ve = async () => {
    try {
      await Re.login(c), sessionStorage.setItem("finance-app-authenticated", "true"), t(true), f("");
    } catch (w) {
      alert("Erro no login: " + w.message);
    }
  }, fe = async () => {
    if (K !== x) {
      alert("Novas senhas n\xE3o coincidem");
      return;
    }
    try {
      await Re.changePassword(z, K), alert("Senha alterada com sucesso!"), s("login"), B(""), Se(""), D("");
    } catch (w) {
      alert("Erro ao alterar senha: " + w.message);
    }
  }, Ee = () => {
    sessionStorage.removeItem("finance-app-authenticated"), t(false), u({}), p({}), v({}), N(0), L("Desconectado");
  }, Ot = (w, M, A, F) => {
    console.log("\u{1F5D1}\uFE0F Preparando exclus\xE3o:", { transactionId: w, date: M, type: A, description: F }), ae({ id: w, date: M, type: A, description: F }), U(true);
  }, te = async () => {
    try {
      console.log("\u{1F5D1}\uFE0F Iniciando exclus\xE3o - ID:", X.id), console.log("\u{1F5D1}\uFE0F Estrutura atual dailyTransactions:", o), await Re.deleteTransaction(X.id), console.log("\u2705 Exclus\xE3o realizada no banco");
      const w = await Re.getTransactions();
      console.log("\u{1F4CA} Dados recarregados:", w), fn.startTransition(() => {
        u(w || {}), N((M) => M + 1);
      }), U(false), ae(null), alert("Transa\xE7\xE3o exclu\xEDda com sucesso!");
    } catch (w) {
      console.error("\u274C Erro ao excluir transa\xE7\xE3o:", w), alert("Erro ao excluir transa\xE7\xE3o: " + w.message);
    }
  }, $t = () => {
    try {
      const w = [];
      Object.entries(o).forEach(([V, ne]) => {
        Object.entries(ne.income || {}).forEach(([W, Y]) => {
          w.push({ Data: at(V), Tipo: "Entrada", Valor: Y.amount.toFixed(2).replace(".", ","), Categoria: Y.category || "", Descri\u00E7\u00E3o: Y.description || "" });
        }), Object.entries(ne.expenses || {}).forEach(([W, Y]) => {
          w.push({ Data: at(V), Tipo: "Sa\xEDda", Valor: Y.amount.toFixed(2).replace(".", ","), Categoria: Y.category || "", Descri\u00E7\u00E3o: Y.description || "" });
        });
      }), w.sort((V, ne) => {
        const W = new Date(V.Data.split("/").reverse().join("-"));
        return new Date(ne.Data.split("/").reverse().join("-")) - W;
      });
      const M = jp.unparse(w, { delimiter: ",", header: true, encoding: "utf-8" }), A = new Blob([M], { type: "text/csv;charset=utf-8;" }), F = URL.createObjectURL(A), b = document.createElement("a");
      b.href = F, b.download = `transacoes_financeiras_${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.csv`, b.click(), URL.revokeObjectURL(F), alert("Arquivo CSV exportado com sucesso!");
    } catch (w) {
      console.error("Erro ao exportar CSV:", w), alert("Erro ao exportar dados para CSV.");
    }
  }, pe = H.useCallback((w) => typeof w != "number" || isNaN(w) ? "$ 0.00" : new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(w), []), at = H.useCallback((w) => new Date(w).toLocaleDateString("pt-BR"), []), kt = H.useCallback(async (w, M, A, F, b) => {
    try {
      const V = b || (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
      console.log("\u{1F4B0} Adicionando transa\xE7\xE3o:", { type: w, amount: M, description: A, category: F, dateKey: V }), await Re.addTransaction(V, w, parseFloat(M), A, F), console.log("\u2705 Transa\xE7\xE3o salva no banco");
      const ne = await Re.getTransactions();
      console.log("\u{1F4CA} Dados recarregados ap\xF3s inser\xE7\xE3o:", ne), fn.startTransition(() => {
        u(ne || {}), N((W) => W + 1);
      }), console.log("\u2705 Interface atualizada");
    } catch (V) {
      throw console.error("\u274C Erro ao adicionar transa\xE7\xE3o:", V), V;
    }
  }, []), Nt = H.useCallback(async (w) => {
    try {
      await Re.updateInitialBalances(w), fn.startTransition(() => {
        p(w), N((M) => M + 1);
      });
    } catch (M) {
      console.error("Erro ao atualizar saldos:", M), alert("Erro ao salvar saldos iniciais.");
    }
  }, []), _t = H.useCallback(async (w, M, A, F) => {
    try {
      await Re.addInvestmentMovement(w, M, parseFloat(A), F);
      const b = await Re.getInvestmentMovements();
      fn.startTransition(() => {
        v(b || {}), N((V) => V + 1);
      });
    } catch (b) {
      console.error("Erro ao adicionar movimento:", b), alert("Erro ao adicionar movimento de investimento.");
    }
  }, []), Ce = H.useMemo(() => {
    const w = {};
    return Object.entries(o).forEach(([M, A]) => {
      const F = Object.values(A.income || {}).reduce((V, ne) => V + (ne.amount || 0), 0), b = Object.values(A.expenses || {}).reduce((V, ne) => V + (ne.amount || 0), 0);
      w[M] = { income: F, expenses: b, balance: F - b };
    }), w;
  }, [o, O]);
  H.useMemo(() => {
    const w = {};
    return Object.entries(Ce).forEach(([M, A]) => {
      const F = M.substring(0, 7);
      w[F] || (w[F] = { income: 0, expenses: 0, balance: 0 }), w[F].income += A.income, w[F].expenses += A.expenses, w[F].balance += A.balance;
    }), w;
  }, [Ce, O]);
  const dn = H.useMemo(() => {
    const w = Object.values(a).reduce((F, b) => F + (b || 0), 0), M = Object.values(g).reduce((F, b) => F + Object.values(b).reduce((V, ne) => V + (ne.amount || 0), 0), 0), A = Object.values(Ce).reduce((F, b) => F + b.balance, 0);
    return w + M + A;
  }, [a, g, Ce, O]), Xe = H.useMemo(() => {
    const w = [];
    console.log("\u{1F4CA} Processando dailyTransactions para lista:", o), Object.entries(o).forEach(([A, F]) => {
      Object.entries(F.income || {}).forEach(([b, V]) => {
        console.log(`\u{1F49A} Receita encontrada - ID: ${b}, Dados:`, V), w.push({ id: parseInt(b), date: A, type: "income", amount: V.amount, description: V.description, category: V.category, timestamp: V.timestamp });
      }), Object.entries(F.expenses || {}).forEach(([b, V]) => {
        console.log(`\u{1F534} Despesa encontrada - ID: ${b}, Dados:`, V), w.push({ id: parseInt(b), date: A, type: "expenses", amount: V.amount, description: V.description, category: V.category, timestamp: V.timestamp });
      });
    }), console.log("\u{1F4CB} Lista completa de transa\xE7\xF5es:", w);
    let M = w;
    if (j.trim()) {
      const A = j.toLowerCase().trim();
      M = w.filter((F) => (F.description || "").toLowerCase().includes(A) || (F.category || "").toLowerCase().includes(A));
    }
    return M.sort((A, F) => {
      let b = 0;
      switch (se) {
        case "date":
          b = new Date(A.date) - new Date(F.date);
          break;
        case "amount":
          b = A.amount - F.amount;
          break;
        case "category":
          b = (A.category || "").localeCompare(F.category || "");
          break;
        case "description":
          b = (A.description || "").localeCompare(F.description || "");
          break;
        default:
          b = 0;
      }
      return ee === "desc" ? -b : b;
    }), M;
  }, [o, j, se, ee, O]), Qr = () => le ? i.jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4", children: i.jsxs("div", { className: "bg-white rounded-lg p-6 max-w-md w-full shadow-xl", children: [i.jsxs("div", { className: "text-center mb-4", children: [i.jsx("div", { className: "text-4xl mb-2", children: "\u{1F499}" }), i.jsx("h3", { className: "text-lg font-semibold text-gray-800", children: _ === 60 ? "Voc\xEA est\xE1 usando h\xE1 2 meses!" : "Voc\xEA est\xE1 usando h\xE1 3 meses!" })] }), i.jsx("p", { className: "text-gray-600 text-center mb-6", children: "Se voc\xEA est\xE1 gostando do programa, ajude a mant\xEA-lo e melhor\xE1-lo. A doa\xE7\xE3o de qualquer valor ajuda no desenvolvimento de novas funcionalidades." }), i.jsx("div", { className: "bg-blue-50 rounded-lg p-4 mb-6 border border-blue-200", children: i.jsxs("div", { className: "flex items-center justify-between", children: [i.jsxs("div", { children: [i.jsx("p", { className: "text-sm text-gray-600 mb-1", children: "PIX:" }), i.jsx("p", { className: "font-mono text-lg font-semibold text-blue-800", children: "lamvial@outlook.com" })] }), i.jsx("button", { onClick: $e, className: "bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700", children: "Copiar" })] }) }), i.jsxs("div", { className: "flex flex-col gap-2", children: [i.jsx("button", { onClick: () => {
    $e(), I(false);
  }, className: "w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 font-medium", children: "\u{1F49A} Obrigado, vou considerar!" }), i.jsx("button", { onClick: () => I(false), className: "w-full bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300", children: "Lembrar mais tarde" }), i.jsx("button", { onClick: ve, className: "w-full text-gray-500 py-2 text-sm hover:text-gray-700", children: "N\xE3o mostrar novamente" })] }), i.jsx("p", { className: "text-xs text-gray-400 text-center mt-4", children: "Este app \xE9 totalmente gratuito e seus dados ficam no seu dispositivo" })] }) }) : null, nr = () => $ ? i.jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4", children: i.jsxs("div", { className: "bg-white rounded-lg p-6 max-w-md w-full shadow-xl", children: [i.jsxs("div", { className: "text-center mb-4", children: [i.jsx("div", { className: "text-4xl mb-2", children: "\u2B50" }), i.jsx("h3", { className: "text-lg font-semibold text-gray-800", children: "Gostou? Deixe uma \u2B50 para ajudar outros a descobrir" })] }), i.jsx("p", { className: "text-gray-600 text-center mb-6", children: "Voc\xEA est\xE1 usando h\xE1 mais de 30 dias! Se o aplicativo tem sido \xFAtil, uma avalia\xE7\xE3o no GitHub ajuda outras pessoas a encontr\xE1-lo." }), i.jsx("div", { className: "bg-yellow-50 rounded-lg p-4 mb-6 border border-yellow-200", children: i.jsxs("div", { className: "text-center", children: [i.jsx("p", { className: "text-sm text-gray-600 mb-2", children: "Clique no bot\xE3o abaixo e depois na estrela \u2B50" }), i.jsx("p", { className: "text-xs text-gray-500", children: 'GitHub \u2192 Bot\xE3o "\u2B50 Star" \u2192 Pronto!' })] }) }), i.jsxs("div", { className: "flex flex-col gap-2", children: [i.jsx("button", { onClick: () => {
    Ye(), Q(false);
  }, className: "w-full bg-yellow-600 text-white py-3 rounded hover:bg-yellow-700 font-medium", children: "\u2B50 Avaliar no GitHub" }), i.jsx("button", { onClick: () => Q(false), className: "w-full bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300", children: "Lembrar mais tarde" }), i.jsx("button", { onClick: ue, className: "w-full text-gray-500 py-2 text-sm hover:text-gray-700", children: "N\xE3o mostrar novamente" })] }), i.jsx("p", { className: "text-xs text-gray-400 text-center mt-4", children: "Leva apenas 10 segundos e ajuda muito o projeto" })] }) }) : null, Hc = () => !je || !X ? null : i.jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4", children: i.jsxs("div", { className: "bg-white rounded-lg p-6 max-w-md w-full shadow-xl", children: [i.jsxs("div", { className: "text-center mb-4", children: [i.jsx("div", { className: "text-4xl mb-2 text-red-500", children: "\u26A0\uFE0F" }), i.jsx("h3", { className: "text-lg font-semibold text-gray-800", children: "Excluir Transa\xE7\xE3o" })] }), i.jsxs("div", { className: "mb-6 p-4 bg-gray-50 rounded-lg", children: [i.jsxs("p", { className: "text-sm text-gray-600 mb-2", children: [i.jsx("strong", { children: "ID:" }), " ", X.id] }), i.jsxs("p", { className: "text-sm text-gray-600 mb-2", children: [i.jsx("strong", { children: "Data:" }), " ", at(X.date)] }), i.jsxs("p", { className: "text-sm text-gray-600 mb-2", children: [i.jsx("strong", { children: "Tipo:" }), " ", X.type === "income" ? "Entrada" : "Sa\xEDda"] }), i.jsxs("p", { className: "text-sm text-gray-600", children: [i.jsx("strong", { children: "Descri\xE7\xE3o:" }), " ", X.description] })] }), i.jsx("p", { className: "text-gray-600 text-center mb-6", children: "Esta a\xE7\xE3o n\xE3o pode ser desfeita. Deseja realmente excluir esta transa\xE7\xE3o?" }), i.jsxs("div", { className: "flex gap-3", children: [i.jsx("button", { onClick: () => {
    U(false), ae(null);
  }, className: "flex-1 bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300", children: "Cancelar" }), i.jsx("button", { onClick: te, className: "flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 font-medium", children: "Excluir" })] })] }) });
  if (d) return i.jsx("div", { className: "min-h-screen bg-gray-50 flex items-center justify-center", children: i.jsxs("div", { className: "text-center", children: [i.jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" }), i.jsx("h2", { className: "text-xl font-semibold text-gray-700", children: "V&M Personal Finance PWA" }), i.jsx("p", { className: "text-gray-500 mt-2", children: S })] }) });
  if (!e) return i.jsx("div", { className: "min-h-screen bg-gray-50 flex items-center justify-center p-4", children: i.jsxs("div", { className: "max-w-md w-full space-y-6", children: [i.jsxs("div", { className: "text-center", children: [i.jsx("img", { src: "/icon-192.png", alt: "Logo", className: "mx-auto h-16 w-16 object-contain" }), i.jsx("h2", { className: "mt-6 text-3xl font-extrabold text-gray-900", children: "V&M Personal Finance" }), i.jsx("p", { className: "mt-2 text-sm text-blue-600", children: "Progressive Web App" })] }), l === "setup" && i.jsxs("div", { className: "bg-white rounded-lg shadow p-6 space-y-4", children: [i.jsx("h3", { className: "text-lg font-semibold text-gray-900", children: "Configurar Sistema" }), i.jsx("p", { className: "text-sm text-gray-600", children: "Configure uma senha para proteger seus dados financeiros. Esta senha ser\xE1 necess\xE1ria para acessar o sistema." }), i.jsxs("div", { children: [i.jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Senha" }), i.jsx("input", { type: "password", value: c, onChange: (w) => f(w.target.value), className: "mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500", placeholder: "M\xEDnimo 6 caracteres" })] }), i.jsxs("div", { children: [i.jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Confirmar Senha" }), i.jsx("input", { type: "password", value: x, onChange: (w) => D(w.target.value), className: "mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500", placeholder: "Digite a senha novamente" })] }), i.jsx("button", { onClick: ht, className: "w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium", children: "Configurar Sistema" })] }), l === "login" && n && i.jsxs("div", { className: "bg-white rounded-lg shadow p-6 space-y-4", children: [i.jsx("h3", { className: "text-lg font-semibold text-gray-900", children: "Entrar" }), i.jsxs("div", { children: [i.jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Senha" }), i.jsx("input", { type: "password", value: c, onChange: (w) => f(w.target.value), onKeyPress: (w) => w.key === "Enter" && Ve(), className: "mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500", placeholder: "Digite sua senha" })] }), i.jsx("button", { onClick: Ve, className: "w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium", children: "Entrar" }), i.jsx("div", { className: "text-center", children: i.jsx("button", { onClick: () => s("change-password"), className: "text-sm text-blue-600 hover:text-blue-700", children: "Alterar senha" }) })] }), l === "change-password" && i.jsxs("div", { className: "bg-white rounded-lg shadow p-6 space-y-4", children: [i.jsx("h3", { className: "text-lg font-semibold text-gray-900", children: "Alterar Senha" }), i.jsxs("div", { children: [i.jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Senha Atual" }), i.jsx("input", { type: "password", value: z, onChange: (w) => B(w.target.value), className: "mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500", placeholder: "Sua senha atual" })] }), i.jsxs("div", { children: [i.jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Nova Senha" }), i.jsx("input", { type: "password", value: K, onChange: (w) => Se(w.target.value), className: "mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500", placeholder: "Nova senha (m\xEDnimo 6 caracteres)" })] }), i.jsxs("div", { children: [i.jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Confirmar Nova Senha" }), i.jsx("input", { type: "password", value: x, onChange: (w) => D(w.target.value), className: "mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500", placeholder: "Confirme a nova senha" })] }), i.jsx("button", { onClick: fe, className: "w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium", children: "Alterar Senha" }), i.jsx("button", { onClick: () => s("login"), className: "w-full text-gray-600 hover:text-gray-700", children: "Voltar ao login" })] }), !n && l === "login" && i.jsxs("div", { className: "bg-white rounded-lg shadow p-6 space-y-4 text-center", children: [i.jsx("h3", { className: "text-lg font-semibold text-gray-900", children: "Sistema N\xE3o Configurado" }), i.jsx("p", { className: "text-gray-600", children: "Este \xE9 o primeiro acesso. Configure uma senha para proteger seus dados." }), i.jsx("button", { onClick: () => s("setup"), className: "w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium", children: "Configurar Sistema" })] }), i.jsxs("div", { className: "bg-blue-50 border border-blue-200 rounded-lg p-4", children: [i.jsx("h4", { className: "font-semibold text-blue-800", children: "Progressive Web App" }), i.jsxs("div", { className: "text-sm text-blue-700 mt-2 space-y-1", children: [i.jsx("p", { children: "\u2022 Funciona offline ap\xF3s carregamento inicial" }), i.jsx("p", { children: "\u2022 Dados salvos localmente em seu dispositivo" }), i.jsx("p", { children: '\u2022 Instale tocando "Adicionar \xE0 tela inicial"' }), i.jsx("p", { children: "\u2022 Funciona em computador, tablet e celular" })] })] })] }) });
  const Qc = () => {
    const [w, M] = H.useState({ type: "income", amount: "", description: "", category: "", date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0] }), A = async (W) => {
      if (W.preventDefault(), !w.amount || !w.description) {
        alert("Por favor, preencha valor e descri\xE7\xE3o.");
        return;
      }
      if (parseFloat(w.amount) <= 0) {
        alert("O valor deve ser maior que zero.");
        return;
      }
      try {
        await kt(w.type, w.amount, w.description, w.category, w.date), M({ type: "income", amount: "", description: "", category: "", date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0] }), alert("Transa\xE7\xE3o adicionada com sucesso!");
      } catch (Y) {
        console.error("Erro no formul\xE1rio:", Y), alert("Erro ao adicionar transa\xE7\xE3o: " + Y.message);
      }
    }, F = Ce[w.date] || { income: 0, expenses: 0 }, b = Object.values(Ce).reduce((W, Y) => W + Y.income, 0), V = Object.values(Ce).reduce((W, Y) => W + Y.expenses, 0), ne = Xe;
    return i.jsxs("div", { className: "space-y-6", children: [i.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [i.jsx("div", { className: "bg-white rounded-lg shadow p-6", children: i.jsxs("div", { className: "flex items-center", children: [i.jsx("div", { className: "p-2 bg-green-100 rounded-lg", children: i.jsx("svg", { className: "w-6 h-6 text-green-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: i.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M12 6v6m0 0v6m0-6h6m-6 0H6" }) }) }), i.jsxs("div", { className: "ml-4", children: [i.jsx("p", { className: "text-sm font-medium text-gray-600", children: "Entradas Hoje" }), i.jsx("p", { className: "text-2xl font-bold text-green-600", children: pe(F.income) })] })] }) }), i.jsx("div", { className: "bg-white rounded-lg shadow p-6", children: i.jsxs("div", { className: "flex items-center", children: [i.jsx("div", { className: "p-2 bg-red-100 rounded-lg", children: i.jsx("svg", { className: "w-6 h-6 text-red-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: i.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M20 12H4" }) }) }), i.jsxs("div", { className: "ml-4", children: [i.jsx("p", { className: "text-sm font-medium text-gray-600", children: "Sa\xEDdas Hoje" }), i.jsx("p", { className: "text-2xl font-bold text-red-600", children: pe(F.expenses) })] })] }) }), i.jsx("div", { className: "bg-white rounded-lg shadow p-6", children: i.jsxs("div", { className: "flex items-center", children: [i.jsx("div", { className: "p-2 bg-purple-100 rounded-lg", children: i.jsx("svg", { className: "w-6 h-6 text-purple-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: i.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" }) }) }), i.jsxs("div", { className: "ml-4", children: [i.jsx("p", { className: "text-sm font-medium text-gray-600", children: "Patrim\xF4nio Total" }), i.jsx("p", { className: "text-2xl font-bold text-purple-600", children: pe(dn) })] })] }) })] }), i.jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [i.jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Nova Transa\xE7\xE3o" }), i.jsxs("form", { onSubmit: A, className: "space-y-4", children: [i.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [i.jsxs("div", { children: [i.jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Tipo" }), i.jsxs("select", { value: w.type, onChange: (W) => M({ ...w, type: W.target.value, category: "" }), className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent", children: [i.jsx("option", { value: "income", children: "Entrada" }), i.jsx("option", { value: "expenses", children: "Sa\xEDda" })] })] }), i.jsxs("div", { children: [i.jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Data" }), i.jsx("input", { type: "date", value: w.date, onChange: (W) => M({ ...w, date: W.target.value }), className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" })] })] }), i.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [i.jsxs("div", { children: [i.jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Valor *" }), i.jsx("input", { type: "number", step: "0.01", min: "0.01", value: w.amount, onChange: (W) => M({ ...w, amount: W.target.value }), className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent", placeholder: "0,00", required: true })] }), i.jsxs("div", { children: [i.jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Categoria" }), i.jsxs("select", { value: w.category, onChange: (W) => M({ ...w, category: W.target.value }), className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent", children: [i.jsx("option", { value: "", children: "Selecione uma categoria" }), Ne[w.type].map((W) => i.jsx("option", { value: W, children: W }, W))] })] })] }), i.jsxs("div", { children: [i.jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Descri\xE7\xE3o *" }), i.jsx("input", { type: "text", value: w.description, onChange: (W) => M({ ...w, description: W.target.value }), className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent", placeholder: "Descri\xE7\xE3o da transa\xE7\xE3o", required: true })] }), i.jsx("button", { type: "submit", className: "w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium", children: "Adicionar Transa\xE7\xE3o" })] })] }), i.jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [i.jsxs("div", { className: "flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4", children: [i.jsxs("h3", { className: "text-lg font-semibold text-gray-900", children: ["Transa\xE7\xF5es Recentes (", ne.length, ")"] }), i.jsxs("div", { className: "flex flex-col sm:flex-row gap-3", children: [i.jsxs("div", { className: "relative", children: [i.jsx("svg", { className: "w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: i.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" }) }), i.jsx("input", { type: "text", value: j, onChange: (W) => Z(W.target.value), placeholder: "Buscar por descri\xE7\xE3o ou categoria", className: "pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-64" })] }), i.jsxs("select", { value: `${se}-${ee}`, onChange: (W) => {
      const [Y, Vt] = W.target.value.split("-");
      oe(Y), de(Vt);
    }, className: "px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent", children: [i.jsx("option", { value: "date-desc", children: "Data \u2193 (mais recente)" }), i.jsx("option", { value: "date-asc", children: "Data \u2191 (mais antiga)" }), i.jsx("option", { value: "amount-desc", children: "Valor \u2193 (maior)" }), i.jsx("option", { value: "amount-asc", children: "Valor \u2191 (menor)" }), i.jsx("option", { value: "category-asc", children: "Categoria A-Z" }), i.jsx("option", { value: "category-desc", children: "Categoria Z-A" })] })] })] }), i.jsx("div", { className: "space-y-3 max-h-96 overflow-y-auto", children: ne.length === 0 ? i.jsx("div", { className: "text-center py-8 text-gray-500", children: j ? "Nenhuma transa\xE7\xE3o encontrada para esta busca." : "Nenhuma transa\xE7\xE3o encontrada." }) : ne.map((W) => i.jsx("div", { className: "border border-gray-200 rounded-lg p-4 hover:bg-gray-50", children: i.jsxs("div", { className: "flex items-center justify-between", children: [i.jsxs("div", { className: "flex-1", children: [i.jsxs("div", { className: "flex items-center gap-3", children: [i.jsx("span", { className: `px-2 py-1 rounded-full text-xs font-medium ${W.type === "income" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`, children: W.type === "income" ? "Entrada" : "Sa\xEDda" }), i.jsx("span", { className: "text-sm text-gray-500", children: at(W.date) }), i.jsxs("span", { className: "text-xs text-gray-400", children: ["ID: ", W.id] })] }), i.jsx("p", { className: "font-medium text-gray-900 mt-1", children: j ? i.jsx("span", { dangerouslySetInnerHTML: { __html: (W.description || "").replace(new RegExp(`(${j})`, "gi"), '<mark class="bg-yellow-200">$1</mark>') } }) : W.description }), i.jsxs("div", { className: "flex items-center gap-4 mt-1", children: [i.jsx("span", { className: "text-sm text-gray-600", children: j ? i.jsx("span", { dangerouslySetInnerHTML: { __html: (W.category || "Sem categoria").replace(new RegExp(`(${j})`, "gi"), '<mark class="bg-yellow-200">$1</mark>') } }) : W.category || "Sem categoria" }), i.jsx("span", { className: `font-semibold ${W.type === "income" ? "text-green-600" : "text-red-600"}`, children: pe(W.amount) })] })] }), i.jsx("button", { onClick: () => Ot(W.id, W.date, W.type, W.description), className: "ml-4 p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors", title: "Excluir transa\xE7\xE3o", children: i.jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: i.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M6 18L18 6M6 6l12 12" }) }) })] }) }, `${W.date}-${W.id}`)) })] }), i.jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [i.jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Liquidez Mensal" }), i.jsxs("div", { className: "space-y-3", children: [i.jsxs("div", { className: "flex justify-between items-center", children: [i.jsx("span", { className: "text-gray-600", children: "Total de entradas:" }), i.jsx("span", { className: "font-semibold text-green-600", children: pe(b) })] }), i.jsxs("div", { className: "flex justify-between items-center", children: [i.jsx("span", { className: "text-gray-600", children: "Sa\xEDdas totais:" }), i.jsx("span", { className: "font-semibold text-red-600", children: pe(V) })] }), i.jsx("div", { className: "border-t pt-2", children: i.jsxs("div", { className: "flex justify-between items-center", children: [i.jsx("span", { className: "text-gray-900 font-medium", children: "Saldo Liquidez:" }), i.jsx("span", { className: `font-bold text-lg ${b - V >= 0 ? "text-blue-600" : "text-red-600"}`, children: pe(b - V) })] }) })] })] }), i.jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [i.jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Status do Sistema" }), i.jsxs("div", { className: "space-y-3", children: [i.jsxs("div", { className: "flex justify-between items-center", children: [i.jsx("span", { className: "text-gray-600", children: "Aplicativo:" }), i.jsxs("span", { className: "flex items-center", children: [i.jsx("div", { className: "w-2 h-2 bg-green-500 rounded-full mr-2" }), i.jsx("span", { className: "text-green-600 font-medium", children: "Progressive Web App" })] })] }), i.jsxs("div", { className: "flex justify-between items-center", children: [i.jsx("span", { className: "text-gray-600", children: "Banco de dados:" }), i.jsxs("span", { className: "flex items-center", children: [i.jsx("div", { className: "w-2 h-2 bg-green-500 rounded-full mr-2" }), i.jsx("span", { className: "text-green-600 font-medium", children: S })] })] }), i.jsxs("div", { className: "flex justify-between items-center", children: [i.jsx("span", { className: "text-gray-600", children: "Transa\xE7\xF5es:" }), i.jsxs("span", { className: "text-gray-900 font-medium", children: [Object.keys(o).length, " registros"] })] }), i.jsxs("div", { className: "flex justify-between items-center", children: [i.jsx("span", { className: "text-gray-600", children: "Investimentos:" }), i.jsxs("span", { className: "text-gray-900 font-medium", children: [Object.keys(g).length, " movimentos"] })] })] })] })] }, `dashboard-${O}`);
  }, Kc = () => {
    const [w, M] = H.useState(a), [A, F] = H.useState({ investmentType: "", amount: "", description: "", date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0] }), b = ["Tesouro Direto", "CDB", "LCI/LCA", "Fundos de Investimento", "A\xE7\xF5es", "FIIs", "Criptomoedas", "Poupan\xE7a", "Outros"], V = (Y, Vt) => {
      M((Gc) => ({ ...Gc, [Y]: parseFloat(Vt) || 0 }));
    }, ne = async () => {
      await Nt(w), alert("Saldos iniciais salvos com sucesso!");
    }, W = async () => {
      A.investmentType && A.amount && (await _t(A.date, A.investmentType, A.amount, A.description), F({ investmentType: "", amount: "", description: "", date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0] }));
    };
    return i.jsxs("div", { className: "space-y-6", children: [i.jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [i.jsx("h2", { className: "text-xl font-semibold text-gray-900 mb-4", children: "Resumo do Patrim\xF4nio" }), i.jsxs("div", { className: "text-center", children: [i.jsx("p", { className: "text-3xl font-bold text-purple-600", children: pe(dn) }), i.jsx("p", { className: "text-gray-600 mt-2", children: "Patrim\xF4nio Total" })] })] }), i.jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [i.jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Saldos Iniciais por Investimento" }), i.jsx("div", { className: "space-y-4", children: b.map((Y) => i.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 items-center", children: [i.jsx("label", { className: "text-sm font-medium text-gray-700", children: Y }), i.jsx("input", { type: "number", step: "0.01", value: w[Y] || "", onChange: (Vt) => V(Y, Vt.target.value), className: "p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent", placeholder: "0,00" })] }, Y)) }), i.jsx("button", { onClick: ne, className: "mt-4 w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors", children: "Salvar Saldos Iniciais" })] }), i.jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [i.jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Adicionar Movimenta\xE7\xE3o" }), i.jsxs("div", { className: "space-y-4", children: [i.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [i.jsxs("div", { children: [i.jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Tipo de Investimento" }), i.jsxs("select", { value: A.investmentType, onChange: (Y) => F({ ...A, investmentType: Y.target.value }), className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent", children: [i.jsx("option", { value: "", children: "Selecione..." }), b.map((Y) => i.jsx("option", { value: Y, children: Y }, Y))] })] }), i.jsxs("div", { children: [i.jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Data" }), i.jsx("input", { type: "date", value: A.date, onChange: (Y) => F({ ...A, date: Y.target.value }), className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" })] })] }), i.jsxs("div", { children: [i.jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Valor (positivo para aplica\xE7\xE3o, negativo para resgate)" }), i.jsx("input", { type: "number", step: "0.01", value: A.amount, onChange: (Y) => F({ ...A, amount: Y.target.value }), className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent", placeholder: "0,00" })] }), i.jsxs("div", { children: [i.jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Descri\xE7\xE3o" }), i.jsx("input", { type: "text", value: A.description, onChange: (Y) => F({ ...A, description: Y.target.value }), className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent", placeholder: "Descri\xE7\xE3o da movimenta\xE7\xE3o" })] }), i.jsx("button", { onClick: W, className: "w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium", children: "Adicionar Movimenta\xE7\xE3o" })] })] })] }, `patrimony-${O}`);
  }, Yc = () => {
    const [w, M] = H.useState(null), [A, F] = H.useState(false), b = async (V) => {
      F(true);
      try {
        const ne = await Re.getAnnualReport(V);
        M(ne);
      } catch (ne) {
        console.error("Erro ao gerar relat\xF3rio:", ne), alert("Erro ao gerar relat\xF3rio anual.");
      } finally {
        F(false);
      }
    };
    return H.useEffect(() => {
      b(J);
    }, [J]), A ? i.jsx("div", { className: "flex justify-center items-center py-12", children: i.jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" }) }) : w ? i.jsxs("div", { className: "space-y-6", children: [i.jsx("div", { className: "bg-white rounded-lg shadow p-6", children: i.jsxs("div", { className: "flex justify-between items-center", children: [i.jsxs("h2", { className: "text-xl font-semibold text-gray-900", children: ["Relat\xF3rio Anual ", J] }), i.jsx("select", { value: J, onChange: (V) => m(parseInt(V.target.value)), className: "p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent", children: [2025, 2024, 2023, 2022, 2021, 2020].map((V) => i.jsx("option", { value: V, children: V }, V)) })] }) }), i.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [i.jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [i.jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-2", children: "Receitas Totais" }), i.jsx("p", { className: "text-2xl font-bold text-green-600", children: pe(w.summary.totalIncome) })] }), i.jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [i.jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-2", children: "Despesas Totais" }), i.jsx("p", { className: "text-2xl font-bold text-red-600", children: pe(w.summary.totalExpenses) })] }), i.jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [i.jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-2", children: "Saldo L\xEDquido" }), i.jsx("p", { className: `text-2xl font-bold ${w.summary.totalIncome - w.summary.totalExpenses >= 0 ? "text-green-600" : "text-red-600"}`, children: pe(w.summary.totalIncome - w.summary.totalExpenses) })] })] }), i.jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [i.jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Evolu\xE7\xE3o Mensal" }), i.jsx("div", { className: "overflow-x-auto", children: i.jsxs("table", { className: "min-w-full divide-y divide-gray-200", children: [i.jsx("thead", { className: "bg-gray-50", children: i.jsxs("tr", { children: [i.jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "M\xEAs" }), i.jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Receitas" }), i.jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Despesas" }), i.jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Saldo" }), i.jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Investimentos" })] }) }), i.jsx("tbody", { className: "bg-white divide-y divide-gray-200", children: Object.entries(w.monthlyData).map(([V, ne]) => {
      const Y = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"][parseInt(V) - 1], Vt = ne.income - ne.expenses;
      return i.jsxs("tr", { children: [i.jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900", children: Y }), i.jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-green-600", children: pe(ne.income) }), i.jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-red-600", children: pe(ne.expenses) }), i.jsx("td", { className: `px-6 py-4 whitespace-nowrap text-sm font-medium ${Vt >= 0 ? "text-green-600" : "text-red-600"}`, children: pe(Vt) }), i.jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-blue-600", children: pe(ne.investmentMovements) })] }, V);
    }) })] }) })] })] }, `report-${O}-${J}`) : i.jsx("div", { className: "text-center py-12", children: i.jsx("p", { className: "text-gray-600", children: "Carregando relat\xF3rio..." }) });
  }, Xc = () => {
    const w = async () => {
      try {
        const A = await Re.exportData(), F = new Blob([JSON.stringify(A, null, 2)], { type: "application/json" }), b = URL.createObjectURL(F), V = document.createElement("a");
        V.href = b, V.download = `personal_finance_backup_${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.json`, V.click(), URL.revokeObjectURL(b);
      } catch (A) {
        console.error("Erro ao exportar dados:", A), alert("Erro ao exportar dados.");
      }
    }, M = async () => {
      try {
        await Re.downloadBackup();
      } catch (A) {
        console.error("Erro ao baixar backup:", A), alert("Erro ao baixar backup do banco de dados.");
      }
    };
    return i.jsx("div", { className: "space-y-6", children: i.jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [i.jsx("h2", { className: "text-xl font-semibold text-gray-900 mb-4", children: "Configura\xE7\xF5es" }), i.jsxs("div", { className: "space-y-4", children: [i.jsxs("div", { children: [i.jsx("h3", { className: "text-lg font-medium text-gray-900 mb-2", children: "Backup e Exporta\xE7\xE3o" }), i.jsx("p", { className: "text-gray-600 mb-4", children: "Fa\xE7a backup dos seus dados financeiros" }), i.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3", children: [i.jsx("button", { onClick: $t, className: "bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium", children: "Exportar CSV" }), i.jsx("button", { onClick: w, className: "bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium", children: "Exportar JSON" }), i.jsx("button", { onClick: M, className: "bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium", children: "Baixar Banco (.db)" }), i.jsx("button", { onClick: () => s("change-password"), className: "bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors font-medium", children: "Alterar Senha" }), i.jsx("button", { onClick: Ee, className: "bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium", children: "Sair" })] })] }), i.jsxs("div", { className: "border-t pt-4", children: [i.jsx("h3", { className: "text-lg font-medium text-gray-900 mb-2", children: "Avalia\xE7\xE3o" }), i.jsx("p", { className: "text-gray-600 mb-4", children: "Se voc\xEA gostou do aplicativo, ajude outros a descobri-lo" }), i.jsx("button", { onClick: Ye, className: "w-full bg-yellow-600 text-white py-3 px-4 rounded-lg hover:bg-yellow-700 transition-colors font-medium", children: "Gostou? Deixe uma \u2B50 para ajudar outros a descobrir" })] }), i.jsxs("div", { className: "border-t pt-4", children: [i.jsx("h3", { className: "text-lg font-medium text-gray-900 mb-2", children: "Funcionalidades Fase 1" }), i.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600", children: [i.jsx("p", { children: "\u2705 Exclus\xE3o de transa\xE7\xF5es com logs" }), i.jsx("p", { children: "\u2705 Busca por descri\xE7\xE3o/categoria" }), i.jsx("p", { children: "\u2705 Ordena\xE7\xE3o flex\xEDvel" }), i.jsx("p", { children: "\u2705 Export CSV completo" }), i.jsx("p", { children: "\u2705 Categorias predefinidas" }), i.jsx("p", { children: "\u2705 Valida\xE7\xE3o de formul\xE1rios" })] })] }), i.jsxs("div", { className: "border-t pt-4", children: [i.jsx("h3", { className: "text-lg font-medium text-gray-900 mb-2", children: "Informa\xE7\xF5es do Sistema" }), i.jsxs("div", { className: "space-y-2 text-sm text-gray-600", children: [i.jsx("p", { children: "\u2022 Progressive Web App (PWA)" }), i.jsx("p", { children: "\u2022 SQLite WebAssembly" }), i.jsx("p", { children: "\u2022 Dados locais (IndexedDB)" }), i.jsx("p", { children: "\u2022 Funciona offline" }), i.jsx("p", { children: "\u2022 Vers\xE3o: 1.1 + Avalia\xE7\xE3o GitHub Stars" })] })] })] })] }) });
  };
  return i.jsxs("div", { className: "min-h-screen bg-gray-50", children: [i.jsx("header", { className: "bg-white shadow", children: i.jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4", children: i.jsxs("div", { className: "flex justify-between items-center", children: [i.jsxs("div", { className: "flex items-center space-x-3", children: [i.jsx("div", { className: "p-2 bg-blue-100 rounded-lg", children: i.jsx("img", { src: "/icon-192.png", alt: "V&M Finance Logo", className: "w-8 h-8 object-contain" }) }), i.jsxs("div", { children: [i.jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "V&M Personal Finance" }), i.jsx("p", { className: "text-sm text-blue-600", children: "Progressive Web App" })] })] }), i.jsx("button", { onClick: () => R(!T), className: "p-2 text-gray-400 hover:text-gray-600", children: i.jsxs("svg", { className: "w-6 h-6", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: [i.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" }), i.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z" })] }) })] }) }) }), i.jsx("nav", { className: "bg-white border-b", children: i.jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: i.jsxs("div", { className: "flex space-x-8", children: [i.jsx("button", { onClick: () => C("dashboard"), className: `py-4 px-1 border-b-2 font-medium text-sm ${y === "dashboard" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`, children: "Painel" }), i.jsx("button", { onClick: () => C("patrimony"), className: `py-4 px-1 border-b-2 font-medium text-sm ${y === "patrimony" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`, children: "Patrim\xF4nio" }), i.jsx("button", { onClick: () => C("annual-report"), className: `py-4 px-1 border-b-2 font-medium text-sm ${y === "annual-report" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`, children: "Relat\xF3rio Anual" })] }) }) }), i.jsxs("main", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [T && i.jsx(Xc, {}), !T && y === "dashboard" && i.jsx(Qc, {}), !T && y === "patrimony" && i.jsx(Kc, {}), !T && y === "annual-report" && i.jsx(Yc, {})] }), i.jsx(Qr, {}), i.jsx(nr, {}), i.jsx(Hc, {})] });
}
"serviceWorker" in navigator && window.addEventListener("load", () => {
  navigator.serviceWorker.register("/sw.js").then((e) => {
    console.log("\u2705 Service Worker registrado:", e);
  }).catch((e) => {
    console.log("\u274C Erro ao registrar Service Worker:", e);
  });
});
Is.createRoot(document.getElementById("root")).render(i.jsx(fn.StrictMode, { children: i.jsx(Tp, {}) }));
