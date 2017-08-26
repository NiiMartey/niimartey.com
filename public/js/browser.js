! function () {
    window.browser = {
        agent: null,
        version: null,
        platform: null
    };
    var o, r = navigator.userAgent,
        e = null,
        n = null,
        t = {
            msie: /MSIE ([0-9\.]+)/,
            ff: /Firefox\/([0-9\.]+)/,
            chrome: /Chrome\/([0-9\.]+)(?:[\s\S](?!(?:OPR)))+$/,
            safari: /^(?:[\s\S](?!(?:Android)))+Version\/([0-9\.]+)[\s\S]+Safari\//,
            androidInternet: /Android[\s\S]+Version\/([0-9\.]+)[\s\S]+Safari\//,
            opera: /Chrome[\s\S]+OPR\/([0-9\.]+)/,
            operaOld: /Opera\/([0-9\.]+)[\s\S]*Presto/
        };
    for (var i in t)
        if (t.hasOwnProperty(i) && (o = r.match(t[i]))) {
            e = i, n = o[1].split("."), n = parseFloat(n.shift() + "." + n.join(""));
            break
        }
    null === e && /trident/i.test(r) && (e = "msie", n = 11), window.browser.agent = e, window.browser.version = n;
    var a = navigator.platform,
        s = /browser\.platform=([^;]+)/.exec(document.cookie);
    s ? window.browser.platform = s[1] : /(ipod)|(iphone)|(ipad)/i.test(a) ? window.browser.platform = "mac" : /mac/i.test(a) ? window.browser.platform = "mac" : /android/i.test(r) || /android/i.test(a) ? window.browser.platform = "win" : window.browser.platform = "win", zd.unsupportedPopup = {
        applicationLoaded: !1,
        onLoadError: function (o) {
            for (var r, e = document.body.childNodes, n = 0, t = e.length; t > n; n++) r = e[n], r && r !== o && r.style && (r.style.display = "none");
            o.style.display = "block"
        },
        onLoadComplete: function (o) {
            for (var r, e = document.body.childNodes, n = 0, t = e.length; t > n; n++) r = e[n], r && r !== o && r.style && (r.style.display = "block");
            global.emit("Notifications:AddNotification", {
                content: _("mb_js_browser_unsupportedpopup_warning"),
                type: "warning",
                selfClosable: !1
            }), o.parentNode.removeChild(o)
        }
    }, window.onload = function () {
        var o = document.getElementById("unsupportedPopup");
        if (o) {
            o.style.display = "none";
            var r = function () {
                var o = browser.agent,
                    r = browser.version;
                switch (o) {
                    case "msie":
                        return r >= 9;
                    case "ff":
                        return r >= 19;
                    case "chrome":
                        return r >= 20;
                    case "opera":
                        return r >= 15;
                    case "safari":
                        return r >= 5.1;
                    case "androidInternet":
                        return r >= 4
                }
                return !1
            }();
            if (!r) try {
                var e = 0,
                    n = setTimeout(function () {
                        clearTimeout(e), zd.unsupportedPopup.onLoadError(o)
                    }, 5e3);
                ! function i() {
                    return zd.unsupportedPopup.applicationLoaded ? (clearTimeout(n), void zd.unsupportedPopup.onLoadComplete(o)) : void(e = setTimeout(i, 100))
                }()
            } catch (t) {
                zd.unsupportedPopup.onLoadError(o)
            }
        }
    }
}();