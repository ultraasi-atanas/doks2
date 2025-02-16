
;
(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __markAsModule = (target) => __defProp(target, "__esModule", {value: true});
  var __commonJS = (cb, mod) => () => (mod || cb((mod = {exports: {}}).exports, mod), mod.exports);
  var __reExport = (target, module, desc) => {
    if (module && typeof module === "object" || typeof module === "function") {
      for (let key of __getOwnPropNames(module))
        if (!__hasOwnProp.call(target, key) && key !== "default")
          __defProp(target, key, {get: () => module[key], enumerable: !(desc = __getOwnPropDesc(module, key)) || desc.enumerable});
    }
    return target;
  };
  var __toModule = (module) => {
    return __reExport(__markAsModule(__defProp(module != null ? __create(__getProtoOf(module)) : {}, "default", module && module.__esModule && "default" in module ? {get: () => module.default, enumerable: true} : {value: module, enumerable: true})), module);
  };

  // node_modules/lazysizes/lazysizes.js
  var require_lazysizes = __commonJS((exports, module) => {
    (function(window2, factory) {
      var lazySizes = factory(window2, window2.document, Date);
      window2.lazySizes = lazySizes;
      if (typeof module == "object" && module.exports) {
        module.exports = lazySizes;
      }
    })(typeof window != "undefined" ? window : {}, function l(window2, document, Date2) {
      "use strict";
      var lazysizes, lazySizesCfg;
      (function() {
        var prop;
        var lazySizesDefaults = {
          lazyClass: "lazyload",
          loadedClass: "lazyloaded",
          loadingClass: "lazyloading",
          preloadClass: "lazypreload",
          errorClass: "lazyerror",
          autosizesClass: "lazyautosizes",
          fastLoadedClass: "ls-is-cached",
          iframeLoadMode: 0,
          srcAttr: "data-src",
          srcsetAttr: "data-srcset",
          sizesAttr: "data-sizes",
          minSize: 40,
          customMedia: {},
          init: true,
          expFactor: 1.5,
          hFac: 0.8,
          loadMode: 2,
          loadHidden: true,
          ricTimeout: 0,
          throttleDelay: 125
        };
        lazySizesCfg = window2.lazySizesConfig || window2.lazysizesConfig || {};
        for (prop in lazySizesDefaults) {
          if (!(prop in lazySizesCfg)) {
            lazySizesCfg[prop] = lazySizesDefaults[prop];
          }
        }
      })();
      if (!document || !document.getElementsByClassName) {
        return {
          init: function() {
          },
          cfg: lazySizesCfg,
          noSupport: true
        };
      }
      var docElem = document.documentElement;
      var supportPicture = window2.HTMLPictureElement;
      var _addEventListener = "addEventListener";
      var _getAttribute = "getAttribute";
      var addEventListener = window2[_addEventListener].bind(window2);
      var setTimeout = window2.setTimeout;
      var requestAnimationFrame = window2.requestAnimationFrame || setTimeout;
      var requestIdleCallback = window2.requestIdleCallback;
      var regPicture = /^picture$/i;
      var loadEvents = ["load", "error", "lazyincluded", "_lazyloaded"];
      var regClassCache = {};
      var forEach = Array.prototype.forEach;
      var hasClass = function(ele, cls) {
        if (!regClassCache[cls]) {
          regClassCache[cls] = new RegExp("(\\s|^)" + cls + "(\\s|$)");
        }
        return regClassCache[cls].test(ele[_getAttribute]("class") || "") && regClassCache[cls];
      };
      var addClass = function(ele, cls) {
        if (!hasClass(ele, cls)) {
          ele.setAttribute("class", (ele[_getAttribute]("class") || "").trim() + " " + cls);
        }
      };
      var removeClass = function(ele, cls) {
        var reg;
        if (reg = hasClass(ele, cls)) {
          ele.setAttribute("class", (ele[_getAttribute]("class") || "").replace(reg, " "));
        }
      };
      var addRemoveLoadEvents = function(dom, fn, add) {
        var action = add ? _addEventListener : "removeEventListener";
        if (add) {
          addRemoveLoadEvents(dom, fn);
        }
        loadEvents.forEach(function(evt) {
          dom[action](evt, fn);
        });
      };
      var triggerEvent = function(elem, name, detail, noBubbles, noCancelable) {
        var event = document.createEvent("Event");
        if (!detail) {
          detail = {};
        }
        detail.instance = lazysizes;
        event.initEvent(name, !noBubbles, !noCancelable);
        event.detail = detail;
        elem.dispatchEvent(event);
        return event;
      };
      var updatePolyfill = function(el, full) {
        var polyfill;
        if (!supportPicture && (polyfill = window2.picturefill || lazySizesCfg.pf)) {
          if (full && full.src && !el[_getAttribute]("srcset")) {
            el.setAttribute("srcset", full.src);
          }
          polyfill({reevaluate: true, elements: [el]});
        } else if (full && full.src) {
          el.src = full.src;
        }
      };
      var getCSS = function(elem, style) {
        return (getComputedStyle(elem, null) || {})[style];
      };
      var getWidth = function(elem, parent, width) {
        width = width || elem.offsetWidth;
        while (width < lazySizesCfg.minSize && parent && !elem._lazysizesWidth) {
          width = parent.offsetWidth;
          parent = parent.parentNode;
        }
        return width;
      };
      var rAF = function() {
        var running, waiting;
        var firstFns = [];
        var secondFns = [];
        var fns = firstFns;
        var run = function() {
          var runFns = fns;
          fns = firstFns.length ? secondFns : firstFns;
          running = true;
          waiting = false;
          while (runFns.length) {
            runFns.shift()();
          }
          running = false;
        };
        var rafBatch = function(fn, queue) {
          if (running && !queue) {
            fn.apply(this, arguments);
          } else {
            fns.push(fn);
            if (!waiting) {
              waiting = true;
              (document.hidden ? setTimeout : requestAnimationFrame)(run);
            }
          }
        };
        rafBatch._lsFlush = run;
        return rafBatch;
      }();
      var rAFIt = function(fn, simple) {
        return simple ? function() {
          rAF(fn);
        } : function() {
          var that = this;
          var args = arguments;
          rAF(function() {
            fn.apply(that, args);
          });
        };
      };
      var throttle = function(fn) {
        var running;
        var lastTime = 0;
        var gDelay = lazySizesCfg.throttleDelay;
        var rICTimeout = lazySizesCfg.ricTimeout;
        var run = function() {
          running = false;
          lastTime = Date2.now();
          fn();
        };
        var idleCallback = requestIdleCallback && rICTimeout > 49 ? function() {
          requestIdleCallback(run, {timeout: rICTimeout});
          if (rICTimeout !== lazySizesCfg.ricTimeout) {
            rICTimeout = lazySizesCfg.ricTimeout;
          }
        } : rAFIt(function() {
          setTimeout(run);
        }, true);
        return function(isPriority) {
          var delay;
          if (isPriority = isPriority === true) {
            rICTimeout = 33;
          }
          if (running) {
            return;
          }
          running = true;
          delay = gDelay - (Date2.now() - lastTime);
          if (delay < 0) {
            delay = 0;
          }
          if (isPriority || delay < 9) {
            idleCallback();
          } else {
            setTimeout(idleCallback, delay);
          }
        };
      };
      var debounce = function(func) {
        var timeout, timestamp;
        var wait = 99;
        var run = function() {
          timeout = null;
          func();
        };
        var later = function() {
          var last = Date2.now() - timestamp;
          if (last < wait) {
            setTimeout(later, wait - last);
          } else {
            (requestIdleCallback || run)(run);
          }
        };
        return function() {
          timestamp = Date2.now();
          if (!timeout) {
            timeout = setTimeout(later, wait);
          }
        };
      };
      var loader = function() {
        var preloadElems, isCompleted, resetPreloadingTimer, loadMode, started;
        var eLvW, elvH, eLtop, eLleft, eLright, eLbottom, isBodyHidden;
        var regImg = /^img$/i;
        var regIframe = /^iframe$/i;
        var supportScroll = "onscroll" in window2 && !/(gle|ing)bot/.test(navigator.userAgent);
        var shrinkExpand = 0;
        var currentExpand = 0;
        var isLoading = 0;
        var lowRuns = -1;
        var resetPreloading = function(e) {
          isLoading--;
          if (!e || isLoading < 0 || !e.target) {
            isLoading = 0;
          }
        };
        var isVisible = function(elem) {
          if (isBodyHidden == null) {
            isBodyHidden = getCSS(document.body, "visibility") == "hidden";
          }
          return isBodyHidden || !(getCSS(elem.parentNode, "visibility") == "hidden" && getCSS(elem, "visibility") == "hidden");
        };
        var isNestedVisible = function(elem, elemExpand) {
          var outerRect;
          var parent = elem;
          var visible = isVisible(elem);
          eLtop -= elemExpand;
          eLbottom += elemExpand;
          eLleft -= elemExpand;
          eLright += elemExpand;
          while (visible && (parent = parent.offsetParent) && parent != document.body && parent != docElem) {
            visible = (getCSS(parent, "opacity") || 1) > 0;
            if (visible && getCSS(parent, "overflow") != "visible") {
              outerRect = parent.getBoundingClientRect();
              visible = eLright > outerRect.left && eLleft < outerRect.right && eLbottom > outerRect.top - 1 && eLtop < outerRect.bottom + 1;
            }
          }
          return visible;
        };
        var checkElements = function() {
          var eLlen, i, rect, autoLoadElem, loadedSomething, elemExpand, elemNegativeExpand, elemExpandVal, beforeExpandVal, defaultExpand, preloadExpand, hFac;
          var lazyloadElems = lazysizes.elements;
          if ((loadMode = lazySizesCfg.loadMode) && isLoading < 8 && (eLlen = lazyloadElems.length)) {
            i = 0;
            lowRuns++;
            for (; i < eLlen; i++) {
              if (!lazyloadElems[i] || lazyloadElems[i]._lazyRace) {
                continue;
              }
              if (!supportScroll || lazysizes.prematureUnveil && lazysizes.prematureUnveil(lazyloadElems[i])) {
                unveilElement(lazyloadElems[i]);
                continue;
              }
              if (!(elemExpandVal = lazyloadElems[i][_getAttribute]("data-expand")) || !(elemExpand = elemExpandVal * 1)) {
                elemExpand = currentExpand;
              }
              if (!defaultExpand) {
                defaultExpand = !lazySizesCfg.expand || lazySizesCfg.expand < 1 ? docElem.clientHeight > 500 && docElem.clientWidth > 500 ? 500 : 370 : lazySizesCfg.expand;
                lazysizes._defEx = defaultExpand;
                preloadExpand = defaultExpand * lazySizesCfg.expFactor;
                hFac = lazySizesCfg.hFac;
                isBodyHidden = null;
                if (currentExpand < preloadExpand && isLoading < 1 && lowRuns > 2 && loadMode > 2 && !document.hidden) {
                  currentExpand = preloadExpand;
                  lowRuns = 0;
                } else if (loadMode > 1 && lowRuns > 1 && isLoading < 6) {
                  currentExpand = defaultExpand;
                } else {
                  currentExpand = shrinkExpand;
                }
              }
              if (beforeExpandVal !== elemExpand) {
                eLvW = innerWidth + elemExpand * hFac;
                elvH = innerHeight + elemExpand;
                elemNegativeExpand = elemExpand * -1;
                beforeExpandVal = elemExpand;
              }
              rect = lazyloadElems[i].getBoundingClientRect();
              if ((eLbottom = rect.bottom) >= elemNegativeExpand && (eLtop = rect.top) <= elvH && (eLright = rect.right) >= elemNegativeExpand * hFac && (eLleft = rect.left) <= eLvW && (eLbottom || eLright || eLleft || eLtop) && (lazySizesCfg.loadHidden || isVisible(lazyloadElems[i])) && (isCompleted && isLoading < 3 && !elemExpandVal && (loadMode < 3 || lowRuns < 4) || isNestedVisible(lazyloadElems[i], elemExpand))) {
                unveilElement(lazyloadElems[i]);
                loadedSomething = true;
                if (isLoading > 9) {
                  break;
                }
              } else if (!loadedSomething && isCompleted && !autoLoadElem && isLoading < 4 && lowRuns < 4 && loadMode > 2 && (preloadElems[0] || lazySizesCfg.preloadAfterLoad) && (preloadElems[0] || !elemExpandVal && (eLbottom || eLright || eLleft || eLtop || lazyloadElems[i][_getAttribute](lazySizesCfg.sizesAttr) != "auto"))) {
                autoLoadElem = preloadElems[0] || lazyloadElems[i];
              }
            }
            if (autoLoadElem && !loadedSomething) {
              unveilElement(autoLoadElem);
            }
          }
        };
        var throttledCheckElements = throttle(checkElements);
        var switchLoadingClass = function(e) {
          var elem = e.target;
          if (elem._lazyCache) {
            delete elem._lazyCache;
            return;
          }
          resetPreloading(e);
          addClass(elem, lazySizesCfg.loadedClass);
          removeClass(elem, lazySizesCfg.loadingClass);
          addRemoveLoadEvents(elem, rafSwitchLoadingClass);
          triggerEvent(elem, "lazyloaded");
        };
        var rafedSwitchLoadingClass = rAFIt(switchLoadingClass);
        var rafSwitchLoadingClass = function(e) {
          rafedSwitchLoadingClass({target: e.target});
        };
        var changeIframeSrc = function(elem, src) {
          var loadMode2 = elem.getAttribute("data-load-mode") || lazySizesCfg.iframeLoadMode;
          if (loadMode2 == 0) {
            elem.contentWindow.location.replace(src);
          } else if (loadMode2 == 1) {
            elem.src = src;
          }
        };
        var handleSources = function(source) {
          var customMedia;
          var sourceSrcset = source[_getAttribute](lazySizesCfg.srcsetAttr);
          if (customMedia = lazySizesCfg.customMedia[source[_getAttribute]("data-media") || source[_getAttribute]("media")]) {
            source.setAttribute("media", customMedia);
          }
          if (sourceSrcset) {
            source.setAttribute("srcset", sourceSrcset);
          }
        };
        var lazyUnveil = rAFIt(function(elem, detail, isAuto, sizes, isImg) {
          var src, srcset, parent, isPicture, event, firesLoad;
          if (!(event = triggerEvent(elem, "lazybeforeunveil", detail)).defaultPrevented) {
            if (sizes) {
              if (isAuto) {
                addClass(elem, lazySizesCfg.autosizesClass);
              } else {
                elem.setAttribute("sizes", sizes);
              }
            }
            srcset = elem[_getAttribute](lazySizesCfg.srcsetAttr);
            src = elem[_getAttribute](lazySizesCfg.srcAttr);
            if (isImg) {
              parent = elem.parentNode;
              isPicture = parent && regPicture.test(parent.nodeName || "");
            }
            firesLoad = detail.firesLoad || "src" in elem && (srcset || src || isPicture);
            event = {target: elem};
            addClass(elem, lazySizesCfg.loadingClass);
            if (firesLoad) {
              clearTimeout(resetPreloadingTimer);
              resetPreloadingTimer = setTimeout(resetPreloading, 2500);
              addRemoveLoadEvents(elem, rafSwitchLoadingClass, true);
            }
            if (isPicture) {
              forEach.call(parent.getElementsByTagName("source"), handleSources);
            }
            if (srcset) {
              elem.setAttribute("srcset", srcset);
            } else if (src && !isPicture) {
              if (regIframe.test(elem.nodeName)) {
                changeIframeSrc(elem, src);
              } else {
                elem.src = src;
              }
            }
            if (isImg && (srcset || isPicture)) {
              updatePolyfill(elem, {src});
            }
          }
          if (elem._lazyRace) {
            delete elem._lazyRace;
          }
          removeClass(elem, lazySizesCfg.lazyClass);
          rAF(function() {
            var isLoaded = elem.complete && elem.naturalWidth > 1;
            if (!firesLoad || isLoaded) {
              if (isLoaded) {
                addClass(elem, lazySizesCfg.fastLoadedClass);
              }
              switchLoadingClass(event);
              elem._lazyCache = true;
              setTimeout(function() {
                if ("_lazyCache" in elem) {
                  delete elem._lazyCache;
                }
              }, 9);
            }
            if (elem.loading == "lazy") {
              isLoading--;
            }
          }, true);
        });
        var unveilElement = function(elem) {
          if (elem._lazyRace) {
            return;
          }
          var detail;
          var isImg = regImg.test(elem.nodeName);
          var sizes = isImg && (elem[_getAttribute](lazySizesCfg.sizesAttr) || elem[_getAttribute]("sizes"));
          var isAuto = sizes == "auto";
          if ((isAuto || !isCompleted) && isImg && (elem[_getAttribute]("src") || elem.srcset) && !elem.complete && !hasClass(elem, lazySizesCfg.errorClass) && hasClass(elem, lazySizesCfg.lazyClass)) {
            return;
          }
          detail = triggerEvent(elem, "lazyunveilread").detail;
          if (isAuto) {
            autoSizer.updateElem(elem, true, elem.offsetWidth);
          }
          elem._lazyRace = true;
          isLoading++;
          lazyUnveil(elem, detail, isAuto, sizes, isImg);
        };
        var afterScroll = debounce(function() {
          lazySizesCfg.loadMode = 3;
          throttledCheckElements();
        });
        var altLoadmodeScrollListner = function() {
          if (lazySizesCfg.loadMode == 3) {
            lazySizesCfg.loadMode = 2;
          }
          afterScroll();
        };
        var onload = function() {
          if (isCompleted) {
            return;
          }
          if (Date2.now() - started < 999) {
            setTimeout(onload, 999);
            return;
          }
          isCompleted = true;
          lazySizesCfg.loadMode = 3;
          throttledCheckElements();
          addEventListener("scroll", altLoadmodeScrollListner, true);
        };
        return {
          _: function() {
            started = Date2.now();
            lazysizes.elements = document.getElementsByClassName(lazySizesCfg.lazyClass);
            preloadElems = document.getElementsByClassName(lazySizesCfg.lazyClass + " " + lazySizesCfg.preloadClass);
            addEventListener("scroll", throttledCheckElements, true);
            addEventListener("resize", throttledCheckElements, true);
            addEventListener("pageshow", function(e) {
              if (e.persisted) {
                var loadingElements = document.querySelectorAll("." + lazySizesCfg.loadingClass);
                if (loadingElements.length && loadingElements.forEach) {
                  requestAnimationFrame(function() {
                    loadingElements.forEach(function(img) {
                      if (img.complete) {
                        unveilElement(img);
                      }
                    });
                  });
                }
              }
            });
            if (window2.MutationObserver) {
              new MutationObserver(throttledCheckElements).observe(docElem, {childList: true, subtree: true, attributes: true});
            } else {
              docElem[_addEventListener]("DOMNodeInserted", throttledCheckElements, true);
              docElem[_addEventListener]("DOMAttrModified", throttledCheckElements, true);
              setInterval(throttledCheckElements, 999);
            }
            addEventListener("hashchange", throttledCheckElements, true);
            ["focus", "mouseover", "click", "load", "transitionend", "animationend"].forEach(function(name) {
              document[_addEventListener](name, throttledCheckElements, true);
            });
            if (/d$|^c/.test(document.readyState)) {
              onload();
            } else {
              addEventListener("load", onload);
              document[_addEventListener]("DOMContentLoaded", throttledCheckElements);
              setTimeout(onload, 2e4);
            }
            if (lazysizes.elements.length) {
              checkElements();
              rAF._lsFlush();
            } else {
              throttledCheckElements();
            }
          },
          checkElems: throttledCheckElements,
          unveil: unveilElement,
          _aLSL: altLoadmodeScrollListner
        };
      }();
      var autoSizer = function() {
        var autosizesElems;
        var sizeElement = rAFIt(function(elem, parent, event, width) {
          var sources, i, len;
          elem._lazysizesWidth = width;
          width += "px";
          elem.setAttribute("sizes", width);
          if (regPicture.test(parent.nodeName || "")) {
            sources = parent.getElementsByTagName("source");
            for (i = 0, len = sources.length; i < len; i++) {
              sources[i].setAttribute("sizes", width);
            }
          }
          if (!event.detail.dataAttr) {
            updatePolyfill(elem, event.detail);
          }
        });
        var getSizeElement = function(elem, dataAttr, width) {
          var event;
          var parent = elem.parentNode;
          if (parent) {
            width = getWidth(elem, parent, width);
            event = triggerEvent(elem, "lazybeforesizes", {width, dataAttr: !!dataAttr});
            if (!event.defaultPrevented) {
              width = event.detail.width;
              if (width && width !== elem._lazysizesWidth) {
                sizeElement(elem, parent, event, width);
              }
            }
          }
        };
        var updateElementsSizes = function() {
          var i;
          var len = autosizesElems.length;
          if (len) {
            i = 0;
            for (; i < len; i++) {
              getSizeElement(autosizesElems[i]);
            }
          }
        };
        var debouncedUpdateElementsSizes = debounce(updateElementsSizes);
        return {
          _: function() {
            autosizesElems = document.getElementsByClassName(lazySizesCfg.autosizesClass);
            addEventListener("resize", debouncedUpdateElementsSizes);
          },
          checkElems: debouncedUpdateElementsSizes,
          updateElem: getSizeElement
        };
      }();
      var init = function() {
        if (!init.i && document.getElementsByClassName) {
          init.i = true;
          autoSizer._();
          loader._();
        }
      };
      setTimeout(function() {
        if (lazySizesCfg.init) {
          init();
        }
      });
      lazysizes = {
        cfg: lazySizesCfg,
        autoSizer,
        loader,
        init,
        uP: updatePolyfill,
        aC: addClass,
        rC: removeClass,
        hC: hasClass,
        fire: triggerEvent,
        gW: getWidth,
        rAF
      };
      return lazysizes;
    });
  });

  // <stdin>
  var import_lazysizes = __toModule(require_lazysizes());
})();

;
(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __markAsModule = (target) => __defProp(target, "__esModule", {value: true});
  var __commonJS = (cb, mod) => () => (mod || cb((mod = {exports: {}}).exports, mod), mod.exports);
  var __reExport = (target, module, desc) => {
    if (module && typeof module === "object" || typeof module === "function") {
      for (let key of __getOwnPropNames(module))
        if (!__hasOwnProp.call(target, key) && key !== "default")
          __defProp(target, key, {get: () => module[key], enumerable: !(desc = __getOwnPropDesc(module, key)) || desc.enumerable});
    }
    return target;
  };
  var __toModule = (module) => {
    return __reExport(__markAsModule(__defProp(module != null ? __create(__getProtoOf(module)) : {}, "default", module && module.__esModule && "default" in module ? {get: () => module.default, enumerable: true} : {value: module, enumerable: true})), module);
  };

  // node_modules/clipboard/dist/clipboard.js
  var require_clipboard = __commonJS((exports, module) => {
    (function webpackUniversalModuleDefinition(root, factory) {
      if (typeof exports === "object" && typeof module === "object")
        module.exports = factory();
      else if (typeof define === "function" && define.amd)
        define([], factory);
      else if (typeof exports === "object")
        exports["ClipboardJS"] = factory();
      else
        root["ClipboardJS"] = factory();
    })(exports, function() {
      return function() {
        var __webpack_modules__ = {
          134: function(__unused_webpack_module, __webpack_exports__, __webpack_require__2) {
            "use strict";
            __webpack_require__2.d(__webpack_exports__, {
              default: function() {
                return clipboard2;
              }
            });
            var tiny_emitter = __webpack_require__2(279);
            var tiny_emitter_default = /* @__PURE__ */ __webpack_require__2.n(tiny_emitter);
            var listen = __webpack_require__2(370);
            var listen_default = /* @__PURE__ */ __webpack_require__2.n(listen);
            var src_select = __webpack_require__2(817);
            var select_default = /* @__PURE__ */ __webpack_require__2.n(src_select);
            ;
            function _typeof(obj) {
              "@babel/helpers - typeof";
              if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
                _typeof = function _typeof2(obj2) {
                  return typeof obj2;
                };
              } else {
                _typeof = function _typeof2(obj2) {
                  return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
                };
              }
              return _typeof(obj);
            }
            function _classCallCheck(instance, Constructor) {
              if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
              }
            }
            function _defineProperties(target, props) {
              for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor)
                  descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
              }
            }
            function _createClass(Constructor, protoProps, staticProps) {
              if (protoProps)
                _defineProperties(Constructor.prototype, protoProps);
              if (staticProps)
                _defineProperties(Constructor, staticProps);
              return Constructor;
            }
            var ClipboardAction = /* @__PURE__ */ function() {
              function ClipboardAction2(options) {
                _classCallCheck(this, ClipboardAction2);
                this.resolveOptions(options);
                this.initSelection();
              }
              _createClass(ClipboardAction2, [{
                key: "resolveOptions",
                value: function resolveOptions() {
                  var options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
                  this.action = options.action;
                  this.container = options.container;
                  this.emitter = options.emitter;
                  this.target = options.target;
                  this.text = options.text;
                  this.trigger = options.trigger;
                  this.selectedText = "";
                }
              }, {
                key: "initSelection",
                value: function initSelection() {
                  if (this.text) {
                    this.selectFake();
                  } else if (this.target) {
                    this.selectTarget();
                  }
                }
              }, {
                key: "createFakeElement",
                value: function createFakeElement() {
                  var isRTL = document.documentElement.getAttribute("dir") === "rtl";
                  this.fakeElem = document.createElement("textarea");
                  this.fakeElem.style.fontSize = "12pt";
                  this.fakeElem.style.border = "0";
                  this.fakeElem.style.padding = "0";
                  this.fakeElem.style.margin = "0";
                  this.fakeElem.style.position = "absolute";
                  this.fakeElem.style[isRTL ? "right" : "left"] = "-9999px";
                  var yPosition = window.pageYOffset || document.documentElement.scrollTop;
                  this.fakeElem.style.top = "".concat(yPosition, "px");
                  this.fakeElem.setAttribute("readonly", "");
                  this.fakeElem.value = this.text;
                  return this.fakeElem;
                }
              }, {
                key: "selectFake",
                value: function selectFake() {
                  var _this = this;
                  var fakeElem = this.createFakeElement();
                  this.fakeHandlerCallback = function() {
                    return _this.removeFake();
                  };
                  this.fakeHandler = this.container.addEventListener("click", this.fakeHandlerCallback) || true;
                  this.container.appendChild(fakeElem);
                  this.selectedText = select_default()(fakeElem);
                  this.copyText();
                  this.removeFake();
                }
              }, {
                key: "removeFake",
                value: function removeFake() {
                  if (this.fakeHandler) {
                    this.container.removeEventListener("click", this.fakeHandlerCallback);
                    this.fakeHandler = null;
                    this.fakeHandlerCallback = null;
                  }
                  if (this.fakeElem) {
                    this.container.removeChild(this.fakeElem);
                    this.fakeElem = null;
                  }
                }
              }, {
                key: "selectTarget",
                value: function selectTarget() {
                  this.selectedText = select_default()(this.target);
                  this.copyText();
                }
              }, {
                key: "copyText",
                value: function copyText() {
                  var succeeded;
                  try {
                    succeeded = document.execCommand(this.action);
                  } catch (err) {
                    succeeded = false;
                  }
                  this.handleResult(succeeded);
                }
              }, {
                key: "handleResult",
                value: function handleResult(succeeded) {
                  this.emitter.emit(succeeded ? "success" : "error", {
                    action: this.action,
                    text: this.selectedText,
                    trigger: this.trigger,
                    clearSelection: this.clearSelection.bind(this)
                  });
                }
              }, {
                key: "clearSelection",
                value: function clearSelection() {
                  if (this.trigger) {
                    this.trigger.focus();
                  }
                  document.activeElement.blur();
                  window.getSelection().removeAllRanges();
                }
              }, {
                key: "destroy",
                value: function destroy() {
                  this.removeFake();
                }
              }, {
                key: "action",
                set: function set() {
                  var action = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "copy";
                  this._action = action;
                  if (this._action !== "copy" && this._action !== "cut") {
                    throw new Error('Invalid "action" value, use either "copy" or "cut"');
                  }
                },
                get: function get() {
                  return this._action;
                }
              }, {
                key: "target",
                set: function set(target) {
                  if (target !== void 0) {
                    if (target && _typeof(target) === "object" && target.nodeType === 1) {
                      if (this.action === "copy" && target.hasAttribute("disabled")) {
                        throw new Error('Invalid "target" attribute. Please use "readonly" instead of "disabled" attribute');
                      }
                      if (this.action === "cut" && (target.hasAttribute("readonly") || target.hasAttribute("disabled"))) {
                        throw new Error(`Invalid "target" attribute. You can't cut text from elements with "readonly" or "disabled" attributes`);
                      }
                      this._target = target;
                    } else {
                      throw new Error('Invalid "target" value, use a valid Element');
                    }
                  }
                },
                get: function get() {
                  return this._target;
                }
              }]);
              return ClipboardAction2;
            }();
            var clipboard_action = ClipboardAction;
            ;
            function clipboard_typeof(obj) {
              "@babel/helpers - typeof";
              if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
                clipboard_typeof = function _typeof2(obj2) {
                  return typeof obj2;
                };
              } else {
                clipboard_typeof = function _typeof2(obj2) {
                  return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
                };
              }
              return clipboard_typeof(obj);
            }
            function clipboard_classCallCheck(instance, Constructor) {
              if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
              }
            }
            function clipboard_defineProperties(target, props) {
              for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor)
                  descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
              }
            }
            function clipboard_createClass(Constructor, protoProps, staticProps) {
              if (protoProps)
                clipboard_defineProperties(Constructor.prototype, protoProps);
              if (staticProps)
                clipboard_defineProperties(Constructor, staticProps);
              return Constructor;
            }
            function _inherits(subClass, superClass) {
              if (typeof superClass !== "function" && superClass !== null) {
                throw new TypeError("Super expression must either be null or a function");
              }
              subClass.prototype = Object.create(superClass && superClass.prototype, {constructor: {value: subClass, writable: true, configurable: true}});
              if (superClass)
                _setPrototypeOf(subClass, superClass);
            }
            function _setPrototypeOf(o, p) {
              _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf2(o2, p2) {
                o2.__proto__ = p2;
                return o2;
              };
              return _setPrototypeOf(o, p);
            }
            function _createSuper(Derived) {
              var hasNativeReflectConstruct = _isNativeReflectConstruct();
              return function _createSuperInternal() {
                var Super = _getPrototypeOf(Derived), result;
                if (hasNativeReflectConstruct) {
                  var NewTarget = _getPrototypeOf(this).constructor;
                  result = Reflect.construct(Super, arguments, NewTarget);
                } else {
                  result = Super.apply(this, arguments);
                }
                return _possibleConstructorReturn(this, result);
              };
            }
            function _possibleConstructorReturn(self, call) {
              if (call && (clipboard_typeof(call) === "object" || typeof call === "function")) {
                return call;
              }
              return _assertThisInitialized(self);
            }
            function _assertThisInitialized(self) {
              if (self === void 0) {
                throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
              }
              return self;
            }
            function _isNativeReflectConstruct() {
              if (typeof Reflect === "undefined" || !Reflect.construct)
                return false;
              if (Reflect.construct.sham)
                return false;
              if (typeof Proxy === "function")
                return true;
              try {
                Date.prototype.toString.call(Reflect.construct(Date, [], function() {
                }));
                return true;
              } catch (e) {
                return false;
              }
            }
            function _getPrototypeOf(o) {
              _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf2(o2) {
                return o2.__proto__ || Object.getPrototypeOf(o2);
              };
              return _getPrototypeOf(o);
            }
            function getAttributeValue(suffix, element) {
              var attribute = "data-clipboard-".concat(suffix);
              if (!element.hasAttribute(attribute)) {
                return;
              }
              return element.getAttribute(attribute);
            }
            var Clipboard2 = /* @__PURE__ */ function(_Emitter) {
              _inherits(Clipboard3, _Emitter);
              var _super = _createSuper(Clipboard3);
              function Clipboard3(trigger, options) {
                var _this;
                clipboard_classCallCheck(this, Clipboard3);
                _this = _super.call(this);
                _this.resolveOptions(options);
                _this.listenClick(trigger);
                return _this;
              }
              clipboard_createClass(Clipboard3, [{
                key: "resolveOptions",
                value: function resolveOptions() {
                  var options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
                  this.action = typeof options.action === "function" ? options.action : this.defaultAction;
                  this.target = typeof options.target === "function" ? options.target : this.defaultTarget;
                  this.text = typeof options.text === "function" ? options.text : this.defaultText;
                  this.container = clipboard_typeof(options.container) === "object" ? options.container : document.body;
                }
              }, {
                key: "listenClick",
                value: function listenClick(trigger) {
                  var _this2 = this;
                  this.listener = listen_default()(trigger, "click", function(e) {
                    return _this2.onClick(e);
                  });
                }
              }, {
                key: "onClick",
                value: function onClick(e) {
                  var trigger = e.delegateTarget || e.currentTarget;
                  if (this.clipboardAction) {
                    this.clipboardAction = null;
                  }
                  this.clipboardAction = new clipboard_action({
                    action: this.action(trigger),
                    target: this.target(trigger),
                    text: this.text(trigger),
                    container: this.container,
                    trigger,
                    emitter: this
                  });
                }
              }, {
                key: "defaultAction",
                value: function defaultAction(trigger) {
                  return getAttributeValue("action", trigger);
                }
              }, {
                key: "defaultTarget",
                value: function defaultTarget(trigger) {
                  var selector = getAttributeValue("target", trigger);
                  if (selector) {
                    return document.querySelector(selector);
                  }
                }
              }, {
                key: "defaultText",
                value: function defaultText(trigger) {
                  return getAttributeValue("text", trigger);
                }
              }, {
                key: "destroy",
                value: function destroy() {
                  this.listener.destroy();
                  if (this.clipboardAction) {
                    this.clipboardAction.destroy();
                    this.clipboardAction = null;
                  }
                }
              }], [{
                key: "isSupported",
                value: function isSupported() {
                  var action = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : ["copy", "cut"];
                  var actions = typeof action === "string" ? [action] : action;
                  var support = !!document.queryCommandSupported;
                  actions.forEach(function(action2) {
                    support = support && !!document.queryCommandSupported(action2);
                  });
                  return support;
                }
              }]);
              return Clipboard3;
            }(tiny_emitter_default());
            var clipboard2 = Clipboard2;
          },
          828: function(module2) {
            var DOCUMENT_NODE_TYPE = 9;
            if (typeof Element !== "undefined" && !Element.prototype.matches) {
              var proto = Element.prototype;
              proto.matches = proto.matchesSelector || proto.mozMatchesSelector || proto.msMatchesSelector || proto.oMatchesSelector || proto.webkitMatchesSelector;
            }
            function closest(element, selector) {
              while (element && element.nodeType !== DOCUMENT_NODE_TYPE) {
                if (typeof element.matches === "function" && element.matches(selector)) {
                  return element;
                }
                element = element.parentNode;
              }
            }
            module2.exports = closest;
          },
          438: function(module2, __unused_webpack_exports, __webpack_require__2) {
            var closest = __webpack_require__2(828);
            function _delegate(element, selector, type, callback, useCapture) {
              var listenerFn = listener.apply(this, arguments);
              element.addEventListener(type, listenerFn, useCapture);
              return {
                destroy: function() {
                  element.removeEventListener(type, listenerFn, useCapture);
                }
              };
            }
            function delegate(elements, selector, type, callback, useCapture) {
              if (typeof elements.addEventListener === "function") {
                return _delegate.apply(null, arguments);
              }
              if (typeof type === "function") {
                return _delegate.bind(null, document).apply(null, arguments);
              }
              if (typeof elements === "string") {
                elements = document.querySelectorAll(elements);
              }
              return Array.prototype.map.call(elements, function(element) {
                return _delegate(element, selector, type, callback, useCapture);
              });
            }
            function listener(element, selector, type, callback) {
              return function(e) {
                e.delegateTarget = closest(e.target, selector);
                if (e.delegateTarget) {
                  callback.call(element, e);
                }
              };
            }
            module2.exports = delegate;
          },
          879: function(__unused_webpack_module, exports2) {
            exports2.node = function(value) {
              return value !== void 0 && value instanceof HTMLElement && value.nodeType === 1;
            };
            exports2.nodeList = function(value) {
              var type = Object.prototype.toString.call(value);
              return value !== void 0 && (type === "[object NodeList]" || type === "[object HTMLCollection]") && "length" in value && (value.length === 0 || exports2.node(value[0]));
            };
            exports2.string = function(value) {
              return typeof value === "string" || value instanceof String;
            };
            exports2.fn = function(value) {
              var type = Object.prototype.toString.call(value);
              return type === "[object Function]";
            };
          },
          370: function(module2, __unused_webpack_exports, __webpack_require__2) {
            var is = __webpack_require__2(879);
            var delegate = __webpack_require__2(438);
            function listen(target, type, callback) {
              if (!target && !type && !callback) {
                throw new Error("Missing required arguments");
              }
              if (!is.string(type)) {
                throw new TypeError("Second argument must be a String");
              }
              if (!is.fn(callback)) {
                throw new TypeError("Third argument must be a Function");
              }
              if (is.node(target)) {
                return listenNode(target, type, callback);
              } else if (is.nodeList(target)) {
                return listenNodeList(target, type, callback);
              } else if (is.string(target)) {
                return listenSelector(target, type, callback);
              } else {
                throw new TypeError("First argument must be a String, HTMLElement, HTMLCollection, or NodeList");
              }
            }
            function listenNode(node, type, callback) {
              node.addEventListener(type, callback);
              return {
                destroy: function() {
                  node.removeEventListener(type, callback);
                }
              };
            }
            function listenNodeList(nodeList, type, callback) {
              Array.prototype.forEach.call(nodeList, function(node) {
                node.addEventListener(type, callback);
              });
              return {
                destroy: function() {
                  Array.prototype.forEach.call(nodeList, function(node) {
                    node.removeEventListener(type, callback);
                  });
                }
              };
            }
            function listenSelector(selector, type, callback) {
              return delegate(document.body, selector, type, callback);
            }
            module2.exports = listen;
          },
          817: function(module2) {
            function select(element) {
              var selectedText;
              if (element.nodeName === "SELECT") {
                element.focus();
                selectedText = element.value;
              } else if (element.nodeName === "INPUT" || element.nodeName === "TEXTAREA") {
                var isReadOnly = element.hasAttribute("readonly");
                if (!isReadOnly) {
                  element.setAttribute("readonly", "");
                }
                element.select();
                element.setSelectionRange(0, element.value.length);
                if (!isReadOnly) {
                  element.removeAttribute("readonly");
                }
                selectedText = element.value;
              } else {
                if (element.hasAttribute("contenteditable")) {
                  element.focus();
                }
                var selection = window.getSelection();
                var range = document.createRange();
                range.selectNodeContents(element);
                selection.removeAllRanges();
                selection.addRange(range);
                selectedText = selection.toString();
              }
              return selectedText;
            }
            module2.exports = select;
          },
          279: function(module2) {
            function E() {
            }
            E.prototype = {
              on: function(name, callback, ctx) {
                var e = this.e || (this.e = {});
                (e[name] || (e[name] = [])).push({
                  fn: callback,
                  ctx
                });
                return this;
              },
              once: function(name, callback, ctx) {
                var self = this;
                function listener() {
                  self.off(name, listener);
                  callback.apply(ctx, arguments);
                }
                ;
                listener._ = callback;
                return this.on(name, listener, ctx);
              },
              emit: function(name) {
                var data = [].slice.call(arguments, 1);
                var evtArr = ((this.e || (this.e = {}))[name] || []).slice();
                var i = 0;
                var len = evtArr.length;
                for (i; i < len; i++) {
                  evtArr[i].fn.apply(evtArr[i].ctx, data);
                }
                return this;
              },
              off: function(name, callback) {
                var e = this.e || (this.e = {});
                var evts = e[name];
                var liveEvents = [];
                if (evts && callback) {
                  for (var i = 0, len = evts.length; i < len; i++) {
                    if (evts[i].fn !== callback && evts[i].fn._ !== callback)
                      liveEvents.push(evts[i]);
                  }
                }
                liveEvents.length ? e[name] = liveEvents : delete e[name];
                return this;
              }
            };
            module2.exports = E;
            module2.exports.TinyEmitter = E;
          }
        };
        var __webpack_module_cache__ = {};
        function __webpack_require__(moduleId) {
          if (__webpack_module_cache__[moduleId]) {
            return __webpack_module_cache__[moduleId].exports;
          }
          var module2 = __webpack_module_cache__[moduleId] = {
            exports: {}
          };
          __webpack_modules__[moduleId](module2, module2.exports, __webpack_require__);
          return module2.exports;
        }
        !function() {
          __webpack_require__.n = function(module2) {
            var getter = module2 && module2.__esModule ? function() {
              return module2["default"];
            } : function() {
              return module2;
            };
            __webpack_require__.d(getter, {a: getter});
            return getter;
          };
        }();
        !function() {
          __webpack_require__.d = function(exports2, definition) {
            for (var key in definition) {
              if (__webpack_require__.o(definition, key) && !__webpack_require__.o(exports2, key)) {
                Object.defineProperty(exports2, key, {enumerable: true, get: definition[key]});
              }
            }
          };
        }();
        !function() {
          __webpack_require__.o = function(obj, prop) {
            return Object.prototype.hasOwnProperty.call(obj, prop);
          };
        }();
        return __webpack_require__(134);
      }().default;
    });
  });

  // <stdin>
  var import_clipboard = __toModule(require_clipboard());
  var clipboard = new import_clipboard.default(".btn-clipboard");
  clipboard.on("success", function(e) {
    e.clearSelection();
  });
  clipboard.on("error", function(e) {
    console.error("Action:", e.action);
    console.error("Trigger:", e.trigger);
  });
})();
/*!
 * clipboard.js v2.0.8
 * https://clipboardjs.com/
 *
 * Licensed MIT © Zeno Rocha
 */

;
(() => {
  // node_modules/instant.page/instantpage.js
  var mouseoverTimer;
  var lastTouchTimestamp;
  var prefetches = new Set();
  var prefetchElement = document.createElement("link");
  var isSupported = prefetchElement.relList && prefetchElement.relList.supports && prefetchElement.relList.supports("prefetch") && window.IntersectionObserver && "isIntersecting" in IntersectionObserverEntry.prototype;
  var allowQueryString = "instantAllowQueryString" in document.body.dataset;
  var allowExternalLinks = "instantAllowExternalLinks" in document.body.dataset;
  var useWhitelist = "instantWhitelist" in document.body.dataset;
  var mousedownShortcut = "instantMousedownShortcut" in document.body.dataset;
  var DELAY_TO_NOT_BE_CONSIDERED_A_TOUCH_INITIATED_ACTION = 1111;
  var delayOnHover = 65;
  var useMousedown = false;
  var useMousedownOnly = false;
  var useViewport = false;
  if ("instantIntensity" in document.body.dataset) {
    const intensity = document.body.dataset.instantIntensity;
    if (intensity.substr(0, "mousedown".length) == "mousedown") {
      useMousedown = true;
      if (intensity == "mousedown-only") {
        useMousedownOnly = true;
      }
    } else if (intensity.substr(0, "viewport".length) == "viewport") {
      if (!(navigator.connection && (navigator.connection.saveData || navigator.connection.effectiveType && navigator.connection.effectiveType.includes("2g")))) {
        if (intensity == "viewport") {
          if (document.documentElement.clientWidth * document.documentElement.clientHeight < 45e4) {
            useViewport = true;
          }
        } else if (intensity == "viewport-all") {
          useViewport = true;
        }
      }
    } else {
      const milliseconds = parseInt(intensity);
      if (!isNaN(milliseconds)) {
        delayOnHover = milliseconds;
      }
    }
  }
  if (isSupported) {
    const eventListenersOptions = {
      capture: true,
      passive: true
    };
    if (!useMousedownOnly) {
      document.addEventListener("touchstart", touchstartListener, eventListenersOptions);
    }
    if (!useMousedown) {
      document.addEventListener("mouseover", mouseoverListener, eventListenersOptions);
    } else if (!mousedownShortcut) {
      document.addEventListener("mousedown", mousedownListener, eventListenersOptions);
    }
    if (mousedownShortcut) {
      document.addEventListener("mousedown", mousedownShortcutListener, eventListenersOptions);
    }
    if (useViewport) {
      let triggeringFunction;
      if (window.requestIdleCallback) {
        triggeringFunction = (callback) => {
          requestIdleCallback(callback, {
            timeout: 1500
          });
        };
      } else {
        triggeringFunction = (callback) => {
          callback();
        };
      }
      triggeringFunction(() => {
        const intersectionObserver = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const linkElement = entry.target;
              intersectionObserver.unobserve(linkElement);
              preload(linkElement.href);
            }
          });
        });
        document.querySelectorAll("a").forEach((linkElement) => {
          if (isPreloadable(linkElement)) {
            intersectionObserver.observe(linkElement);
          }
        });
      });
    }
  }
  function touchstartListener(event) {
    lastTouchTimestamp = performance.now();
    const linkElement = event.target.closest("a");
    if (!isPreloadable(linkElement)) {
      return;
    }
    preload(linkElement.href);
  }
  function mouseoverListener(event) {
    if (performance.now() - lastTouchTimestamp < DELAY_TO_NOT_BE_CONSIDERED_A_TOUCH_INITIATED_ACTION) {
      return;
    }
    const linkElement = event.target.closest("a");
    if (!isPreloadable(linkElement)) {
      return;
    }
    linkElement.addEventListener("mouseout", mouseoutListener, {passive: true});
    mouseoverTimer = setTimeout(() => {
      preload(linkElement.href);
      mouseoverTimer = void 0;
    }, delayOnHover);
  }
  function mousedownListener(event) {
    const linkElement = event.target.closest("a");
    if (!isPreloadable(linkElement)) {
      return;
    }
    preload(linkElement.href);
  }
  function mouseoutListener(event) {
    if (event.relatedTarget && event.target.closest("a") == event.relatedTarget.closest("a")) {
      return;
    }
    if (mouseoverTimer) {
      clearTimeout(mouseoverTimer);
      mouseoverTimer = void 0;
    }
  }
  function mousedownShortcutListener(event) {
    if (performance.now() - lastTouchTimestamp < DELAY_TO_NOT_BE_CONSIDERED_A_TOUCH_INITIATED_ACTION) {
      return;
    }
    const linkElement = event.target.closest("a");
    if (event.which > 1 || event.metaKey || event.ctrlKey) {
      return;
    }
    if (!linkElement) {
      return;
    }
    linkElement.addEventListener("click", function(event2) {
      if (event2.detail == 1337) {
        return;
      }
      event2.preventDefault();
    }, {capture: true, passive: false, once: true});
    const customEvent = new MouseEvent("click", {view: window, bubbles: true, cancelable: false, detail: 1337});
    linkElement.dispatchEvent(customEvent);
  }
  function isPreloadable(linkElement) {
    if (!linkElement || !linkElement.href) {
      return;
    }
    if (useWhitelist && !("instant" in linkElement.dataset)) {
      return;
    }
    if (!allowExternalLinks && linkElement.origin != location.origin && !("instant" in linkElement.dataset)) {
      return;
    }
    if (!["http:", "https:"].includes(linkElement.protocol)) {
      return;
    }
    if (linkElement.protocol == "http:" && location.protocol == "https:") {
      return;
    }
    if (!allowQueryString && linkElement.search && !("instant" in linkElement.dataset)) {
      return;
    }
    if (linkElement.hash && linkElement.pathname + linkElement.search == location.pathname + location.search) {
      return;
    }
    if ("noInstant" in linkElement.dataset) {
      return;
    }
    return true;
  }
  function preload(url) {
    if (prefetches.has(url)) {
      return;
    }
    const prefetcher = document.createElement("link");
    prefetcher.rel = "prefetch";
    prefetcher.href = url;
    document.head.appendChild(prefetcher);
    prefetches.add(url);
  }
})();
/*! instant.page v5.1.0 - (C) 2019-2020 Alexandre Dieulot - https://instant.page/license */

;
/*
 FlexSearch v0.6.30
 Copyright 2019 Nextapps GmbH
 Author: Thomas Wilkerling
 Released under the Apache 2.0 Licence
 https://github.com/nextapps-de/flexsearch
*/
'use strict';(function(K,R,w){let L;(L=w.define)&&L.amd?L([],function(){return R}):(L=w.modules)?L[K.toLowerCase()]=R:"object"===typeof exports?module.exports=R:w[K]=R})("FlexSearch",function ma(K){function w(a,c){const b=c?c.id:a&&a.id;this.id=b||0===b?b:na++;this.init(a,c);fa(this,"index",function(){return this.a?Object.keys(this.a.index[this.a.keys[0]].c):Object.keys(this.c)});fa(this,"length",function(){return this.index.length})}function L(a,c,b,d){this.u!==this.g&&(this.o=this.o.concat(b),this.u++,
d&&this.o.length>=d&&(this.u=this.g),this.u===this.g&&(this.cache&&this.j.set(c,this.o),this.F&&this.F(this.o)));return this}function S(a){const c=B();for(const b in a)if(a.hasOwnProperty(b)){const d=a[b];F(d)?c[b]=d.slice(0):G(d)?c[b]=S(d):c[b]=d}return c}function W(a,c){const b=a.length,d=O(c),e=[];for(let f=0,h=0;f<b;f++){const g=a[f];if(d&&c(g)||!d&&!c[g])e[h++]=g}return e}function P(a,c,b,d,e,f,h,g,k,l){b=ha(b,h?0:e,g,f,c,k,l);let p;g&&(g=b.page,p=b.next,b=b.result);if(h)c=this.where(h,null,
e,b);else{c=b;b=this.l;e=c.length;f=Array(e);for(h=0;h<e;h++)f[h]=b[c[h]];c=f}b=c;d&&(O(d)||(M=d.split(":"),1<M.length?d=oa:(M=M[0],d=pa)),b.sort(d));b=T(g,p,b);this.cache&&this.j.set(a,b);return b}function fa(a,c,b){Object.defineProperty(a,c,{get:b})}function r(a){return new RegExp(a,"g")}function Q(a,c){for(let b=0;b<c.length;b+=2)a=a.replace(c[b],c[b+1]);return a}function V(a,c,b,d,e,f,h,g){if(c[b])return c[b];e=e?(g-(h||g/1.5))*f+(h||g/1.5)*e:f;c[b]=e;e>=h&&(a=a[g-(e+.5>>0)],a=a[b]||(a[b]=[]),
a[a.length]=d);return e}function ba(a,c){if(a){const b=Object.keys(a);for(let d=0,e=b.length;d<e;d++){const f=b[d],h=a[f];if(h)for(let g=0,k=h.length;g<k;g++)if(h[g]===c){1===k?delete a[f]:h.splice(g,1);break}else G(h[g])&&ba(h[g],c)}}}function ca(a){let c="",b="";var d="";for(let e=0;e<a.length;e++){const f=a[e];if(f!==b)if(e&&"h"===f){if(d="a"===d||"e"===d||"i"===d||"o"===d||"u"===d||"y"===d,("a"===b||"e"===b||"i"===b||"o"===b||"u"===b||"y"===b)&&d||" "===b)c+=f}else c+=f;d=e===a.length-1?"":a[e+
1];b=f}return c}function qa(a,c){a=a.length-c.length;return 0>a?1:a?-1:0}function pa(a,c){a=a[M];c=c[M];return a<c?-1:a>c?1:0}function oa(a,c){const b=M.length;for(let d=0;d<b;d++)a=a[M[d]],c=c[M[d]];return a<c?-1:a>c?1:0}function T(a,c,b){return a?{page:a,next:c?""+c:null,result:b}:b}function ha(a,c,b,d,e,f,h){let g,k=[];if(!0===b){b="0";var l=""}else l=b&&b.split(":");const p=a.length;if(1<p){const y=B(),t=[];let v,x;var n=0,m;let I;var u=!0;let D,E=0,N,da,X,ea;l&&(2===l.length?(X=l,l=!1):l=ea=
parseInt(l[0],10));if(h){for(v=B();n<p;n++)if("not"===e[n])for(x=a[n],I=x.length,m=0;m<I;m++)v["@"+x[m]]=1;else da=n+1;if(C(da))return T(b,g,k);n=0}else N=J(e)&&e;let Y;for(;n<p;n++){const ra=n===(da||p)-1;if(!N||!n)if((m=N||e&&e[n])&&"and"!==m)if("or"===m)Y=!1;else continue;else Y=f=!0;x=a[n];if(I=x.length){if(u)if(D){var q=D.length;for(m=0;m<q;m++){u=D[m];var A="@"+u;h&&v[A]||(y[A]=1,f||(k[E++]=u))}D=null;u=!1}else{D=x;continue}A=!1;for(m=0;m<I;m++){q=x[m];var z="@"+q;const Z=f?y[z]||0:n;if(!(!Z&&
!d||h&&v[z]||!f&&y[z]))if(Z===n){if(ra){if(!ea||--ea<E)if(k[E++]=q,c&&E===c)return T(b,E+(l||0),k)}else y[z]=n+1;A=!0}else d&&(z=t[Z]||(t[Z]=[]),z[z.length]=q)}if(Y&&!A&&!d)break}else if(Y&&!d)return T(b,g,x)}if(D)if(n=D.length,h)for(m=l?parseInt(l,10):0;m<n;m++)a=D[m],v["@"+a]||(k[E++]=a);else k=D;if(d)for(E=k.length,X?(n=parseInt(X[0],10)+1,m=parseInt(X[1],10)+1):(n=t.length,m=0);n--;)if(q=t[n]){for(I=q.length;m<I;m++)if(d=q[m],!h||!v["@"+d])if(k[E++]=d,c&&E===c)return T(b,n+":"+m,k);m=0}}else!p||
e&&"not"===e[0]||(k=a[0],l&&(l=parseInt(l[0],10)));c&&(h=k.length,l&&l>h&&(l=0),l=l||0,g=l+c,g<h?k=k.slice(l,g):(g=0,l&&(k=k.slice(l))));return T(b,g,k)}function J(a){return"string"===typeof a}function F(a){return a.constructor===Array}function O(a){return"function"===typeof a}function G(a){return"object"===typeof a}function C(a){return"undefined"===typeof a}function ia(a){const c=Array(a);for(let b=0;b<a;b++)c[b]=B();return c}function B(){return Object.create(null)}function sa(){let a,c;self.onmessage=
function(b){if(b=b.data)if(b.search){const d=c.search(b.content,b.threshold?{limit:b.limit,threshold:b.threshold,where:b.where}:b.limit);self.postMessage({id:a,content:b.content,limit:b.limit,result:d})}else b.add?c.add(b.id,b.content):b.update?c.update(b.id,b.content):b.remove?c.remove(b.id):b.clear?c.clear():b.info?(b=c.info(),b.worker=a,console.log(b)):b.register&&(a=b.id,b.options.cache=!1,b.options.async=!1,b.options.worker=!1,c=(new Function(b.register.substring(b.register.indexOf("{")+1,b.register.lastIndexOf("}"))))(),
c=new c(b.options))}}function ta(a,c,b,d){a=K("flexsearch","id"+a,sa,function(f){(f=f.data)&&f.result&&d(f.id,f.content,f.result,f.limit,f.where,f.cursor,f.suggest)},c);const e=ma.toString();b.id=c;a.postMessage({register:e,options:b,id:c});return a}const H={encode:"icase",f:"forward",split:/\W+/,cache:!1,async:!1,g:!1,D:!1,a:!1,b:9,threshold:0,depth:0},ja={memory:{encode:"extra",f:"strict",threshold:0,b:1},speed:{encode:"icase",f:"strict",threshold:1,b:3,depth:2},match:{encode:"extra",f:"full",threshold:1,
b:3},score:{encode:"extra",f:"strict",threshold:1,b:9,depth:4},balance:{encode:"balance",f:"strict",threshold:0,b:3,depth:3},fast:{encode:"icase",f:"strict",threshold:8,b:9,depth:1}},aa=[];let na=0;const ka={},la={};w.create=function(a,c){return new w(a,c)};w.registerMatcher=function(a){for(const c in a)a.hasOwnProperty(c)&&aa.push(r(c),a[c]);return this};w.registerEncoder=function(a,c){U[a]=c.bind(U);return this};w.registerLanguage=function(a,c){ka[a]=c.filter;la[a]=c.stemmer;return this};w.encode=
function(a,c){return U[a](c)};w.prototype.init=function(a,c){this.v=[];if(c){var b=c.preset;a=c}else a||(a=H),b=a.preset;c={};J(a)?(c=ja[a],a={}):b&&(c=ja[b]);if(b=a.worker)if("undefined"===typeof Worker)a.worker=!1,this.m=null;else{var d=parseInt(b,10)||4;this.C=-1;this.u=0;this.o=[];this.F=null;this.m=Array(d);for(var e=0;e<d;e++)this.m[e]=ta(this.id,e,a,L.bind(this))}this.f=a.tokenize||c.f||this.f||H.f;this.split=C(b=a.split)?this.split||H.split:J(b)?r(b):b;this.D=a.rtl||this.D||H.D;this.async=
"undefined"===typeof Promise||C(b=a.async)?this.async||H.async:b;this.g=C(b=a.worker)?this.g||H.g:b;this.threshold=C(b=a.threshold)?c.threshold||this.threshold||H.threshold:b;this.b=C(b=a.resolution)?b=c.b||this.b||H.b:b;b<=this.threshold&&(this.b=this.threshold+1);this.depth="strict"!==this.f||C(b=a.depth)?c.depth||this.depth||H.depth:b;this.w=(b=C(b=a.encode)?c.encode||H.encode:b)&&U[b]&&U[b].bind(U)||(O(b)?b:this.w||!1);(b=a.matcher)&&this.addMatcher(b);if(b=(c=a.lang)||a.filter){J(b)&&(b=ka[b]);
if(F(b)){d=this.w;e=B();for(var f=0;f<b.length;f++){var h=d?d(b[f]):b[f];e[h]=1}b=e}this.filter=b}if(b=c||a.stemmer){var g;c=J(b)?la[b]:b;d=this.w;e=[];for(g in c)c.hasOwnProperty(g)&&(f=d?d(g):g,e.push(r(f+"($|\\W)"),d?d(c[g]):c[g]));this.stemmer=g=e}this.a=e=(b=a.doc)?S(b):this.a||H.a;this.i=ia(this.b-(this.threshold||0));this.h=B();this.c=B();if(e){this.l=B();a.doc=null;g=e.index={};c=e.keys=[];d=e.field;f=e.tag;h=e.store;F(e.id)||(e.id=e.id.split(":"));if(h){var k=B();if(J(h))k[h]=1;else if(F(h))for(let l=
0;l<h.length;l++)k[h[l]]=1;else G(h)&&(k=h);e.store=k}if(f){this.G=B();h=B();if(d)if(J(d))h[d]=a;else if(F(d))for(k=0;k<d.length;k++)h[d[k]]=a;else G(d)&&(h=d);F(f)||(e.tag=f=[f]);for(d=0;d<f.length;d++)this.G[f[d]]=B();this.I=f;d=h}if(d){let l;F(d)||(G(d)?(l=d,e.field=d=Object.keys(d)):e.field=d=[d]);for(e=0;e<d.length;e++)f=d[e],F(f)||(l&&(a=l[f]),c[e]=f,d[e]=f.split(":")),g[f]=new w(a)}a.doc=b}this.B=!0;this.j=(this.cache=b=C(b=a.cache)?this.cache||H.cache:b)?new ua(b):!1;return this};w.prototype.encode=
function(a){a&&(aa.length&&(a=Q(a,aa)),this.v.length&&(a=Q(a,this.v)),this.w&&(a=this.w(a)),this.stemmer&&(a=Q(a,this.stemmer)));return a};w.prototype.addMatcher=function(a){const c=this.v;for(const b in a)a.hasOwnProperty(b)&&c.push(r(b),a[b]);return this};w.prototype.add=function(a,c,b,d,e){if(this.a&&G(a))return this.A("add",a,c);if(c&&J(c)&&(a||0===a)){var f="@"+a;if(this.c[f]&&!d)return this.update(a,c);if(this.g)return++this.C>=this.m.length&&(this.C=0),this.m[this.C].postMessage({add:!0,id:a,
content:c}),this.c[f]=""+this.C,b&&b(),this;if(!e){if(this.async&&"function"!==typeof importScripts){let t=this;f=new Promise(function(v){setTimeout(function(){t.add(a,c,null,d,!0);t=null;v()})});if(b)f.then(b);else return f;return this}if(b)return this.add(a,c,null,d,!0),b(),this}c=this.encode(c);if(!c.length)return this;b=this.f;e=O(b)?b(c):c.split(this.split);this.filter&&(e=W(e,this.filter));const n=B();n._ctx=B();const m=e.length,u=this.threshold,q=this.depth,A=this.b,z=this.i,y=this.D;for(let t=
0;t<m;t++){var h=e[t];if(h){var g=h.length,k=(y?t+1:m-t)/m,l="";switch(b){case "reverse":case "both":for(var p=g;--p;)l=h[p]+l,V(z,n,l,a,y?1:(g-p)/g,k,u,A-1);l="";case "forward":for(p=0;p<g;p++)l+=h[p],V(z,n,l,a,y?(p+1)/g:1,k,u,A-1);break;case "full":for(p=0;p<g;p++){const v=(y?p+1:g-p)/g;for(let x=g;x>p;x--)l=h.substring(p,x),V(z,n,l,a,v,k,u,A-1)}break;default:if(g=V(z,n,h,a,1,k,u,A-1),q&&1<m&&g>=u)for(g=n._ctx[h]||(n._ctx[h]=B()),h=this.h[h]||(this.h[h]=ia(A-(u||0))),k=t-q,l=t+q+1,0>k&&(k=0),l>
m&&(l=m);k<l;k++)k!==t&&V(h,g,e[k],a,0,A-(k<t?t-k:k-t),u,A-1)}}}this.c[f]=1;this.B=!1}return this};w.prototype.A=function(a,c,b){if(F(c)){var d=c.length;if(d--){for(var e=0;e<d;e++)this.A(a,c[e]);return this.A(a,c[d],b)}}else{var f=this.a.index,h=this.a.keys,g=this.a.tag;e=this.a.store;var k;var l=this.a.id;d=c;for(var p=0;p<l.length;p++)d=d[l[p]];if("remove"===a&&(delete this.l[d],l=h.length,l--)){for(c=0;c<l;c++)f[h[c]].remove(d);return f[h[l]].remove(d,b)}if(g){for(k=0;k<g.length;k++){var n=g[k];
var m=c;l=n.split(":");for(p=0;p<l.length;p++)m=m[l[p]];m="@"+m}k=this.G[n];k=k[m]||(k[m]=[])}l=this.a.field;for(let u=0,q=l.length;u<q;u++){n=l[u];g=c;for(m=0;m<n.length;m++)g=g[n[m]];n=f[h[u]];m="add"===a?n.add:n.update;u===q-1?m.call(n,d,g,b):m.call(n,d,g)}if(e){b=Object.keys(e);a=B();for(f=0;f<b.length;f++)if(h=b[f],e[h]){h=h.split(":");let u,q;for(l=0;l<h.length;l++)g=h[l],u=(u||c)[g],q=(q||a)[g]=u}c=a}k&&(k[k.length]=c);this.l[d]=c}return this};w.prototype.update=function(a,c,b){if(this.a&&
G(a))return this.A("update",a,c);this.c["@"+a]&&J(c)&&(this.remove(a),this.add(a,c,b,!0));return this};w.prototype.remove=function(a,c,b){if(this.a&&G(a))return this.A("remove",a,c);var d="@"+a;if(this.c[d]){if(this.g)return this.m[this.c[d]].postMessage({remove:!0,id:a}),delete this.c[d],c&&c(),this;if(!b){if(this.async&&"function"!==typeof importScripts){let e=this;d=new Promise(function(f){setTimeout(function(){e.remove(a,null,!0);e=null;f()})});if(c)d.then(c);else return d;return this}if(c)return this.remove(a,
null,!0),c(),this}for(c=0;c<this.b-(this.threshold||0);c++)ba(this.i[c],a);this.depth&&ba(this.h,a);delete this.c[d];this.B=!1}return this};let M;w.prototype.search=function(a,c,b,d){if(G(c)){if(F(c))for(var e=0;e<c.length;e++)c[e].query=a;else c.query=a;a=c;c=1E3}else c&&O(c)?(b=c,c=1E3):c||0===c||(c=1E3);if(this.g){this.F=b;this.u=0;this.o=[];for(var f=0;f<this.g;f++)this.m[f].postMessage({search:!0,limit:c,content:a})}else{var h=[],g=a;if(G(a)&&!F(a)){b||(b=a.callback)&&(g.callback=null);var k=
a.sort;var l=a.page;c=a.limit;f=a.threshold;var p=a.suggest;a=a.query}if(this.a){f=this.a.index;const y=g.where;var n=g.bool||"or",m=g.field;let t=n;let v,x;if(m)F(m)||(m=[m]);else if(F(g)){var u=g;m=[];t=[];for(var q=0;q<g.length;q++)d=g[q],e=d.bool||n,m[q]=d.field,t[q]=e,"not"===e?v=!0:"and"===e&&(x=!0)}else m=this.a.keys;n=m.length;for(q=0;q<n;q++)u&&(g=u[q]),l&&!J(g)&&(g.page=null,g.limit=0),h[q]=f[m[q]].search(g,0);if(b)return b(P.call(this,a,t,h,k,c,p,y,l,x,v));if(this.async){const I=this;return new Promise(function(D){Promise.all(h).then(function(E){D(P.call(I,
a,t,E,k,c,p,y,l,x,v))})})}return P.call(this,a,t,h,k,c,p,y,l,x,v)}f||(f=this.threshold||0);if(!d){if(this.async&&"function"!==typeof importScripts){let y=this;f=new Promise(function(t){setTimeout(function(){t(y.search(g,c,null,!0));y=null})});if(b)f.then(b);else return f;return this}if(b)return b(this.search(g,c,null,!0)),this}if(!a||!J(a))return h;g=a;if(this.cache)if(this.B){if(b=this.j.get(a))return b}else this.j.clear(),this.B=!0;g=this.encode(g);if(!g.length)return h;b=this.f;b=O(b)?b(g):g.split(this.split);
this.filter&&(b=W(b,this.filter));u=b.length;d=!0;e=[];var A=B(),z=0;1<u&&(this.depth&&"strict"===this.f?n=!0:b.sort(qa));if(!n||(q=this.h)){const y=this.b;for(;z<u;z++){let t=b[z];if(t){if(n){if(!m)if(q[t])m=t,A[t]=1;else if(!p)return h;if(p&&z===u-1&&!e.length)n=!1,t=m||t,A[t]=0;else if(!m)continue}if(!A[t]){const v=[];let x=!1,I=0;const D=n?q[m]:this.i;if(D){let E;for(let N=0;N<y-f;N++)if(E=D[N]&&D[N][t])v[I++]=E,x=!0}if(x)m=t,e[e.length]=1<I?v.concat.apply([],v):v[0];else if(!p){d=!1;break}A[t]=
1}}}}else d=!1;d&&(h=ha(e,c,l,p));this.cache&&this.j.set(a,h);return h}};w.prototype.find=function(a,c){return this.where(a,c,1)[0]||null};w.prototype.where=function(a,c,b,d){const e=this.l,f=[];let h=0;let g;var k;let l;if(G(a)){b||(b=c);var p=Object.keys(a);var n=p.length;g=!1;if(1===n&&"id"===p[0])return[e[a.id]];if((k=this.I)&&!d)for(var m=0;m<k.length;m++){var u=k[m],q=a[u];if(!C(q)){l=this.G[u]["@"+q];if(0===--n)return l;p.splice(p.indexOf(u),1);delete a[u];break}}k=Array(n);for(m=0;m<n;m++)k[m]=
p[m].split(":")}else{if(O(a)){c=d||Object.keys(e);b=c.length;for(p=0;p<b;p++)n=e[c[p]],a(n)&&(f[h++]=n);return f}if(C(c))return[e[a]];if("id"===a)return[e[c]];p=[a];n=1;k=[a.split(":")];g=!0}d=l||d||Object.keys(e);m=d.length;for(u=0;u<m;u++){q=l?d[u]:e[d[u]];let A=!0;for(let z=0;z<n;z++){g||(c=a[p[z]]);const y=k[z],t=y.length;let v=q;if(1<t)for(let x=0;x<t;x++)v=v[y[x]];else v=v[y[0]];if(v!==c){A=!1;break}}if(A&&(f[h++]=q,b&&h===b))break}return f};w.prototype.info=function(){if(this.g)for(let a=0;a<
this.g;a++)this.m[a].postMessage({info:!0,id:this.id});else return{id:this.id,items:this.length,cache:this.cache&&this.cache.s?this.cache.s.length:!1,matcher:aa.length+(this.v?this.v.length:0),worker:this.g,threshold:this.threshold,depth:this.depth,resolution:this.b,contextual:this.depth&&"strict"===this.f}};w.prototype.clear=function(){return this.destroy().init()};w.prototype.destroy=function(){this.cache&&(this.j.clear(),this.j=null);this.i=this.h=this.c=null;if(this.a){const a=this.a.keys;for(let c=
0;c<a.length;c++)this.a.index[a[c]].destroy();this.a=this.l=null}return this};w.prototype.export=function(a){const c=!a||C(a.serialize)||a.serialize;if(this.a){const d=!a||C(a.doc)||a.doc;var b=!a||C(a.index)||a.index;a=[];let e=0;if(b)for(b=this.a.keys;e<b.length;e++){const f=this.a.index[b[e]];a[e]=[f.i,f.h,Object.keys(f.c)]}d&&(a[e]=this.l)}else a=[this.i,this.h,Object.keys(this.c)];c&&(a=JSON.stringify(a));return a};w.prototype.import=function(a,c){if(!c||C(c.serialize)||c.serialize)a=JSON.parse(a);
const b=B();if(this.a){var d=!c||C(c.doc)||c.doc,e=0;if(!c||C(c.index)||c.index){c=this.a.keys;const h=c.length;for(var f=a[0][2];e<f.length;e++)b[f[e]]=1;for(e=0;e<h;e++){f=this.a.index[c[e]];const g=a[e];g&&(f.i=g[0],f.h=g[1],f.c=b)}}d&&(this.l=G(d)?d:a[e])}else{d=a[2];for(e=0;e<d.length;e++)b[d[e]]=1;this.i=a[0];this.h=a[1];this.c=b}};const va=function(){const a=r("\\s+"),c=r("[^a-z0-9 ]"),b=[r("[-/]")," ",c,"",a," "];return function(d){return ca(Q(d.toLowerCase(),b))}}(),U={icase:function(a){return a.toLowerCase()},
simple:function(){const a=r("\\s+"),c=r("[^a-z0-9 ]"),b=r("[-/]"),d=r("[\u00e0\u00e1\u00e2\u00e3\u00e4\u00e5]"),e=r("[\u00e8\u00e9\u00ea\u00eb]"),f=r("[\u00ec\u00ed\u00ee\u00ef]"),h=r("[\u00f2\u00f3\u00f4\u00f5\u00f6\u0151]"),g=r("[\u00f9\u00fa\u00fb\u00fc\u0171]"),k=r("[\u00fd\u0177\u00ff]"),l=r("\u00f1"),p=r("[\u00e7c]"),n=r("\u00df"),m=r(" & "),u=[d,"a",e,"e",f,"i",h,"o",g,"u",k,"y",l,"n",p,"k",n,"s",m," and ",b," ",c,"",a," "];return function(q){q=Q(q.toLowerCase(),u);return" "===q?"":q}}(),advanced:function(){const a=
r("ae"),c=r("ai"),b=r("ay"),d=r("ey"),e=r("oe"),f=r("ue"),h=r("ie"),g=r("sz"),k=r("zs"),l=r("ck"),p=r("cc"),n=r("sh"),m=r("th"),u=r("dt"),q=r("ph"),A=r("pf"),z=r("ou"),y=r("uo"),t=[a,"a",c,"ei",b,"ei",d,"ei",e,"o",f,"u",h,"i",g,"s",k,"s",n,"s",l,"k",p,"k",m,"t",u,"t",q,"f",A,"f",z,"o",y,"u"];return function(v,x){if(!v)return v;v=this.simple(v);2<v.length&&(v=Q(v,t));x||1<v.length&&(v=ca(v));return v}}(),extra:function(){const a=r("p"),c=r("z"),b=r("[cgq]"),d=r("n"),e=r("d"),f=r("[vw]"),h=r("[aeiouy]"),
g=[a,"b",c,"s",b,"k",d,"m",e,"t",f,"f",h,""];return function(k){if(!k)return k;k=this.advanced(k,!0);if(1<k.length){k=k.split(" ");for(let l=0;l<k.length;l++){const p=k[l];1<p.length&&(k[l]=p[0]+Q(p.substring(1),g))}k=k.join(" ");k=ca(k)}return k}}(),balance:va},ua=function(){function a(c){this.clear();this.H=!0!==c&&c}a.prototype.clear=function(){this.cache=B();this.count=B();this.index=B();this.s=[]};a.prototype.set=function(c,b){if(this.H&&C(this.cache[c])){let d=this.s.length;if(d===this.H){d--;
const e=this.s[d];delete this.cache[e];delete this.count[e];delete this.index[e]}this.index[c]=d;this.s[d]=c;this.count[c]=-1;this.cache[c]=b;this.get(c)}else this.cache[c]=b};a.prototype.get=function(c){const b=this.cache[c];if(this.H&&b){var d=++this.count[c];const f=this.index;let h=f[c];if(0<h){const g=this.s;for(var e=h;this.count[g[--h]]<=d&&-1!==h;);h++;if(h!==e){for(d=e;d>h;d--)e=g[d-1],g[d]=e,f[e]=d;g[h]=c;f[c]=h}}}return b};return a}();return w}(function(){const K={},R="undefined"!==typeof Blob&&
"undefined"!==typeof URL&&URL.createObjectURL;return function(w,L,S,W,P){S=R?URL.createObjectURL(new Blob(["("+S.toString()+")()"],{type:"text/javascript"})):w+".min.js";w+="-"+L;K[w]||(K[w]=[]);K[w][P]=new Worker(S);K[w][P].onmessage=W;return K[w][P]}}()),this);

;
(() => {
  // <stdin>
  document.getElementById("mode").addEventListener("click", () => {
    document.body.classList.toggle("dark");
    localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
  });
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
  }
})();
