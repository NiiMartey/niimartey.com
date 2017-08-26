! function () {
    var e = "/static/js/";
    if ("undefined" == typeof zd && (zd = {}), "undefined" == typeof zd.core3) {
        zd.core3 = {}, zd.core3.modules = {}, zd.core3.module = null, zd.core3.createModule = function (t, i) {
            var n = {
                id: t,
                exports: {},
                loaded: !1,
                filename: e + t + ".js?" + (zd.config.disc || zd.config.get("disc") || Date.now()),
                parent: i || null,
                children: []
            };
            return n.require = zd.core3.require.bind(zd.core3, n), zd.core3.modules[t] = n, n
        }, zd.core3.parseId = function (e, t) {
            var i = "string" == typeof t ? t.split("/") : [],
                n = e.split("/");
            i.pop(), "." === n[0] ? (n.shift(), i.length > 0 && (n = i.concat(n))) : ".." === n[0] && (n = i.concat(n));
            for (var s, o = 0, r = n.length; r > o; o++) {
                if (s = n[o], "." === s || "" === s.trim()) throw new Error('Incorrect module id "' + e + '".');
                if (".." === s) {
                    if (1 > o) throw new Error('Incorrect module id "' + e + '" with parent "' + t + '".');
                    n.splice(o - 1, 2), o -= 2, r -= 2
                }
            }
            return n.join("/")
        }, zd.core3.require = function (e, i) {
            "string" == typeof e && (i = e, e = null), i = zd.core3.parseId(i, e && e.id);
            var n = zd.core3.modules[i];
            if ("function" == typeof n) {
                var s = n;
                n = zd.core3.createModule(i, e), s(n, n.exports, n.require), t(n)
            } else n || (n = zd.core3.createModule(i, e), $.ajax({
                url: n.filename,
                type: "get",
                dataType: "text",
                async: !1,
                success: function (e) {
                    "msie" === browser.agent && browser.version < 9 && (e = e.replace(/\.((?:with)|(?:catch))[\s]*\(/g, '["$1"](')), zd.core3.module = n, jQuery.globalEval(e)
                },
                error: function () {
                    var t = i + "/index",
                        s = zd.core3.createModule(t, e);
                    n = zd.core3.modules[i] = s, $.ajax({
                        url: n.filename,
                        type: "get",
                        dataType: "text",
                        async: !1,
                        success: function (e) {
                            "msie" === browser.agent && browser.version < 9 && (e = e.replace(/\.((?:with)|(?:catch)|(?:delete))[\s]*\(/g, '["$1"](')), zd.core3.module = n, jQuery.globalEval(e)
                        },
                        error: function () {
                            throw new Error("Can't find module \"" + i + '".')
                        }
                    })
                }
            }), t(n));
            return n.exports
        };
        var t = function (e) {
            e.loaded = !0, e.parent && e.parent.children.push(e), "function" == typeof e.exports && (e.exports.prototype.__name__ = e.id);
            var t = {
                bind: function (e, t) {
                    return this.hasOwnProperty("listener") || (this.listener = $("<div></div>")), this.listener.on(e, t), this
                },
                unbind: function (e, t) {
                    return this.hasOwnProperty("listener") ? (this.listener.off(e, t), this) : this
                },
                trigger: function (e, t) {
                    return this.hasOwnProperty("listener") ? (this.listener.trigger(e, t), this) : this
                },
                one: function (e, t) {
                    return this.hasOwnProperty("listener") || (this.listener = $("<div></div>")), this.listener.one(e, t), this
                }
            };
            0 === e.id.indexOf("modules") && "new" !== e.exports.EventEmitterType ? $.extend(e.exports, t) : 0 === e.id.indexOf("libs") && "new" !== e.exports.prototype.EventEmitterType && $.extend(e.exports.prototype, t)
        }
    }
}(), zd.core3.modules["core/SmartObject"] = function (e, t, i) {
    function n(e, t) {
        this.oldValue = e, this.newValue = t
    }

    function s(e) {
        if (e instanceof n) return e;
        var t = {},
            i = {};
        return function s(e, t, i) {
            for (var o in e) e.hasOwnProperty(o) && (e[o] instanceof n ? (t[o] = e[o].oldValue, i[o] = e[o].newValue) : (t[o] = {}, i[o] = {}, s(e[o], t[o], i[o])))
        }(e, t, i), new n(t, i)
    }

    function o(e, t, i) {
        i = i || {};
        for (var s in t) t.hasOwnProperty(s) && void 0 !== e[s] && e[s] !== t[s] && (r.isPureObject(t[s]) ? e[s] instanceof l || e[s] instanceof u ? e[s].emit("Update", t[s]) : r.isPureObject(e[s]) ? ("object" != typeof i[s] && (i[s] = {}), o(e[s], t[s], i[s]), 0 === Object.keys(i[s]).length && delete i[s]) : (i[s] = new n(e[s], t[s]), e[s] = t[s]) : (i[s] = new n(e[s], t[s]), e[s] = t[s]));
        return i
    }
    var r = i("./utils"),
        a = i("libs/EventEmitter"),
        l = i("libs/om/SmartObject"),
        u = function () {
            this.__init__.apply(this, arguments)
        };
    r.inherits(u, a), r.extend(u.prototype, {
        __init__: function (e) {
            e = e || {}, this._parse(e), this.values = r.extend(!0, {
                id: null,
                parent: null,
                readyState: 1
            }, this.values || {}), o(this.values, e), this._parse(this.values), this.values.id = this.values.id || r.uid(), this.__children = [], this.__timeouts = {}, this.addListener("Destroy", this.onDestroy, this).addListener("Update", this.onUpdate, this).addListener("Change", this.onChange, this).addListener("Change:parent", this.onChangeParent, this);
            var t = this.get("parent");
            t && this.onChangeParent({
                oldValue: null,
                newValue: t
            })
        },
        __destroy__: function () {
            this.emit("Destroyed", this), this.removeAllListeners();
            var e = this.__timeouts || {};
            for (var t in e) clearTimeout(t);
            var i = this.get("parent");
            i && this.onChangeParent({
                oldValue: i,
                newValue: null
            });
            for (var t in this) delete this[t]
        },
        __addChild: function (e) {
            var t = this.__children;
            if (Array.isArray(t)) {
                var i = t.indexOf(e); - 1 === i && t.push(e)
            }
        },
        __removeChild: function (e) {
            var t = this.__children;
            if (Array.isArray(t)) {
                var i = t.indexOf(e);
                i > -1 && (t.splice(i, 1), 0 === t.length && delete this.__children)
            }
        },
        onDestroy: function () {
            this.removeListener("Destroy", this.onDestroy, this);
            for (var e, t = this.__children || []; e = t.shift();) e.emit("Destroy");
            this.__destroy__()
        },
        onUpdate: function (e) {
            this._update(e)
        },
        onChange: function () {},
        onChangeParent: function (e) {
            var t = e.oldValue,
                i = e.newValue;
            t && t.__removeChild(this), i && i.__addChild(this)
        },
        update: function () {
            'Use .emit("Update", {}) not .update({})'
        },
        _parse: function (e) {
            void 0 !== e.parent && (e.parent instanceof l || e.parent instanceof u || delete e.parent)
        },
        _update: function (t) {
            if (t === this.values) throw new Error(e.id + "::_update - options is this.values");
            t = t || {}, this._parse(t), delete t.id;
            var i = o(this.values, t);
            if (0 === Object.keys(i).length) return this;
            var r = [];
            return function a(e, t) {
                for (var i in e) e.hasOwnProperty(i) && (e[i] instanceof n || a(e[i], t + ":" + i), Object.keys(e[i]).length > 0 && r.push({
                    type: t + ":" + i,
                    data: s(e[i])
                }))
            }(i, "Change"), r.push({
                type: "Change",
                data: s(i)
            }), r.forEach(function (e) {
                this.emit(e.type, e.data, this)
            }, this), this
        },
        get: function (e) {
            return void 0 === e ? this.values : (e = e.split("."), function t(i) {
                if (!i) return i;
                var n = e.shift();
                return i instanceof l || i instanceof u ? i.get([n].concat(e).join(".")) : 0 === e.length ? i[n] : t(i[n])
            }(this.values))
        },
        setTimeout: function (e, t, i) {
            var n, s = 0;
            "number" == typeof t ? s = t : t instanceof Object && (n = t), i instanceof Object && (n = i), n = i || this;
            var o = this.__timeouts;
            if (!o) return 0;
            var r = setTimeout(function () {
                delete o[r], e.apply(n, arguments)
            }.bind(this), s || 0);
            return o[r] = 1, r
        },
        clearTimeout: function (e) {
            var t = this.__timeouts;
            t && void 0 !== t[e] && (clearTimeout(e), delete t[e])
        }
    }), e.exports = u
}, zd.core3.modules["core/utils"] = function (e, t, i) {
    e.exports = i("core/utils/utils")
}, zd.core3.modules["core/utils/utils"] = function (e, t, i) {
    e.exports = {
        $super: i("./$super"),
        extend: i("./extend"),
        uid: i("./uid"),
        param: i("./param"),
        isPureObject: i("./isPureObject"),
        isArray: i("./isArray"),
        isFunction: i("./isFunction"),
        isObject: i("./isObject"),
        isNumber: i("./isNumber"),
        isString: i("./isString"),
        isBoolean: i("./isBoolean"),
        inherits: i("./inherits"),
        "implements": i("./implements"),
        ui: i("./ui"),
        sort: i("./sort")
    }
}, zd.core3.modules["core/utils/$super"] = function (e, t, i) {
    e.exports = function n(e, t) {
        if (t = t || n.caller || arguments.callee.caller, "msie" === browser.agent && browser.version < 9) {
            var i = e.constructor.prototype;
            for (var s in i)
                if (i.hasOwnProperty(s) && i[s] === t) return Object.getPrototypeOf(i)
        }
        for (var o = e; o && o !== Object.prototype;) {
            for (var s in o)
                if (o.hasOwnProperty(s) && o[s] === t) return Object.getPrototypeOf(o);
            o = Object.getPrototypeOf(o)
        }
    }
}, zd.core3.modules["core/utils/extend"] = function (e, t, i) {
    e.exports = $.extend
}, zd.core3.modules["core/utils/uid"] = function (e, t, i) {
    var n = -1;
    e.exports = function () {
        ++n > parseInt("zzzzz", 36) && (n = 0);
        var e = ("0000" + n.toString(36)).slice(-5),
            t = Date.now().toString(16);
        return "id" + e + t
    }
}, zd.core3.modules["core/utils/param"] = function (e, t, i) {
    e.exports = function (e) {
        return $.param({
            data: JSON.stringify(e)
        })
    }
}, zd.core3.modules["core/utils/isPureObject"] = function (e, t, i) {
    e.exports = function (e) {
        return e && "[object Object]" === e.toString() && Object.getPrototypeOf(e) === Object.prototype
    }
}, zd.core3.modules["core/utils/isArray"] = function (e, t, i) {
    e.exports = function (e) {
        return Array.isArray(e)
    }
}, zd.core3.modules["core/utils/isFunction"] = function (e, t, i) {
    e.exports = function (e) {
        return "function" == typeof e
    }
}, zd.core3.modules["core/utils/isObject"] = function (e, t, i) {
    e.exports = function (e) {
        return e instanceof Object
    }
}, zd.core3.modules["core/utils/isNumber"] = function (e, t, i) {
    e.exports = function (e) {
        return "number" == typeof e && !isNaN(e)
    }
}, zd.core3.modules["core/utils/isString"] = function (e, t, i) {
    e.exports = function (e) {
        return "string" == typeof e
    }
}, zd.core3.modules["core/utils/isBoolean"] = function (e, t, i) {
    e.exports = function (e) {
        return "boolean" == typeof e
    }
}, zd.core3.modules["core/utils/inherits"] = function (e, t, i) {
    var n = i("./extend"),
        s = i("./isPureObject");
    e.exports = function (e, t, i) {
        var o = e,
            r = "function" == typeof t ? t : null,
            a = s(i) ? i : s(t) ? t : null;
        return r && (o.prototype = Object.create(r.prototype), "msie" === browser.agent && browser.version < 9 && (o.prototype.constructor = o, o.prototype.__proto__ = r.prototype)), a && n(o.prototype, a), o
    }
}, zd.core3.modules["core/utils/implements"] = function (e, t, i) {
    e.exports = function () {
        for (var e = arguments[0], t = 1, i = arguments.length; i > t; t++) {
            var n = arguments[t].prototype;
            for (var s in n) n.hasOwnProperty(s) && "__name__" !== s && (e.prototype[s] = n[s])
        }
        return e
    }
}, zd.core3.modules["core/utils/ui"] = function (e, t, i) {
    e.exports = i("core/utils/ui/ui")
}, zd.core3.modules["core/utils/ui/ui"] = function (e, t, i) {
    e.exports = {
        dateConverter: i("./dateConverter"),
        escape: i("./escape"),
        getDownloadButtonDictionary: i("./getDownloadButtonDictionary"),
        getInputSelection: i("./getInputSelection"),
        getScrollBarWidth: i("./getScrollBarWidth"),
        setInputSelection: i("./setInputSelection"),
        sizeConverter: i("./sizeConverter"),
        timeConverter: i("./timeConverter")
    }
}, zd.core3.modules["core/utils/ui/dateConverter"] = function (e, t, i) {
    e.exports = function (e) {
        if (e) {
            var t, i = ([_("mb_js_core_date_jan"), _("mb_js_core_date_feb"), _("mb_js_core_date_mar"), _("mb_js_core_date_apr"), _("mb_js_core_date_may"), _("mb_js_core_date_jun"), _("mb_js_core_date_jul"), _("mb_js_core_date_aug"), _("mb_js_core_date_sep"), _("mb_js_core_date_oct"), _("mb_js_core_date_nov"), _("mb_js_core_date_dec")], new Date),
                n = new Date(e *= 1e3),
                s = {
                    date: i.getDate(),
                    month: i.getMonth(),
                    year: i.getFullYear(),
                    hours: i.getHours(),
                    minutes: i.getMinutes()
                },
                o = {
                    date: n.getDate(),
                    month: n.getMonth(),
                    year: n.getFullYear(),
                    hours: n.getHours(),
                    minutes: n.getMinutes()
                },
                r = "",
                a = "",
                l = !1;
            return s.date == o.date && s.month == o.month && s.year == o.year && (l = _("mb_js_core_date_today")), s.date - o.date == 1 && s.month == o.month && s.year == o.year && (l = _("mb_js_core_date_yesterday")), l ? t = l : (o.date < 10 && (o.date = "0" + o.date), o.month += 1, o.month < 10 && (o.month = "0" + o.month), t = o.date + "/" + o.month + "/" + o.year), o.hours < 10 && (r = "0"), o.minutes < 10 && (a = "0"), t + " " + r + o.hours + ":" + a + o.minutes
        }
    }
}, zd.core3.modules["core/utils/ui/escape"] = function (e, t, i) {
    e.exports = function (e, t) {
        if (e = e || "", t) {
            var i = "number" == typeof t ? t : 25,
                n = 5;
            if (e.length > i + 3) {
                var s = mimeTypes.getExtension(e) || "",
                    o = e,
                    r = 0;
                s.length > 0 && s.length < 20 && (s = "." + s, r = s.length, o = e.substr(0, e.length - r));
                var a = o.substr(0, i - n - r),
                    l = o.substr(o.length - n);
                e = a + "..." + l + s
            }
        }
        return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
    }
}, zd.core3.modules["core/utils/ui/getDownloadButtonDictionary"] = function (e, t, i) {
    e.exports = function () {
        var e = {
            platform: browser.platform
        };
        switch (browser.platform) {
            case "win":
                e.downloadLink = zd.config.get("locations.download.win"), e.downloadText = _("mb_js_core_download_win", "<span>", "</span>");
                break;
            case "mac":
                e.downloadLink = zd.config.get("locations.download.mac"), e.downloadText = _("mb_js_core_download_mac", "<span>", "</span>");
                break;
            case "ios":
                e.downloadLink = zd.config.get("locations.download.iphone"), e.downloadText = _("mb_js_core_download_iphone", "<span>", "</span>");
                break;
            case "linux":
                e.downloadLink = zd.config.get("locations.download.linux"), e.downloadText = _("mb_js_core_download_linux", "<span>", "</span>");
                break;
            case "android":
                e.downloadLink = zd.config.get("locations.download.android"), e.downloadText = _("mb_js_core_download_android", "<span>", "</span>")
        }
        return e
    }
}, zd.core3.modules["core/utils/ui/getInputSelection"] = function (e, t, i) {
    e.exports = function (e) {
        e[0] && (e = e[0]);
        var t, i;
        if ("number" == typeof e.selectionStart) t = e.selectionStart, i = e.selectionEnd;
        else {
            var n, s, o = document.selection;
            if ("textarea" != e.tagName.toLowerCase()) s = e.value, n = o.createRange().duplicate(), n.moveEnd("character", s.length), t = "" == n.text ? s.length : s.lastIndexOf(n.text), n = o.createRange().duplicate(), n.moveStart("character", -s.length), i = n.text.length;
            else {
                n = o.createRange();
                var r = n.duplicate();
                r.moveToElementText(e), r.setEndPoint("EndToEnd", n), t = r.text.length - n.text.length, i = t + n.text.length
            }
        }
        return {
            start: t,
            end: i,
            text: e.value.substr(t, i - t)
        }
    }
}, zd.core3.modules["core/utils/ui/getScrollBarWidth"] = function (e, t, i) {
    var n;
    e.exports = function () {
        if (void 0 !== n) return n;
        var e = $("<div></div>");
        e.css({
            position: "absolute",
            left: -1e3,
            top: -1e3,
            width: 100,
            height: 100,
            overflow: "auto"
        });
        var t = $("<div></div>").appendTo(e);
        t.css({
            height: 1e3
        }), e.appendTo(document.body);
        var i = e.width() - t.width();
        return e.remove(), n = i
    }
}, zd.core3.modules["core/utils/ui/setInputSelection"] = function (e, t, i) {
    e.exports = function (e, t, i) {
        try {
            if (e[0] && (e = e[0]), e.setSelectionRange) e.setSelectionRange(t, i);
            else if (e.createTextRange) {
                var n = e.createTextRange();
                n.collapse(!0), n.moveEnd("character", i), n.moveStart("character", t), n.select()
            }
        } catch (s) {}
    }
}, zd.core3.modules["core/utils/ui/sizeConverter"] = function (e, t, i) {
    e.exports = function (e, t) {
        var i = [_("mb_js_core_size_b"), _("mb_js_core_size_kb"), _("mb_js_core_size_mb"), _("mb_js_core_size_gb"), _("mb_js_core_size_tb"), _("mb_js_core_size_pb"), _("mb_js_core_size_eb")];
        if (!e) return "0" + i[0];
        var n = 1;
        0 > e && (n = -1, e = -1 * e);
        var s = Math.floor(Math.log(e) / Math.log(1024)),
            o = 1;
        (0 == s || 1 == s || 2 == s) && (o = 1);
        var r = (e / Math.pow(1024, Math.floor(s))).toFixed(o) * n;
        return r >= 1e3 && 1024 >= r && i.length != s - 1 && (r = 1, s += 1), t && t[r] && (r = t[r]), r + i[s]
    }
}, zd.core3.modules["core/utils/ui/timeConverter"] = function (e, t, i) {
    e.exports = function (e) {
        var t = [[_("mb_js_core_time_day"), _("mb_js_core_time_days")], [_("mb_js_core_time_hour"), _("mb_js_core_time_hours")], [_("mb_js_core_time_minute"), _("mb_js_core_time_minutes")], [_("mb_js_core_time_second"), _("mb_js_core_time_seconds")]],
            i = 0,
            n = 0,
            s = 0,
            o = 0;
        return e >= 86400 ? (i = Math.floor(e / 86400), e -= 3600 * i * 24, i + " " + t[0][i > 1 ? 1 : 0]) : e >= 3600 ? (n = Math.floor(e / 3600), e -= 3600 * n, n + " " + t[1][n > 1 ? 1 : 0]) : e >= 60 ? (s = Math.floor(e / 60), e -= 60 * s, s + " " + t[2][s > 1 ? 1 : 0]) : (o = e, o + " " + t[3][o > 1 || 0 === o ? 1 : 0])
    }
}, zd.core3.modules["core/utils/sort"] = function (e, t, i) {
    var n = i("./isFunction"),
        s = i("./isString"),
        o = i("./isNumber"),
        r = i("./isBoolean"),
        a = function (e, t) {
            return e.sort(function (e, i) {
                for (var n = 0, s = t.length; s > n; n++) {
                    var o = t[n][0],
                        r = t[n][1],
                        a = e[o],
                        l = i[o];
                    if (a.val !== l.val)
                        if (a.isString && l.isString) {
                            for (var u = a.parts, d = l.parts, h = 0, c = u.length; c > h; h++) {
                                if (void 0 === d[h]) return "asc" === r ? 1 : -1;
                                var p = u[h].v,
                                    _ = d[h].v,
                                    f = u[h].l,
                                    m = d[h].l;
                                if (p !== _) return _ > p ? "asc" === r ? -1 : 1 : "asc" === r ? 1 : -1;
                                if (f !== m) return "asc" === r ? m - f : f - m
                            }
                            if (d[h]) return "asc" === r ? -1 : 1
                        } else if (a.isNumber && l.isNumber) return "asc" === r ? a.val - l.val : l.val - a.val
                }
                return 0
            }), e
        };
    e.exports = function (e, t, i) {
        var l = t.split(/ *, */).map(function (e) {
                var t = e.split(/ +/);
                return "asec" === t[1] && (t[1] = "asc"), t
            }),
            u = e.map(function (e, t) {
                var i = {
                    ___index: t
                };
                return l.forEach(function (t) {
                    var a = t[0],
                        l = n(e.get) ? e.get(a) : e[a],
                        u = {};
                    i[a] = u, s(l) ? (u.isString = !0, u.val = l.toLowerCase()) : o(l) ? (u.isNumber = !0, u.val = l) : l instanceof Date ? (u.isNumber = !0, u.val = l.getTime()) : r(l) ? (u.isNumber = !0, u.val = l ? 1 : 0) : (u.isString = !0, u.val = l && n(l.toString) ? l.toString().toLowerCase() : ""), u.isString && (u.parts = function (e) {
                        if ("" === e) return [{
                            v: "",
                            l: 0
                        }];
                        for (var t, i = [], n = /((?:(?:[^0-9]+)|^))(?:([0-9]+)|$)/g; t = n.exec(e);) "" !== t[1] && void 0 !== t[1] && i.push({
                            v: t[1],
                            l: t[1].length
                        }), void 0 !== t[2] && i.push({
                            v: parseInt(t[2], 10),
                            l: t[2].length
                        });
                        return i
                    }(u.val))
                }), i
            }),
            d = function (t) {
                return t.map(function (t) {
                    return e[t.___index]
                })
            };
        if (!i) return a(u, l), d(u);
        if (!window.Worker) return a(u, l), when.resolve(d(u));
        var h = when.defer(),
            c = new window.Worker(window.URL.createObjectURL(new Blob(["onmessage = function(evt) {var d = JSON.parse(evt.data),a = d.a,o = d.o,s = " + a.toString() + ";s(a, o);postMessage(JSON.stringify(a));}"], {
                type: "text/javascript"
            })));
        return c.onmessage = function (e) {
            var t = JSON.parse(e.data);
            h.resolve(d(t))
        }, c.postMessage(JSON.stringify({
            a: u,
            o: l
        })), h.promise
    }
}, zd.core3.modules["libs/EventEmitter"] = function (e, t, i) {
    var n = Array.isArray,
        s = function () {};
    s.prototype = {
        EventEmitterType: "new",
        addListener: function (e, t, i) {
            if ("_maxListeners" === e || "_warned" === e) throw new SyntaxError("Your can't use _maxListeners or _warned as event name");
            if ("function" != typeof t) throw new TypeError("addListener only takes instances of Function");
            i = i || this;
            var s, o;
            return (s = this._events) || (s = this._events = {}), n(o = this._events[e]) || (o = s[e] = []), o.push({
                func: t,
                context: i
            }), this.emit("newListener", e, t, i), this
        },
        removeListener: function (e, t, i) {
            if ("function" != typeof t) throw new TypeError("removeListener only takes instances of Function");
            var s, o;
            if (!(s = this._events)) return this;
            if (!n(o = s[e])) return this;
            for (var r = 0, a = o.length; a > r; r++)
                if (o[r].func === t && o[r].context === i) {
                    o[r].removed = !0, o.splice(r, 1), 0 === e.length && delete s[e], 0 === Object.keys(s).length && delete this._events, this.emit("RemoveListener", e, t, i, r);
                    break
                }
            return this
        },
        once: function (e, t, i) {
            if ("function" != typeof t) throw new TypeError("addListener only takes instances of Function");
            i = i || this;
            var n = this,
                s = function () {
                    return n.removeListener(e, s, i), t.apply(this, arguments)
                };
            return this.addListener(e, s, i), this
        },
        emit: function (e) {
            var t, i, s, o = 0;
            if (!(t = this._events)) return this;
            if (!n(i = t[e])) return this;
            var r = Array.prototype.slice.call(arguments, 1);
            for (i = i.slice(); s = i[o++];)
                if (!s.removed) {
                    var a = s.func.apply(s.context, r);
                    if (a === !1) break
                }
            return this
        },
        setMaxListeners: function (e) {
            if ("number" != typeof e) throw new TypeError("setMaxListeners only takes numbers");
            return this._events || (this._events = {}), this._events._maxListeners = e, this
        },
        removeAllListeners: function (e, t) {
            1 === arguments.length && ("object" == typeof e ? (t = e, e = null) : t = null);
            var i, s;
            if (!(i = this._events)) return this;
            if (void 0 !== e) {
                if (!n(i[e])) return this;
                t ? ! function () {
                    for (var n = i[e], s = 0, o = n.length; o > s; s++) n[s].context === t && (n.splice(s, 1), s--, o--);
                    0 === n.length && delete i[e]
                }() : delete i[e]
            } else t ? ! function () {
                for (var e in i)
                    if (i.hasOwnProperty(e)) {
                        for (var n = i[e], s = 0, o = n.length; o > s; s++) n[s].context === t && (n.splice(s, 1), s--, o--);
                        0 === n.length && delete i[e]
                    }
            }() : (void 0 !== i._maxListeners && (s = i._maxListeners), delete this._events, void 0 !== s && (this._events = {
                _maxListeners: s
            }));
            return this
        },
        listeners: function (e) {
            var t, i;
            return (t = this._events) && n(i = t[e]) ? i : []
        }
    }, s.prototype.on = s.prototype.addListener, s.prototype.off = s.prototype.removeListener, e.exports = s
}, zd.core3.modules["libs/om/SmartObject"] = function (e, t, i) {
    function n(e) {
        return Array.isArray(e)
    }

    function s(e) {
        return e instanceof Object && Object.getPrototypeOf(e) === Object.prototype && !(e.bind && e.unbind && e.trigger)
    }

    function o(e, t) {
        this.oldValue = e, this.newValue = t
    }

    function r(e) {
        if (e instanceof o) return e;
        var t = {},
            i = {};
        return function n(e, t, i) {
            for (var s in e) e.hasOwnProperty(s) && (e[s] instanceof o ? (t[s] = e[s].oldValue, i[s] = e[s].newValue) : (t[s] = {}, i[s] = {}, n(e[s], t[s], i[s])))
        }(e, t, i), new o(t, i)
    }

    function a(e, t, i) {
        i = i || {};
        for (var n in t) t.hasOwnProperty(n) && void 0 !== e[n] && e[n] !== t[n] && (s(t[n]) ? e[n] instanceof d ? e[n].emit("Update", t[n]) : s(e[n]) ? ("object" != typeof i[n] && (i[n] = {}), a(e[n], t[n], i[n]), 0 === Object.keys(i[n]).length && delete i[n]) : (i[n] = new o(e[n], t[n]), e[n] = t[n]) : (i[n] = new o(e[n], t[n]), e[n] = t[n]));
        return i
    }
    var l = zd.utils,
        u = i("libs/EventEmitter"),
        d = function () {
            this.__init__.apply(this, arguments)
        };
    l.inherits(d, u), l.extend(d.prototype, {
        __init__: function (e) {
            this.values = l.extend({
                    id: null,
                    parent: null,
                    readyState: 0
                }, this.values || {}), e = l.extend(!0, {}, e || {}),
                function t(e, i) {
                    for (var n in i) s(i[n]) ? (void 0 === e[n] && (e[n] = {}), s(e[n]) ? t(e[n], i[n]) : i[n] = null) : (void 0 === e[n] && (e[n] = i[n]), i[n] = null)
                }(e, this.values), e.id ? this.values.id = e.id : this.values.id = this._getId(), this.__notifications = function () {
                    var e = this,
                        t = {},
                        i = [],
                        n = !1;
                    return {
                        add: function (e) {
                            var n = t[e.type];
                            if (n) {
                                var o = n.data.newValue,
                                    r = e.data.newValue;
                                if (s(o) && s(r) ? l.extend(!0, o, r) : n.data.newValue = e.data.newValue, "Change" === e.type) {
                                    var a = i.indexOf(n);
                                    i.splice(a, 1), i.push(n)
                                }
                            } else t[e.type] = e, i.push(e)
                        },
                        dispatch: function () {
                            if (!n) {
                                n = !0;
                                var s = i.shift();
                                s && (delete t[s.type], e.emit(s.type, s.data)), n = !1, i.length > 0 && this.dispatch()
                            }
                        },
                        empty: function () {
                            i.length = 0;
                            for (var e in t) delete t[e]
                        },
                        arr: i
                    }
                }.call(this), this.addListener("Destroy", this.onDestroy, this).addListener("Update", this.onUpdate, this).addListener("Change:parent", this.__onChangeParent, this).addListener("Change:parent", this.onChangeParent, this).addListener("Change:readyState", this.onChangeReadyState, this), this.__options = e, this.setTimeout(function () {
                    this.__init_async__()
                }, 1)
        },
        __init_async__: function () {
            var e = this.__options;
            delete this.__options, this.update(e), this.update({
                readyState: 2 | this.get("readyState")
            })
        },
        __destroy__: function () {
            this.emit("Destroyed", this), this.__notifications.empty(), this.removeAllListeners(), this.clearTimeouts();
            var e = this.values.parent;
            e && e.__removeChild(this);
            for (var t in this) this.hasOwnProperty(t) && delete this[t]
        },
        __addChild: function (e) {
            var t = this.__children;
            n(t) || (t = this.__children = []);
            var i = t.indexOf(e); - 1 === i && t.push(e)
        },
        __removeChild: function (e) {
            var t = this.__children;
            if (n(t)) {
                var i = t.indexOf(e);
                i > -1 && (t.splice(i, 1), 0 === t.length && delete this.__children)
            }
        },
        __onChangeParent: function (e) {
            var t = e.oldValue,
                i = e.newValue;
            t && t.__removeChild(this), i && i.__addChild(this)
        },
        _getId: function () {
            var e = function () {
                    for (var e = Date.now(), t = "0123456789abcdef", i = "", n = e; n > 0;) {
                        if (16 > n) {
                            i = t[n] + i, n = 0;
                            break
                        }
                        i = t[n % 16] + i, n = Math.floor(n / 16)
                    }
                    return i
                }(),
                t = function (e) {
                    for (var t = "1234567890qwertyuiopasdfghjklzxcvbnm", i = "", n = 0; e > n; n++) i += t[Math.floor(Math.random() * t.length)][["toUpperCase", "toLowerCase"][Math.round(Math.random())]]();
                    return i
                }(10);
            return t + e
        },
        onChangeReadyState: function (e) {
            var t = e.newValue;
            2 === (3 & t) && this.setTimeout(function () {
                this.update({
                    readyState: 1 | e.newValue
                })
            }, 0)
        },
        onDestroy: function () {
            this.removeListener("Destroy", this.onDestroy, this);
            for (var e, t = this.__children || []; e = t.shift();) e.emit("Destroy");
            this.__destroy__()
        },
        onUpdate: function (e) {
            this.update(e)
        },
        onChangeParent: function () {},
        update: function (e) {
            if (!this.values || e === this.values) return this;
            if (e = e || {}, delete e.id, void 0 !== e.parent && (e.parent instanceof d || (e.parent = null)), this.__options) return a(this.__options, e), this;
            var t = a(this.values, e);
            if (Object.keys(t).length > 0) {
                var i = this;
                ! function n(e, t) {
                    for (var s in e) e.hasOwnProperty(s) && (e[s] instanceof o || n(e[s], t + ":" + s), Object.keys(e[s]).length > 0 && i.__notifications.add({
                        type: t + ":" + s,
                        data: r(e[s])
                    }))
                }(t, "Change"), Object.keys(t).length > 0 && this.__notifications.add({
                    type: "Change",
                    data: r(t)
                }), this.__notifications.dispatch()
            }
            return this
        },
        get: function (e) {
            return void 0 === e ? this.values : (e = e.split("."), function t(i) {
                if (!i) return i;
                var n = e.shift();
                return i instanceof d ? 0 === e.length ? i.get(n) : t(i.get(n)) : 0 === e.length ? i[n] : t(i[n])
            }(this.values))
        },
        set: function (e, t) {
            var i = {};
            i[e] = t, this.update(i)
        },
        setTimeout: function (e, t, i) {
            var n, s = 0;
            "number" == typeof t ? s = t : t instanceof Object && (n = t), i instanceof Object && (n = i), n = i || this;
            var o = this.__timeouts;
            o || (o = this.__timeouts = []);
            var r = setTimeout(function () {
                self.clearTimeout(r), e.apply(n, arguments)
            }, s);
            return o.push(r), r
        },
        clearTimeout: function (e) {
            clearTimeout(e);
            var t = this.__timeouts;
            if (t) {
                var i = t.indexOf(e);
                i > -1 && (t.splice(i, 1), 0 === t.length && delete this.__timeouts)
            }
        },
        clearTimeouts: function () {
            for (var e, t = this.__timeouts || []; e = t.shift();) clearTimeout(e);
            delete this.__timeouts
        },
        onReady: function (e) {
            var t = this.get("readyState");
            return 1 & t ? e.apply(this) : void 0 !== t && this.addListener("Change:readyState", function i(t) {
                1 & t.newValue && (e.apply(this), this.setTimeout(function () {
                    this.removeListener("Change:readyState", i, this)
                }, 1))
            }, this), this
        }
    }), e.exports = d
}, zd.core3.modules["libs/Config/Config"] = function (e, t, i) {
    var n = i("core/utils"),
        s = i("libs/om/SmartObject"),
        o = window.localStorage,
        r = "config",
        a = function () {
            var e = a.instance;
            return e || (this.__init__.apply(this, arguments), e = a.instance = this), e
        };
    n.inherits(a, s), n.extend(a.prototype, {
        __init__: function (e) {
            var t = zd.config.cdn,
                s = zd.config.disc,
                o = window.devicePixelRatio ? window.devicePixelRatio : 1;
            this.values = n.extend(!0, {
                DOMAIN: "megabackup.com",
                captchaGuid: null,
                captchaUrl: null,
                cdn: t,
                currency: null,
                disc: s,
                desktopFbAuthData: null,
                download: null,
                facebookAppId: null,
                installerType: null,
                installerLink: null,
                lang: "en",
                devicePixelRatio: o,
                lastRevisionId: null,
                lastRevisionTS: null,
                locations: {
                    ROOT: "/",
                    DEFAULT: "#backup",
                    BUYNOW: "/buynow",
                    quickstart: {
                        DEFAULT: "#quickstart",
                        TOUR: "#quickstart/step1",
                        ADVANCED: "#quickstart/advanced"
                    },
                    FS: "#fs",
                    BACKUP: "#backup",
                    SHARE: "#share",
                    TRASH: "#trash",
                    RECENTLY_VIEWED_SHARES: "/recently",
                    UNINSTALL: "/uninstall",
                    download: {
                        win: "/installer?type=win",
                        mac: "/installer?type=mac",
                        android: "/installer?type=android",
                        linux: "/installer?type=linux",
                        iphone: "/installer?type=iphone"
                    },
                    helpcenter: {
                        DEFAULT: "#helpcenter/",
                        ANSWERS: "#helpcenter/answers",
                        SUGGESTIONS: "#helpcenter/suggestions"
                    },
                    account: {
                        DEFAULT: "#account/settings",
                        SETTINGS: "#account/settings",
                        REFERRALS: "#account/referrals"
                    },
                    popups: {
                        PAY: "#popup/Pay",
                        TERMS_AND_CONDITIONS: "#popup/Policies/TermsAndConditions",
                        PRIVACY_POLICY: "#popup/Policies/PrivacyPolicy",
                        PRICING_POLICY: "#popup/Policies/PricingPolicy",
                        DMCA_POLICY: "#popup/Policies/DMCAPolicy",
                        ACCEPTABLE_USE_POLICY: "#popup/Policies/AcceptableUsePolicy",
                        REMOVE_ACCOUNT: "#popup/RemoveAccount",
                        CONTACT_US: "#popup/ContactUs",
                        QUICK_START_PROMO: "#popup/QuickStartPromo",
                        INVITE_FRIENDS: "#popup/InviteFriends",
                        UPLOAD_POPUP: "#popups/UploadPopup",
                        MONTH_TRIAL_EXPIRED_POPUP: "#popup/MonthTrialExpired",
                        FREE_TRIAL_EXPIRED_POPUP: "#popup/FreeTrialExpired",
                        OVER_LIMIT_POPUP: "#popup/OverLimit",
                        USER_RAN_OUT_POPUP: "#popup/UserRanOut",
                        STORAGE_IS_FULL_POPUP: "#popup/StorageIsFull",
                        auth: {
                            SIGN_IN: "#popup/auth/Signin",
                            SIGN_UP: "#popup/auth/Signup",
                            FORGOT: "#popup/auth/Forgot",
                            RESET_PASS: "#popup/auth/Resetpass",
                            LINK_FB: "#popup/auth/LinkFb",
                            LINK_OTHER_FB: "#popup/auth/LinkOtherFb"
                        }
                    },
                    socials: {
                        FACEBOOK: "https://www.facebook.com/megabackupclub",
                        YOUTUBE: "https://www.youtube.com/user/MegaBackup",
                        TWITTER: "https://twitter.com/MegaBackUp_Club"
                    }
                },
                longPolling: null,
                productId: null,
                socket: null,
                templatesDisc: null,
                uploadUrl: null,
                validHash: null,
                webp: null,
                zeroLinkTTL: null,
                MAX_FILE_SIZE: localStorage && localStorage.getItem("MAX_FILE_SIZE") ? parseInt(localStorage.getItem("MAX_FILE_SIZE")) : 419430400,
                MAX_NODES: 100,
                isLogged: !1,
                socialCommentsOff: !1,
                role: this.__getDefaultRole(),
                profile: this.__getEmptyProfile(),
                settings: this.__getDefaultSettings(),
                logo: this.__getDefaultLogo({
                    cdn: t,
                    devicePixelRatio: o,
                    disc: s
                })
            }, this.values || {}, e || {}), zd.config.profile && zd.config.profile.nickname && (zd.config.profile.nickName = zd.config.profile.nickname), n.$super(this).__init__.call(this, zd.config), zd.config = this, this._profileFallback = n.extend({}, i("models/account/profile")), global.addListener("RevisionsManager:ApplyRevisions", this.onRevisionsManagerAddRevision, this), this.addListener("UpdateProfile", this.onUpdateProfile, this), this.onReady(function () {
                0 == this.get("profile.subscription") && "trial3010" == this.get("profile.subscriptionType") && (window.location.href = "#popup/MonthTrialExpired"), this.addListener("Change", this.onChange, this), this.get("profile.preferences.backup") && (this.values.locations.popups.PAY = "/buynow"), this.onStorage = this.onStorage.bind(this), window.addEventListener("storage", this.onStorage)
            }.bind(this))
        },
        update: function (e) {
            e = e || {}, e && e.profile && e.profile.advancedTour && e.profile.advancedTour.steps && ("mac" === browser.platform || "ios" === browser.platform ? delete e.profile.advancedTour.steps.direct_share : delete e.profile.advancedTour.steps.float_dropzone), "isLogged" in e && (e.isLogged || (e.profile = this.__getEmptyProfile(), e.settings = this.__getDefaultSettings(), e.role = this.__getDefaultRole())), n.$super(this).update.apply(this, arguments)
        },
        __destroy__: function () {
            o.removeItem(r), window.removeEventListener("storage", this.onStorage), n.$super(this).__destroy__.apply(this, arguments)
        },
        __getEmptyProfile: function () {
            return {
                firstName: null,
                lang: null,
                lastName: null,
                libraries: null,
                nickName: null,
                notifs: null,
                popups: null,
                preferences: null,
                shortcuts: null,
                subscription: null,
                subscriptionType: null,
                tabs: null,
                advancedTour: null,
                tour: null,
                userId: null,
                username: null,
                userpic: null,
                defaultUserpic: null,
                usedSpace: {
                    accountSize: null,
                    occupiedSize: null
                },
                rootId: null,
                backupRootId: null
            }
        },
        __getDefaultSettings: function () {
            return null
        },
        __getDefaultLogo: function (e) {
            var t = e ? e.cdn : this.get("cdn"),
                i = e ? e.devicePixelRatio : this.get("devicePixelRatio"),
                n = e ? e.disc : this.get("disc");
            return i > 1 ? t + "/static/img/logo@2x.png?" + n : t + "/static/img/logo.png?" + n
        },
        __getDefaultBrand: function () {
            return null
        },
        __getDefaultRole: function () {
            return "user"
        },
        _stringify: function (e) {
            var t = {};
            return ["isLogged", "settings", "profile", "logo"].forEach(function (i) {
                i in e && (t[i] = e[i])
            }), 0 === Object.keys(t).length ? null : JSON.stringify(t)
        },
        _getProfile: function () {
            var e = function (e) {
                    e.nickname ? (e.nickName = e.nickname, delete e.nickname) : e.defaultNickname = e.username.split("@")[0], this.update({
                        profile: e
                    })
                }.bind(this),
                t = n.extend(this._profileFallback, {
                    trigger: function (t, i) {
                        switch (t) {
                            case "getProfileComplete":
                                e(i.response.profile);
                                break;
                            case "getProfileError":
                        }
                    }.bind(this)
                });
            t.getProfile()
        },
        onUpdateProfile: function () {
            this._getProfile()
        },
        onChange: function (e) {
            var t = e.newValue,
                i = (e.oldValue, this._stringify(t));
            null !== i && o.setItem(r, i)
        },
        onStorage: function (e) {
            var t = e.key,
                i = e.newValue;
            e.oldValue;
            t === r && this.update(JSON.parse(i))
        },
        onRevisionsManagerAddRevision: function (e) {
            var t = e.revisions;
            (t || []).forEach(function (e) {
                /^local/.test(e.id) || this.update({
                    lastRevisionId: e.id
                }), (e.events || []).forEach(function (e) {
                    if ("object" == typeof e) switch (e.cmd) {
                        case "_sch":
                            if (e.error) global.emit("Notifications:AddNotification", {
                                content: _("mb_js_subscription_error"),
                                type: "error",
                                selfClosable: !1,
                                okButton: !0
                            });
                            else {
                                var t = e.subscription;
                                this.update({
                                    profile: {
                                        subscription: t
                                    }
                                }), $document.trigger("notification:AddNotification", {
                                    inner: _("mb_js_config_unlimited_subscription"),
                                    type: "information",
                                    selfClosable: !1
                                })
                            }
                            break;
                        case "_sc":
                            var i = {
                                    profile: {}
                                },
                                n = i.profile[e.advanced ? "advancedTour" : "tour"] = {
                                    steps: {}
                                };
                            n.steps[e.step] = {
                                passed: !0
                            }, e.speed && (n.speed = e.speed), this.update(i)
                    }
                }, this)
            }, this)
        }
    }), e.exports = a
}, zd.core3.modules["models/account/profile"] = function (e, t, i) {
    var n = {
        getProfile: function () {
            this._getProfileRequest || (this._getProfileRequest = new(i("libs/request"))({
                url: "/settings/profile",
                link: "cancel"
            }).bind("complete", function (e, t) {
                this.trigger("getProfileComplete", t)
            }.bind(this)).bind("error", function (e, t) {
                this.trigger("getProfileError", t)
            }.bind(this))), this._getProfileRequest.trigger("send", {
                sync: !0
            })
        },
        editWeb: function (e) {
            this._editWebRequest || (this._editWebRequest = new(i("libs/request"))({
                url: "/settings/edit-web"
            }).bind("complete", function (e, t) {
                this.trigger("editWebComplete", t)
            }.bind(this)).bind("error", function (e, t) {
                this.trigger("editWebError", t)
            }.bind(this))), this._editWebRequest.trigger("send", {
                request: {
                    settings: e
                }
            })
        },
        verifyEmail: function (e) {
            var t = {
                    hash: e
                },
                n = new(i("libs/request"))({
                    url: "/settings/verify-email",
                    fireErrors: 0
                });
            n.bind("complete", function (e, t) {
                this.trigger("verifyEmailComplete", t)
            }.bind(this)).bind("error", function (e, t) {
                this.trigger("verifyEmailError", t)
            }.bind(this)), n.trigger("send", {
                request: t
            })
        },
        resendVerify: function () {
            var e = new(i("libs/request"))({
                url: "/settings/send-verify-request"
            });
            e.bind("complete", function (e, t) {
                global.emit("Notifications:AddNotification", {
                    content: _("mb_js_models_account_profile_resend_complete", {
                        username: zd.config.get("profile.username")
                    }),
                    type: "information",
                    selfClosable: !1
                }), this.trigger("resendVerifyComplete", t)
            }.bind(this)).bind("error", function (e, t) {
                this.trigger("resendVerifyError", t)
            }.bind(this)), e.trigger("send")
        }
    };
    e.exports = n
}, zd.core3.modules["libs/request"] = function (e, t, i) {
    var n = function (e, t, i, n) {
        this._options = $.extend({
            url: "/",
            type: "post",
            dataType: "json",
            maxRetry: 5,
            retryTimeout: 0,
            retryErrorCodes: []
        }, e || {}, {
            data: zd.utils.param(t),
            async: !n,
            success: this.onSuccess.bind(this),
            error: this.onError.bind(this)
        }), this._options.retryErrorCodes.splice(0, 0, 1008, 1022), this._currentTry = 0, this._requestData = t, this._additionalData = i, this.bind("destroy", this.abort.bind(this)).bind("abort", this.destroy.bind(this)).bind("error", this.destroy.bind(this)).bind("success", this.destroy.bind(this))
    };
    i("core/utils").inherits(n, i("libs/eventsModelAbstract")), $.extend(n.prototype, {
        onSuccess: function (e) {
            global.emit("Freeze:Loaded", {
                name: "libs.request"
            }), delete this._ajax;
            var t, i = [],
                n = !1;
            return e || (i.push({
                    code: -403,
                    message: "Server Response Error!"
                }), n = !0, e = {}), t = e, e.error && (e.error.code = parseInt(e.error.code), e.error.message = e.error.msg || e.error.message, i.push(e.error), this._options.retryErrorCodes.indexOf(e.error.code) > -1 && (n = !0)),
                i.splice.apply(i, [i.length, 0].concat(e.errors || [])), t.errors = i, i.forEach(function (e) {
                    this.trigger("fireError", {
                        requestInstance: this,
                        requestData: this._requestData,
                        responseData: $.extend({}, t, {
                            error: e
                        }),
                        additionalData: this._additionalData
                    })
                }, this), e.result || n ? n ? void(this._currentTry <= this._options.maxRetry ? window.setTimeout(function () {
                    this.send()
                }.bind(this), this._options.retryTimeout) : this.trigger("error", {
                    requestInstance: this,
                    requestData: this._requestData,
                    responseData: t,
                    additionalData: this.additionalData
                })) : void this.trigger("success", {
                    requestInstance: this,
                    requestData: this._requestData,
                    responseData: t,
                    additionalData: this._additionalData
                }) : void this.trigger("error", {
                    requestInstance: this,
                    requestData: this._requestData,
                    responseData: t,
                    additionalData: this._additionalData
                })
        },
        onError: function (e, t, i) {
            global.emit("Freeze:Loaded", {
                name: "libs.request"
            }), delete this._ajax;
            var n, s = {};
            if ("abort" === t) return void this.trigger("abort", {
                requestInstance: this,
                requestData: this._requestData,
                responseData: s,
                additionalData: this.additionalData
            });
            if (this._currentTry <= this._options.maxRetry) return void window.setTimeout(function () {
                this.send()
            }.bind(this), this._options.retryTimeout);
            switch (t) {
                case "error":
                    n = {
                        code: "Internal Server Error" == i ? 1008 : -402,
                        message: i || "HTTP request error!"
                    };
                    break;
                case "parsererror":
                    n = {
                        code: -401,
                        message: "Parse Error!"
                    };
                    break;
                default:
                    n = {
                        code: -400,
                        message: "Unknown Error!"
                    }
            }
            s.error = n, this.trigger("fireError", {
                requestInstance: this,
                requestData: this._requestData,
                responseData: s,
                additionalData: this._additionalData
            }), this.trigger("error", {
                requestInstance: this,
                requestData: this._requestData,
                responseData: s,
                additionalData: this._additionalData
            })
        },
        send: function () {
            this._currentTry++, global.emit("Freeze:Loading", {
                name: "libs.request"
            }), this._ajax = $.ajax(this._options)
        },
        abort: function () {
            this._ajax ? this._ajax.abort() : this.trigger("abort", {
                requestInstance: this,
                requestData: this._requestData,
                responseData: {},
                additionalData: this._additionalData
            })
        },
        destroy: function () {
            window.setTimeout(function () {
                this._ajax && this._ajax.abort(), this.unbind();
                for (var e in this) this.hasOwnProperty(e) && delete this[e]
            }.bind(this), 1)
        }
    });
    var s = function (e) {
        this._options = $.extend({
            url: "/",
            type: "post",
            dataType: "json",
            maxRetry: 5,
            link: "parallel",
            retryErrorCodes: [],
            fireErrors: 1
        }, e || {}), this._requests = [], this.bind("destroy", this.onDestroy.bind(this)).bind("send", this.onSend.bind(this)).bind("abort", this.onAbort.bind(this)).bind("setOptions", this.onSetOptions.bind(this))
    };
    i("core/utils").inherits(s, i("libs/eventsModelAbstract")), $.extend(s.prototype, {
        createRequest: function (e, t, i) {
            return new n(this._options, e, t || {}, i).bind("success", this.onRSuccess.bind(this)).bind("error", this.onRError.bind(this)).bind("abort", this.onRAbort.bind(this)).bind("fireError", this.onRFireError.bind(this))
        },
        onSetOptions: function (e, t) {
            $.extend(this.options, t)
        },
        onSend: function (e, t) {
            t = t || {};
            var i, n = this._options.link,
                s = t.request || "",
                o = t.additionalData,
                r = !!t.sync;
            "ignore" === n && this._requests.length > 0 || (i = this.createRequest(s, o, r), "cancel" === n ? (this.trigger("abort"), this._requests.push(i), i.send()) : "chain" === n ? (this._requests.push(i), 1 === this._requests.length && i.send()) : (this._requests.push(i), i.send()))
        },
        onAbort: function (e, t) {
            for (var i, n = this._requests; i = n.shift();) i.abort()
        },
        onRSuccess: function (e, t) {
            this.removeRequestInstance(t.requestInstance), t.responseData.revisions instanceof Array && global.emit("RevisionsManager:AddRevisions", {
                revisions: t.responseData.revisions
            }), t.additionalData.ignoreUsedSpace || global.emit("UsedSpace:Update", {
                occupiedSize: t.responseData.occupiedSize,
                accountSize: t.responseData.accountSize
            }), this.trigger("complete", $.extend({
                request: t.requestData,
                response: t.responseData
            }, t.additionalData))
        },
        onRError: function (e, t) {
            this.removeRequestInstance(t.requestInstance), t.responseData.revisions instanceof Array && global.emit("RevisionsManager:AddRevisions", {
                revisions: t.responseData.revisions
            }), t.additionalData.ignoreUsedSpace || global.emit("UsedSpace:Update", {
                occupiedSize: t.responseData.occupiedSize,
                accountSize: t.responseData.accountSize
            }), this.trigger("error", $.extend({
                request: t.requestData,
                response: t.responseData
            }, t.additionalData))
        },
        onRAbort: function (e, t) {
            this.removeRequestInstance(t.requestInstance)
        },
        onRFireError: function (e, t) {
            this._options.fireErrors && global.emit("ErrorController:FireError", {
                error: t.responseData.error
            })
        },
        removeRequestInstance: function (e) {
            var t = this._requests.indexOf(e);
            t > -1 && this._requests.splice(t, 1), this._requests.length && this._requests[0].send()
        },
        onDestroy: function () {
            this.trigger("abort"), this.unbind();
            for (var e in this) this.hasOwnProperty(e) && delete this[e]
        }
    }), e.exports = s
}, zd.core3.modules["libs/eventsModelAbstract"] = function (e, t, i) {
    var n = function () {};
    n.prototype = {
        bind: function (e, t) {
            return this.__listener || (this.__listener = $("<div></div>")), this.__listener.bind(e, t), this
        },
        unbind: function (e, t) {
            return this.__listener ? (this.__listener.unbind(e, t), this) : this
        },
        trigger: function (e, t) {
            return this.__listener ? (this.__listener.trigger(e, t), this) : this
        },
        one: function (e, t) {
            return this.__listener || (this.__listener = $("<div></div>")), this.__listener.one(e, t), this
        }
    }, e.exports = n
}, zd.core3.modules["newlibs/tabs/index/Index"] = function (e, t, i) {
    var n = i("core/utils"),
        s = i("./Abstract"),
        o = function () {
            this.limit = 1, this.images = {}, this.queue = [], this.actions = 0
        };
    n.inherits(o, Object, {
        next: function () {
            if (!(this.actions >= this.limit)) {
                var e = this.queue.shift();
                e && (e.priority > 2 && this.setLimit(3), this.actions++, e.load()["with"](this).then(function () {
                    this.actions--, this.next()
                })["catch"](function () {
                    this.actions--, this.next()
                }))
            }
        },
        push: function (e) {
            var t = e.src,
                i = e.elem,
                n = e.setImage,
                s = e.priority,
                o = this.images[t],
                r = this.queue;
            if (o) return void o.addImageTo(i, n);
            o = this.images[t] = {
                state: 0,
                priority: s,
                addImageTo: function (e, i) {
                    return 0 !== this.state ? void i(e, t) : void this.__elems.push({
                        e: e,
                        a: i
                    })
                },
                load: function () {
                    for (var e, i = this.__elems; e = i.shift();) e.a(e.e, t);
                    this.state = 1;
                    var n = when.defer(),
                        s = new Image;
                    return s.onload = function () {
                        this.state = 2, s = null, n.resolve()
                    }.bind(this), s.onerror = function () {
                        this.state = 3, s = null, n.reject()
                    }.bind(this), s.src = t, n.promise
                },
                __elems: [{
                    e: i,
                    a: n
                }]
            };
            for (var a = !1, l = 0, u = r.length; u > l; l++)
                if (r[l].priority > s) {
                    a = !0, r.splice(l, 0, o);
                    break
                }
            a || r.push(o), this.next()
        },
        setLimit: function (e) {
            var t = this.limit;
            if (t >= e) return void(this.limit = e);
            this.limit = e;
            for (var i = t; e > i; i++) this.next()
        }
    });
    var r = function () {
        this.__init__.apply(this, arguments)
    };
    n.inherits(r, s, {
        __init__: function () {
            this.values = n.extend({
                template: zd.core2.getTemplate("newcore.tabs.index.Index.index")
            }, this.values || {});
            var e = this._$ = this._$ || {};
            e.slidesWrapper = e.slidesWrapper || null;
            var t = this._widgets = this._widgets || {};
            t.header = t.header, this.__slides = [new(i("./slides/Slide1"))({
                parent: this
            }), new(i("./slides/Slide7"))({
                parent: this
            }), new(i("./slides/Slide6"))({
                parent: this
            }), new(i("./slides/Slide3"))({
                parent: this
            }), new(i("./slides/Slide8"))({
                parent: this
            }), new(i("./slides/Slide5"))({
                parent: this
            }), new(i("./slides/Slide4"))({
                parent: this
            })], this.__queue = new o, this.__slides.forEach(function (e, t) {
                var i = 0 === t ? 0 : 1;
                this.__loadImages(e, i), e.addListener("Change:widget", function () {
                    this.__loadImages(e, i)
                }, this)
            }, this), n.$super(this).__init__.apply(this, arguments), this.onWindowScroll = this.onWindowScroll.bind(this), $window.on("scroll", this.onWindowScroll), this.onWindowResize = this.onWindowResize.bind(this), $window.on("resize", this.onWindowResize)
        },
        __destroy__: function () {
            $window.off("scroll", this.onWindowScroll).off("resize", this.onWindowResize), n.$super(this).__destroy__.apply(this, arguments)
        },
        onChangeWidget: function (e) {
            var t, i = e.newValue,
                s = this._$;
            i ? (t = s.slidesWrapper = i.find("[data-id=slidesWrapper]"), this.__loadImages(this, 2)) : (t = s.slidesWrapper = null, this.__slides.forEach(function (e) {
                e.emit("Update", {
                    wrapper: t
                })
            })), n.$super(this).onChangeWidget.apply(this, arguments), i && (this.__slides.forEach(function (e) {
                e.emit("Update", {
                    wrapper: t
                })
            }), this.__setSlidesPosition())
        },
        __loadImages: function (e, t) {
            var i = e.get("widget");
            if (i) {
                var n = i.filter("[data-sprite]").add(i.find("[data-sprite]")),
                    s = i.attr("data-sprite-image"),
                    o = i.filter("[data-background]").add(i.find("[data-background]")),
                    r = i.find("[data-svg-background]"),
                    a = i.filter("[data-image]").add(i.find("[data-image]")),
                    l = this.__queue;
                n.each(function () {
                    var e = $(this),
                        i = e.attr("data-sprite") || s;
                    l.push({
                        src: i,
                        elem: e,
                        setImage: function (e, t) {
                            e.css("background-image", 'url("' + t + '")')
                        },
                        priority: 0 === t ? 1 : 2
                    })
                }), o.each(function () {
                    var e = $(this),
                        i = e.attr("data-background");
                    l.push({
                        src: i,
                        elem: e,
                        setImage: function (e, t) {
                            e.css("background-image", 'url("' + t + '")')
                        },
                        priority: 0 === t ? 1 : 2 === t ? 5 : 3
                    })
                }), r.each(function () {
                    var e = $(this),
                        i = e.attr("data-svg-background");
                    l.push({
                        src: i,
                        elem: e,
                        setImage: function (e, t) {
                            e[0].setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", t)
                        },
                        priority: 0 === t ? 1 : 2 === t ? 5 : 3
                    })
                }), a.each(function () {
                    var e = $(this),
                        i = e.attr("data-image");
                    l.push({
                        src: i,
                        elem: e,
                        setImage: function (e, t) {
                            e.attr("src", t)
                        },
                        priority: 0 === t ? 1 : 4
                    })
                })
            }
        },
        __getSlidesInfo: function () {
            if (!("msie" === browser.agent && browser.version < 10)) {
                var e = $window.height(),
                    t = 380,
                    i = 250,
                    n = Math.log(i / 3),
                    s = this.__slidesInfo || null,
                    o = this.__slidesInfo = {
                        windowHeight: $window.height(),
                        cornerHeight: t,
                        multiplier: n,
                        slides: []
                    };
                this.__slides.slice(0, -1).forEach(function (t, i) {
                    var n = t.get("widget"),
                        r = 0,
                        a = 0;
                    0 !== i && (a = e / 100 * 2, r = (parseFloat(n.css("margin-top")) || 0) + (s && s.slides && s.slides[i] && s.slides[i].addMargin || 0) - a, n.css("margin-top", r)), o.slides.push({
                        height: n.outerHeight(),
                        top: n.position().top + (parseFloat(n.css("top")) || 0) + r,
                        widget: n,
                        addMargin: a,
                        index: i,
                        initialTop: 0
                    })
                });
                var r = o.slides[0];
                o.slides[0].initialTop = 3 * -Math.pow(Math.E, (r.top + r.height - e - t) / (e + t) * n)
            }
        },
        __setSlidesPosition: function () {
            if (!("msie" === browser.agent && browser.version < 10)) {
                this.__slidesInfo || this.__getSlidesInfo();
                var e = $window.scrollTop(),
                    t = this.__slidesInfo,
                    i = t.windowHeight,
                    n = t.cornerHeight,
                    s = t.multiplier;
                t.slides.forEach(function (t) {
                    if (!(e < t.top + t.height - i - n || e > t.top + t.height)) {
                        var o = 3 * Math.pow(Math.E, (e - (t.top + t.height - i - n)) / (i + n) * s) + t.initialTop,
                            r = "translateY(-" + o + "px) translateZ(0)";
                        t.widget.css({
                            transform: r,
                            MozTransform: r,
                            WebkitTransform: r,
                            msTransform: r
                        })
                    }
                })
            }
        },
        onWindowScroll: function (e) {
            this.__setSlidesPosition()
        },
        onWindowResize: function (e) {
            this.__getSlidesInfo(), this.__setSlidesPosition()
        }
    }), e.exports = r
}, zd.core3.modules["newlibs/tabs/index/Abstract"] = function (e, t, i) {
    var n = i("core/utils"),
        s = i("core/View"),
        o = function () {};
    n.inherits(o, s, {
        __init__: function () {
            this.values = n.extend({
                visible: !0
            }, this.values || {});
            var e = this._widgets = this._widgets || {},
                t = this._controllers = this._controllers || {},
                s = this._$ = this._$ || {};
            e.header = e.header || new(i("./widgets/Header"))({
                parent: this
            }), s.headerWrapper = s.headerWrapper || null, e.footer = e.footer || new(i("./widgets/Footer"))({
                parent: this
            }), s.footerWrapper = s.footerWrapper || null, t.popups = t.popups || new(i("./controllers/Popups"))({
                parent: this
            }), s.popupsContainer = null, n.$super(this).__init__.apply(this, arguments)
        },
        onChangeWidget: function (e) {
            var t = e.newValue,
                i = this._$;
            t ? (i.headerWrapper = t.find("[data-id=headerWrapper]"), i.footerWrapper = t.find("[data-id=footerWrapper]")) : (i.headerWrapper = null, i.footerWrapper = null, this.__setWrappers()), i.popupsContainer = this.get("wrapper") || null, n.$super(this).onChangeWidget.apply(this, arguments), t && this.__setWrappers()
        },
        onChangeWrapper: function (e) {
            var t = e.newValue,
                i = this._$;
            t ? i.popupsContainer = t : (i.popupsContainer = null, this.__setWrappers()), n.$super(this).onChangeWrapper.apply(this, arguments), t && this.__setWrappers()
        },
        __setWrappers: function () {
            var e = this._widgets,
                t = this._controllers,
                i = this._$;
            e.header.emit("Update", {
                wrapper: i.headerWrapper
            }), e.footer.emit("Update", {
                wrapper: i.footerWrapper
            }), t.popups.emit("Update", {
                container: i.popupsContainer
            })
        }
    }), e.exports = o
}, zd.core3.modules["core/View"] = function (e, t, i) {
    var n = zd.utils,
        s = i("libs/om/SmartObject"),
        o = i("./SmartObject"),
        r = function () {};
    n.inherits(r, o), n.extend(r.prototype, {
        __init__: function (e) {
            this.values = n.extend({
                template: null,
                wrapper: null,
                widget: null,
                dictionary: null,
                visible: !1,
                place: "last"
            }, this.values || {}), this._$ = this._$ || {}, this._emptyDomElements(), n.$super(this).__init__.apply(this, arguments), this._emptyWrapper = $("<div></div>")[0], this.addListener("Change:template", this.onChangeTemplate, this).addListener("Change:wrapper", this.onChangeWrapper, this).addListener("Change:widget", this.onChangeWidget, this).addListener("Change:dictionary", this.onChangeDictionary, this).addListener("Change:visible", this.onChangeVisible, this), this.addListener("Show", function () {
                this.emit("Update", {
                    visible: !0
                })
            }, this), this.addListener("Hide", function () {
                this.emit("Update", {
                    visible: !1
                })
            }, this), this.addListener("Reposition", function () {
                this._putWidget()
            }, this);
            var t = this.get("template");
            if (t) this._redraw();
            else {
                var i = this.get("widget");
                i && this.onChangeWidget({
                    oldValue: null,
                    newValue: i
                })
            }
        },
        __destroy__: function () {
            var e = this.get("widget");
            e && this.onChangeWidget({
                oldValue: e,
                newValue: null
            }), $(this._emptyWrapper).remove(), n.$super(this).__destroy__.apply(this, arguments)
        },
        _parse: function (e) {
            ! function () {
                var t = e.wrapper;
                return t && t instanceof jQuery ? void(e.wrapper = t[0] || null) : void(t instanceof Element || null === t || delete e.wrapper)
            }(), n.$super(this)._parse.apply(this, arguments)
        },
        onChange: function (e) {
            n.$super(this).onChange.apply(this, arguments);
            var t = e.newValue;
            ("template" in t || "dictionary" in t) && this._redraw()
        },
        getWidth: function () {
            var e = this.get("widget");
            return e ? e.width() : 0
        },
        getHeight: function () {
            var e = this.get("widget");
            return e ? e.height() : 0
        },
        getOffset: function () {
            var e = this.get("widget");
            return e ? e.offset() : {
                top: 0,
                left: 0
            }
        },
        onChangeTemplate: function () {},
        onChangeDictionary: function () {},
        onChangeWrapper: function (e) {
            var t = (e.oldValue, e.newValue, this.get("widget"));
            t && this._putWidget()
        },
        _emptyDomElements: function () {},
        _findDomElements: function () {},
        _setWrappers: function () {},
        onChangeWidget: function (e) {
            var t = e.oldValue,
                i = e.newValue;
            i ? this._findDomElements() : (this._emptyDomElements(), this._setWrappers()), i && (t ? i.insertAfter(t) : this._putWidget(), this.get("visible") ? this._show() : this._hide()), t && this._remove(t), i && this._setWrappers()
        },
        onChangeVisible: function (e) {
            var t = this.get("widget"),
                i = e.newValue;
            t && (i ? this._show() : this._hide())
        },
        _show: function () {
            var e = this.get("widget");
            return e && e.show(), this
        },
        _hide: function () {
            var e = this.get("widget");
            return e && e.hide(), this
        },
        _remove: function (e) {
            e.remove()
        },
        _redraw: function () {
            var e = this.get("template"),
                t = this.get("dictionary") || {};
            e && ((t instanceof o || t instanceof s) && (t = t.get()), this.emit("Update", {
                widget: e.setDictionary(t).compile()
            }))
        },
        _putWidget: function () {
            var e = this.get("widget"),
                t = this.get("wrapper") || this._emptyWrapper,
                i = this.get("place");
            if ("last" === i) {
                var n = t.childNodes[t.childNodes.length - 1];
                if (n === e[0]) return;
                $(t).append(e)
            } else if ("first" === i) {
                var r = t.childNodes[0];
                if (r === e[0]) return;
                r ? e.insertBefore(r) : $(t).append(e)
            } else if (i) {
                if (i = i instanceof o || i instanceof s ? i.get("widget") : i, i[0].nextSibling === e[0]) return;
                e.insertAfter(i)
            }
        }
    }), e.exports = r
}, zd.core3.modules["newlibs/tabs/index/widgets/Header"] = function (e, t, i) {
    var n = i("core/utils"),
        s = i("core/View"),
        o = function () {
            this.__init__.apply(this, arguments)
        };
    n.inherits(o, s, {
        __init__: function () {
            this.values = n.extend({
                template: zd.core2.getTemplate("newcore.tabs.index.widgets.Header.header"),
                visible: !0
            }, this.values || {}), n.$super(this).__init__.apply(this, arguments)
        }
    }), e.exports = o
}, zd.core3.modules["newlibs/tabs/index/widgets/Footer"] = function (e, t, i) {
    var n = i("core/utils"),
        s = i("../../../widgets/Footer"),
        o = function () {
            this.__init__.apply(this, arguments)
        };
    n.inherits(o, s, {
        onChangeWidget: function (e) {
            var t = e.newValue;
            t && t.addClass("footer-index"), n.$super(this).onChangeWidget.apply(this, arguments)
        }
    }), e.exports = o
}, zd.core3.modules["newlibs/widgets/Footer"] = function (e, t, i) {
    var n = i("core/utils"),
        s = i("core/View"),
        o = function () {
            this.__init__.apply(this, arguments)
        };
    n.inherits(o, s, {
        __init__: function (e) {
            this.values = n.extend({
                template: zd.core2.getTemplate("newcore.widgets.Footer.footer"),
                visible: !0
            }, this.values || {}), n.$super(this).__init__.apply(this, arguments)
        }
    }), e.exports = o
}, zd.core3.modules["newlibs/tabs/index/controllers/Popups"] = function (e, t, i) {
    var n = i("core/utils"),
        s = i("../../../controllers/Popups"),
        o = i("../popups/Auth"),
        r = function (e) {
            this.__init__.apply(this, arguments)
        };
    n.inherits(r, s, {
        __init__: function (e) {
            var t = zd.config.get("locations.popups.auth"),
                i = this._popups = this._popups || {};
            i[t.SIGN_IN] = {
                Constructor: o,
                options: {
                    mode: "signin"
                },
                location: t.SIGN_IN,
                inHistory: !0
            }, i[t.SIGN_UP] = {
                Constructor: o,
                options: {
                    mode: "signup"
                },
                location: t.SIGN_UP,
                inHistory: !0
            }, i[t.FORGOT] = {
                Constructor: o,
                options: {
                    mode: "forgotPasswordStep1"
                },
                location: t.FORGOT,
                inHistory: !0
            }, i[t.RESET_PASS] = {
                Constructor: o,
                options: {
                    mode: "resetPassword"
                },
                location: t.RESET_PASS,
                inHistory: !1
            }, i[t.LINK_FB] = {
                Constructor: o,
                options: {
                    mode: "linkEmailFB"
                },
                location: t.LINK_FB,
                inHistory: !1
            }, i[t.LINK_OTHER_FB] = {
                Constructor: o,
                options: {
                    mode: "linkEmailOtherFB"
                },
                location: t.LINK_OTHER_FB,
                inHistory: !1
            }, n.$super(this).__init__.apply(this, arguments)
        },
        _route: function () {
            if (0 === this.getHistoryLength()) {
                var e = $(window).scrollTop();
                $document.addClass("modal-popup").scrollTop(e)
            }
            n.$super(this)._route.apply(this, arguments)
        },
        onPopupDestroyed: function () {
            if (n.$super(this).onPopupDestroyed.apply(this, arguments), 0 === this.getHistoryLength()) {
                var e = $document.scrollTop();
                $document.removeClass("modal-popup"), $(window).scrollTop(e)
            }
        }
    }), e.exports = r
}, zd.core3.modules["newlibs/controllers/Popups"] = function (e, t, i) {
    var n = i("core/utils"),
        s = i("core/SmartObject"),
        o = function (e) {
            this.__init__.apply(this, arguments)
        };
    n.inherits(o, s, {
        __init__: function (e) {
            this.values = n.extend({
                container: null,
                pathname: "/",
                hash: zd.config.get("locations.DEFAULT")
            }, this.values || {}), this.__popups = [], this.__lastLocation = null, this.__msie = "msie" === browser.agent && browser.version < 10;
            var t = zd.config.get("locations.popups");
            this._popups = this._popups || {}, this._popups[t.TERMS_AND_CONDITIONS] = {
                Constructor: i("../popups/policies/Popup"),
                options: {
                    mode: "TermsAndConditions"
                },
                location: t.TERMS_AND_CONDITIONS,
                inHistory: !0
            }, this._popups[t.PRIVACY_POLICY] = {
                Constructor: i("../popups/policies/Popup"),
                options: {
                    mode: "PrivacyPolicy"
                },
                location: t.PRIVACY_POLICY,
                inHistory: !0
            }, this._popups[t.PRICING_POLICY] = {
                Constructor: i("../popups/policies/Popup"),
                options: {
                    mode: "PricingPolicy"
                },
                location: t.PRICING_POLICY,
                inHistory: !0
            }, this._popups[t.DMCA_POLICY] = {
                Constructor: i("../popups/policies/Popup"),
                options: {
                    mode: "DMCAPolicy"
                },
                location: t.DMCA_POLICY,
                inHistory: !0
            }, this._popups[t.ACCEPTABLE_USE_POLICY] = {
                Constructor: i("../popups/policies/Popup"),
                options: {
                    mode: "AcceptableUsePolicy"
                },
                location: t.ACCEPTABLE_USE_POLICY,
                inHistory: !0
            }, this._popups[t.CONTACT_US] = {
                Constructor: i("../popups/ContactUs"),
                location: t.CONTACT_US,
                inHistory: !0
            }, n.$super(this).__init__.apply(this, arguments), this.addListener("Change:container", this.onChangeContainer, this), this.onWindowLocation = this.onWindowLocation.bind(this), $(window).on("hashset hashreplace urlstate", this.onWindowLocation), this.onDocumentLinkClick = this.onDocumentLinkClick.bind(this), $document.on("click", "a", this.onDocumentLinkClick), this.onWindowLocation()
        },
        __destroy__: function () {
            $(window).off("hashset hashreplace urlstate", this.onWindowLocation), $document.off("click", "a", this.onDocumentLinkClick), n.$super(this).__destroy__.apply(this, arguments)
        },
        onChangeContainer: function (e) {
            var t = e.newValue,
                i = this.__popups;
            i.forEach(function (e) {
                e.emit("Update", {
                    wrapper: t
                })
            })
        },
        onWindowLocation: function (e, t) {
            var i = t && t.hash || window.location.hash,
                n = this.__getPopupByLocation(i);
            if (n) return void this._route(e, n, i);
            var s = window.location.pathname,
                o = this.__getPopupByLocation(s);
            if (o) return void this._route(e, o, s);
            if (0 === i.indexOf("#popup")) return this._replaceLocation(this.get("hash")), void(e && e.stopImmediatePropagation());
            this.__lastLocation = null;
            var r = this.__popups;
            r.forEach(function (e) {
                e.removeAllListeners("Destroyed").emit("Destroy")
            }), r.length = 0, this.emit("Update", {
                pathname: s || "/",
                hash: i || zd.config.get("locations.DEFAULT")
            })
        },
        onDocumentLinkClick: function (e) {
            var t = $(e.currentTarget),
                i = t.attr("href"),
                n = this.__getPopupByLocation(i);
            n && (e.preventDefault(), n.inHistory && !this.__msie ? this._setLocation(i) : this._route(e, n, i))
        },
        __getPopupByLocation: function (e) {
            var t = this._popups;
            for (var i in t)
                if (0 === e.indexOf(i)) return t[i];
            return null
        },
        _setLocation: function (e) {
            if (0 === e.indexOf("#")) {
                if (window.location.hash === e) return;
                $(window).trigger("hashset", {
                    hash: e
                })
            } else if (0 === e.indexOf("/")) {
                if (window.location.pathname === e) return;
                history.pushState({
                    soft: this.__msie
                }, null, e + window.location.hash)
            }
        },
        _replaceLocation: function (e) {
            0 === e.indexOf("#") ? $(window).trigger("hashreplace", {
                hash: e
            }) : 0 === e.indexOf("/") && history.replaceState({
                soft: this.__msie
            }, null, e + window.location.hash)
        },
        _route: function (e, t, i) {
            if (t.inHistory || e && e.stopImmediatePropagation(), this.__lastLocation === i) return void(e && e.stopImmediatePropagation());
            this.__lastLocation = i;
            var s = new t.Constructor(n.extend({
                    parent: this,
                    visible: !0,
                    wrapper: this.get("container"),
                    location: i
                }, t.options || {})),
                o = this.__popups,
                r = o.indexOf(s);
            return r > -1 && o.splice(r, 1), o.push(s), s.removeListener("Destroyed", this.onPopupDestroyed, this).addListener("Destroyed", this.onPopupDestroyed, this).emit("Reposition").emit("Center")
        },
        onPopupDestroyed: function (e) {
            var t = this.__popups,
                i = t.indexOf(e);
            i > -1 && t.splice(i, 1);
            var n, s = t[t.length - 1],
                o = e.get("location");
            s ? (n = s.get("location"), o.charAt(0) !== n.charAt(0) && (n = 0 === o.indexOf("/") ? this.get("pathname") : this.get("hash"))) : (this.__lastLocation = null, n = 0 === o.indexOf("/") ? this.get("pathname") : this.get("hash")), this._setLocation(n)
        },
        getHistoryLength: function () {
            return this.__popups.length
        }
    }), e.exports = o
}, zd.core3.modules["newlibs/popups/policies/Popup"] = function (e, t, i) {
    var n = i("core/utils"),
        s = i("../../ui/UIPopup"),
        o = function (e) {
            var t = o.instance;
            return t ? t.emit("Update", e || {}) : (this.__init__.apply(this, arguments), t = o.instance = this), t
        };
    n.inherits(o, s, {
        __init__: function () {
            this.values = n.extend({
                visible: !0,
                contentTemplate: zd.core2.getTemplate("newcore.popups.policies.Popup.content"),
                titleTemplate: zd.core2.getTemplate("newcore.popups.policies.Popup.title"),
                className: "policies-popup",
                mode: "TermsAndConditions"
            }, this.values || {});
            var e = zd.config.get("locations.popups");
            this.__policies = {
                PrivacyPolicy: {
                    id: "PrivacyPolicy",
                    Content: i("./PrivacyPolicyContent"),
                    title: "Privacy Policy",
                    link: e.PRIVACY_POLICY
                },
                TermsAndConditions: {
                    id: "TermsAndConditions",
                    Content: i("./TermsAndConditionsContent"),
                    title: "Terms of Use",
                    link: e.TERMS_AND_CONDITIONS
                },
                DMCAPolicy: {
                    id: "DMCAPolicy",
                    Content: i("./DmcaPolicyContent"),
                    title: "DMCA Policy",
                    link: e.DMCA_POLICY
                },
                AcceptableUsePolicy: {
                    id: "AcceptableUsePolicy",
                    Content: i("./AcceptableUsePolicyContent"),
                    title: "Acceptable Use Policy",
                    link: e.ACCEPTABLE_USE_POLICY
                }
            };
            this.__policyContent = this.__policyContent || null, n.$super(this).__init__.apply(this, arguments);
            var t = this.get("mode");
            t && this.onChangeMode({
                oldValue: null,
                newValue: t
            }), this.addListener("Change:mode", this.onChangeMode, this)
        },
        __destroy__: function () {
            delete o.instance, n.$super(this).__destroy__.apply(this, arguments)
        },
        _createTitle: function () {
            var e = this.get("titleTemplate"),
                t = this.__policies,
                i = [];
            for (var n in t) i.push(t[n]);
            return e.setDictionary({
                policies: i
            }).compile()
        },
        _createContent: function () {
            var e = n.$super(this)._createContent.apply(this, arguments);
            return this.setTimeout(function () {
                this.__policyContent && this.__policyContent.emit("Update", {
                    wrapper: e
                })
            }), e
        },
        _removeContent: function () {
            return this.__policyContent && this.__policyContent.emit("Update", {
                wrapper: null
            }), n.$super(this)._removeContent.apply(this, arguments)
        },
        __setActiveTitle: function (e) {
            var t = this._$.title,
                i = this.__policies[e];
            t && t.find("[data-id=" + i.id + "]").addClass("active")
        },
        __unsetActiveTitle: function (e) {
            var t = this._$.title,
                i = this.__policies[e];
            t && t.find("[data-id=" + i.id + "]").removeClass("active")
        },
        onChangeMode: function (e) {
            var t = e.oldValue,
                i = e.newValue;
            if (t && (this.__unsetActiveTitle(t), this.__policyContent.emit("Destroy")), i) {
                var n = this.__policies[i];
                this.__setActiveTitle(i), this.__policyContent = new n.Content({
                    parent: this,
                    wrapper: this._$.content
                })
            }
        }
    }), e.exports = o
}, zd.core3.modules["newlibs/ui/UIPopup"] = function (e, t, i) {
    var n = i("core/utils"),
        s = i("core/View"),
        o = function () {
            this.__init__.apply(this, arguments)
        };
    n.inherits(o, s, {
        __init__: function () {
            this.values = n.extend({
                template: zd.core2.getTemplate("newcore.ui.UIPopup.body"),
                wrapper: $document,
                modal: !0,
                className: null,
                contentTemplate: null,
                titleTemplate: null,
                location: null,
                place: "first"
            }, this.values || {});
            var e = this._$ = this._$ || {};
            e.shadow = e.shadow || zd.core2.getTemplate("newcore.ui.UIPopup.shadow").compile(), e.contentWrapper = e.contentWrapper || null, e.titleWrapper = e.titleWrapper || null, e.content = e.content || null, e.title = e.title || null, e.shadow.on("click", function (e) {
                e.preventDefault(), this.emit("Close")
            }.bind(this)), n.$super(this).__init__.apply(this, arguments);
            var t = this.get("modal");
            this.onChangeModal({
                oldValue: null,
                newValue: t
            });
            var i = this.get("contentTemplate");
            i && this.onChangeContentTemplate({
                oldValue: null,
                newValue: i
            });
            var s = this.get("titleTemplate");
            s && this.onChangeTitleTemplate({
                oldValue: null,
                newValue: s
            }), this.addListener("Change:modal", this.onChangeModal, this).addListener("Change:contentTemplate", this.onChangeContentTemplate, this).addListener("Change:titleTemplate", this.onChangeTitleTemplate, this).addListener("Change:className", this.onChangeClassName, this), this.addListener("Close", this.onClose, this).addListener("Center", this.onCenter, this), this._addResizeListener()
        },
        onChangeWidget: function (e) {
            var t = e.newValue;
            t ? (n.extend(this._$, {
                contentWrapper: t.find("[data-id=popupContent]"),
                titleWrapper: t.find("[data-id=popupTitle]")
            }), t.find("[data-id=close]").on("click", function (e) {
                e.preventDefault(), this.emit("Close")
            }.bind(this))) : (n.extend(this._$, {
                contentWrapper: null,
                titleWrapper: null
            }), this._$.shadow.appendTo(this._emptyWrapper), this._setContentWrapper(), this._setTitleWrapper()), n.$super(this).onChangeWidget.apply(this, arguments), t && (this._$.shadow.insertAfter(t), this.__addClassName(this.get("className")), this._setContentWrapper(), this._setTitleWrapper())
        },
        onChangeWrapper: function (e) {
            n.$super(this).onChangeWrapper.apply(this, arguments);
            var t = this.get("widget");
            t && (this._$.shadow.insertAfter(t), this.__center())
        },
        __destroy__: function () {
            this._removeResizeListener(), this._$.content && this._removeContent(), this._$.title && this._removeTitle(), this._$.shadow.remove(), n.$super(this).__destroy__.apply(this, arguments)
        },
        __addClassName: function (e) {
            var t = this.get("widget");
            t && e && t.addClass(e)
        },
        __removeClassName: function (e) {
            var t = this.get("widget");
            t && e && t.removeClass(e)
        },
        __makeModal: function () {
            this._$.shadow.show()
        },
        __unmakeModal: function () {
            this._$.shadow.hide()
        },
        __center: function () {
            var e = this.get("widget"),
                t = this.get("wrapper");
            if (e && t) {
                var i = $(t),
                    n = e.outerWidth(),
                    s = e.outerHeight(),
                    o = i.innerWidth(),
                    r = i.innerHeight();
                if (s && n && r && o) {
                    var a = (o - n) / 2;
                    0 > a && (a = 0);
                    var l = (r - s) / 2;
                    0 > l && (l = 0), e.css({
                        left: a,
                        top: l
                    })
                }
            }
        },
        _createContent: function () {
            var e = this.get("contentTemplate");
            return e.compile()
        },
        _removeContent: function () {
            this._$.content.remove(), this._$.content = null
        },
        _createTitle: function () {
            var e = this.get("titleTemplate");
            return e.compile()
        },
        _removeTitle: function () {
            this._$.title.remove(), this._$.title = null
        },
        _addResizeListener: function () {
            this.onWindowResize = function () {
                this.__center()
            }.bind(this), $(window).on("resize", this.onWindowResize)
        },
        _removeResizeListener: function () {
            $(window).off("resize", this.onWindowResize)
        },
        _setContentWrapper: function () {
            var e = this._$.content;
            if (e) {
                var t = this._$.contentWrapper || $(this._emptyWrapper);
                t.append(e), this.__center()
            }
        },
        _setTitleWrapper: function () {
            var e = this._$.title;
            if (e) {
                var t = this._$.titleWrapper || $(this._emptyWrapper);
                t.append(e), this.__center()
            }
        },
        onChangeModal: function (e) {
            e.newValue ? this.__makeModal() : this.__unmakeModal()
        },
        onChangeContentTemplate: function (e) {
            e.oldValue && this._removeContent(), e.newValue && (this._$.content = this._createContent(), this._setContentWrapper())
        },
        onChangeTitleTemplate: function (e) {
            e.oldValue && this._removeTitle(), e.newValue && (this._$.title = this._createTitle(), this._setTitleWrapper())
        },
        onChangeClassName: function (e) {
            var t = e.oldValue,
                i = e.newValue;
            t && this.__removeClassName(t), i && this.__addClassName(i)
        },
        onClose: function () {
            this.emit("Destroy")
        },
        onCenter: function () {
            this.__center()
        }
    }), e.exports = o
}, zd.core3.modules["newlibs/popups/policies/PrivacyPolicyContent"] = function (e, t, i) {
    var n = i("core/utils"),
        s = i("core/View"),
        o = function () {
            this.__init__.apply(this, arguments)
        };
    n.inherits(o, s, {
        __init__: function () {
            this.values = n.extend({
                template: zd.core2.getTemplate("newcore.popups.policies.PrivacyPolicyContent.content"),
                visible: !0
            }, this.values || {}), n.$super(this).__init__.apply(this, arguments)
        }
    }), e.exports = o
}, zd.core3.modules["newlibs/popups/policies/TermsAndConditionsContent"] = function (e, t, i) {
    var n = i("core/utils"),
        s = i("core/View"),
        o = function () {
            this.__init__.apply(this, arguments)
        };
    n.inherits(o, s, {
        __init__: function () {
            this.values = n.extend({
                template: zd.core2.getTemplate("newcore.popups.policies.TermsAndConditionsContent.content"),
                visible: !0
            }, this.values || {}), n.$super(this).__init__.apply(this, arguments)
        }
    }), e.exports = o
}, zd.core3.modules["newlibs/popups/policies/DmcaPolicyContent"] = function (e, t, i) {
    var n = i("core/utils"),
        s = i("core/View"),
        o = function () {
            this.__init__.apply(this, arguments)
        };
    n.inherits(o, s, {
        __init__: function () {
            this.values = n.extend({
                template: zd.core2.getTemplate("newcore.popups.policies.DmcaPolicyContent.content"),
                visible: !0
            }, this.values || {}), n.$super(this).__init__.apply(this, arguments)
        }
    }), e.exports = o
}, zd.core3.modules["newlibs/popups/policies/AcceptableUsePolicyContent"] = function (e, t, i) {
    var n = i("core/utils"),
        s = i("core/View"),
        o = function () {
            this.__init__.apply(this, arguments)
        };
    n.inherits(o, s, {
        __init__: function () {
            this.values = n.extend({
                template: zd.core2.getTemplate("newcore.popups.policies.AcceptableUsePolicyContent.content"),
                visible: !0
            }, this.values || {}), n.$super(this).__init__.apply(this, arguments)
        }
    }), e.exports = o
}, zd.core3.modules["newlibs/popups/ContactUs"] = function (e, t, i) {
    var n = i("core/utils"),
        s = i("../ui/UIPopup"),
        o = function () {
            this.__init__.apply(this, arguments)
        };
    n.inherits(o, s, {
        __init__: function () {
            this.values = n.extend({
                className: "contact-us-popup",
                titleTemplate: zd.core2.getTemplate("newcore.popups.ContactUs.title"),
                contentTemplate: zd.core2.getTemplate("newcore.popups.ContactUs.content")
            }, this.values || {});
            var e = this._$ = this._$ || {};
            e.form = e.form || null, e.textarea = e.textarea || null, e.sendButton = e.sendButton || null, n.$super(this).__init__.apply(this, arguments)
        },
        _createContent: function () {
            var e = n.$super(this)._createContent.apply(this, arguments),
                t = e.find("[data-id=formContent]"),
                i = e.find("textarea"),
                s = e.find("[data-id=send]"),
                o = e.find("[data-id=cancel]");
            return t.on("submit", function (e) {
                e.preventDefault(), this.__send()
            }.bind(this)), i.on("keyup", function (e) {
                this.__validate()
            }.bind(this)), i.on("keydown", function (e) {
                e.ctrlKey && 13 === e.keyCode && this.__send()
            }.bind(this)), o.on("click", function (e) {
                e.preventDefault(), this.emit("Close")
            }.bind(this)), n.extend(this._$, {
                form: t,
                textarea: i,
                sendButton: s
            }), this.__validate(), this.setTimeout(function () {
                i.focus()
            }), e
        },
        _removeContent: function () {
            return n.extend(this._$, {
                form: null,
                textarea: null,
                sendButton: null
            }), n.$super(this)._removeContent.apply(this, arguments)
        },
        __validate: function () {
            var e = this._$,
                t = e.textarea.val(),
                i = t.trim().length > 0;
            return i ? e.sendButton.removeClass("disabled") : e.sendButton.addClass("disabled"), i
        },
        __send: function () {
            this.__validate() && (this._$.form.addClass("loading"), this.contactUs(this._$.textarea.val())["with"](this).then(function () {
                global.emit("Notifications:AddNotification", {
                    content: _("mb_js_popups_contactus_complete"),
                    type: "information",
                    selfClosable: !0
                }), this.emit("Close")
            })["catch"](function () {
                this._$.form.removeClass("loading")
            }))
        }
    }), n["implements"](o, i("../requests/ContactUs")), e.exports = o
}, zd.core3.modules["newlibs/requests/ContactUs"] = function (e, t, i) {
    var n = i("core/utils"),
        s = i("core/SmartObject"),
        o = function () {
            this.__init__.apply(this, arguments)
        };
    n.inherits(o, s, {
        contactUs: function (e) {
            var t = {
                    message: e
                },
                n = this.__contactUsRequest;
            return n || (n = this.__contactUsRequest = new(i("core/Request"))({
                parent: this,
                url: "/help/contact-us"
            }).addListener("Destroyed", function () {
                delete this.__contactUsRequest, n = null
            }, this)), n.send(t)
        }
    }), e.exports = o
}, zd.core3.modules["core/Request"] = function (e, t, i) {
    var n = i("./utils"),
        s = i("./SmartObject"),
        o = i("./Error"),
        r = function () {
            this.__init__.apply(this, arguments)
        };
    n.inherits(r, s, {
        __init__: function (e) {
            this.values = n.extend(!0, {
                url: null,
                link: "parallel",
                type: "post",
                dataType: "json",
                maxRetry: 5,
                param: n.param,
                retryErrorCodes: {
                    "-500": 1,
                    1008: 1,
                    1022: 1
                },
                retryTimeout: 100
            }, this.values || {}, e || {}), n.$super(this).__init__.apply(this, arguments), this.__requests = []
        },
        __destroy__: function () {
            this.__requests.forEach(function (e) {
                e.abort()
            }), n.$super(this).__destroy__.apply(this, arguments)
        },
        __createXhr: function (e) {
            var t = when.defer(),
                i = t.promise,
                s = null,
                r = null,
                a = 0,
                l = function () {
                    var e = this.__requests,
                        t = e.indexOf(i);
                    t > -1 && e.splice(t, 1), 0 === e.length && this.setTimeout(function () {
                        0 === e.length && this.emit("Destroy")
                    })
                }.bind(this),
                u = function (e) {
                    return this.values.retryErrorCodes[e.code] && ++a !== this.values.maxRetry ? void(r = this.setTimeout(function () {
                        r = null, i.send()
                    }, this.values.retryTimeout)) : void t.reject(e)
                }.bind(this);
            return i.abort = function () {
                s ? s.abort() : (l(), t.reject(new o.RequestAbortError)), r && this.clearTimeout(r)
            }.bind(this), i.send = function () {
                s = $.ajax({
                    url: this.values.url,
                    type: this.values.type,
                    dataType: this.values.dataType,
                    async: !0,
                    data: this.get("param")(e),
                    success: function (e) {
                        if (s = null, e.revisions && global.emit("RevisionsManager:AddRevisions", {
                                revisions: e.revisions
                            }), void 0 !== e.occupiedSize || void 0 !== e.accountSize) {
                            var i = {};
                            void 0 !== e.occupiedSize && (i.occupiedSize = e.occupiedSize), void 0 !== e.accountSize && (i.accountSize = e.accountSize), global.emit("UsedSpace:Update", i)
                        }
                        if (e.result === !1) {
                            var r = e.error;
                            return void u(new o.ResponseError({
                                code: r.code,
                                message: r.msg || r.message,
                                details: n.extend({
                                    response: e
                                }, r.details || {})
                            }))
                        }
                        t.resolve(e)
                    },
                    error: function (e, i) {
                        return s = null, "abort" === i ? (l(), void t.reject(new o.RequestAbortError)) : void u(new o.RequestError(arguments[2]))
                    }.bind(this)
                })
            }.bind(this), i.then(function (e) {
                l()
            }.bind(this))["catch"](function (e) {
                -1 !== e.code && l()
            }), i
        },
        __createRequest: function (e) {
            var t, i = this.values.link,
                n = this.__requests;
            switch (i) {
                case "ignore":
                    t = n[0], t ? (t = this.__createXhr(e), t.abort()) : (t = this.__createXhr(e), t.send(), n.push(t));
                    break;
                case "cancel":
                    t = n[0], t && t.abort(), t = this.__createXhr(e), t.send(), n.push(t);
                    break;
                case "queue":
                    t = this.__createXhr(e);
                    var s = n[n.length - 1];
                    s ? s.then(function (e) {
                        t.send()
                    }.bind(this))["catch"](function (e) {
                        t.send()
                    }.bind(this)) : t.send(), n.push(t);
                    break;
                case "parallel":
                    t = this.__createXhr(e), t.send(), n.push(t)
            }
            return t
        },
        send: function (e) {
            return global.emit("Freeze:Loading", {
                name: "om.Request"
            }), e = e || {}, when(this.__createRequest(e)).then(function (e) {
                return global.emit("Freeze:Loaded", {
                    name: "om.Request"
                }), e
            })["catch"](function (e) {
                return global.emit("Freeze:Loaded", {
                    name: "om.Request"
                }), when.reject(e)
            })
        }
    }), e.exports = r
}, zd.core3.modules["core/Error"] = function (e, t, i) {
    var n = (i("./utils"), function (e) {
        e.code = e.code || -2, e.message = e.message || e.msg || "Unknown error", e.details = e.details || {}, global.emit("ErrorController:FireError", {
            error: e
        });
        var t = new Error(e.message);
        return t.code = e.code, t.details = e.details, t.body = e, t.stopPropagation = function () {
            t.body.prevented = !0
        }, t
    });
    n.prototype = Error.prototype;
    var s = function (e) {
            return new n(e)
        },
        o = function (e) {},
        r = function () {
            var e = {
                code: -1,
                message: "Aborted",
                details: {}
            };
            return new n(e)
        },
        a = function () {
            var e = {
                code: -701,
                message: "FB auth failed",
                details: {}
            };
            return new n(e)
        };
    n.ResponseError = s, n.RequestError = o, n.RequestAbortError = r, n.FbAuthFailedError = a, e.exports = n
}, zd.core3.modules["newlibs/tabs/index/popups/Auth"] = function (e, t, i) {
    var n = i("core/utils"),
        s = i("../../../popups/Auth"),
        o = function () {
            return s.apply(this, arguments)
        };
    n.inherits(o, s, {
        onAuthWidgetSigninComplete: function () {
            window.location.href = "/"
        }
    }), e.exports = o
}, zd.core3.modules["newlibs/popups/Auth"] = function (e, t, i) {
    var n = i("core/utils"),
        s = i("../ui/UIPopup"),
        o = function (e) {
            var t = o.instance;
            return t ? t.emit("Update", e) : (this.__init__.apply(this, arguments), t = o.instance = this), t
        };
    n.inherits(o, s, {
        __init__: function () {
            this.values = n.extend({
                className: "auth-popup",
                titleTemplate: zd.core2.getTemplate("newcore.popups.Auth.title"),
                contentTemplate: zd.core2.getTemplate("newcore.popups.Auth.content"),
                location: null,
                mode: null
            }, this.values || {}), this.__authWidget = new(i("../widgets/auth/Auth"))({
                parent: this
            }).addListener("Change:mode", this.onAuthWidgetChangeMode, this).addListener("SigninComplete", this.onAuthWidgetSigninComplete, this), n.$super(this).__init__.apply(this, arguments), this.addListener("Change:mode", this.onChangeMode, this);
            var e = this.get("mode");
            e && this.onChangeMode({
                oldValue: null,
                newValue: e
            })
        },
        __destroy__: function () {
            delete o.instance, n.$super(this).__destroy__.apply(this, arguments)
        },
        _setTitleWrapper: function () {
            this.__authWidget.emit("Update", {
                titleWrapper: this._$.title
            }), n.$super(this)._setTitleWrapper.apply(this, arguments)
        },
        _removeTitle: function () {
            this.__authWidget.emit("Update", {
                titleWrapper: null
            }), n.$super(this)._removeTitle.apply(this, arguments)
        },
        _setContentWrapper: function () {
            this.__authWidget.emit("Update", {
                contentWrapper: this._$.content
            }), n.$super(this)._setContentWrapper.apply(this, arguments)
        },
        _removeContent: function () {
            this.__authWidget.emit("Update", {
                contentWrapper: null
            }), n.$super(this)._removeContent.apply(this, arguments)
        },
        onChangeMode: function (e) {
            this.__authWidget.emit("Update", {
                mode: e.newValue
            })
        },
        onAuthWidgetChangeMode: function (e) {
            this.emit("Update", {
                mode: e.newValue
            }), this.emit("Center")
        },
        onAuthWidgetSigninComplete: function () {
            this.emit("SigninComplete")
        }
    }), e.exports = o
}, zd.core3.modules["newlibs/widgets/auth/Auth"] = function (e, t, i) {
    var n = i("core/utils"),
        s = i("core/SmartObject"),
        o = function () {
            this.__init__.apply(this, arguments)
        };
    n.inherits(o, s, {
        __init__: function (e) {
            this.values = n.extend({
                mode: null,
                email: null,
                widget: null,
                titleWrapper: null,
                contentWrapper: null
            }, this.values || {}), this.__constructors = {
                Signup: i("./Signup"),
                Signin: i("./Signin"),
                ForgotPasswordStep1: i("./ForgotPasswordStep1"),
                ForgotPasswordStep2: i("./ForgotPasswordStep2"),
                ResetPassword: i("./ResetPassword"),
                LinkEmailFB: i("./LinkEmailFB"),
                LinkEmailOtherFB: i("./LinkEmailOtherFB")
            }, n.$super(this).__init__.apply(this, arguments), this.addListener("Change:mode", this.onChangeMode, this).addListener("Change:widget", this.onChangeWidget, this).addListener("Change:titleWrapper", this.onChangeTitleWrapper, this).addListener("Change:contentWrapper", this.onChangeContentWrapper, this);
            var t = this.get("mode");
            null !== t && this.onChangeMode({
                oldValue: null,
                newValue: t
            }), window.auth = this
        },
        _signin: function (e) {
            var t = e;
            t.preferences = e.accountInfo.preferences, zd.config.emit("Update", n.extend({
                isLogged: 1,
                profile: e
            })), this.emit("SigninComplete")
        },
        onChangeMode: function (e) {
            var t = e.newValue;
            if (null === t) return void this.emit("Update", {
                widget: null
            });
            var i, n = {
                    parent: this,
                    email: this.get("email")
                },
                s = this.__constructors;
            switch (t) {
                case "signup":
                    i = new s.Signup(n).addListener("SignupComplete", this.onSigninComplete, this);
                    break;
                case "forgotPasswordStep1":
                    i = new s.ForgotPasswordStep1(n);
                    break;
                case "forgotPasswordStep2":
                    i = new s.ForgotPasswordStep2(n);
                    break;
                case "resetPassword":
                    if (!zd.config.get("validHash")) return global.emit("Notifications:AddNotification", {
                        content: _("mb_js_auth_error1441"),
                        type: "error",
                        selfClosable: !1,
                        okButton: !0
                    }), this.setTimeout(function () {
                        this.emit("Update", {
                            mode: "forgotPasswordStep1"
                        })
                    }), !1;
                    i = new s.ResetPassword(n);
                    break;
                case "linkEmailFB":
                    i = new s.LinkEmailFB(n).addListener("LinkComplete", this.onLinkComplete, this);
                    break;
                case "linkEmailOtherFB":
                    i = new s.LinkEmailOtherFB(n).addListener("SignupComplete", this.onSignupComplete, this);
                    break;
                default:
                    i = new s.Signin(n).addListener("SigninComplete", this.onSigninComplete, this)
            }
            this.emit("Update", {
                widget: i
            })
        },
        onChangeWidget: function (e) {
            var t = e.newValue,
                i = e.oldValue;
            i && i.emit("Destroy"), t && t.addListener("Change:email", this.onWidgetChangeEmail, this).addListener("Route", this.onWidgetRoute, this).emit("Update", {
                titleWrapper: this.get("titleWrapper"),
                contentWrapper: this.get("contentWrapper")
            })
        },
        onChangeTitleWrapper: function (e) {
            var t = this.get("widget");
            t && t.emit("Update", {
                titleWrapper: e.newValue
            })
        },
        onChangeContentWrapper: function (e) {
            var t = this.get("widget");
            t && t.emit("Update", {
                contentWrapper: e.newValue
            })
        },
        onWidgetChangeEmail: function (e) {
            this.emit("Update", {
                email: e.newValue
            })
        },
        onWidgetRoute: function (e, t) {
            this.emit("Update", {
                mode: e
            }), this.get("widget").emit("Update", t)
        },
        onLinkComplete: function (e) {
            this._signin(e)
        },
        onSignupComplete: function (e) {
            this._signin(e)
        },
        onSigninComplete: function (e) {
            this._signin(e)
        }
    }), e.exports = o
}, zd.core3.modules["newlibs/widgets/auth/Signup"] = function (e, t, i) {
    var n = i("core/utils"),
        s = i("./Abstract"),
        o = function () {
            this.__init__.apply(this, arguments)
        };
    n.inherits(o, s, {
        __init__: function (e) {
            this.values = n.extend({
                titleTemplate: zd.core2.getTemplate("newcore.widgets.auth.Signup.title"),
                contentTemplate: zd.core2.getTemplate("newcore.widgets.auth.Signup.content"),
                loadingPhrase: _("mb_js_index_signup_creating_acc"),
                passValue: ""
            }, this.values || {});
            var t = this._$ = this._$ || {};
            t.email = t.email || null, n.$super(this).__init__.apply(this, arguments), this.addListener("Change:email", this.onChangeEmail, this), this._getUrlData(zd.config.get("locations.popups.auth.SIGN_UP"))["with"](this).then(function (e) {
                this.emit("Update", {
                    email: e[0]
                })
            })["catch"](function () {})
        },
        _createContent: function () {
            var e = n.$super(this)._createContent.apply(this, arguments);
            return this._form = e.find("form").on("submit", this.onFormSubmit.bind(this)), this._emailField = {
                wrapper: e.find("[data-id=emailWrapper]"),
                field: e.find("[data-id=email]").textinput().on("change", function (e) {
                    var t = this._emailField.field.val();
                    /\s/.test(t) && (t = t.replace(/\s/g, ""), this._emailField.field.val(t));
                    var i = n.ui.getInputSelection(this._emailField.field);
                    this.emit("Update", {
                        email: t
                    }), n.ui.setInputSelection(this._emailField.field, i.start, i.end), this.__validate()
                }.bind(this)).on("keydown", function (e) {
                    32 === e.keyCode && e.preventDefault()
                }.bind(this)).on("focus", function () {
                    this._emailField.wrapper.addClass("focus")
                }.bind(this)).on("blur", function () {
                    this._emailField.wrapper.removeClass("focus")
                }.bind(this))
            }, this._$.email = this._emailField.field, this.setTimeout(function () {
                this.__validate();
                var e = this._emailField.field,
                    t = e.val();
                e.trigger("blur").trigger("focus"), n.ui.setInputSelection(e, 0, t.length)
            }, 100), this._passwordVisibleField = {
                wrapper: e.find("[data-id=passwordVisibleWrapper]").hide(),
                field: e.find("[data-id=passwordVisible]").textinput().on("focus", function () {
                    this._passwordVisibleField.wrapper.addClass("focus")
                }.bind(this)).on("blur", function () {
                    this._passwordVisibleField.wrapper.removeClass("focus")
                }.bind(this)).on("change", function () {
                    this.emit("Update", {
                        passValue: this._passwordVisibleField.field.val()
                    }), this.__validate()
                }.bind(this))
            }, this._passwordInvisibleField = {
                wrapper: e.find("[data-id=passwordInvisibleWrapper]"),
                field: e.find("[data-id=passwordInvisible]").textinput().on("focus", function () {
                    this._passwordInvisibleField.wrapper.addClass("focus")
                }.bind(this)).on("blur", function () {
                    this._passwordInvisibleField.wrapper.removeClass("focus")
                }.bind(this)).on("change", function () {
                    this.emit("Update", {
                        passValue: this._passwordInvisibleField.field.val()
                    }), this.__validate()
                }.bind(this))
            }, this._passwordTypeCheckbox = e.find("[data-id=hidePass]").on("change", function () {
                var e, t = this._passwordTypeCheckbox.is(":checked"),
                    i = this._passwordVisibleField,
                    s = this._passwordInvisibleField,
                    o = i.field,
                    r = s.field;
                t ? (i.wrapper.hide(), s.wrapper.show(), e = n.ui.getInputSelection(o), r.val(o.val()).focus(), n.ui.setInputSelection(r, e.start, e.end)) : (s.wrapper.hide(), i.wrapper.show(), e = n.ui.getInputSelection(r), o.val(r.val()).focus(), n.ui.setInputSelection(o, e.start, e.end))
            }.bind(this)), this._captchaField = new(i("../../ui/UICaptcha"))({
                parent: this,
                wrapper: e.find("[data-id=captcha]")
            }).addListener("Change:value", function () {
                this.__validate()
            }, this), this._facebookLogin = e.find("[data-id=facebookLogin]").on("click", function (e) {
                e.preventDefault(), this.facebookSignup().then(function (e) {
                    this.emit("SignupComplete", e)
                })["catch"](function (e) {
                    var t = e.details;
                    switch (e.code) {
                        case 1406:
                            t.username && (t.email = t.username), this.emit("Route", "linkEmailFB", t), e.stopPropagation();
                            break;
                        case 1407:
                            t.username && (t.email = t.username), this.emit("Route", "linkEmailOtherFB", t), e.stopPropagation()
                    }
                })
            }.bind(this)), this._submitButton = e.find("[data-id=submit]"), this.__setEmail(), this.__validate(), e
        },
        _removeContent: function () {
            this._emailField && this._emailField.field.textinput("destroy"), this._passwordVisibleField && this._passwordVisibleField.field.textinput("destroy"), this._passwordInvisibleField && this._passwordInvisibleField.field.textinput("destroy"), n.$super(this)._removeContent.apply(this, arguments)
        },
        __setEmail: function () {
            var e = this.get("email"),
                t = this._$.email;
            t && (e ? t.val(e) : t.val(""))
        },
        __validate: function () {
            var e = this._emailField.field.val().trim(),
                t = this.get("passValue"),
                i = this._captchaField;
            return e.length > 0 && t.length > 0 && i.validate() ? (this._submitButton.removeClass("disabled"), !0) : (this._submitButton.addClass("disabled"), !1)
        },
        onFormSubmit: function (e) {
            e.preventDefault(), this.__validate() && 0 === this.get("status") && (this.emit("Update", {
                status: 1
            }), this._passwordInvisibleField.field.val(this.get("passValue")), this.authSignup(this._form)["with"](this).then(function (e) {
                this.emit("SignupComplete", e)
            })["catch"](function (e) {
                var t = e.details,
                    i = t.response || {};
                switch (i.guid && (this._captchaField.emit("Update", {
                    guid: i.guid,
                    url: i.captchaUrl
                }), this.__validate()), e.code) {
                    case 107:
                    case 1471:
                    case 1473:
                        this._captchaField.emit("IncorrectCaptcha"), e.stopPropagation();
                        break;
                    case 1403:
                        this._emailField.field.inputError({
                            message: _("mb_js_auth_error_invalid_email_address"),
                            position: "right"
                        }), e.stopPropagation();
                        break;
                    case 1404:
                        t.username && this._emailField.field.val(t.username), this._emailField.field.inputError({
                            message: _("mb_js_auth_error_email_already_registered"),
                            position: "right"
                        }), e.stopPropagation();
                        break;
                    case 1405:
                        this._passwordInvisibleField.field.inputError({
                            message: _("mb_js_auth_error_too_short_password"),
                            linkedFields: [this._passwordVisibleField.field],
                            position: "right"
                        }), e.stopPropagation()
                }
            }).then(function () {
                this.emit("Update", {
                    status: 0
                })
            }))
        },
        onChangeEmail: function () {
            this.__setEmail()
        }
    }), n["implements"](o, i("../../requests/auth/AuthSignup"), i("../../requests/facebook/FacebookSignup")), e.exports = o
}, zd.core3.modules["newlibs/widgets/auth/Abstract"] = function (e, t, i) {
    var n = i("core/utils"),
        s = i("core/SmartObject"),
        o = function () {
            this.__init__.apply(this, arguments)
        };
    n.inherits(o, s), n.extend(o.prototype, {
        __init__: function () {
            this.values = n.extend({
                options: null,
                titleTemplate: null,
                contentTemplate: null,
                titleWrapper: null,
                contentWrapper: null,
                email: null,
                status: 0
            }, this.values || {}), this._wrapper = $("<div></div>"), this._title = null, this._content = null, this._loader = null, n.$super(this).__init__.apply(this, arguments), this.addListener("Change:status", this.onChangeStatus, this).addListener("Change:titleTemplate", this.onChangeTitleTemplate, this).addListener("Change:contentTemplate", this.onChangeContentTemplate, this).addListener("Change:titleWrapper", this.onChangeTitleWrapper, this).addListener("Change:contentWrapper", this.onChangeContentWrapper, this);
            var e = this.get("titleTemplate");
            null !== e && this.onChangeTitleTemplate({
                oldValue: null,
                newValue: e
            });
            var t = this.get("contentTemplate");
            null !== t && this.onChangeContentTemplate({
                oldValue: null,
                newValue: t
            });
            var i = this.get("status");
            null !== i && this.onChangeStatus({
                oldValue: null,
                newValue: i
            })
        },
        __destroy__: function () {
            this._title && this._removeTitle(), this._content && this._removeContent(), n.$super(this).__destroy__.apply(this, arguments)
        },
        _getUrlData: function (e) {
            var t = when.defer(),
                i = null,
                n = this.setTimeout(function () {
                    this.clearTimeout(i), t.reject()
                }, 500);
            return function s() {
                var o = 0 === e.indexOf("/") ? window.location.pathname : window.location.hash;
                if (-1 === o.indexOf(e)) return void(i = this.setTimeout(s));
                this.clearTimeout(n);
                var r = o.replace(e, "").replace(/^\//, ""),
                    a = decodeURIComponent(r).split("/");
                return 0 === a.length || a.length > 0 && !a[0] ? void t.reject(new Error("Url params is empty")) : void t.resolve(a)
            }.call(this), t.promise
        },
        _createTitle: function () {
            return this.get("titleTemplate").compile()
        },
        _removeTitle: function () {
            this._title.remove(), this._title = null
        },
        _createContent: function () {
            return this.get("contentTemplate").compile()
        },
        _removeContent: function () {
            this._content.remove(), this._content = null
        },
        __setTitleWrapper: function () {
            var e = this._title;
            if (e) {
                var t = this.get("titleWrapper") || this._wrapper;
                t.append(e)
            }
        },
        __setContentWrapper: function () {
            var e = this._content;
            if (e) {
                var t = this.get("contentWrapper") || this._wrapper;
                t.append(e)
            }
        },
        onChangeStatus: function (e) {
            var t = this.get("loadingPhrase");
            t && (this._loader && (this._loader.remove(), this._loader = null), 1 === e.newValue && (this._loader = zd.core2.getTemplate("newcore.widgets.auth.Abstract.loader").setDictionary({
                message: t
            }).compile().appendTo(this._content)))
        },
        onChangeTitleTemplate: function (e) {
            var t = this._title;
            t && this._removeTitle(), e.newValue && (this._title = this._createTitle(), this.__setTitleWrapper())
        },
        onChangeContentTemplate: function (e) {
            var t = this._content;
            t && this._removeContent(), e.newValue && (this._content = this._createContent(), this.__setContentWrapper())
        },
        onChangeTitleWrapper: function () {
            this.__setTitleWrapper()
        },
        onChangeContentWrapper: function () {
            this.__setContentWrapper()
        }
    }), e.exports = o
}, zd.core3.modules["newlibs/ui/UICaptcha"] = function (e, t, i) {
    var n = i("core/utils"),
        s = i("core/View"),
        o = {},
        r = function () {
            this.__init__.apply(this, arguments)
        };
    n.inherits(r, s, {
        __init__: function () {
            var e = function () {
                for (var e in o) return o[e];
                return null
            }();
            e || this.captchaNeedToShow()["with"](this).then(function (e) {
                var t = e.guid,
                    i = e.captchaUrl;
                t && i && this.emit("Update", {
                    guid: t,
                    url: i
                })
            })["catch"](function (e) {});
            var t = e ? e.get("url") : null,
                i = e ? e.get("guid") : null;
            this.values = n.extend({
                visible: !1,
                template: zd.core2.getTemplate("newcore.ui.UICaptcha.template"),
                guid: i,
                url: t,
                value: null
            }, this.values || {});
            var s = this._$ = this._$ || {};
            s.input = s.field || null, s.image = s.image || null, s.guid = s.guid || null, s.updater = s.updater || null, n.$super(this).__init__.apply(this, arguments), o[this.get("id")] = this, this.addListener("Destroyed", function () {
                delete o[this.get("id")]
            }), this.addListener("Change", function (e) {
                var t = e.newValue.url,
                    i = e.newValue.guid,
                    n = {};
                if (void 0 !== t || void 0 !== i) {
                    void 0 !== t && (n.url = t), void 0 !== i && (n.guid = i);
                    for (var s in o) o[s].emit("Update", n)
                }
            }), this.addListener("Change:url", this.onChangeUrl, this).addListener("Change:guid", this.onChangeGuid, this).addListener("IncorrectCaptcha", this.onIncorrectCaptcha, this), t && this.onChangeUrl({
                oldValue: null,
                newValue: t
            }), t && this.onChangeGuid({
                oldValue: null,
                newValue: i
            })
        },
        onChangeWidget: function (e) {
            var t = this._$,
                i = e.newValue;
            i ? n.extend(t, {
                field: i.find("[data-id=field]").textinput(),
                image: i.find("[data-id=image]"),
                guid: i.find("[data-id=guid]"),
                updater: i.find("[data-id=updater]")
            }) : (t.field.textinput("destroy"), n.extend(t, {
                field: null,
                image: null,
                guid: null,
                updater: null
            })), n.$super(this).onChangeWidget.apply(this, arguments), i && (t.field.on("change", function (e) {
                this.emit("Update", {
                    value: t.field.val().trim()
                })
            }.bind(this)), t.updater.on("click", function () {
                this.captchaReload()["with"](this).then(function (e) {
                    this.emit("Update", {
                        url: e.imageUrl,
                        guid: e.guid
                    })
                })["catch"](function () {})
            }.bind(this)), this.__setImageUrl(), this.__setGuid())
        },
        __setImageUrl: function () {
            var e = this.get("widget"),
                t = this.get("url"),
                i = this._$;
            e && (t ? (i.image.attr("src", t), this.emit("Update", {
                visible: !0
            }), i.field.val("").trigger("change")) : (i.image.removeAttr("src"), this.emit("Update", {
                visible: !1
            })))
        },
        __setGuid: function () {
            var e = this.get("widget"),
                t = this.get("guid"),
                i = this._$;
            e && (t ? i.guid.val(t) : i.guid.val(""))
        },
        onChangeUrl: function (e) {
            this.__setImageUrl()
        },
        onChangeGuid: function (e) {
            this.__setGuid()
        },
        onIncorrectCaptcha: function (e, t) {
            var i = this._$;
            i.field.val("").trigger("change").inputError({
                message: _("mb_js_libs_ui_uicaptcha_error_symbols_entered_incorrectly"),
                position: "right",
                once: !0
            })
        },
        validate: function () {
            var e = this.get("visible");
            if (!e) return !0;
            var t = this.get("value");
            return "" !== t
        },
        getValues: function () {
            var e = this.get("visible");
            return e ? {
                guid: this.get("guid"),
                captcha: this.get("value")
            } : {}
        }
    }), n["implements"](r, i("../requests/captcha/CaptchaReload"), i("../requests/captcha/CaptchaNeedToShow")), e.exports = r
}, zd.core3.modules["newlibs/requests/captcha/CaptchaReload"] = function (e, t, i) {
    var n = i("core/utils"),
        s = i("core/SmartObject"),
        o = function () {
            this.__init__.apply(this, arguments)
        };
    n.inherits(o, s, {
        captchaReload: function () {
            var e = this.__captchaReloadRequest;
            return e || (e = this.__captchaReloadRequest = new(i("core/Request"))({
                parent: this,
                url: "/captcha/get"
            }).addListener("Destroyed", function () {
                delete this.__captchaReloadRequest, e = null
            }, this)), e.send()
        }
    }), e.exports = o
}, zd.core3.modules["newlibs/requests/captcha/CaptchaNeedToShow"] = function (e, t, i) {
    var n = i("core/utils"),
        s = i("core/SmartObject"),
        o = function () {
            this.__init__.apply(this, arguments)
        };
    n.inherits(o, s, {
        captchaNeedToShow: function () {
            var e = this.__captchaNeedToShowRequest;
            return e || (e = this.__captchaNeedToShowRequest = new(i("core/Request"))({
                parent: this,
                url: "/captcha/need-to-show"
            }).addListener("Destroyed", function () {
                delete this.__captchaNeedToShowRequest, e = null
            }, this)), e.send()
        }
    }), e.exports = o
}, zd.core3.modules["newlibs/requests/auth/AuthSignup"] = function (e, t, i) {
    var n = i("core/utils"),
        s = i("core/SmartObject"),
        o = function () {
            this.__init__.apply(this, arguments)
        };
    n.inherits(o, s, {
        authSignup: function (e) {
            return new(i("../IframeRequest"))({
                parent: this
            }).iframeRequest({
                form: e,
                action: "/auth/signup"
            })
        }
    }), e.exports = o
}, zd.core3.modules["newlibs/requests/IframeRequest"] = function (e, t, i) {
    var n = i("core/utils"),
        s = i("core/SmartObject"),
        o = i("core/Error"),
        r = function () {
            this.__init__.apply(this, arguments)
        };
    n.inherits(r, s, {
        iframeRequest: function (e) {
            global.emit("Freeze:Loading");
            var t = when.defer(),
                i = e.form,
                s = e.action,
                r = function () {
                    this.removeListener("Destroyed", a, this), i.removeAttr("target"), i.removeAttr("action"), i.removeAttr("method"), this.setTimeout(function () {
                        u.remove(), global.emit("Freeze:Loaded")
                    })
                }.bind(this),
                a = function () {
                    u[0].onload = function () {}, u[0].onerror = function () {}, r()
                };
            this.addListener("Destroyed", a, this);
            var l = n.uid(),
                u = $("<iframe ></iframe>").attr("id", l).attr("name", l).css({
                    width: 0,
                    height: 0,
                    display: "block"
                }).appendTo($document);
            return i.attr("target", l), i.attr("action", s), i.attr("method", "post"), i[0].submit(), u[0].onload = function () {
                r();
                var e;
                try {
                    for (var i = u.contents().find("body")[0], s = i.childNodes, a = 0; s[a];) s[a].tagName ? i.removeChild(s[a]) : a++;
                    e = JSON.parse(i.innerHTML.trim())
                } catch (l) {
                    return void t.reject(new o.RequestError("Response parse failed"))
                }
                if (e.result) t.resolve(e);
                else {
                    var d = e.error;
                    d.details = n.extend({
                        response: e
                    }, d.details || {}), t.reject(new o.ResponseError(d))
                }
            }, u[0].onerror = function () {
                r(), t.reject(new o.RequestError("Iframe load failed"))
            }, t.promise
        }
    }), e.exports = r
}, zd.core3.modules["newlibs/requests/facebook/FacebookSignup"] = function (e, t, i) {
    var n = i("core/utils"),
        s = i("core/SmartObject"),
        o = function () {
            this.__init__.apply(this, arguments)
        };
    n.inherits(o, s, {
        facebookSignup: function (e) {
            return new(i("./FacebookAuth"))({
                parent: this
            }).facebookAuth()["with"](this).then(function (t) {
                var s = this.__facebookSignupRequest;
                s || (s = this.__facebookSignupRequest = new(i("core/Request"))({
                    parent: this,
                    param: $.param,
                    url: "/auth/signup"
                }).addListener("Destroyed", function () {
                    delete this.__facebookSignupRequest, s = null
                }, this));
                var o = n.extend({
                    fbSignedRequest: t.fbSignedRequest,
                    dontLogin: zd.config.get("desktopFbAuthData") ? 1 : 0,
                    force: 0
                }, e || {});
                return s.send(o)
            })
        }
    }), e.exports = o
}, zd.core3.modules["newlibs/requests/facebook/FacebookAuth"] = function (e, t, i) {
    var n = null;
    $(window).on("unload closefbauth", function () {
        n && !n.closed && n.close()
    });
    var s = i("core/utils"),
        o = i("core/SmartObject"),
        r = i("core/Error"),
        a = function () {
            this.__init__.apply(this, arguments)
        };
    s.inherits(a, o, {
        facebookAuth: function (e) {
            var t = new(i("./FacebookLoadApi"))({
                    parent: this
                }).facebookLoadApi(),
                s = !1,
                o = function () {
                    $(window).trigger("closefbauth"), s = !0
                };
            this.addListener("Destroyed", o, this);
            var a = function () {
                if (n && !n.closed) return void n.focus();
                FB.init({
                    appId: zd.config.get("facebookAppId"),
                    status: !1,
                    xfbml: !1
                });
                var e = when.defer(),
                    t = window.open;
                return window.open = function () {
                    return n = t.apply(window, arguments)
                }, FB.login(function (t) {
                    t.authResponse ? FB.api("/me", function (i) {
                        if (this.removeListener("Destroyed", o, this), i.error) e.reject(new r.ResponseError(i.error));
                        else {
                            if (s) return void e.reject(new r.RequestAbortError);
                            e.resolve({
                                fbSignedRequest: t.authResponse.signedRequest,
                                email: i.email
                            })
                        }
                    }.bind(this)) : e.reject(new r.FbAuthFailedError)
                }.bind(this), {
                    scope: "email,user_birthday,read_friendlists"
                }), window.open = t, e.promise
            }.bind(this);
            return when.isPromiseLike(t) ? t.then(a) : a()
        }
    }), e.exports = a
}, zd.core3.modules["newlibs/requests/facebook/FacebookLoadApi"] = function (e, t, i) {
    var n = null,
        s = !1,
        o = function () {
            this.winId = Date.now().toString(16), this.win = window.open("/blank", this.winId, "width=475,height=183,scrollbars=1,location=1,toolbar=0")
        };
    o.prototype.init = function () {
        var e = window.open,
            t = (this.winId, this.win);
        window.open = function () {
            if (t && !t.closed) {
                var i = arguments[2].split(",").slice(0, 2).map(function (e) {
                    return parseInt(e.split("=")[1], 10)
                });
                return t.resizeTo(i[0], i[1]), t.location.href = arguments[0], t
            }
            return e.apply(window, arguments)
        }.bind(this), window.setTimeout(function () {
            window.open = e
        }, 500)
    };
    var r = i("core/utils"),
        a = i("core/SmartObject"),
        l = function () {
            this.__init__.apply(this, arguments)
        };
    r.inherits(l, a, {
        facebookLoadApi: function (e) {
            if (n) return n.promise;
            if (s) return null;
            var t = e ? null : new o;
            return n = when.defer(), window.fbAsyncInit = function () {
                    delete window.fbAsyncInit, t && t.init(), FB.init({
                        appId: zd.config.get("facebookAppId"),
                        status: !1,
                        xfbml: !1
                    }), FB.Event.subscribe("edge.create", function (e, t) {
                        global.emit("Facebook:Like", {
                            link: e
                        })
                    }), n.resolve(), n = null, s = !0
                },
                function (e, t, i) {
                    var n, s = e.getElementsByTagName(t)[0];
                    e.getElementById(i) || (n = e.createElement(t), n.id = i, n.src = "//connect.facebook.net/en_US/all.js", s.parentNode.insertBefore(n, s))
                }(document, "script", "facebook-jssdk"), n.promise
        }
    }), e.exports = l
}, zd.core3.modules["newlibs/widgets/auth/Signin"] = function (e, t, i) {
    var n = i("core/utils"),
        s = i("./Abstract"),
        o = function () {
            this.__init__.apply(this, arguments)
        };
    n.inherits(o, s, {
        __init__: function (e) {
            this.values = n.extend({
                titleTemplate: zd.core2.getTemplate("newcore.widgets.auth.Signin.title"),
                contentTemplate: zd.core2.getTemplate("newcore.widgets.auth.Signin.content"),
                loadingPhrase: _("mb_js_index_signin_logging")
            }, this.values || {});
            var t = this._$ = this._$ || {};
            t.email = t.email || null, n.$super(this).__init__.apply(this, arguments), this.addListener("Change:email", this.onChangeEmail, this), this._getUrlData(zd.config.get("locations.popups.auth.SIGN_IN"))["with"](this).then(function (e) {
                this.emit("Update", {
                    email: e[0]
                })
            })["catch"](function () {})
        },
        _createContent: function () {
            var e = n.$super(this)._createContent.apply(this, arguments);
            return this._form = e.find("form").on("submit", this.onFormSubmit.bind(this)), this._emailField = {
                wrapper: e.find("[data-id=emailWrapper]"),
                field: e.find("[data-id=email]").textinput().on("change", function (e) {
                    var t = this._emailField.field.val();
                    /\s/.test(t) && (t = t.replace(/\s/g, ""), this._emailField.field.val(t));
                    var i = n.ui.getInputSelection(this._emailField.field);
                    this.emit("Update", {
                        email: t
                    }), n.ui.setInputSelection(this._emailField.field, i.start, i.end), this.__validate()
                }.bind(this)).on("keydown", function (e) {
                    32 === e.keyCode && e.preventDefault()
                }.bind(this)).on("focus", function () {
                    this._emailField.wrapper.addClass("focus")
                }.bind(this)).on("blur", function () {
                    this._emailField.wrapper.removeClass("focus")
                }.bind(this))
            }, this._$.email = this._emailField.field, this.setTimeout(function () {
                var e = this._emailField.field,
                    t = e.val();
                this.emit("Update", {
                    email: t
                }), this.__validate(), e.trigger("blur").trigger("focus"), n.ui.setInputSelection(e, 0, t.length)
            }, 100), this._passwordField = {
                wrapper: e.find("[data-id=passwordWrapper]"),
                field: e.find("[data-id=password]").textinput().on("focus", function () {
                    this._passwordField.wrapper.addClass("focus")
                }.bind(this)).on("blur", function () {
                    this._passwordField.wrapper.removeClass("focus")
                }.bind(this)).on("keyup", function () {
                    this.__validate()
                }.bind(this))
            }, this._captchaField = new(i("../../ui/UICaptcha"))({
                parent: this,
                wrapper: e.find("[data-id=captcha]")
            }).addListener("Change:value", function () {
                this.__validate()
            }, this), this._facebookLogin = e.find("[data-id=facebookLogin]").on("click", function (e) {
                e.preventDefault(), this.facebookSignup().then(function (e) {
                    this.emit("SigninComplete", e)
                })["catch"](function (e) {
                    var t = e.details;
                    switch (e.code) {
                        case 1406:
                            t.username && (t.email = t.username), this.emit("Route", "linkEmailFB", t), e.stopPropagation();
                            break;
                        case 1407:
                            t.username && (t.email = t.username), this.emit("Route", "linkEmailOtherFB", t), e.stopPropagation()
                    }
                })
            }.bind(this)), this._rememberMeCheckbox = void 0 !== this._rememberMeCheckbox ? this._rememberMeCheckbox : e.find("[data-id=rememberMe]").on("change", function (e) {
                var t = $(e.currentTarget).is(":checked");
                localStorage && localStorage.setItem("Auth:rememberMe", t ? "1" : "0")
            }), this._rememberMeCheckbox && localStorage && "1" === localStorage.getItem("Auth:rememberMe") && this._rememberMeCheckbox.attr("checked", "checked"), this._submitButton = e.find("[data-id=submit]"), this.__setEmail(), this.__validate(), e
        },
        _removeContent: function () {
            this._emailField && this._emailField.field.textinput("destroy"), this._passwordField && this._passwordField.field.textinput("destroy"), n.$super(this)._removeContent.apply(this, arguments)
        },
        __setEmail: function () {
            var e = this.get("email"),
                t = this._$.email;
            t && (e ? t.val(e) : t.val(""))
        },
        __validate: function () {
            var e = (this._emailField.field.val() || "").trim(),
                t = (this._passwordField.field.val() || "").trim(),
                i = this._captchaField;
            return e.length > 0 && t.length > 0 && i.validate() ? (this._submitButton.removeClass("disabled"), !0) : (this._submitButton.addClass("disabled"), !1)
        },
        onFormSubmit: function (e) {
            e.preventDefault(), this.__validate() && 0 === this.get("status") && (this.emit("Update", {
                status: 1
            }), this.authSignin(this._form)["with"](this).then(function (e) {
                this.emit("SigninComplete", e)
            })["catch"](function (e) {
                var t = e.details,
                    i = t.response || {};
                switch (i.guid && i.captchaUrl && (this._captchaField.emit("Update", {
                    guid: i.guid,
                    url: i.captchaUrl
                }), this.__validate()), e.code) {
                    case 107:
                    case 1471:
                    case 1473:
                        this._captchaField.emit("IncorrectCaptcha"), e.stopPropagation();
                        break;
                    case 100:
                        this._emailField.field.inputError({
                            message: _("mb_js_auth_error_mail_not_registered"),
                            position: "right"
                        }), e.stopPropagation();
                        break;
                    case 1403:
                        this._emailField.field.inputError({
                            message: _("mb_js_auth_error_invalid_email_address"),
                            position: "right"
                        }), e.stopPropagation();
                        break;
                    case 1404:
                        t.username && this._emailField.field.val(t.username), this._emailField.field.inputError({
                            message: _("mb_js_auth_error_email_already_registered"),
                            position: "right"
                        }), e.stopPropagation();
                        break;
                    case 106:
                    case 1405:
                        this._passwordField.field.inputError({
                            message: _("mb_js_auth_error_wrong_password"),
                            position: "right"
                        }), e.stopPropagation()
                }
            }).then(function () {
                this.emit("Update", {
                    status: 0
                })
            }))
        },
        onChangeEmail: function () {
            this.__setEmail()
        }
    }), n["implements"](o, i("../../requests/auth/AuthSignin"), i("../../requests/facebook/FacebookSignup")), e.exports = o
}, zd.core3.modules["newlibs/requests/auth/AuthSignin"] = function (e, t, i) {
    var n = i("core/utils"),
        s = i("core/SmartObject"),
        o = function () {
            this.__init__.apply(this, arguments)
        };
    n.inherits(o, s, {
        authSignin: function (e) {
            return new(i("../IframeRequest"))({
                parent: this
            }).iframeRequest({
                form: e,
                action: "/auth/signin"
            })
        }
    }), e.exports = o
}, zd.core3.modules["newlibs/widgets/auth/ForgotPasswordStep1"] = function (e, t, i) {
    var n = i("core/utils"),
        s = i("./Abstract"),
        o = function () {
            this.__init__.apply(this, arguments)
        };
    n.inherits(o, s, {
        __init__: function (e) {
            this.values = n.extend({
                titleTemplate: zd.core2.getTemplate("newcore.widgets.auth.ForgotPasswordStep1.title"),
                contentTemplate: zd.core2.getTemplate("newcore.widgets.auth.ForgotPasswordStep1.content"),
                loadingPhrase: _("mb_js_index_forgot_searching")
            }, this.values || {});
            var t = this._$ = this._$ || {};
            t.email = t.email || null, n.$super(this).__init__.apply(this, arguments), this.addListener("Change:email", this.onChangeEmail, this), this._getUrlData(zd.config.get("locations.popups.auth.FORGOT"))["with"](this).then(function (e) {
                this.emit("Update", {
                    email: e[0]
                })
            })["catch"](function () {})
        },
        _createContent: function () {
            var e = n.$super(this)._createContent.apply(this, arguments);
            return this._form = e.find("form").on("submit", this.onFormSubmit.bind(this)), this._emailField = {
                wrapper: e.find("[data-id=emailWrapper]"),
                field: e.find("[data-id=email]").textinput().on("change", function (e) {
                    var t = this._emailField.field.val();
                    /\s/.test(t) && (t = t.replace(/\s/g, ""), this._emailField.field.val(t));
                    var i = n.ui.getInputSelection(this._emailField.field);
                    this.emit("Update", {
                        email: t
                    }), n.ui.setInputSelection(this._emailField.field, i.start, i.end), this.__validate()
                }.bind(this)).on("keydown", function (e) {
                    32 === e.keyCode && e.preventDefault()
                }.bind(this)).on("focus", function () {
                    this._emailField.wrapper.addClass("focus")
                }.bind(this)).on("blur", function () {
                    this._emailField.wrapper.removeClass("focus")
                }.bind(this))
            }, this._$.email = this._emailField.field, this.setTimeout(function () {
                var e = this._emailField.field,
                    t = e.val();
                this.emit("Update", {
                    email: t
                }), this.__validate(), e.trigger("blur").trigger("focus"), n.ui.setInputSelection(e, 0, t.length)
            }, 100), this._captchaField = new(i("../../ui/UICaptcha"))({
                parent: this,
                wrapper: e.find("[data-id=captcha]")
            }).addListener("Change:value", function () {
                this.__validate()
            }, this), this._submitButton = e.find("[data-id=submit]"), this.__setEmail(), this.__validate(), e
        },
        _removeContent: function () {
            this._emailField && this._emailField.field.textinput("destroy"), n.$super(this)._removeContent.apply(this, arguments)
        },
        __setEmail: function () {
            var e = this.get("email"),
                t = this._$.email;
            t && (e ? t.val(e) : t.val(""))
        },
        __validate: function () {
            var e = this._emailField.field.val().trim(),
                t = this._captchaField;
            return e.length > 0 && t.validate() ? (this._submitButton.removeClass("disabled"), !0) : (this._submitButton.addClass("disabled"), !0)
        },
        onFormSubmit: function (e) {
            e.preventDefault(), this.__validate() && 0 === this.get("status") && (this.emit("Update", {
                status: 1
            }), this.authForgotPassword(this._form)["with"](this).then(function () {
                this.emit("Route", "forgotPasswordStep2")
            })["catch"](function (e) {
                var t = e.details,
                    i = t.response || {};
                switch (i.guid && (this._captchaField.emit("Update", {
                    guid: i.guid,
                    url: i.captchaUrl
                }), this.__validate()), e.code) {
                    case 107:
                    case 1471:
                    case 1473:
                        this._captchaField.emit("IncorrectCaptcha"), e.stopPropagation();
                        break;
                    case 1403:
                        this._emailField.field.inputError({
                            message: _("mb_js_auth_error_invalid_email_address"),
                            position: "right"
                        }), e.stopPropagation();
                        break;
                    case 1411:
                        this._emailField.field.inputError({
                            message: _("mb_js_auth_error_mail_not_registered"),
                            position: "right"
                        }), e.stopPropagation()
                }
            }).then(function () {
                this.emit("Update", {
                    status: 0
                })
            }))
        },
        onChangeEmail: function () {
            this.__setEmail()
        }
    }), n["implements"](o, i("../../requests/auth/AuthForgotPassword")), e.exports = o
}, zd.core3.modules["newlibs/requests/auth/AuthForgotPassword"] = function (e, t, i) {
    var n = i("core/utils"),
        s = i("core/SmartObject"),
        o = function () {
            this.__init__.apply(this, arguments)
        };
    n.inherits(o, s, {
        authForgotPassword: function (e) {
            return new(i("../IframeRequest"))({
                parent: this
            }).iframeRequest({
                form: e,
                action: "/auth/forgot"
            })
        }
    }), e.exports = o
}, zd.core3.modules["newlibs/widgets/auth/ForgotPasswordStep2"] = function (e, t, i) {
    var n = i("core/utils"),
        s = i("./Abstract"),
        o = function () {
            this.__init__.apply(this, arguments)
        };
    n.inherits(o, s, {
        __init__: function () {
            this.values = n.extend({
                titleTemplate: zd.core2.getTemplate("newcore.widgets.auth.ForgotPasswordStep2.title"),
                contentTemplate: zd.core2.getTemplate("newcore.widgets.auth.ForgotPasswordStep2.content"),
                status: 0
            }, this.values || {}), n.$super(this).__init__.apply(this, arguments)
        }
    }), e.exports = o
}, zd.core3.modules["newlibs/widgets/auth/ResetPassword"] = function (e, t, i) {
    var n = i("core/utils"),
        s = i("./Abstract"),
        o = function () {
            this.__init__.apply(this, arguments)
        };
    n.inherits(o, s, {
        __init__: function (e) {
            this.values = n.extend({
                titleTemplate: zd.core2.getTemplate("newcore.widgets.auth.ResetPassword.title"),
                contentTemplate: zd.core2.getTemplate("newcore.widgets.auth.ResetPassword.content"),
                loadingPhrase: _("mb_js_index_resetpassword_applying"),
                passValue: ""
            }, this.values || {}), n.$super(this).__init__.apply(this, arguments)
        },
        _createContent: function () {
            var e = n.$super(this)._createContent.apply(this, arguments);
            return this._form = e.find("form").on("submit", this.onFormSubmit.bind(this)), this._passwordVisibleField = {
                wrapper: e.find("[data-id=passwordVisibleWrapper]").hide(),
                field: e.find("[data-id=passwordVisible]").textinput().on("focus", function () {
                    this._passwordVisibleField.wrapper.addClass("focus")
                }.bind(this)).on("blur", function () {
                    this._passwordVisibleField.wrapper.removeClass("focus")
                }.bind(this)).on("change", function () {
                    this.emit("Update", {
                        passValue: this._passwordVisibleField.field.val()
                    }), this.__validate()
                }.bind(this))
            }, this._passwordInvisibleField = {
                wrapper: e.find("[data-id=passwordInvisibleWrapper]"),
                field: e.find("[data-id=passwordInvisible]").textinput().on("focus", function () {
                    this._passwordInvisibleField.wrapper.addClass("focus")
                }.bind(this)).on("blur", function () {
                    this._passwordInvisibleField.wrapper.removeClass("focus")
                }.bind(this)).on("change", function () {
                    this.emit("Update", {
                        passValue: this._passwordInvisibleField.field.val()
                    }), this.__validate()
                }.bind(this))
            }, this.setTimeout(function () {
                this.__validate();
                var e = this._passwordInvisibleField.field,
                    t = e.val();
                e.trigger("blur").trigger("focus"), n.ui.setInputSelection(e, 0, t.length)
            }, 100), this._passwordTypeCheckbox = e.find("[data-id=hidePass]").on("change", function () {
                var e, t = this._passwordTypeCheckbox.is(":checked"),
                    i = this._passwordVisibleField,
                    s = this._passwordInvisibleField,
                    o = i.field,
                    r = s.field;
                t ? (i.wrapper.hide(), s.wrapper.show(), e = n.ui.getInputSelection(o), r.val(o.val()).focus(), n.ui.setInputSelection(r, e.start, e.end)) : (s.wrapper.hide(), i.wrapper.show(), e = n.ui.getInputSelection(r), o.val(r.val()).focus(), n.ui.setInputSelection(o, e.start, e.end))
            }.bind(this)), this._submitButton = e.find("[data-id=submit]"), this.__validate(), e
        },
        _removeContent: function () {
            this._passwordVisibleField && this._passwordVisibleField.field.textinput("destroy"), this._passwordInvisibleField && this._passwordInvisibleField.field.textinput("destroy"), n.$super(this)._removeContent.apply(this, arguments)
        },
        __validate: function () {
            var e = this.get("passValue");
            return e.length > 0 ? (this._submitButton.removeClass("disabled"), !0) : (this._submitButton.addClass("disabled"), !1)
        },
        onFormSubmit: function (e) {
            e.preventDefault(), this.__validate() && 0 === this.get("status") && (this.emit("Update", {
                status: 1
            }), this._passwordInvisibleField.field.val(this.get("passValue")), this.authResetPassword(this._form)["with"](this).then(function () {
                global.emit("Notifications:AddNotification", {
                    content: _("mb_js_auth_widgets_resetpassword_password_changed"),
                    type: "information",
                    selfClosable: !0
                }), this.emit("Route", "signin")
            })["catch"](function (e) {
                switch (e.code) {
                    case 1442:
                        this._passwordInvisibleField.field.inputError({
                            message: _("mb_js_auth_error_too_short_password"),
                            linkedFields: [this._passwordVisibleField.field],
                            position: "right"
                        }), e.stopPropagation();
                        break;
                    case 1441:
                        global.emit("Notifications:AddNotification", {
                            content: _("mb_js_auth_error1441"),
                            type: "error",
                            selfClosable: !1,
                            okButton: !0
                        }), this.emit("Route", "forgotPasswordStep1"), e.stopPropagation()
                }
            }).then(function () {
                this.emit("Update", {
                    status: 0
                })
            }))
        }
    }), n["implements"](o, i("../../requests/auth/AuthResetPassword")), e.exports = o
}, zd.core3.modules["newlibs/requests/auth/AuthResetPassword"] = function (e, t, i) {
    var n = i("core/utils"),
        s = i("core/SmartObject"),
        o = function () {
            this.__init__.apply(this, arguments)
        };
    n.inherits(o, s, {
        authResetPassword: function (e) {
            return new(i("../IframeRequest"))({
                parent: this
            }).iframeRequest({
                form: e,
                action: "/auth/reset-password"
            })
        }
    }), e.exports = o
}, zd.core3.modules["newlibs/widgets/auth/LinkEmailFB"] = function (e, t, i) {
    var n = i("core/utils"),
        s = i("./Abstract"),
        o = function () {
            this.__init__.apply(this, arguments)
        };
    n.inherits(o, s), n.extend(o.prototype, {
        __init__: function (e) {
            this.values = n.extend({
                titleTemplate: zd.core2.getTemplate("newcore.widgets.auth.LinkEmailFB.title"),
                contentTemplate: zd.core2.getTemplate("newcore.widgets.auth.LinkEmailFB.content"),
                passValue: ""
            }, this.values || {});
            var t = this._$ = this._$ || {};
            t.email = t.email || null, t.form = t.form || null, t.submitButton = t.submitButton || null, t.captcha = t.captcha || null, n.$super(this).__init__.apply(this, arguments), this.addListener("Change:email", this.onChangeEmail, this), this._getUrlData(zd.config.get("locations.popups.auth.LINK_FB"))["with"](this).then(function (e) {
                this.emit("Update", {
                    email: e[0]
                })
            })["catch"](function () {})
        },
        _createContent: function () {
            var e = n.$super(this)._createContent.apply(this, arguments),
                t = this._$;
            return n.extend(t, {
                email: e.find("[data-id=userEmail]"),
                form: e.find("form"),
                submitButton: e.find("[data-id=submit]"),
                captcha: new(i("../../ui/UICaptcha"))({
                    parent: this,
                    wrapper: e.find("[data-id=captcha]")
                })
            }), t.form.on("submit", this.onFormSubmit.bind(this)), t.captcha.addListener("Change:value", function () {
                this.__validate()
            }, this), this._passwordVisibleField = {
                wrapper: e.find("[data-id=passwordVisibleWrapper]").hide(),
                field: e.find("[data-id=passwordVisible]").textinput().on("focus", function () {
                    this._passwordVisibleField.wrapper.addClass("focus")
                }.bind(this)).on("blur", function () {
                    this._passwordVisibleField.wrapper.removeClass("focus")
                }.bind(this)).on("change", function () {
                    this.emit("Update", {
                        passValue: this._passwordVisibleField.field.val()
                    }), this.__validate()
                }.bind(this))
            }, this._passwordInvisibleField = {
                wrapper: e.find("[data-id=passwordInvisibleWrapper]"),
                field: e.find("[data-id=passwordInvisible]").textinput().on("focus", function () {
                    this._passwordInvisibleField.wrapper.addClass("focus")
                }.bind(this)).on("blur", function () {
                    this._passwordInvisibleField.wrapper.removeClass("focus")
                }.bind(this)).on("change", function () {
                    this.emit("Update", {
                        passValue: this._passwordInvisibleField.field.val()
                    }), this.__validate()
                }.bind(this))
            }, this._passwordTypeCheckbox = e.find("[data-id=hidePass]").on("change", function () {
                var e, t = this._passwordTypeCheckbox.is(":checked"),
                    i = this._passwordVisibleField,
                    s = this._passwordInvisibleField,
                    o = i.field,
                    r = s.field;
                t ? (i.wrapper.hide(), s.wrapper.show(), e = n.ui.getInputSelection(o), r.val(o.val()).focus(), n.ui.setInputSelection(r, e.start, e.end)) : (s.wrapper.hide(), i.wrapper.show(), e = n.ui.getInputSelection(r), o.val(r.val()).focus(), n.ui.setInputSelection(o, e.start, e.end))
            }.bind(this)), this.setTimeout(function () {
                this.__validate();
                var e = this._passwordInvisibleField.field,
                    t = e.val();
                e.trigger("blur").trigger("focus"), n.ui.setInputSelection(e, 0, t.length)
            }, 100), this.__setEmail(), this.__validate(), e
        },
        _removeContent: function () {
            var e = this._$;
            this._passwordVisibleField && this._passwordVisibleField.field.textinput("destroy"), this._passwordInvisibleField && this._passwordInvisibleField.field.textinput("destroy");
            var t = e.captcha;
            t && t.emit("Destroy"), n.extend(e, {
                email: null,
                form: null,
                submitButton: null,
                captcha: null
            }), n.$super(this)._removeContent.apply(this, arguments)
        },
        __setEmail: function () {
            var e = this.get("email"),
                t = this._$.email;
            t && (e ? t.text(e) : t.text(""))
        },
        __validate: function () {
            var e = this.get("passValue"),
                t = this._$,
                i = t.captcha,
                n = t.submitButton;
            return e.length > 0 && i.validate() ? (n.removeClass("disabled"), !0) : (n.addClass("disabled"), !1)
        },
        onFormSubmit: function (e) {
            if (e.preventDefault(), this.__validate() && 0 === this.get("status")) {
                this.emit("Update", {
                    status: 1
                });
                var t = n.extend({
                    password: this.get("passValue"),
                    email: this.get("email")
                }, this._$.captcha.getValues());
                this.facebookSignin(t)["with"](this).then(function (e) {
                    return zd.config.get("desktopFbAuthData") ? void(window.location.href = "/auth/fb?data=" + zd.config.get("desktopFbAuthData")) : void this.emit("LinkComplete", e)
                })["catch"](function (e) {
                    var t = e.details,
                        i = t.response || {};
                    switch (i.guid && i.captchaUrl && (this._$.captcha.emit("Update", {
                        guid: i.guid,
                        url: i.captchaUrl
                    }), this.__validate()), e.code) {
                        case 107:
                        case 1471:
                        case 1473:
                            this._$.captcha.emit("IncorrectCaptcha"), e.stopPropagation();
                            break;
                        case 106:
                        case 1405:
                            this._passwordInvisibleField.field.inputError({
                                message: _("mb_js_auth_error_wrong_password"),
                                linkedFields: [this._passwordVisibleField.field],
                                position: "right"
                            }), e.stopPropagation()
                    }
                }).then(function () {
                    this.emit("Update", {
                        status: 0
                    })
                })
            }
        },
        onChangeEmail: function () {
            this.__setEmail()
        }
    }), n["implements"](o, i("../../requests/facebook/FacebookSignin")), e.exports = o
}, zd.core3.modules["newlibs/requests/facebook/FacebookSignin"] = function (e, t, i) {
    var n = i("core/utils"),
        s = i("core/SmartObject"),
        o = function () {
            this.__init__.apply(this, arguments)
        };
    n.inherits(o, s, {
        facebookSignin: function (e) {
            return new(i("./FacebookAuth"))({
                parent: this
            }).facebookAuth()["with"](this).then(function (t) {
                var s = this.__facebookSigninRequest;
                s || (s = this.__facebookSigninRequest = new(i("core/Request"))({
                    parent: this,
                    param: $.param,
                    url: "/auth/signup"
                }).addListener("Destroyed", function () {
                    delete this.__facebookSigninRequest, s = null
                }, this));
                var o = n.extend({
                    fbSignedRequest: null,
                    username: e.email || t.email,
                    dontLogin: zd.config.get("desktopFbAuthData") ? 1 : 0
                }, t, e);
                return delete o.email, s.send(o)
            })
        }
    }), e.exports = o
}, zd.core3.modules["newlibs/widgets/auth/LinkEmailOtherFB"] = function (e, t, i) {
    var n = i("core/utils"),
        s = i("./Abstract"),
        o = function () {
            this.__init__.apply(this, arguments)
        };
    n.inherits(o, s), n.extend(o.prototype, {
        __init__: function (e) {
            this.values = n.extend({
                titleTemplate: zd.core2.getTemplate("newcore.widgets.auth.LinkEmailOtherFB.title"),
                contentTemplate: zd.core2.getTemplate("newcore.widgets.auth.LinkEmailOtherFB.content")
            }, this.values || {});
            var t = this._$ = this._$ || {};
            t.email = t.email || null, t.linkAccountButton = t.linkAccountButton || null, t.createAccountButton = t.createAccountButton || null, n.$super(this).__init__.apply(this, arguments), this.addListener("Change:email", this.onChangeEmail, this), this._getUrlData(zd.config.get("locations.popups.auth.LINK_OTHER_FB"))["with"](this).then(function (e) {
                this.emit("Update", {
                    email: e[0]
                })
            })["catch"](function () {})
        },
        _createContent: function () {
            var e = n.$super(this)._createContent.apply(this, arguments),
                t = this._$;
            return n.extend(t, {
                email: e.find("[data-id=userEmail]"),
                linkAccountButton: e.find("[data-id=linkAccount]"),
                createAccountButton: e.find("[data-id=createAccount]")
            }), t.linkAccountButton.on("click", function (e) {
                e.preventDefault(), this.emit("Route", "linkEmailFB", {
                    email: this.get("email")
                })
            }.bind(this)), t.createAccountButton.on("click", function (e) {
                e.preventDefault(), this.__createAccount()
            }.bind(this)), this.__setEmail(), e
        },
        _removeContent: function () {
            n.extend(this._$, {
                email: null,
                linkAccountButton: null,
                createAccountButton: null
            }), n.$super(this)._removeContent.apply(this, arguments)
        },
        __setEmail: function () {
            var e = this.get("email"),
                t = this._$.email;
            t && (e ? t.text(e) : t.text(""))
        },
        __createAccount: function () {
            0 === this.get("status") && (this.emit("Update", {
                status: 1
            }), this.facebookSignup({
                force: 1
            })["with"](this).then(function (e) {
                return zd.config.get("desktopFbAuthData") ? void(window.location.href = "/auth/fb?data=" + zd.config.get("desktopFbAuthData")) : void this.emit("SignupComplete", e)
            })["catch"](function (e) {
                var t = e.details;
                switch (e.code) {
                    case 1406:
                        t.username && (t.email = t.username), this.emit("Route", "linkEmailFB", t), e.stopPropagation()
                }
            }).then(function () {
                this.emit("Update", {
                    status: 0
                })
            }))
        },
        onChangeEmail: function (e) {
            this.__setEmail()
        }
    }), n["implements"](o, i("../../requests/facebook/FacebookSignup")), e.exports = o
}, zd.core3.modules["newlibs/tabs/index/widgets/HeaderDark"] = function (e, t, i) {
    var n = i("core/utils"),
        s = i("./Header"),
        o = function () {
            this.__init__.apply(this, arguments)
        };
    n.inherits(o, s, {
        onChangeWidget: function (e) {
            e.newValue && e.newValue.addClass("index-header-dark"), n.$super(this).onChangeWidget.apply(this, arguments)
        }
    }), e.exports = o
}, zd.core3.modules["newlibs/tabs/index/slides/Slide1"] = function (e, t, i) {
    var n = i("core/utils"),
        s = i("./Slide"),
        o = function () {
            this.__init__.apply(this, arguments)
        };
    n.inherits(o, s, {
        __init__: function () {
            this.values = n.extend({
                template: zd.core2.getTemplate("newcore.tabs.index.slides.Slide1.slide1"),
                dictionary: {
                    uid: n.uid()
                }
            }, this.values || {}), n.$super(this).__init__.apply(this, arguments)
        }
    }), e.exports = o
}, zd.core3.modules["newlibs/tabs/index/slides/Slide"] = function (e, t, i) {
    var n = i("core/utils"),
        s = i("core/View"),
        o = function () {
            this.__init__.apply(this, arguments)
        };
    n.inherits(o, s), n.extend(o.prototype, {
        __init__: function () {
            this.values = n.extend({
                visible: !0
            }, this.values || {}), n.$super(this).__init__.apply(this, arguments)
        }
    }), e.exports = o
}, zd.core3.modules["newlibs/tabs/index/slides/Slide7"] = function (e, t, i) {
    var n = i("core/utils"),
        s = i("./Slide"),
        o = function () {
            this.__init__.apply(this, arguments)
        };
    n.inherits(o, s, {
        __init__: function () {
            this.values = n.extend({
                template: zd.core2.getTemplate("newcore.tabs.index.slides.Slide7.slide7"),
                dictionary: {
                    uid: n.uid()
                }
            }, this.values || {}), n.$super(this).__init__.apply(this, arguments)
        },
        onChangeWidget: function (e) {
            var t = e.newValue,
                i = t.find("[data-id=ScreenSlides]"),
                s = t.find("[data-id=firstStep]"),
                o = t.find("[data-id=secondStep]"),
                r = t.find("[data-id=thirdStep]"),
                a = i.find("[data-id=firstStep],[data-id=secondStep], [data-id=thirdStep]");
            s.on("click", function () {
                a.removeClass("active").removeClass("next"), s.addClass("active"), r.addClass("next")
            }.bind(this)), o.on("click", function () {
                a.removeClass("active").removeClass("next"), o.addClass("active")
            }.bind(this)), r.on("click", function () {
                a.removeClass("active").removeClass("next"), r.addClass("active"), s.addClass("next")
            }.bind(this)), n.$super(this).onChangeWidget.apply(this, arguments)
        }
    }), e.exports = o
}, zd.core3.modules["newlibs/tabs/index/slides/Slide6"] = function (e, t, i) {
    var n = i("core/utils"),
        s = i("./Slide"),
        o = function () {
            this.__init__.apply(this, arguments)
        };
    n.inherits(o, s, {
        __init__: function () {
            this.values = n.extend({
                template: zd.core2.getTemplate("newcore.tabs.index.slides.Slide6.slide6"),
                dictionary: {
                    download: n.ui.getDownloadButtonDictionary(),
                    uid: n.uid()
                }
            }, this.values || {}), n.$super(this).__init__.apply(this, arguments)
        }
    }), e.exports = o
}, zd.core3.modules["newlibs/tabs/index/slides/Slide3"] = function (e, t, i) {
    var n = i("core/utils"),
        s = i("./Slide"),
        o = function () {
            this.__init__.apply(this, arguments)
        };
    n.inherits(o, s, {
        __init__: function () {
            this.values = n.extend({
                template: zd.core2.getTemplate("newcore.tabs.index.slides.Slide3.slide3"),
                dictionary: {
                    uid: n.uid()
                }
            }, this.values || {});
            var e = this._$ = this._$ || {};
            e.carouselWrapper = e.carouselWrapper || null, this.__carousel = new(i("../../../ui/UICarousel"))({
                slides: [zd.core2.getTemplate("newcore.tabs.index.slides.Slide3.step1"), zd.core2.getTemplate("newcore.tabs.index.slides.Slide3.step2"), zd.core2.getTemplate("newcore.tabs.index.slides.Slide3.step3")],
                tail: -200
            }), n.$super(this).__init__.apply(this, arguments)
        },
        onChangeWidget: function (e) {
            var t, i = e.newValue;
            i ? t = $.carouselWrapper = i.find("[data-id=carousel]") : (t = $.carouselWrapper = null, this.__carousel.emit("Update", {
                wrapper: t
            })), n.$super(this).onChangeWidget.apply(this, arguments), i && this.__carousel.emit("Update", {
                wrapper: t
            })
        }
    }), e.exports = o
}, zd.core3.modules["newlibs/ui/UICarousel"] = function (e, t, i) {
    var n = i("core/utils"),
        s = i("core/View"),
        o = function () {
            this.__init__.apply(this, arguments)
        };
    n.inherits(o, s), n.extend(o.prototype, {
        __init__: function () {
            this.values = n.extend({
                visible: !0,
                slides: null,
                template: zd.core2.getTemplate("newcore.ui.UICarousel.carousel"),
                dotTemplate: zd.core2.getTemplate("newcore.ui.UICarousel.dot"),
                tail: 700,
                duration: 500
            }, this.values || {}), this.$ = {
                fake: $("<div></div>"),
                nextButton: null,
                prevButton: null,
                dotsWrapper: null,
                slides: [],
                dots: []
            }, this.__promise = when.resolve(), this.__currentSlide = {
                $: null,
                dot: null,
                index: -1
            }, n.$super(this).__init__.apply(this, arguments), this.addListener("Change:slides", this.onChangeSlides, this), this.addListener("SlideToIndex", this.onSlideToIndex, this);
            var e = this.get("slides");
            e && this.onChangeSlides({
                oldValue: null,
                newValue: e
            })
        },
        onChangeWidget: function (e) {
            var t = e.newValue;
            if (t) {
                this.$.nextButton = t.find("[data-id=next]").on("click", function () {
                    this.__next()
                }.bind(this)), this.$.prevButton = t.find("[data-id=prev]").on("click", function () {
                    this.__prev()
                }.bind(this));
                var i = this.$.dotsWrapper = t.find("[data-id=dots]");
                this.$.slides.forEach(function (e) {
                    t.append(e)
                }), this.$.dots.forEach(function (e) {
                    i.append(e)
                })
            } else {
                this.$.nextButton = null, this.$.prevButton = null, this.$.dotsWrapper = null;
                var s = this.$.fake;
                this.$.slides.forEach(function (e) {
                    s.append(e)
                }), this.$.dots.forEach(function (e) {
                    s.append(e)
                })
            }
            n.$super(this).onChangeWidget.apply(this, arguments), this.__changeSlide()
        },
        __next: function () {
            this.__promise = this.__promise.then(function () {
                var e = this.values.slides,
                    t = this.__currentSlide,
                    i = t.index + 1;
                return i >= e.length && (i = 0), t.index = i, this.__changeSlide("left")
            }.bind(this))
        },
        __prev: function () {
            this.__promise = this.__promise.then(function () {
                var e = this.values.slides,
                    t = this.__currentSlide,
                    i = t.index - 1;
                return 0 > i && (i = e.length - 1), t.index = i, this.__changeSlide("right")
            }.bind(this))
        },
        __outToRight: function () {
            var e = this.__currentSlide,
                t = e.$,
                i = e.dot,
                n = this.get("tail"),
                s = this.get("duration");
            if (!t) return when.resolve();
            var o = when.defer(),
                r = o.promise,
                a = t.find("[data-id=slideItem]"),
                l = a.size();
            return i.removeClass("active"), r.then(function () {
                t.hide()
            }), 0 === l ? (o.resolve(), r) : (a.get().reverse().forEach(function (e, i) {
                var a = $(e),
                    u = t.width(),
                    d = parseInt(a.css("left"), 10),
                    h = u / 2 + n;
                this.setTimeout(function () {
                    a.animate({
                        left: h
                    }, {
                        duration: s,
                        easing: "easeInCubic",
                        step: function (e) {
                            a.css({
                                opacity: 1 - (e - d) / (h - d)
                            })
                        },
                        complete: function () {
                            i === l - 1 && o.resolve()
                        }
                    })
                }, 150 * i), r.then(function () {
                    a.removeAttr("style")
                })
            }, this), r)
        },
        __outToLeft: function () {
            var e = this.__currentSlide,
                t = e.$,
                i = e.dot,
                n = this.get("tail"),
                s = this.get("duration");
            if (!t) return when.resolve();
            var o = when.defer(),
                r = o.promise,
                a = t.find("[data-id=slideItem]"),
                l = a.size();
            return i.removeClass("active"), r.then(function () {
                t.hide()
            }), 0 === l ? (o.resolve(), r) : (a.get().forEach(function (e, i) {
                var a = $(e),
                    u = t.width(),
                    d = parseInt(a.css("left"), 10),
                    h = -u / 2 - n;
                this.setTimeout(function () {
                    a.animate({
                        left: h
                    }, {
                        duration: s,
                        easing: "easeInCubic",
                        step: function (e) {
                            a.css({
                                opacity: 1 - (d - e) / (d - h)
                            })
                        },
                        complete: function () {
                            i === l - 1 && o.resolve()
                        }
                    })
                }, 150 * i), r.then(function () {
                    a.removeAttr("style")
                })
            }, this), r)
        },
        __inFromRight: function () {
            var e = this.__currentSlide.index,
                t = this.$.slides,
                i = this.$.dots,
                n = t[e],
                s = i[e],
                o = this.get("tail"),
                r = this.get("duration");
            if (!n) return when.resolve();
            var a = when.defer(),
                l = a.promise,
                u = n.find("[data-id=slideItem]"),
                d = u.size();
            return n.show(), l.then(function () {
                s.addClass("active")
            }), 0 === d ? (a.resolve(), l) : (this.__currentSlide.$ = n, this.__currentSlide.dot = s, u.get().forEach(function (e, t) {
                var i = $(e),
                    s = n.width(),
                    l = parseInt(i.css("left"), 10),
                    u = s / 2 + o;
                i.css({
                    left: u,
                    opacity: 0
                }), this.setTimeout(function () {
                    i.animate({
                        left: l
                    }, {
                        duration: r,
                        easing: "easeOutCubic",
                        step: function (e) {
                            i.css({
                                opacity: 1 - (e - l) / (u - l)
                            })
                        },
                        complete: function () {
                            i.removeAttr("style"), t === d - 1 && a.resolve()
                        }
                    })
                }, 150 * t)
            }, this), l)
        },
        __inFromLeft: function () {
            var e = this.__currentSlide.index,
                t = this.$.slides,
                i = this.$.dots,
                n = t[e],
                s = i[e],
                o = this.get("tail"),
                r = this.get("duration");
            if (!n) return when.resolve();
            var a = when.defer(),
                l = a.promise,
                u = n.find("[data-id=slideItem]"),
                d = u.size();
            return n.show(), l.then(function () {
                s.addClass("active")
            }), 0 === d ? (a.resolve(), l) : (this.__currentSlide.$ = n, this.__currentSlide.dot = s, u.get().reverse().forEach(function (e, t) {
                var i = $(e),
                    s = n.width(),
                    l = parseInt(i.css("left"), 10),
                    u = -s / 2 - o;
                i.css({
                    left: u,
                    opacity: 0
                }), this.setTimeout(function () {
                    i.animate({
                        left: l
                    }, {
                        duration: r,
                        easing: "easeOutCubic",
                        step: function (e) {
                            i.css({
                                opacity: 1 - (l - e) / (l - u)
                            })
                        },
                        complete: function () {
                            i.removeAttr("style"), t === d - 1 && a.resolve()
                        }
                    })
                }, 150 * t)
            }, this), l)
        },
        __hideSlide: function () {
            var e = this.__currentSlide,
                t = e.$,
                i = e.dot,
                n = when.defer(),
                s = n.promise,
                o = this.get("tail"),
                r = this.get("duration");
            if (t) {
                e.$ = null, e.dot = null, i.removeClass("active"), s.then(function () {
                    t.hide()
                });
                var a = t.find("[data-id=slideItem]");
                a.size() > 0 ? a.each(function (e, t) {
                    var i = $(t),
                        l = i.width(),
                        u = -l / 2 - o;
                    this.setTimeout(function () {
                        i.animate({
                            left: u
                        }, {
                            duration: r,
                            easing: "easeInCubic",
                            step: function (e) {
                                0 > e && i.css({
                                    opacity: 1 - e / u
                                })
                            },
                            complete: function () {
                                e === a.size() - 1 && n.resolve()
                            }
                        })
                    }, 150 * e), s.then(function () {
                        i.removeAttr("style")
                    })
                }.bind(this)) : n.resolve()
            } else n.resolve();
            return s
        },
        __changeSlide: function (e) {
            e = e || "right";
            var t = this.$.slides,
                i = this.values.widget;
            if (0 !== t.length && i) return when.resolve().then(function () {
                return "right" === e ? this.__outToRight() : this.__outToLeft()
            }.bind(this)).then(function () {
                return "right" === e ? this.__inFromLeft() : this.__inFromRight()
            }.bind(this))
        },
        onChangeSlides: function (e) {
            var t = e.newValue,
                i = (e.oldValue, this.values.widget, this.$.slides),
                n = this.values.widget || this.$.fake,
                s = this.$.dots,
                o = this.$.dotsWrapper || this.$.fake;
            if (i.forEach(function (e) {
                    e.remove()
                }), i.length = 0, s.forEach(function (e) {
                    e.remove()
                }), s.length = 0, t) {
                for (var r = 0, a = t.length; a > r; r++) {
                    var l = t[r].compile().hide(),
                        u = this.values.dotTemplate.compile().on("click", function (e, t) {
                            this.__promise = this.__promise.then(function () {
                                var t = this.__currentSlide,
                                    i = t.index;
                                if (i !== e) return t.index = e, this.__changeSlide(i > e ? "right" : "left")
                            }.bind(this))
                        }.bind(this, r));
                    i.push(l.appendTo(n)), s.push(u.appendTo(o))
                }
                this.__currentSlide.index = 0
            } else this.__currentSlide.index = -1;
            this.__changeSlide()
        },
        onSlideToIndex: function (e) {
            if (this.values.slides[e]) {
                var t = this.__currentSlide,
                    i = t.index;
                if (i !== e) return t.index = e, this.__changeSlide(i > e ? "right" : "left")
            }
        }
    }), e.exports = o
}, zd.core3.modules["newlibs/tabs/index/slides/Slide8"] = function (e, t, i) {
    var n = i("core/utils"),
        s = i("./Slide"),
        o = function () {
            this.__init__.apply(this, arguments)
        };
    n.inherits(o, s, {
        __init__: function () {
            this.values = n.extend({
                template: zd.core2.getTemplate("newcore.tabs.index.slides.Slide8.slide8"),
                dictionary: {
                    uid: n.uid()
                }
            }, this.values || {});
            var e = this._$ = this._$ || {};
            e.carouselWrapper = e.carouselWrapper || null, this.__carousel = new(i("../../../ui/UICarousel"))({
                slides: [zd.core2.getTemplate("newcore.tabs.index.slides.Slide8.step1"), zd.core2.getTemplate("newcore.tabs.index.slides.Slide8.step2"), zd.core2.getTemplate("newcore.tabs.index.slides.Slide8.step3")],
                tail: -350
            }), n.$super(this).__init__.apply(this, arguments)
        },
        onChangeWidget: function (e) {
            var t, i = e.newValue;
            i ? t = $.carouselWrapper = i.find("[data-id=carousel]") : (t = $.carouselWrapper = null, this.__carousel.emit("Update", {
                wrapper: t
            })), n.$super(this).onChangeWidget.apply(this, arguments), i && (this.__carousel.emit("Update", {
                wrapper: t
            }), i.find("[data-id=linkToSlide1]").on("click", function () {
                this.__carousel.emit("SlideToIndex", 0)
            }.bind(this)), i.find("[data-id=linkToSlide2]").on("click", function () {
                this.__carousel.emit("SlideToIndex", 1)
            }.bind(this)), i.find("[data-id=linkToSlide3]").on("click", function () {
                this.__carousel.emit("SlideToIndex", 2)
            }.bind(this)))
        }
    }), e.exports = o
}, zd.core3.modules["newlibs/tabs/index/slides/Slide5"] = function (e, t, i) {
    var n = i("core/utils"),
        s = i("./Slide"),
        o = function () {
            this.__init__.apply(this, arguments)
        };
    n.inherits(o, s, {
        __init__: function () {
            this.values = n.extend({
                template: zd.core2.getTemplate("newcore.tabs.index.slides.Slide5.slide5"),
                dictionary: {
                    uid: n.uid()
                }
            }, this.values || {}), n.$super(this).__init__.apply(this, arguments)
        }
    }), e.exports = o
}, zd.core3.modules["newlibs/tabs/index/slides/Slide4"] = function (e, t, i) {
    var n = i("core/utils"),
        s = i("./Slide"),
        o = function () {
            this.__init__.apply(this, arguments)
        };
    n.inherits(o, s, {
        __init__: function () {
            this.values = n.extend({
                template: zd.core2.getTemplate("newcore.tabs.index.slides.Slide4.slide4"),
                dictionary: {
                    uid: n.uid()
                }
            }, this.values || {});
            var e = this._$ = this._$ || {};
            e.carouselWrapper = e.carouselWrapper || null, this.__carousel = new(i("../../../ui/UICarousel"))({
                slides: [zd.core2.getTemplate("newcore.tabs.index.slides.Slide4.man1"), zd.core2.getTemplate("newcore.tabs.index.slides.Slide4.man2"), zd.core2.getTemplate("newcore.tabs.index.slides.Slide4.man3"), zd.core2.getTemplate("newcore.tabs.index.slides.Slide4.man4"), zd.core2.getTemplate("newcore.tabs.index.slides.Slide4.man5")],
                tail: -150
            }), n.$super(this).__init__.apply(this, arguments)
        },
        onChangeWidget: function (e) {
            var t, i = e.newValue;
            i ? t = $.carouselWrapper = i.find("[data-id=carousel]") : (t = $.carouselWrapper = null, this.__carousel.emit("Update", {
                wrapper: t
            })), n.$super(this).onChangeWidget.apply(this, arguments), i && this.__carousel.emit("Update", {
                wrapper: t
            })
        }
    }), e.exports = o
};
var global, $document, $window = $(window);
$(document).ready(function e() {
    if ($document = $("#mainContainer"), $document.is(":hidden") && "undefined" == typeof browser) return void setTimeout(e, 100);
    var t = zd.core3.createModule("main/run/index"),
        i = t.require;
    global = new(i("core/SmartObject")), new(i("libs/Config/Config"))({
        locations: {
            DEFAULT: "#default",
            helpcenter: {
                DEFAULT: "/helpcenter",
                ANSWERS: "/helpcenter/answers",
                SUGGESTIONS: "/helpcenter/suggestions"
            },
            popups: {
                auth: {
                    SIGN_IN: "/signin",
                    SIGN_UP: "/signup",
                    FORGOT: "/forgot",
                    RESET_PASS: "/resetpass",
                    LINK_FB: "/link-fb",
                    LINK_OTHER_FB: "/link-other-fb"
                }
            },
            MAX_FILE_SIZE: 209715200
        }
    }).onReady(function () {
        zd.core2.getTemplatesNamespace("newcore"), new(i("newlibs/tabs/index/Index"))({
            parent: global,
            wrapper: $document
        }), zd.config.addListener("Change:profile:userId", function () {
            setTimeout(function () {
                window.location.replace("/")
            }, 1e3)
        })
    }), zd.unsupportedPopup.applicationLoaded = !0
});