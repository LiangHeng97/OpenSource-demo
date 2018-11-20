/*!
* @license TweenJS
* Visit http://createjs.com/ for documentation, updates and examples.
*
* Copyright (c) 2011-2015 gskinner.com, inc.
*
* Distributed under the terms of the MIT license.
* http://www.opensource.org/licenses/mit-license.html
*
* This notice shall be included in all copies or substantial portions of the Software.
*/
(this.createjs = this.createjs || {}),
  (createjs.extend = function(a, b) {
    "use strict";
    function c() {
      this.constructor = a;
    }
    return (c.prototype = b.prototype), (a.prototype = new c());
  }),
  (this.createjs = this.createjs || {}),
  (createjs.promote = function(a, b) {
    "use strict";
    var c = a.prototype,
      d = (Object.getPrototypeOf && Object.getPrototypeOf(c)) || c.__proto__;
    if (d) {
      c[(b += "_") + "constructor"] = d.constructor;
      for (var e in d) c.hasOwnProperty(e) && "function" == typeof d[e] && (c[b + e] = d[e]);
    }
    return a;
  }),
  (this.createjs = this.createjs || {}),
  (createjs.deprecate = function(a, b) {
    "use strict";
    return function() {
      var c = "Deprecated property or method '" + b + "'. See docs for info.";
      return console && (console.warn ? console.warn(c) : console.log(c)), a && a.apply(this, arguments);
    };
  }),
  (this.createjs = this.createjs || {}),
  (function() {
    "use strict";
    function Event(a, b, c) {
      (this.type = a), (this.target = null), (this.currentTarget = null), (this.eventPhase = 0), (this.bubbles = !!b), (this.cancelable = !!c), (this.timeStamp = new Date().getTime()), (this.defaultPrevented = !1), (this.propagationStopped = !1), (this.immediatePropagationStopped = !1), (this.removed = !1);
    }
    var a = Event.prototype;
    (a.preventDefault = function() {
      this.defaultPrevented = this.cancelable && !0;
    }),
      (a.stopPropagation = function() {
        this.propagationStopped = !0;
      }),
      (a.stopImmediatePropagation = function() {
        this.immediatePropagationStopped = this.propagationStopped = !0;
      }),
      (a.remove = function() {
        this.removed = !0;
      }),
      (a.clone = function() {
        return new Event(this.type, this.bubbles, this.cancelable);
      }),
      (a.set = function(a) {
        for (var b in a) this[b] = a[b];
        return this;
      }),
      (a.toString = function() {
        return "[Event (type=" + this.type + ")]";
      }),
      (createjs.Event = Event);
  })(),
  (this.createjs = this.createjs || {}),
  (function() {
    "use strict";
    function EventDispatcher() {
      (this._listeners = null), (this._captureListeners = null);
    }
    var a = EventDispatcher.prototype;
    (EventDispatcher.initialize = function(b) {
      (b.addEventListener = a.addEventListener), (b.on = a.on), (b.removeEventListener = b.off = a.removeEventListener), (b.removeAllEventListeners = a.removeAllEventListeners), (b.hasEventListener = a.hasEventListener), (b.dispatchEvent = a.dispatchEvent), (b._dispatchEvent = a._dispatchEvent), (b.willTrigger = a.willTrigger);
    }),
      (a.addEventListener = function(a, b, c) {
        var d;
        d = c ? (this._captureListeners = this._captureListeners || {}) : (this._listeners = this._listeners || {});
        var e = d[a];
        return e && this.removeEventListener(a, b, c), (e = d[a]), e ? e.push(b) : (d[a] = [b]), b;
      }),
      (a.on = function(a, b, c, d, e, f) {
        return (
          b.handleEvent && ((c = c || b), (b = b.handleEvent)),
          (c = c || this),
          this.addEventListener(
            a,
            function(a) {
              b.call(c, a, e), d && a.remove();
            },
            f
          )
        );
      }),
      (a.removeEventListener = function(a, b, c) {
        var d = c ? this._captureListeners : this._listeners;
        if (d) {
          var e = d[a];
          if (e)
            for (var f = 0, g = e.length; g > f; f++)
              if (e[f] == b) {
                1 == g ? delete d[a] : e.splice(f, 1);
                break;
              }
        }
      }),
      (a.off = a.removeEventListener),
      (a.removeAllEventListeners = function(a) {
        a ? (this._listeners && delete this._listeners[a], this._captureListeners && delete this._captureListeners[a]) : (this._listeners = this._captureListeners = null);
      }),
      (a.dispatchEvent = function(a, b, c) {
        if ("string" == typeof a) {
          var d = this._listeners;
          if (!(b || (d && d[a]))) return !0;
          a = new createjs.Event(a, b, c);
        } else a.target && a.clone && (a = a.clone());
        try {
          a.target = this;
        } catch (e) {}
        if (a.bubbles && this.parent) {
          for (var f = this, g = [f]; f.parent; ) g.push((f = f.parent));
          var h,
            i = g.length;
          for (h = i - 1; h >= 0 && !a.propagationStopped; h--) g[h]._dispatchEvent(a, 1 + (0 == h));
          for (h = 1; i > h && !a.propagationStopped; h++) g[h]._dispatchEvent(a, 3);
        } else this._dispatchEvent(a, 2);
        return !a.defaultPrevented;
      }),
      (a.hasEventListener = function(a) {
        var b = this._listeners,
          c = this._captureListeners;
        return !!((b && b[a]) || (c && c[a]));
      }),
      (a.willTrigger = function(a) {
        for (var b = this; b; ) {
          if (b.hasEventListener(a)) return !0;
          b = b.parent;
        }
        return !1;
      }),
      (a.toString = function() {
        return "[EventDispatcher]";
      }),
      (a._dispatchEvent = function(a, b) {
        var c,
          d,
          e = 2 >= b ? this._captureListeners : this._listeners;
        if (a && e && (d = e[a.type]) && (c = d.length)) {
          try {
            a.currentTarget = this;
          } catch (f) {}
          try {
            a.eventPhase = 0 | b;
          } catch (f) {}
          (a.removed = !1), (d = d.slice());
          for (var g = 0; c > g && !a.immediatePropagationStopped; g++) {
            var h = d[g];
            h.handleEvent ? h.handleEvent(a) : h(a), a.removed && (this.off(a.type, h, 1 == b), (a.removed = !1));
          }
        }
        2 === b && this._dispatchEvent(a, 2.1);
      }),
      (createjs.EventDispatcher = EventDispatcher);
  })(),
  (this.createjs = this.createjs || {}),
  (function() {
    "use strict";
    function Ticker() {
      throw "Ticker cannot be instantiated.";
    }
    (Ticker.RAF_SYNCHED = "synched"),
      (Ticker.RAF = "raf"),
      (Ticker.TIMEOUT = "timeout"),
      (Ticker.timingMode = null),
      (Ticker.maxDelta = 0),
      (Ticker.paused = !1),
      (Ticker.removeEventListener = null),
      (Ticker.removeAllEventListeners = null),
      (Ticker.dispatchEvent = null),
      (Ticker.hasEventListener = null),
      (Ticker._listeners = null),
      createjs.EventDispatcher.initialize(Ticker),
      (Ticker._addEventListener = Ticker.addEventListener),
      (Ticker.addEventListener = function() {
        return !Ticker._inited && Ticker.init(), Ticker._addEventListener.apply(Ticker, arguments);
      }),
      (Ticker._inited = !1),
      (Ticker._startTime = 0),
      (Ticker._pausedTime = 0),
      (Ticker._ticks = 0),
      (Ticker._pausedTicks = 0),
      (Ticker._interval = 50),
      (Ticker._lastTime = 0),
      (Ticker._times = null),
      (Ticker._tickTimes = null),
      (Ticker._timerId = null),
      (Ticker._raf = !0),
      (Ticker._setInterval = function(a) {
        (Ticker._interval = a), Ticker._inited && Ticker._setupTick();
      }),
      (Ticker.setInterval = createjs.deprecate(Ticker._setInterval, "Ticker.setInterval")),
      (Ticker._getInterval = function() {
        return Ticker._interval;
      }),
      (Ticker.getInterval = createjs.deprecate(Ticker._getInterval, "Ticker.getInterval")),
      (Ticker._setFPS = function(a) {
        Ticker._setInterval(1e3 / a);
      }),
      (Ticker.setFPS = createjs.deprecate(Ticker._setFPS, "Ticker.setFPS")),
      (Ticker._getFPS = function() {
        return 1e3 / Ticker._interval;
      }),
      (Ticker.getFPS = createjs.deprecate(Ticker._getFPS, "Ticker.getFPS"));
    try {
      Object.defineProperties(Ticker, { interval: { get: Ticker._getInterval, set: Ticker._setInterval }, framerate: { get: Ticker._getFPS, set: Ticker._setFPS } });
    } catch (a) {
      console.log(a);
    }
    (Ticker.init = function() {
      Ticker._inited || ((Ticker._inited = !0), (Ticker._times = []), (Ticker._tickTimes = []), (Ticker._startTime = Ticker._getTime()), Ticker._times.push((Ticker._lastTime = 0)), (Ticker.interval = Ticker._interval));
    }),
      (Ticker.reset = function() {
        if (Ticker._raf) {
          var a = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.oCancelAnimationFrame || window.msCancelAnimationFrame;
          a && a(Ticker._timerId);
        } else clearTimeout(Ticker._timerId);
        Ticker.removeAllEventListeners("tick"), (Ticker._timerId = Ticker._times = Ticker._tickTimes = null), (Ticker._startTime = Ticker._lastTime = Ticker._ticks = Ticker._pausedTime = 0), (Ticker._inited = !1);
      }),
      (Ticker.getMeasuredTickTime = function(a) {
        var b = 0,
          c = Ticker._tickTimes;
        if (!c || c.length < 1) return -1;
        a = Math.min(c.length, a || 0 | Ticker._getFPS());
        for (var d = 0; a > d; d++) b += c[d];
        return b / a;
      }),
      (Ticker.getMeasuredFPS = function(a) {
        var b = Ticker._times;
        return !b || b.length < 2 ? -1 : ((a = Math.min(b.length - 1, a || 0 | Ticker._getFPS())), 1e3 / ((b[0] - b[a]) / a));
      }),
      (Ticker.getTime = function(a) {
        return Ticker._startTime ? Ticker._getTime() - (a ? Ticker._pausedTime : 0) : -1;
      }),
      (Ticker.getEventTime = function(a) {
        return Ticker._startTime ? (Ticker._lastTime || Ticker._startTime) - (a ? Ticker._pausedTime : 0) : -1;
      }),
      (Ticker.getTicks = function(a) {
        return Ticker._ticks - (a ? Ticker._pausedTicks : 0);
      }),
      (Ticker._handleSynch = function() {
        (Ticker._timerId = null), Ticker._setupTick(), Ticker._getTime() - Ticker._lastTime >= 0.97 * (Ticker._interval - 1) && Ticker._tick();
      }),
      (Ticker._handleRAF = function() {
        (Ticker._timerId = null), Ticker._setupTick(), Ticker._tick();
      }),
      (Ticker._handleTimeout = function() {
        (Ticker._timerId = null), Ticker._setupTick(), Ticker._tick();
      }),
      (Ticker._setupTick = function() {
        if (null == Ticker._timerId) {
          var a = Ticker.timingMode;
          if (a == Ticker.RAF_SYNCHED || a == Ticker.RAF) {
            var b = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame;
            if (b) return (Ticker._timerId = b(a == Ticker.RAF ? Ticker._handleRAF : Ticker._handleSynch)), void (Ticker._raf = !0);
          }
          (Ticker._raf = !1), (Ticker._timerId = setTimeout(Ticker._handleTimeout, Ticker._interval));
        }
      }),
      (Ticker._tick = function() {
        var a = Ticker.paused,
          b = Ticker._getTime(),
          c = b - Ticker._lastTime;
        if (((Ticker._lastTime = b), Ticker._ticks++, a && (Ticker._pausedTicks++, (Ticker._pausedTime += c)), Ticker.hasEventListener("tick"))) {
          var d = new createjs.Event("tick"),
            e = Ticker.maxDelta;
          (d.delta = e && c > e ? e : c), (d.paused = a), (d.time = b), (d.runTime = b - Ticker._pausedTime), Ticker.dispatchEvent(d);
        }
        for (Ticker._tickTimes.unshift(Ticker._getTime() - b); Ticker._tickTimes.length > 100; ) Ticker._tickTimes.pop();
        for (Ticker._times.unshift(b); Ticker._times.length > 100; ) Ticker._times.pop();
      });
    var b = window,
      c = b.performance.now || b.performance.mozNow || b.performance.msNow || b.performance.oNow || b.performance.webkitNow;
    (Ticker._getTime = function() {
      return ((c && c.call(b.performance)) || new Date().getTime()) - Ticker._startTime;
    }),
      (createjs.Ticker = Ticker);
  })(),
  (this.createjs = this.createjs || {}),
  (function() {
    "use strict";
    function AbstractTween(a) {
      this.EventDispatcher_constructor(),
        (this.ignoreGlobalPause = !1),
        (this.loop = 0),
        (this.useTicks = !1),
        (this.reversed = !1),
        (this.bounce = !1),
        (this.timeScale = 1),
        (this.duration = 0),
        (this.position = 0),
        (this.rawPosition = -1),
        (this._paused = !0),
        (this._next = null),
        (this._prev = null),
        (this._parent = null),
        (this._labels = null),
        (this._labelList = null),
        a && ((this.useTicks = !!a.useTicks), (this.ignoreGlobalPause = !!a.ignoreGlobalPause), (this.loop = a.loop === !0 ? -1 : a.loop || 0), (this.reversed = !!a.reversed), (this.bounce = !!a.bounce), (this.timeScale = a.timeScale || 1), a.onChange && this.addEventListener("change", a.onChange), a.onComplete && this.addEventListener("complete", a.onComplete));
    }
    var a = createjs.extend(AbstractTween, createjs.EventDispatcher);
    (a._setPaused = function(a) {
      return createjs.Tween._register(this, a), this;
    }),
      (a.setPaused = createjs.deprecate(a._setPaused, "AbstractTween.setPaused")),
      (a._getPaused = function() {
        return this._paused;
      }),
      (a.getPaused = createjs.deprecate(a._getPaused, "AbstactTween.getPaused")),
      (a._getCurrentLabel = function(a) {
        var b = this.getLabels();
        null == a && (a = this.position);
        for (var c = 0, d = b.length; d > c && !(a < b[c].position); c++);
        return 0 === c ? null : b[c - 1].label;
      }),
      (a.getCurrentLabel = createjs.deprecate(a._getCurrentLabel, "AbstractTween.getCurrentLabel"));
    try {
      Object.defineProperties(a, { paused: { set: a._setPaused, get: a._getPaused }, currentLabel: { get: a._getCurrentLabel } });
    } catch (b) {}
    (a.advance = function(a, b) {
      this.setPosition(this.rawPosition + a * this.timeScale, b);
    }),
      (a.setPosition = function(a, b, c, d) {
        var e = this.duration,
          f = this.loop,
          g = this.rawPosition,
          h = 0,
          i = 0,
          j = !1;
        if ((0 > a && (a = 0), 0 === e)) {
          if (((j = !0), -1 !== g)) return j;
        } else {
          if (((h = (a / e) | 0), (i = a - h * e), (j = -1 !== f && a >= f * e + e), j && (a = (i = e) * (h = f) + e), a === g)) return j;
          var k = !this.reversed != !(this.bounce && h % 2);
          k && (i = e - i);
        }
        (this.position = i), (this.rawPosition = a), this._updatePosition(c, j), j && (this.paused = !0), d && d(this), b || this._runActions(g, a, c, !c && -1 === g), this.dispatchEvent("change"), j && this.dispatchEvent("complete");
      }),
      (a.calculatePosition = function(a) {
        var b = this.duration,
          c = this.loop,
          d = 0,
          e = 0;
        if (0 === b) return 0;
        -1 !== c && a >= c * b + b ? ((e = b), (d = c)) : 0 > a ? (e = 0) : ((d = (a / b) | 0), (e = a - d * b));
        var f = !this.reversed != !(this.bounce && d % 2);
        return f ? b - e : e;
      }),
      (a.getLabels = function() {
        var a = this._labelList;
        if (!a) {
          a = this._labelList = [];
          var b = this._labels;
          for (var c in b) a.push({ label: c, position: b[c] });
          a.sort(function(a, b) {
            return a.position - b.position;
          });
        }
        return a;
      }),
      (a.setLabels = function(a) {
        (this._labels = a), (this._labelList = null);
      }),
      (a.addLabel = function(a, b) {
        this._labels || (this._labels = {}), (this._labels[a] = b);
        var c = this._labelList;
        if (c) {
          for (var d = 0, e = c.length; e > d && !(b < c[d].position); d++);
          c.splice(d, 0, { label: a, position: b });
        }
      }),
      (a.gotoAndPlay = function(a) {
        (this.paused = !1), this._goto(a);
      }),
      (a.gotoAndStop = function(a) {
        (this.paused = !0), this._goto(a);
      }),
      (a.resolve = function(a) {
        var b = Number(a);
        return isNaN(b) && (b = this._labels && this._labels[a]), b;
      }),
      (a.toString = function() {
        return "[AbstractTween]";
      }),
      (a.clone = function() {
        throw "AbstractTween can not be cloned.";
      }),
      (a._init = function(a) {
        (a && a.paused) || (this.paused = !1), a && null != a.position && this.setPosition(a.position);
      }),
      (a._updatePosition = function() {}),
      (a._goto = function(a) {
        var b = this.resolve(a);
        null != b && this.setPosition(b, !1, !0);
      }),
      (a._runActions = function(a, b, c, d) {
        if (this._actionHead || this.tweens) {
          var e,
            f,
            g,
            h,
            i = this.duration,
            j = this.reversed,
            k = this.bounce,
            l = this.loop;
          if ((0 === i ? ((e = f = g = h = 0), (j = k = !1)) : ((e = (a / i) | 0), (f = (b / i) | 0), (g = a - e * i), (h = b - f * i)), -1 !== l && (f > l && ((h = i), (f = l)), e > l && ((g = i), (e = l))), c)) return this._runActionsRange(h, h, c, d);
          if (e !== f || g !== h || c || d) {
            -1 === e && (e = g = 0);
            var m = b >= a,
              n = e;
            do {
              var o = !j != !(k && n % 2),
                p = n === e ? g : m ? 0 : i,
                q = n === f ? h : m ? i : 0;
              if ((o && ((p = i - p), (q = i - q)), k && n !== e && p === q));
              else if (this._runActionsRange(p, q, c, d || (n !== e && !k))) return !0;
              d = !1;
            } while ((m && ++n <= f) || (!m && --n >= f));
          }
        }
      }),
      (a._runActionsRange = function() {}),
      (createjs.AbstractTween = createjs.promote(AbstractTween, "EventDispatcher"));
  })(),
  (this.createjs = this.createjs || {}),
  (function() {
    "use strict";
    function Tween(b, c) {
      this.AbstractTween_constructor(c), (this.pluginData = null), (this.target = b), (this.passive = !1), (this._stepHead = new a(null, 0, 0, {}, null, !0)), (this._stepTail = this._stepHead), (this._stepPosition = 0), (this._actionHead = null), (this._actionTail = null), (this._plugins = null), (this._pluginIds = null), (this._injected = null), c && ((this.pluginData = c.pluginData), c.override && Tween.removeTweens(b)), this.pluginData || (this.pluginData = {}), this._init(c);
    }
    function a(a, b, c, d, e, f) {
      (this.next = null), (this.prev = a), (this.t = b), (this.d = c), (this.props = d), (this.ease = e), (this.passive = f), (this.index = a ? a.index + 1 : 0);
    }
    function b(a, b, c, d, e) {
      (this.next = null), (this.prev = a), (this.t = b), (this.d = 0), (this.scope = c), (this.funct = d), (this.params = e);
    }
    var c = createjs.extend(Tween, createjs.AbstractTween);
    (Tween.IGNORE = {}),
      (Tween._tweens = []),
      (Tween._plugins = null),
      (Tween._tweenHead = null),
      (Tween._tweenTail = null),
      (Tween.get = function(a, b) {
        return new Tween(a, b);
      }),
      (Tween.tick = function(a, b) {
        for (var c = Tween._tweenHead; c; ) {
          var d = c._next;
          (b && !c.ignoreGlobalPause) || c._paused || c.advance(c.useTicks ? 1 : a), (c = d);
        }
      }),
      (Tween.handleEvent = function(a) {
        "tick" === a.type && this.tick(a.delta, a.paused);
      }),
      (Tween.removeTweens = function(a) {
        if (a.tweenjs_count) {
          for (var b = Tween._tweenHead; b; ) {
            var c = b._next;
            b.target === a && Tween._register(b, !0), (b = c);
          }
          a.tweenjs_count = 0;
        }
      }),
      (Tween.removeAllTweens = function() {
        for (var a = Tween._tweenHead; a; ) {
          var b = a._next;
          (a._paused = !0), a.target && (a.target.tweenjs_count = 0), (a._next = a._prev = null), (a = b);
        }
        Tween._tweenHead = Tween._tweenTail = null;
      }),
      (Tween.hasActiveTweens = function(a) {
        return a ? !!a.tweenjs_count : !!Tween._tweenHead;
      }),
      (Tween._installPlugin = function(a) {
        for (var b = (a.priority = a.priority || 0), c = (Tween._plugins = Tween._plugins || []), d = 0, e = c.length; e > d && !(b < c[d].priority); d++);
        c.splice(d, 0, a);
      }),
      (Tween._register = function(a, b) {
        var c = a.target;
        if (!b && a._paused) {
          c && (c.tweenjs_count = c.tweenjs_count ? c.tweenjs_count + 1 : 1);
          var d = Tween._tweenTail;
          d ? ((Tween._tweenTail = d._next = a), (a._prev = d)) : (Tween._tweenHead = Tween._tweenTail = a), !Tween._inited && createjs.Ticker && (createjs.Ticker.addEventListener("tick", Tween), (Tween._inited = !0));
        } else if (b && !a._paused) {
          c && c.tweenjs_count--;
          var e = a._next,
            f = a._prev;
          e ? (e._prev = f) : (Tween._tweenTail = f), f ? (f._next = e) : (Tween._tweenHead = e), (a._next = a._prev = null);
        }
        a._paused = b;
      }),
      (c.wait = function(a, b) {
        return a > 0 && this._addStep(+a, this._stepTail.props, null, b), this;
      }),
      (c.to = function(a, b, c) {
        (null == b || 0 > b) && (b = 0);
        var d = this._addStep(+b, null, c);
        return this._appendProps(a, d), this;
      }),
      (c.label = function(a) {
        return this.addLabel(a, this.duration), this;
      }),
      (c.call = function(a, b, c) {
        return this._addAction(c || this.target, a, b || [this]);
      }),
      (c.set = function(a, b) {
        return this._addAction(b || this.target, this._set, [a]);
      }),
      (c.play = function(a) {
        return this._addAction(a || this, this._set, [{ paused: !1 }]);
      }),
      (c.pause = function(a) {
        return this._addAction(a || this, this._set, [{ paused: !0 }]);
      }),
      (c.w = c.wait),
      (c.t = c.to),
      (c.c = c.call),
      (c.s = c.set),
      (c.toString = function() {
        return "[Tween]";
      }),
      (c.clone = function() {
        throw "Tween can not be cloned.";
      }),
      (c._addPlugin = function(a) {
        var b = this._pluginIds || (this._pluginIds = {}),
          c = a.ID;
        if (c && !b[c]) {
          b[c] = !0;
          for (var d = this._plugins || (this._plugins = []), e = a.priority || 0, f = 0, g = d.length; g > f; f++) if (e < d[f].priority) return void d.splice(f, 0, a);
          d.push(a);
        }
      }),
      (c._updatePosition = function(a, b) {
        var c = this._stepHead.next,
          d = this.position,
          e = this.duration;
        if (this.target && c) {
          for (var f = c.next; f && f.t <= d; ) (c = c.next), (f = c.next);
          var g = b ? (0 === e ? 1 : d / e) : (d - c.t) / c.d;
          this._updateTargetProps(c, g, b);
        }
        this._stepPosition = c ? d - c.t : 0;
      }),
      (c._updateTargetProps = function(a, b, c) {
        if (!(this.passive = !!a.passive)) {
          var d,
            e,
            f,
            g,
            h = a.prev.props,
            i = a.props;
          (g = a.ease) && (b = g(b, 0, 1, 1));
          var j = this._plugins;
          a: for (var k in h) {
            if (((e = h[k]), (f = i[k]), (d = e !== f && "number" == typeof e ? e + (f - e) * b : b >= 1 ? f : e), j))
              for (var l = 0, m = j.length; m > l; l++) {
                var n = j[l].change(this, a, k, d, b, c);
                if (n === Tween.IGNORE) continue a;
                void 0 !== n && (d = n);
              }
            this.target[k] = d;
          }
        }
      }),
      (c._runActionsRange = function(a, b, c, d) {
        var e = a > b,
          f = e ? this._actionTail : this._actionHead,
          g = b,
          h = a;
        e && ((g = a), (h = b));
        for (var i = this.position; f; ) {
          var j = f.t;
          if ((j === b || (j > h && g > j) || (d && j === a)) && (f.funct.apply(f.scope, f.params), i !== this.position)) return !0;
          f = e ? f.prev : f.next;
        }
      }),
      (c._appendProps = function(a, b, c) {
        var d,
          e,
          f,
          g,
          h,
          i = this._stepHead.props,
          j = this.target,
          k = Tween._plugins,
          l = b.prev,
          m = l.props,
          n = b.props || (b.props = this._cloneProps(m)),
          o = {};
        for (d in a)
          if (a.hasOwnProperty(d) && ((o[d] = n[d] = a[d]), void 0 === i[d])) {
            if (((g = void 0), k))
              for (e = k.length - 1; e >= 0; e--)
                if (((f = k[e].init(this, d, g)), void 0 !== f && (g = f), g === Tween.IGNORE)) {
                  delete n[d], delete o[d];
                  break;
                }
            g !== Tween.IGNORE && (void 0 === g && (g = j[d]), (m[d] = void 0 === g ? null : g));
          }
        for (d in o) {
          f = a[d];
          for (var p, q = l; (p = q) && (q = p.prev); )
            if (q.props !== p.props) {
              if (void 0 !== q.props[d]) break;
              q.props[d] = m[d];
            }
        }
        if (c !== !1 && (k = this._plugins)) for (e = k.length - 1; e >= 0; e--) k[e].step(this, b, o);
        (h = this._injected) && ((this._injected = null), this._appendProps(h, b, !1));
      }),
      (c._injectProp = function(a, b) {
        var c = this._injected || (this._injected = {});
        c[a] = b;
      }),
      (c._addStep = function(b, c, d, e) {
        var f = new a(this._stepTail, this.duration, b, c, d, e || !1);
        return (this.duration += b), (this._stepTail = this._stepTail.next = f);
      }),
      (c._addAction = function(a, c, d) {
        var e = new b(this._actionTail, this.duration, a, c, d);
        return this._actionTail ? (this._actionTail.next = e) : (this._actionHead = e), (this._actionTail = e), this;
      }),
      (c._set = function(a) {
        for (var b in a) this[b] = a[b];
      }),
      (c._cloneProps = function(a) {
        var b = {};
        for (var c in a) b[c] = a[c];
        return b;
      }),
      (createjs.Tween = createjs.promote(Tween, "AbstractTween"));
  })(),
  (this.createjs = this.createjs || {}),
  (function() {
    "use strict";
    function Timeline(a) {
      var b, c;
      a instanceof Array || (null == a && arguments.length > 1) ? ((b = a), (c = arguments[1]), (a = arguments[2])) : a && ((b = a.tweens), (c = a.labels)), this.AbstractTween_constructor(a), (this.tweens = []), b && this.addTween.apply(this, b), this.setLabels(c), this._init(a);
    }
    var a = createjs.extend(Timeline, createjs.AbstractTween);
    (a.addTween = function(a) {
      a._parent && a._parent.removeTween(a);
      var b = arguments.length;
      if (b > 1) {
        for (var c = 0; b > c; c++) this.addTween(arguments[c]);
        return arguments[b - 1];
      }
      if (0 === b) return null;
      this.tweens.push(a), (a._parent = this), (a.paused = !0);
      var d = a.duration;
      return a.loop > 0 && (d *= a.loop + 1), d > this.duration && (this.duration = d), this.rawPosition >= 0 && a.setPosition(this.rawPosition), a;
    }),
      (a.removeTween = function(a) {
        var b = arguments.length;
        if (b > 1) {
          for (var c = !0, d = 0; b > d; d++) c = c && this.removeTween(arguments[d]);
          return c;
        }
        if (0 === b) return !0;
        for (var e = this.tweens, d = e.length; d--; ) if (e[d] === a) return e.splice(d, 1), (a._parent = null), a.duration >= this.duration && this.updateDuration(), !0;
        return !1;
      }),
      (a.updateDuration = function() {
        this.duration = 0;
        for (var a = 0, b = this.tweens.length; b > a; a++) {
          var c = this.tweens[a],
            d = c.duration;
          c.loop > 0 && (d *= c.loop + 1), d > this.duration && (this.duration = d);
        }
      }),
      (a.toString = function() {
        return "[Timeline]";
      }),
      (a.clone = function() {
        throw "Timeline can not be cloned.";
      }),
      (a._updatePosition = function(a) {
        for (var b = this.position, c = 0, d = this.tweens.length; d > c; c++) this.tweens[c].setPosition(b, !0, a);
      }),
      (a._runActionsRange = function(a, b, c, d) {
        for (var e = this.position, f = 0, g = this.tweens.length; g > f; f++) if ((this.tweens[f]._runActions(a, b, c, d), e !== this.position)) return !0;
      }),
      (createjs.Timeline = createjs.promote(Timeline, "AbstractTween"));
  })(),
  (this.createjs = this.createjs || {}),
  (function() {
    "use strict";
    function Ease() {
      throw "Ease cannot be instantiated.";
    }
    (Ease.linear = function(a) {
      return a;
    }),
      (Ease.none = Ease.linear),
      (Ease.get = function(a) {
        return (
          -1 > a ? (a = -1) : a > 1 && (a = 1),
          function(b) {
            return 0 == a ? b : 0 > a ? b * (b * -a + 1 + a) : b * ((2 - b) * a + (1 - a));
          }
        );
      }),
      (Ease.getPowIn = function(a) {
        return function(b) {
          return Math.pow(b, a);
        };
      }),
      (Ease.getPowOut = function(a) {
        return function(b) {
          return 1 - Math.pow(1 - b, a);
        };
      }),
      (Ease.getPowInOut = function(a) {
        return function(b) {
          return (b *= 2) < 1 ? 0.5 * Math.pow(b, a) : 1 - 0.5 * Math.abs(Math.pow(2 - b, a));
        };
      }),
      (Ease.quadIn = Ease.getPowIn(2)),
      (Ease.quadOut = Ease.getPowOut(2)),
      (Ease.quadInOut = Ease.getPowInOut(2)),
      (Ease.cubicIn = Ease.getPowIn(3)),
      (Ease.cubicOut = Ease.getPowOut(3)),
      (Ease.cubicInOut = Ease.getPowInOut(3)),
      (Ease.quartIn = Ease.getPowIn(4)),
      (Ease.quartOut = Ease.getPowOut(4)),
      (Ease.quartInOut = Ease.getPowInOut(4)),
      (Ease.quintIn = Ease.getPowIn(5)),
      (Ease.quintOut = Ease.getPowOut(5)),
      (Ease.quintInOut = Ease.getPowInOut(5)),
      (Ease.sineIn = function(a) {
        return 1 - Math.cos((a * Math.PI) / 2);
      }),
      (Ease.sineOut = function(a) {
        return Math.sin((a * Math.PI) / 2);
      }),
      (Ease.sineInOut = function(a) {
        return -0.5 * (Math.cos(Math.PI * a) - 1);
      }),
      (Ease.getBackIn = function(a) {
        return function(b) {
          return b * b * ((a + 1) * b - a);
        };
      }),
      (Ease.backIn = Ease.getBackIn(1.7)),
      (Ease.getBackOut = function(a) {
        return function(b) {
          return --b * b * ((a + 1) * b + a) + 1;
        };
      }),
      (Ease.backOut = Ease.getBackOut(1.7)),
      (Ease.getBackInOut = function(a) {
        return (
          (a *= 1.525),
          function(b) {
            return (b *= 2) < 1 ? 0.5 * b * b * ((a + 1) * b - a) : 0.5 * ((b -= 2) * b * ((a + 1) * b + a) + 2);
          }
        );
      }),
      (Ease.backInOut = Ease.getBackInOut(1.7)),
      (Ease.circIn = function(a) {
        return -(Math.sqrt(1 - a * a) - 1);
      }),
      (Ease.circOut = function(a) {
        return Math.sqrt(1 - --a * a);
      }),
      (Ease.circInOut = function(a) {
        return (a *= 2) < 1 ? -0.5 * (Math.sqrt(1 - a * a) - 1) : 0.5 * (Math.sqrt(1 - (a -= 2) * a) + 1);
      }),
      (Ease.bounceIn = function(a) {
        return 1 - Ease.bounceOut(1 - a);
      }),
      (Ease.bounceOut = function(a) {
        return 1 / 2.75 > a ? 7.5625 * a * a : 2 / 2.75 > a ? 7.5625 * (a -= 1.5 / 2.75) * a + 0.75 : 2.5 / 2.75 > a ? 7.5625 * (a -= 2.25 / 2.75) * a + 0.9375 : 7.5625 * (a -= 2.625 / 2.75) * a + 0.984375;
      }),
      (Ease.bounceInOut = function(a) {
        return 0.5 > a ? 0.5 * Ease.bounceIn(2 * a) : 0.5 * Ease.bounceOut(2 * a - 1) + 0.5;
      }),
      (Ease.getElasticIn = function(a, b) {
        var c = 2 * Math.PI;
        return function(d) {
          if (0 == d || 1 == d) return d;
          var e = (b / c) * Math.asin(1 / a);
          return -(a * Math.pow(2, 10 * (d -= 1)) * Math.sin(((d - e) * c) / b));
        };
      }),
      (Ease.elasticIn = Ease.getElasticIn(1, 0.3)),
      (Ease.getElasticOut = function(a, b) {
        var c = 2 * Math.PI;
        return function(d) {
          if (0 == d || 1 == d) return d;
          var e = (b / c) * Math.asin(1 / a);
          return a * Math.pow(2, -10 * d) * Math.sin(((d - e) * c) / b) + 1;
        };
      }),
      (Ease.elasticOut = Ease.getElasticOut(1, 0.3)),
      (Ease.getElasticInOut = function(a, b) {
        var c = 2 * Math.PI;
        return function(d) {
          var e = (b / c) * Math.asin(1 / a);
          return (d *= 2) < 1 ? -0.5 * a * Math.pow(2, 10 * (d -= 1)) * Math.sin(((d - e) * c) / b) : a * Math.pow(2, -10 * (d -= 1)) * Math.sin(((d - e) * c) / b) * 0.5 + 1;
        };
      }),
      (Ease.elasticInOut = Ease.getElasticInOut(1, 0.3 * 1.5)),
      (createjs.Ease = Ease);
  })(),
  (this.createjs = this.createjs || {}),
  (function() {
    "use strict";
    function MotionGuidePlugin() {
      throw "MotionGuidePlugin cannot be instantiated.";
    }
    var a = MotionGuidePlugin;
    (a.priority = 0),
      (a.ID = "MotionGuide"),
      (a.install = function() {
        return createjs.Tween._installPlugin(MotionGuidePlugin), createjs.Tween.IGNORE;
      }),
      (a.init = function(b, c) {
        "guide" == c && b._addPlugin(a);
      }),
      (a.step = function(b, c, d) {
        for (var e in d)
          if ("guide" === e) {
            var f = c.props.guide,
              g = a._solveGuideData(d.guide, f);
            f.valid = !g;
            var h = f.endData;
            if ((b._injectProp("x", h.x), b._injectProp("y", h.y), g || !f.orient)) break;
            var i = void 0 === c.prev.props.rotation ? b.target.rotation || 0 : c.prev.props.rotation;
            if (((f.startOffsetRot = i - f.startData.rotation), "fixed" == f.orient)) (f.endAbsRot = h.rotation + f.startOffsetRot), (f.deltaRotation = 0);
            else {
              var j = void 0 === d.rotation ? b.target.rotation || 0 : d.rotation,
                k = j - f.endData.rotation - f.startOffsetRot,
                l = k % 360;
              switch (((f.endAbsRot = j), f.orient)) {
                case "auto":
                  f.deltaRotation = k;
                  break;
                case "cw":
                  f.deltaRotation = ((l + 360) % 360) + 360 * Math.abs((k / 360) | 0);
                  break;
                case "ccw":
                  f.deltaRotation = ((l - 360) % 360) + -360 * Math.abs((k / 360) | 0);
              }
            }
            b._injectProp("rotation", f.endAbsRot);
          }
      }),
      (a.change = function(b, c, d, e, f) {
        var g = c.props.guide;
        if (g && c.props !== c.prev.props && g !== c.prev.props.guide) return ("guide" === d && !g.valid) || "x" == d || "y" == d || ("rotation" === d && g.orient) ? createjs.Tween.IGNORE : void a._ratioToPositionData(f, g, b.target);
      }),
      (a.debug = function(b, c, d) {
        b = b.guide || b;
        var e = a._findPathProblems(b);
        if ((e && console.error("MotionGuidePlugin Error found: \n" + e), !c)) return e;
        var f,
          g = b.path,
          h = g.length,
          i = 3,
          j = 9;
        for (c.save(), c.lineCap = "round", c.lineJoin = "miter", c.beginPath(), c.moveTo(g[0], g[1]), f = 2; h > f; f += 4) c.quadraticCurveTo(g[f], g[f + 1], g[f + 2], g[f + 3]);
        (c.strokeStyle = "black"), (c.lineWidth = 1.5 * i), c.stroke(), (c.strokeStyle = "white"), (c.lineWidth = i), c.stroke(), c.closePath();
        var k = d.length;
        if (d && k) {
          var l = {},
            m = {};
          a._solveGuideData(b, l);
          for (var f = 0; k > f; f++) (l.orient = "fixed"), a._ratioToPositionData(d[f], l, m), c.beginPath(), c.moveTo(m.x, m.y), c.lineTo(m.x + Math.cos(0.0174533 * m.rotation) * j, m.y + Math.sin(0.0174533 * m.rotation) * j), (c.strokeStyle = "black"), (c.lineWidth = 1.5 * i), c.stroke(), (c.strokeStyle = "red"), (c.lineWidth = i), c.stroke(), c.closePath();
        }
        return c.restore(), e;
      }),
      (a._solveGuideData = function(b, c) {
        var d = void 0;
        if ((d = a.debug(b))) return d;
        {
          var e = (c.path = b.path);
          c.orient = b.orient;
        }
        (c.subLines = []), (c.totalLength = 0), (c.startOffsetRot = 0), (c.deltaRotation = 0), (c.startData = { ratio: 0 }), (c.endData = { ratio: 1 }), (c.animSpan = 1);
        var f,
          g,
          h,
          i,
          j,
          k,
          l,
          m,
          n,
          o = e.length,
          p = 10,
          q = {};
        for (f = e[0], g = e[1], l = 2; o > l; l += 4) {
          (h = e[l]), (i = e[l + 1]), (j = e[l + 2]), (k = e[l + 3]);
          var r = { weightings: [], estLength: 0, portion: 0 },
            s = f,
            t = g;
          for (m = 1; p >= m; m++) {
            a._getParamsForCurve(f, g, h, i, j, k, m / p, !1, q);
            var u = q.x - s,
              v = q.y - t;
            (n = Math.sqrt(u * u + v * v)), r.weightings.push(n), (r.estLength += n), (s = q.x), (t = q.y);
          }
          for (c.totalLength += r.estLength, m = 0; p > m; m++) (n = r.estLength), (r.weightings[m] = r.weightings[m] / n);
          c.subLines.push(r), (f = j), (g = k);
        }
        n = c.totalLength;
        var w = c.subLines.length;
        for (l = 0; w > l; l++) c.subLines[l].portion = c.subLines[l].estLength / n;
        var x = isNaN(b.start) ? 0 : b.start,
          y = isNaN(b.end) ? 1 : b.end;
        a._ratioToPositionData(x, c, c.startData), a._ratioToPositionData(y, c, c.endData), (c.startData.ratio = x), (c.endData.ratio = y), (c.animSpan = c.endData.ratio - c.startData.ratio);
      }),
      (a._ratioToPositionData = function(b, c, d) {
        var e,
          f,
          g,
          h,
          i,
          j = c.subLines,
          k = 0,
          l = 10,
          m = b * c.animSpan + c.startData.ratio;
        for (f = j.length, e = 0; f > e; e++) {
          if (((h = j[e].portion), k + h >= m)) {
            i = e;
            break;
          }
          k += h;
        }
        void 0 === i && ((i = f - 1), (k -= h));
        var n = j[i].weightings,
          o = h;
        for (f = n.length, e = 0; f > e && ((h = n[e] * o), !(k + h >= m)); e++) k += h;
        (i = 4 * i + 2), (g = e / l + ((m - k) / h) * (1 / l));
        var p = c.path;
        return a._getParamsForCurve(p[i - 2], p[i - 1], p[i], p[i + 1], p[i + 2], p[i + 3], g, c.orient, d), c.orient && (b >= 0.99999 && 1.00001 >= b && void 0 !== c.endAbsRot ? (d.rotation = c.endAbsRot) : (d.rotation += c.startOffsetRot + b * c.deltaRotation)), d;
      }),
      (a._getParamsForCurve = function(a, b, c, d, e, f, g, h, i) {
        var j = 1 - g;
        (i.x = j * j * a + 2 * j * g * c + g * g * e), (i.y = j * j * b + 2 * j * g * d + g * g * f), h && (i.rotation = 57.2957795 * Math.atan2((d - b) * j + (f - d) * g, (c - a) * j + (e - c) * g));
      }),
      (a._findPathProblems = function(a) {
        var b = a.path,
          c = (b && b.length) || 0;
        if (6 > c || (c - 2) % 4) {
          var d = "	Cannot parse 'path' array due to invalid number of entries in path. ";
          return (d += "There should be an odd number of points, at least 3 points, and 2 entries per point (x & y). "), (d += "See 'CanvasRenderingContext2D.quadraticCurveTo' for details as 'path' models a quadratic bezier.\n\n"), (d += "Only [ " + c + " ] values found. Expected: " + Math.max(4 * Math.ceil((c - 2) / 4) + 2, 6));
        }
        for (var e = 0; c > e; e++) if (isNaN(b[e])) return "All data in path array must be numeric";
        var f = a.start;
        if (isNaN(f) && void 0 !== f) return "'start' out of bounds. Expected 0 to 1, got: " + f;
        var g = a.end;
        if (isNaN(g) && void 0 !== g) return "'end' out of bounds. Expected 0 to 1, got: " + g;
        var h = a.orient;
        return h && "fixed" != h && "auto" != h && "cw" != h && "ccw" != h ? 'Invalid orientation value. Expected ["fixed", "auto", "cw", "ccw", undefined], got: ' + h : void 0;
      }),
      (createjs.MotionGuidePlugin = MotionGuidePlugin);
  })(),
  (this.createjs = this.createjs || {}),
  (function() {
    "use strict";
    var a = (createjs.TweenJS = createjs.TweenJS || {});
    (a.version = "1.0.0"), (a.buildDate = "Thu, 14 Sep 2017 19:47:47 GMT");
  })();
