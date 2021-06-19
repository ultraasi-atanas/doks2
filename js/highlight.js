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

  // node_modules/highlight.js/lib/core.js
  var require_core = __commonJS((exports, module) => {
    function deepFreeze(obj) {
      if (obj instanceof Map) {
        obj.clear = obj.delete = obj.set = function() {
          throw new Error("map is read-only");
        };
      } else if (obj instanceof Set) {
        obj.add = obj.clear = obj.delete = function() {
          throw new Error("set is read-only");
        };
      }
      Object.freeze(obj);
      Object.getOwnPropertyNames(obj).forEach(function(name) {
        var prop = obj[name];
        if (typeof prop == "object" && !Object.isFrozen(prop)) {
          deepFreeze(prop);
        }
      });
      return obj;
    }
    var deepFreezeEs6 = deepFreeze;
    var _default = deepFreeze;
    deepFreezeEs6.default = _default;
    var Response = class {
      constructor(mode) {
        if (mode.data === void 0)
          mode.data = {};
        this.data = mode.data;
        this.isMatchIgnored = false;
      }
      ignoreMatch() {
        this.isMatchIgnored = true;
      }
    };
    function escapeHTML(value) {
      return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
    }
    function inherit(original, ...objects) {
      const result = Object.create(null);
      for (const key in original) {
        result[key] = original[key];
      }
      objects.forEach(function(obj) {
        for (const key in obj) {
          result[key] = obj[key];
        }
      });
      return result;
    }
    var SPAN_CLOSE = "</span>";
    var emitsWrappingTags = (node) => {
      return !!node.kind;
    };
    var HTMLRenderer = class {
      constructor(parseTree, options) {
        this.buffer = "";
        this.classPrefix = options.classPrefix;
        parseTree.walk(this);
      }
      addText(text) {
        this.buffer += escapeHTML(text);
      }
      openNode(node) {
        if (!emitsWrappingTags(node))
          return;
        let className = node.kind;
        if (!node.sublanguage) {
          className = `${this.classPrefix}${className}`;
        }
        this.span(className);
      }
      closeNode(node) {
        if (!emitsWrappingTags(node))
          return;
        this.buffer += SPAN_CLOSE;
      }
      value() {
        return this.buffer;
      }
      span(className) {
        this.buffer += `<span class="${className}">`;
      }
    };
    var TokenTree = class {
      constructor() {
        this.rootNode = {children: []};
        this.stack = [this.rootNode];
      }
      get top() {
        return this.stack[this.stack.length - 1];
      }
      get root() {
        return this.rootNode;
      }
      add(node) {
        this.top.children.push(node);
      }
      openNode(kind) {
        const node = {kind, children: []};
        this.add(node);
        this.stack.push(node);
      }
      closeNode() {
        if (this.stack.length > 1) {
          return this.stack.pop();
        }
        return void 0;
      }
      closeAllNodes() {
        while (this.closeNode())
          ;
      }
      toJSON() {
        return JSON.stringify(this.rootNode, null, 4);
      }
      walk(builder) {
        return this.constructor._walk(builder, this.rootNode);
      }
      static _walk(builder, node) {
        if (typeof node === "string") {
          builder.addText(node);
        } else if (node.children) {
          builder.openNode(node);
          node.children.forEach((child) => this._walk(builder, child));
          builder.closeNode(node);
        }
        return builder;
      }
      static _collapse(node) {
        if (typeof node === "string")
          return;
        if (!node.children)
          return;
        if (node.children.every((el) => typeof el === "string")) {
          node.children = [node.children.join("")];
        } else {
          node.children.forEach((child) => {
            TokenTree._collapse(child);
          });
        }
      }
    };
    var TokenTreeEmitter = class extends TokenTree {
      constructor(options) {
        super();
        this.options = options;
      }
      addKeyword(text, kind) {
        if (text === "") {
          return;
        }
        this.openNode(kind);
        this.addText(text);
        this.closeNode();
      }
      addText(text) {
        if (text === "") {
          return;
        }
        this.add(text);
      }
      addSublanguage(emitter, name) {
        const node = emitter.root;
        node.kind = name;
        node.sublanguage = true;
        this.add(node);
      }
      toHTML() {
        const renderer = new HTMLRenderer(this, this.options);
        return renderer.value();
      }
      finalize() {
        return true;
      }
    };
    function escape(value) {
      return new RegExp(value.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&"), "m");
    }
    function source(re) {
      if (!re)
        return null;
      if (typeof re === "string")
        return re;
      return re.source;
    }
    function concat(...args) {
      const joined = args.map((x) => source(x)).join("");
      return joined;
    }
    function either(...args) {
      const joined = "(" + args.map((x) => source(x)).join("|") + ")";
      return joined;
    }
    function countMatchGroups(re) {
      return new RegExp(re.toString() + "|").exec("").length - 1;
    }
    function startsWith(re, lexeme) {
      const match = re && re.exec(lexeme);
      return match && match.index === 0;
    }
    var BACKREF_RE = /\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;
    function join(regexps, separator = "|") {
      let numCaptures = 0;
      return regexps.map((regex) => {
        numCaptures += 1;
        const offset = numCaptures;
        let re = source(regex);
        let out = "";
        while (re.length > 0) {
          const match = BACKREF_RE.exec(re);
          if (!match) {
            out += re;
            break;
          }
          out += re.substring(0, match.index);
          re = re.substring(match.index + match[0].length);
          if (match[0][0] === "\\" && match[1]) {
            out += "\\" + String(Number(match[1]) + offset);
          } else {
            out += match[0];
            if (match[0] === "(") {
              numCaptures++;
            }
          }
        }
        return out;
      }).map((re) => `(${re})`).join(separator);
    }
    var MATCH_NOTHING_RE = /\b\B/;
    var IDENT_RE = "[a-zA-Z]\\w*";
    var UNDERSCORE_IDENT_RE = "[a-zA-Z_]\\w*";
    var NUMBER_RE = "\\b\\d+(\\.\\d+)?";
    var C_NUMBER_RE = "(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)";
    var BINARY_NUMBER_RE = "\\b(0b[01]+)";
    var RE_STARTERS_RE = "!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~";
    var SHEBANG = (opts = {}) => {
      const beginShebang = /^#![ ]*\//;
      if (opts.binary) {
        opts.begin = concat(beginShebang, /.*\b/, opts.binary, /\b.*/);
      }
      return inherit({
        className: "meta",
        begin: beginShebang,
        end: /$/,
        relevance: 0,
        "on:begin": (m, resp) => {
          if (m.index !== 0)
            resp.ignoreMatch();
        }
      }, opts);
    };
    var BACKSLASH_ESCAPE = {
      begin: "\\\\[\\s\\S]",
      relevance: 0
    };
    var APOS_STRING_MODE = {
      className: "string",
      begin: "'",
      end: "'",
      illegal: "\\n",
      contains: [BACKSLASH_ESCAPE]
    };
    var QUOTE_STRING_MODE = {
      className: "string",
      begin: '"',
      end: '"',
      illegal: "\\n",
      contains: [BACKSLASH_ESCAPE]
    };
    var PHRASAL_WORDS_MODE = {
      begin: /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/
    };
    var COMMENT = function(begin, end, modeOptions = {}) {
      const mode = inherit({
        className: "comment",
        begin,
        end,
        contains: []
      }, modeOptions);
      mode.contains.push(PHRASAL_WORDS_MODE);
      mode.contains.push({
        className: "doctag",
        begin: "(?:TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):",
        relevance: 0
      });
      return mode;
    };
    var C_LINE_COMMENT_MODE = COMMENT("//", "$");
    var C_BLOCK_COMMENT_MODE = COMMENT("/\\*", "\\*/");
    var HASH_COMMENT_MODE = COMMENT("#", "$");
    var NUMBER_MODE = {
      className: "number",
      begin: NUMBER_RE,
      relevance: 0
    };
    var C_NUMBER_MODE = {
      className: "number",
      begin: C_NUMBER_RE,
      relevance: 0
    };
    var BINARY_NUMBER_MODE = {
      className: "number",
      begin: BINARY_NUMBER_RE,
      relevance: 0
    };
    var CSS_NUMBER_MODE = {
      className: "number",
      begin: NUMBER_RE + "(%|em|ex|ch|rem|vw|vh|vmin|vmax|cm|mm|in|pt|pc|px|deg|grad|rad|turn|s|ms|Hz|kHz|dpi|dpcm|dppx)?",
      relevance: 0
    };
    var REGEXP_MODE = {
      begin: /(?=\/[^/\n]*\/)/,
      contains: [{
        className: "regexp",
        begin: /\//,
        end: /\/[gimuy]*/,
        illegal: /\n/,
        contains: [
          BACKSLASH_ESCAPE,
          {
            begin: /\[/,
            end: /\]/,
            relevance: 0,
            contains: [BACKSLASH_ESCAPE]
          }
        ]
      }]
    };
    var TITLE_MODE = {
      className: "title",
      begin: IDENT_RE,
      relevance: 0
    };
    var UNDERSCORE_TITLE_MODE = {
      className: "title",
      begin: UNDERSCORE_IDENT_RE,
      relevance: 0
    };
    var METHOD_GUARD = {
      begin: "\\.\\s*" + UNDERSCORE_IDENT_RE,
      relevance: 0
    };
    var END_SAME_AS_BEGIN = function(mode) {
      return Object.assign(mode, {
        "on:begin": (m, resp) => {
          resp.data._beginMatch = m[1];
        },
        "on:end": (m, resp) => {
          if (resp.data._beginMatch !== m[1])
            resp.ignoreMatch();
        }
      });
    };
    var MODES = /* @__PURE__ */ Object.freeze({
      __proto__: null,
      MATCH_NOTHING_RE,
      IDENT_RE,
      UNDERSCORE_IDENT_RE,
      NUMBER_RE,
      C_NUMBER_RE,
      BINARY_NUMBER_RE,
      RE_STARTERS_RE,
      SHEBANG,
      BACKSLASH_ESCAPE,
      APOS_STRING_MODE,
      QUOTE_STRING_MODE,
      PHRASAL_WORDS_MODE,
      COMMENT,
      C_LINE_COMMENT_MODE,
      C_BLOCK_COMMENT_MODE,
      HASH_COMMENT_MODE,
      NUMBER_MODE,
      C_NUMBER_MODE,
      BINARY_NUMBER_MODE,
      CSS_NUMBER_MODE,
      REGEXP_MODE,
      TITLE_MODE,
      UNDERSCORE_TITLE_MODE,
      METHOD_GUARD,
      END_SAME_AS_BEGIN
    });
    function skipIfhasPrecedingDot(match, response) {
      const before = match.input[match.index - 1];
      if (before === ".") {
        response.ignoreMatch();
      }
    }
    function beginKeywords(mode, parent) {
      if (!parent)
        return;
      if (!mode.beginKeywords)
        return;
      mode.begin = "\\b(" + mode.beginKeywords.split(" ").join("|") + ")(?!\\.)(?=\\b|\\s)";
      mode.__beforeBegin = skipIfhasPrecedingDot;
      mode.keywords = mode.keywords || mode.beginKeywords;
      delete mode.beginKeywords;
      if (mode.relevance === void 0)
        mode.relevance = 0;
    }
    function compileIllegal(mode, _parent) {
      if (!Array.isArray(mode.illegal))
        return;
      mode.illegal = either(...mode.illegal);
    }
    function compileMatch(mode, _parent) {
      if (!mode.match)
        return;
      if (mode.begin || mode.end)
        throw new Error("begin & end are not supported with match");
      mode.begin = mode.match;
      delete mode.match;
    }
    function compileRelevance(mode, _parent) {
      if (mode.relevance === void 0)
        mode.relevance = 1;
    }
    var COMMON_KEYWORDS = [
      "of",
      "and",
      "for",
      "in",
      "not",
      "or",
      "if",
      "then",
      "parent",
      "list",
      "value"
    ];
    var DEFAULT_KEYWORD_CLASSNAME = "keyword";
    function compileKeywords(rawKeywords, caseInsensitive, className = DEFAULT_KEYWORD_CLASSNAME) {
      const compiledKeywords = {};
      if (typeof rawKeywords === "string") {
        compileList(className, rawKeywords.split(" "));
      } else if (Array.isArray(rawKeywords)) {
        compileList(className, rawKeywords);
      } else {
        Object.keys(rawKeywords).forEach(function(className2) {
          Object.assign(compiledKeywords, compileKeywords(rawKeywords[className2], caseInsensitive, className2));
        });
      }
      return compiledKeywords;
      function compileList(className2, keywordList) {
        if (caseInsensitive) {
          keywordList = keywordList.map((x) => x.toLowerCase());
        }
        keywordList.forEach(function(keyword) {
          const pair = keyword.split("|");
          compiledKeywords[pair[0]] = [className2, scoreForKeyword(pair[0], pair[1])];
        });
      }
    }
    function scoreForKeyword(keyword, providedScore) {
      if (providedScore) {
        return Number(providedScore);
      }
      return commonKeyword(keyword) ? 0 : 1;
    }
    function commonKeyword(keyword) {
      return COMMON_KEYWORDS.includes(keyword.toLowerCase());
    }
    function compileLanguage(language, {plugins}) {
      function langRe(value, global) {
        return new RegExp(source(value), "m" + (language.case_insensitive ? "i" : "") + (global ? "g" : ""));
      }
      class MultiRegex {
        constructor() {
          this.matchIndexes = {};
          this.regexes = [];
          this.matchAt = 1;
          this.position = 0;
        }
        addRule(re, opts) {
          opts.position = this.position++;
          this.matchIndexes[this.matchAt] = opts;
          this.regexes.push([opts, re]);
          this.matchAt += countMatchGroups(re) + 1;
        }
        compile() {
          if (this.regexes.length === 0) {
            this.exec = () => null;
          }
          const terminators = this.regexes.map((el) => el[1]);
          this.matcherRe = langRe(join(terminators), true);
          this.lastIndex = 0;
        }
        exec(s) {
          this.matcherRe.lastIndex = this.lastIndex;
          const match = this.matcherRe.exec(s);
          if (!match) {
            return null;
          }
          const i = match.findIndex((el, i2) => i2 > 0 && el !== void 0);
          const matchData = this.matchIndexes[i];
          match.splice(0, i);
          return Object.assign(match, matchData);
        }
      }
      class ResumableMultiRegex {
        constructor() {
          this.rules = [];
          this.multiRegexes = [];
          this.count = 0;
          this.lastIndex = 0;
          this.regexIndex = 0;
        }
        getMatcher(index) {
          if (this.multiRegexes[index])
            return this.multiRegexes[index];
          const matcher = new MultiRegex();
          this.rules.slice(index).forEach(([re, opts]) => matcher.addRule(re, opts));
          matcher.compile();
          this.multiRegexes[index] = matcher;
          return matcher;
        }
        resumingScanAtSamePosition() {
          return this.regexIndex !== 0;
        }
        considerAll() {
          this.regexIndex = 0;
        }
        addRule(re, opts) {
          this.rules.push([re, opts]);
          if (opts.type === "begin")
            this.count++;
        }
        exec(s) {
          const m = this.getMatcher(this.regexIndex);
          m.lastIndex = this.lastIndex;
          let result = m.exec(s);
          if (this.resumingScanAtSamePosition()) {
            if (result && result.index === this.lastIndex)
              ;
            else {
              const m2 = this.getMatcher(0);
              m2.lastIndex = this.lastIndex + 1;
              result = m2.exec(s);
            }
          }
          if (result) {
            this.regexIndex += result.position + 1;
            if (this.regexIndex === this.count) {
              this.considerAll();
            }
          }
          return result;
        }
      }
      function buildModeRegex(mode) {
        const mm = new ResumableMultiRegex();
        mode.contains.forEach((term) => mm.addRule(term.begin, {rule: term, type: "begin"}));
        if (mode.terminatorEnd) {
          mm.addRule(mode.terminatorEnd, {type: "end"});
        }
        if (mode.illegal) {
          mm.addRule(mode.illegal, {type: "illegal"});
        }
        return mm;
      }
      function compileMode(mode, parent) {
        const cmode = mode;
        if (mode.isCompiled)
          return cmode;
        [
          compileMatch
        ].forEach((ext) => ext(mode, parent));
        language.compilerExtensions.forEach((ext) => ext(mode, parent));
        mode.__beforeBegin = null;
        [
          beginKeywords,
          compileIllegal,
          compileRelevance
        ].forEach((ext) => ext(mode, parent));
        mode.isCompiled = true;
        let keywordPattern = null;
        if (typeof mode.keywords === "object") {
          keywordPattern = mode.keywords.$pattern;
          delete mode.keywords.$pattern;
        }
        if (mode.keywords) {
          mode.keywords = compileKeywords(mode.keywords, language.case_insensitive);
        }
        if (mode.lexemes && keywordPattern) {
          throw new Error("ERR: Prefer `keywords.$pattern` to `mode.lexemes`, BOTH are not allowed. (see mode reference) ");
        }
        keywordPattern = keywordPattern || mode.lexemes || /\w+/;
        cmode.keywordPatternRe = langRe(keywordPattern, true);
        if (parent) {
          if (!mode.begin)
            mode.begin = /\B|\b/;
          cmode.beginRe = langRe(mode.begin);
          if (mode.endSameAsBegin)
            mode.end = mode.begin;
          if (!mode.end && !mode.endsWithParent)
            mode.end = /\B|\b/;
          if (mode.end)
            cmode.endRe = langRe(mode.end);
          cmode.terminatorEnd = source(mode.end) || "";
          if (mode.endsWithParent && parent.terminatorEnd) {
            cmode.terminatorEnd += (mode.end ? "|" : "") + parent.terminatorEnd;
          }
        }
        if (mode.illegal)
          cmode.illegalRe = langRe(mode.illegal);
        if (!mode.contains)
          mode.contains = [];
        mode.contains = [].concat(...mode.contains.map(function(c) {
          return expandOrCloneMode(c === "self" ? mode : c);
        }));
        mode.contains.forEach(function(c) {
          compileMode(c, cmode);
        });
        if (mode.starts) {
          compileMode(mode.starts, parent);
        }
        cmode.matcher = buildModeRegex(cmode);
        return cmode;
      }
      if (!language.compilerExtensions)
        language.compilerExtensions = [];
      if (language.contains && language.contains.includes("self")) {
        throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");
      }
      language.classNameAliases = inherit(language.classNameAliases || {});
      return compileMode(language);
    }
    function dependencyOnParent(mode) {
      if (!mode)
        return false;
      return mode.endsWithParent || dependencyOnParent(mode.starts);
    }
    function expandOrCloneMode(mode) {
      if (mode.variants && !mode.cachedVariants) {
        mode.cachedVariants = mode.variants.map(function(variant) {
          return inherit(mode, {variants: null}, variant);
        });
      }
      if (mode.cachedVariants) {
        return mode.cachedVariants;
      }
      if (dependencyOnParent(mode)) {
        return inherit(mode, {starts: mode.starts ? inherit(mode.starts) : null});
      }
      if (Object.isFrozen(mode)) {
        return inherit(mode);
      }
      return mode;
    }
    var version = "10.7.1";
    function hasValueOrEmptyAttribute(value) {
      return Boolean(value || value === "");
    }
    function BuildVuePlugin(hljs2) {
      const Component = {
        props: ["language", "code", "autodetect"],
        data: function() {
          return {
            detectedLanguage: "",
            unknownLanguage: false
          };
        },
        computed: {
          className() {
            if (this.unknownLanguage)
              return "";
            return "hljs " + this.detectedLanguage;
          },
          highlighted() {
            if (!this.autoDetect && !hljs2.getLanguage(this.language)) {
              console.warn(`The language "${this.language}" you specified could not be found.`);
              this.unknownLanguage = true;
              return escapeHTML(this.code);
            }
            let result = {};
            if (this.autoDetect) {
              result = hljs2.highlightAuto(this.code);
              this.detectedLanguage = result.language;
            } else {
              result = hljs2.highlight(this.language, this.code, this.ignoreIllegals);
              this.detectedLanguage = this.language;
            }
            return result.value;
          },
          autoDetect() {
            return !this.language || hasValueOrEmptyAttribute(this.autodetect);
          },
          ignoreIllegals() {
            return true;
          }
        },
        render(createElement) {
          return createElement("pre", {}, [
            createElement("code", {
              class: this.className,
              domProps: {innerHTML: this.highlighted}
            })
          ]);
        }
      };
      const VuePlugin = {
        install(Vue) {
          Vue.component("highlightjs", Component);
        }
      };
      return {Component, VuePlugin};
    }
    var mergeHTMLPlugin = {
      "after:highlightElement": ({el, result, text}) => {
        const originalStream = nodeStream(el);
        if (!originalStream.length)
          return;
        const resultNode = document.createElement("div");
        resultNode.innerHTML = result.value;
        result.value = mergeStreams(originalStream, nodeStream(resultNode), text);
      }
    };
    function tag(node) {
      return node.nodeName.toLowerCase();
    }
    function nodeStream(node) {
      const result = [];
      (function _nodeStream(node2, offset) {
        for (let child = node2.firstChild; child; child = child.nextSibling) {
          if (child.nodeType === 3) {
            offset += child.nodeValue.length;
          } else if (child.nodeType === 1) {
            result.push({
              event: "start",
              offset,
              node: child
            });
            offset = _nodeStream(child, offset);
            if (!tag(child).match(/br|hr|img|input/)) {
              result.push({
                event: "stop",
                offset,
                node: child
              });
            }
          }
        }
        return offset;
      })(node, 0);
      return result;
    }
    function mergeStreams(original, highlighted, value) {
      let processed = 0;
      let result = "";
      const nodeStack = [];
      function selectStream() {
        if (!original.length || !highlighted.length) {
          return original.length ? original : highlighted;
        }
        if (original[0].offset !== highlighted[0].offset) {
          return original[0].offset < highlighted[0].offset ? original : highlighted;
        }
        return highlighted[0].event === "start" ? original : highlighted;
      }
      function open(node) {
        function attributeString(attr) {
          return " " + attr.nodeName + '="' + escapeHTML(attr.value) + '"';
        }
        result += "<" + tag(node) + [].map.call(node.attributes, attributeString).join("") + ">";
      }
      function close(node) {
        result += "</" + tag(node) + ">";
      }
      function render(event) {
        (event.event === "start" ? open : close)(event.node);
      }
      while (original.length || highlighted.length) {
        let stream = selectStream();
        result += escapeHTML(value.substring(processed, stream[0].offset));
        processed = stream[0].offset;
        if (stream === original) {
          nodeStack.reverse().forEach(close);
          do {
            render(stream.splice(0, 1)[0]);
            stream = selectStream();
          } while (stream === original && stream.length && stream[0].offset === processed);
          nodeStack.reverse().forEach(open);
        } else {
          if (stream[0].event === "start") {
            nodeStack.push(stream[0].node);
          } else {
            nodeStack.pop();
          }
          render(stream.splice(0, 1)[0]);
        }
      }
      return result + escapeHTML(value.substr(processed));
    }
    var error = (message) => {
      console.error(message);
    };
    var warn = (message, ...args) => {
      console.log(`WARN: ${message}`, ...args);
    };
    var deprecated = (version2, message) => {
      console.log(`Deprecated as of ${version2}. ${message}`);
    };
    var escape$1 = escapeHTML;
    var inherit$1 = inherit;
    var NO_MATCH = Symbol("nomatch");
    var HLJS = function(hljs2) {
      const languages = Object.create(null);
      const aliases = Object.create(null);
      const plugins = [];
      let SAFE_MODE = true;
      const fixMarkupRe = /(^(<[^>]+>|\t|)+|\n)/gm;
      const LANGUAGE_NOT_FOUND = "Could not find the language '{}', did you forget to load/include a language module?";
      const PLAINTEXT_LANGUAGE = {disableAutodetect: true, name: "Plain text", contains: []};
      let options = {
        noHighlightRe: /^(no-?highlight)$/i,
        languageDetectRe: /\blang(?:uage)?-([\w-]+)\b/i,
        classPrefix: "hljs-",
        tabReplace: null,
        useBR: false,
        languages: null,
        __emitter: TokenTreeEmitter
      };
      function shouldNotHighlight(languageName) {
        return options.noHighlightRe.test(languageName);
      }
      function blockLanguage(block) {
        let classes = block.className + " ";
        classes += block.parentNode ? block.parentNode.className : "";
        const match = options.languageDetectRe.exec(classes);
        if (match) {
          const language = getLanguage(match[1]);
          if (!language) {
            warn(LANGUAGE_NOT_FOUND.replace("{}", match[1]));
            warn("Falling back to no-highlight mode for this block.", block);
          }
          return language ? match[1] : "no-highlight";
        }
        return classes.split(/\s+/).find((_class) => shouldNotHighlight(_class) || getLanguage(_class));
      }
      function highlight2(codeOrlanguageName, optionsOrCode, ignoreIllegals, continuation) {
        let code = "";
        let languageName = "";
        if (typeof optionsOrCode === "object") {
          code = codeOrlanguageName;
          ignoreIllegals = optionsOrCode.ignoreIllegals;
          languageName = optionsOrCode.language;
          continuation = void 0;
        } else {
          deprecated("10.7.0", "highlight(lang, code, ...args) has been deprecated.");
          deprecated("10.7.0", "Please use highlight(code, options) instead.\nhttps://github.com/highlightjs/highlight.js/issues/2277");
          languageName = codeOrlanguageName;
          code = optionsOrCode;
        }
        const context = {
          code,
          language: languageName
        };
        fire("before:highlight", context);
        const result = context.result ? context.result : _highlight(context.language, context.code, ignoreIllegals, continuation);
        result.code = context.code;
        fire("after:highlight", result);
        return result;
      }
      function _highlight(languageName, codeToHighlight, ignoreIllegals, continuation) {
        function keywordData(mode, match) {
          const matchText = language.case_insensitive ? match[0].toLowerCase() : match[0];
          return Object.prototype.hasOwnProperty.call(mode.keywords, matchText) && mode.keywords[matchText];
        }
        function processKeywords() {
          if (!top.keywords) {
            emitter.addText(modeBuffer);
            return;
          }
          let lastIndex = 0;
          top.keywordPatternRe.lastIndex = 0;
          let match = top.keywordPatternRe.exec(modeBuffer);
          let buf = "";
          while (match) {
            buf += modeBuffer.substring(lastIndex, match.index);
            const data = keywordData(top, match);
            if (data) {
              const [kind, keywordRelevance] = data;
              emitter.addText(buf);
              buf = "";
              relevance += keywordRelevance;
              if (kind.startsWith("_")) {
                buf += match[0];
              } else {
                const cssClass = language.classNameAliases[kind] || kind;
                emitter.addKeyword(match[0], cssClass);
              }
            } else {
              buf += match[0];
            }
            lastIndex = top.keywordPatternRe.lastIndex;
            match = top.keywordPatternRe.exec(modeBuffer);
          }
          buf += modeBuffer.substr(lastIndex);
          emitter.addText(buf);
        }
        function processSubLanguage() {
          if (modeBuffer === "")
            return;
          let result2 = null;
          if (typeof top.subLanguage === "string") {
            if (!languages[top.subLanguage]) {
              emitter.addText(modeBuffer);
              return;
            }
            result2 = _highlight(top.subLanguage, modeBuffer, true, continuations[top.subLanguage]);
            continuations[top.subLanguage] = result2.top;
          } else {
            result2 = highlightAuto(modeBuffer, top.subLanguage.length ? top.subLanguage : null);
          }
          if (top.relevance > 0) {
            relevance += result2.relevance;
          }
          emitter.addSublanguage(result2.emitter, result2.language);
        }
        function processBuffer() {
          if (top.subLanguage != null) {
            processSubLanguage();
          } else {
            processKeywords();
          }
          modeBuffer = "";
        }
        function startNewMode(mode) {
          if (mode.className) {
            emitter.openNode(language.classNameAliases[mode.className] || mode.className);
          }
          top = Object.create(mode, {parent: {value: top}});
          return top;
        }
        function endOfMode(mode, match, matchPlusRemainder) {
          let matched = startsWith(mode.endRe, matchPlusRemainder);
          if (matched) {
            if (mode["on:end"]) {
              const resp = new Response(mode);
              mode["on:end"](match, resp);
              if (resp.isMatchIgnored)
                matched = false;
            }
            if (matched) {
              while (mode.endsParent && mode.parent) {
                mode = mode.parent;
              }
              return mode;
            }
          }
          if (mode.endsWithParent) {
            return endOfMode(mode.parent, match, matchPlusRemainder);
          }
        }
        function doIgnore(lexeme) {
          if (top.matcher.regexIndex === 0) {
            modeBuffer += lexeme[0];
            return 1;
          } else {
            resumeScanAtSamePosition = true;
            return 0;
          }
        }
        function doBeginMatch(match) {
          const lexeme = match[0];
          const newMode = match.rule;
          const resp = new Response(newMode);
          const beforeCallbacks = [newMode.__beforeBegin, newMode["on:begin"]];
          for (const cb of beforeCallbacks) {
            if (!cb)
              continue;
            cb(match, resp);
            if (resp.isMatchIgnored)
              return doIgnore(lexeme);
          }
          if (newMode && newMode.endSameAsBegin) {
            newMode.endRe = escape(lexeme);
          }
          if (newMode.skip) {
            modeBuffer += lexeme;
          } else {
            if (newMode.excludeBegin) {
              modeBuffer += lexeme;
            }
            processBuffer();
            if (!newMode.returnBegin && !newMode.excludeBegin) {
              modeBuffer = lexeme;
            }
          }
          startNewMode(newMode);
          return newMode.returnBegin ? 0 : lexeme.length;
        }
        function doEndMatch(match) {
          const lexeme = match[0];
          const matchPlusRemainder = codeToHighlight.substr(match.index);
          const endMode = endOfMode(top, match, matchPlusRemainder);
          if (!endMode) {
            return NO_MATCH;
          }
          const origin = top;
          if (origin.skip) {
            modeBuffer += lexeme;
          } else {
            if (!(origin.returnEnd || origin.excludeEnd)) {
              modeBuffer += lexeme;
            }
            processBuffer();
            if (origin.excludeEnd) {
              modeBuffer = lexeme;
            }
          }
          do {
            if (top.className) {
              emitter.closeNode();
            }
            if (!top.skip && !top.subLanguage) {
              relevance += top.relevance;
            }
            top = top.parent;
          } while (top !== endMode.parent);
          if (endMode.starts) {
            if (endMode.endSameAsBegin) {
              endMode.starts.endRe = endMode.endRe;
            }
            startNewMode(endMode.starts);
          }
          return origin.returnEnd ? 0 : lexeme.length;
        }
        function processContinuations() {
          const list = [];
          for (let current = top; current !== language; current = current.parent) {
            if (current.className) {
              list.unshift(current.className);
            }
          }
          list.forEach((item) => emitter.openNode(item));
        }
        let lastMatch = {};
        function processLexeme(textBeforeMatch, match) {
          const lexeme = match && match[0];
          modeBuffer += textBeforeMatch;
          if (lexeme == null) {
            processBuffer();
            return 0;
          }
          if (lastMatch.type === "begin" && match.type === "end" && lastMatch.index === match.index && lexeme === "") {
            modeBuffer += codeToHighlight.slice(match.index, match.index + 1);
            if (!SAFE_MODE) {
              const err = new Error("0 width match regex");
              err.languageName = languageName;
              err.badRule = lastMatch.rule;
              throw err;
            }
            return 1;
          }
          lastMatch = match;
          if (match.type === "begin") {
            return doBeginMatch(match);
          } else if (match.type === "illegal" && !ignoreIllegals) {
            const err = new Error('Illegal lexeme "' + lexeme + '" for mode "' + (top.className || "<unnamed>") + '"');
            err.mode = top;
            throw err;
          } else if (match.type === "end") {
            const processed = doEndMatch(match);
            if (processed !== NO_MATCH) {
              return processed;
            }
          }
          if (match.type === "illegal" && lexeme === "") {
            return 1;
          }
          if (iterations > 1e5 && iterations > match.index * 3) {
            const err = new Error("potential infinite loop, way more iterations than matches");
            throw err;
          }
          modeBuffer += lexeme;
          return lexeme.length;
        }
        const language = getLanguage(languageName);
        if (!language) {
          error(LANGUAGE_NOT_FOUND.replace("{}", languageName));
          throw new Error('Unknown language: "' + languageName + '"');
        }
        const md = compileLanguage(language, {plugins});
        let result = "";
        let top = continuation || md;
        const continuations = {};
        const emitter = new options.__emitter(options);
        processContinuations();
        let modeBuffer = "";
        let relevance = 0;
        let index = 0;
        let iterations = 0;
        let resumeScanAtSamePosition = false;
        try {
          top.matcher.considerAll();
          for (; ; ) {
            iterations++;
            if (resumeScanAtSamePosition) {
              resumeScanAtSamePosition = false;
            } else {
              top.matcher.considerAll();
            }
            top.matcher.lastIndex = index;
            const match = top.matcher.exec(codeToHighlight);
            if (!match)
              break;
            const beforeMatch = codeToHighlight.substring(index, match.index);
            const processedCount = processLexeme(beforeMatch, match);
            index = match.index + processedCount;
          }
          processLexeme(codeToHighlight.substr(index));
          emitter.closeAllNodes();
          emitter.finalize();
          result = emitter.toHTML();
          return {
            relevance: Math.floor(relevance),
            value: result,
            language: languageName,
            illegal: false,
            emitter,
            top
          };
        } catch (err) {
          if (err.message && err.message.includes("Illegal")) {
            return {
              illegal: true,
              illegalBy: {
                msg: err.message,
                context: codeToHighlight.slice(index - 100, index + 100),
                mode: err.mode
              },
              sofar: result,
              relevance: 0,
              value: escape$1(codeToHighlight),
              emitter
            };
          } else if (SAFE_MODE) {
            return {
              illegal: false,
              relevance: 0,
              value: escape$1(codeToHighlight),
              emitter,
              language: languageName,
              top,
              errorRaised: err
            };
          } else {
            throw err;
          }
        }
      }
      function justTextHighlightResult(code) {
        const result = {
          relevance: 0,
          emitter: new options.__emitter(options),
          value: escape$1(code),
          illegal: false,
          top: PLAINTEXT_LANGUAGE
        };
        result.emitter.addText(code);
        return result;
      }
      function highlightAuto(code, languageSubset) {
        languageSubset = languageSubset || options.languages || Object.keys(languages);
        const plaintext = justTextHighlightResult(code);
        const results = languageSubset.filter(getLanguage).filter(autoDetection).map((name) => _highlight(name, code, false));
        results.unshift(plaintext);
        const sorted = results.sort((a, b) => {
          if (a.relevance !== b.relevance)
            return b.relevance - a.relevance;
          if (a.language && b.language) {
            if (getLanguage(a.language).supersetOf === b.language) {
              return 1;
            } else if (getLanguage(b.language).supersetOf === a.language) {
              return -1;
            }
          }
          return 0;
        });
        const [best, secondBest] = sorted;
        const result = best;
        result.second_best = secondBest;
        return result;
      }
      function fixMarkup(html) {
        if (!(options.tabReplace || options.useBR)) {
          return html;
        }
        return html.replace(fixMarkupRe, (match) => {
          if (match === "\n") {
            return options.useBR ? "<br>" : match;
          } else if (options.tabReplace) {
            return match.replace(/\t/g, options.tabReplace);
          }
          return match;
        });
      }
      function updateClassName(element, currentLang, resultLang) {
        const language = currentLang ? aliases[currentLang] : resultLang;
        element.classList.add("hljs");
        if (language)
          element.classList.add(language);
      }
      const brPlugin = {
        "before:highlightElement": ({el}) => {
          if (options.useBR) {
            el.innerHTML = el.innerHTML.replace(/\n/g, "").replace(/<br[ /]*>/g, "\n");
          }
        },
        "after:highlightElement": ({result}) => {
          if (options.useBR) {
            result.value = result.value.replace(/\n/g, "<br>");
          }
        }
      };
      const TAB_REPLACE_RE = /^(<[^>]+>|\t)+/gm;
      const tabReplacePlugin = {
        "after:highlightElement": ({result}) => {
          if (options.tabReplace) {
            result.value = result.value.replace(TAB_REPLACE_RE, (m) => m.replace(/\t/g, options.tabReplace));
          }
        }
      };
      function highlightElement(element) {
        let node = null;
        const language = blockLanguage(element);
        if (shouldNotHighlight(language))
          return;
        fire("before:highlightElement", {el: element, language});
        node = element;
        const text = node.textContent;
        const result = language ? highlight2(text, {language, ignoreIllegals: true}) : highlightAuto(text);
        fire("after:highlightElement", {el: element, result, text});
        element.innerHTML = result.value;
        updateClassName(element, language, result.language);
        element.result = {
          language: result.language,
          re: result.relevance,
          relavance: result.relevance
        };
        if (result.second_best) {
          element.second_best = {
            language: result.second_best.language,
            re: result.second_best.relevance,
            relavance: result.second_best.relevance
          };
        }
      }
      function configure(userOptions) {
        if (userOptions.useBR) {
          deprecated("10.3.0", "'useBR' will be removed entirely in v11.0");
          deprecated("10.3.0", "Please see https://github.com/highlightjs/highlight.js/issues/2559");
        }
        options = inherit$1(options, userOptions);
      }
      const initHighlighting = () => {
        if (initHighlighting.called)
          return;
        initHighlighting.called = true;
        deprecated("10.6.0", "initHighlighting() is deprecated.  Use highlightAll() instead.");
        const blocks = document.querySelectorAll("pre code");
        blocks.forEach(highlightElement);
      };
      function initHighlightingOnLoad() {
        deprecated("10.6.0", "initHighlightingOnLoad() is deprecated.  Use highlightAll() instead.");
        wantsHighlight = true;
      }
      let wantsHighlight = false;
      function highlightAll() {
        if (document.readyState === "loading") {
          wantsHighlight = true;
          return;
        }
        const blocks = document.querySelectorAll("pre code");
        blocks.forEach(highlightElement);
      }
      function boot() {
        if (wantsHighlight)
          highlightAll();
      }
      if (typeof window !== "undefined" && window.addEventListener) {
        window.addEventListener("DOMContentLoaded", boot, false);
      }
      function registerLanguage(languageName, languageDefinition) {
        let lang = null;
        try {
          lang = languageDefinition(hljs2);
        } catch (error$1) {
          error("Language definition for '{}' could not be registered.".replace("{}", languageName));
          if (!SAFE_MODE) {
            throw error$1;
          } else {
            error(error$1);
          }
          lang = PLAINTEXT_LANGUAGE;
        }
        if (!lang.name)
          lang.name = languageName;
        languages[languageName] = lang;
        lang.rawDefinition = languageDefinition.bind(null, hljs2);
        if (lang.aliases) {
          registerAliases(lang.aliases, {languageName});
        }
      }
      function unregisterLanguage(languageName) {
        delete languages[languageName];
        for (const alias of Object.keys(aliases)) {
          if (aliases[alias] === languageName) {
            delete aliases[alias];
          }
        }
      }
      function listLanguages() {
        return Object.keys(languages);
      }
      function requireLanguage(name) {
        deprecated("10.4.0", "requireLanguage will be removed entirely in v11.");
        deprecated("10.4.0", "Please see https://github.com/highlightjs/highlight.js/pull/2844");
        const lang = getLanguage(name);
        if (lang) {
          return lang;
        }
        const err = new Error("The '{}' language is required, but not loaded.".replace("{}", name));
        throw err;
      }
      function getLanguage(name) {
        name = (name || "").toLowerCase();
        return languages[name] || languages[aliases[name]];
      }
      function registerAliases(aliasList, {languageName}) {
        if (typeof aliasList === "string") {
          aliasList = [aliasList];
        }
        aliasList.forEach((alias) => {
          aliases[alias.toLowerCase()] = languageName;
        });
      }
      function autoDetection(name) {
        const lang = getLanguage(name);
        return lang && !lang.disableAutodetect;
      }
      function upgradePluginAPI(plugin) {
        if (plugin["before:highlightBlock"] && !plugin["before:highlightElement"]) {
          plugin["before:highlightElement"] = (data) => {
            plugin["before:highlightBlock"](Object.assign({block: data.el}, data));
          };
        }
        if (plugin["after:highlightBlock"] && !plugin["after:highlightElement"]) {
          plugin["after:highlightElement"] = (data) => {
            plugin["after:highlightBlock"](Object.assign({block: data.el}, data));
          };
        }
      }
      function addPlugin(plugin) {
        upgradePluginAPI(plugin);
        plugins.push(plugin);
      }
      function fire(event, args) {
        const cb = event;
        plugins.forEach(function(plugin) {
          if (plugin[cb]) {
            plugin[cb](args);
          }
        });
      }
      function deprecateFixMarkup(arg) {
        deprecated("10.2.0", "fixMarkup will be removed entirely in v11.0");
        deprecated("10.2.0", "Please see https://github.com/highlightjs/highlight.js/issues/2534");
        return fixMarkup(arg);
      }
      function deprecateHighlightBlock(el) {
        deprecated("10.7.0", "highlightBlock will be removed entirely in v12.0");
        deprecated("10.7.0", "Please use highlightElement now.");
        return highlightElement(el);
      }
      Object.assign(hljs2, {
        highlight: highlight2,
        highlightAuto,
        highlightAll,
        fixMarkup: deprecateFixMarkup,
        highlightElement,
        highlightBlock: deprecateHighlightBlock,
        configure,
        initHighlighting,
        initHighlightingOnLoad,
        registerLanguage,
        unregisterLanguage,
        listLanguages,
        getLanguage,
        registerAliases,
        requireLanguage,
        autoDetection,
        inherit: inherit$1,
        addPlugin,
        vuePlugin: BuildVuePlugin(hljs2).VuePlugin
      });
      hljs2.debugMode = function() {
        SAFE_MODE = false;
      };
      hljs2.safeMode = function() {
        SAFE_MODE = true;
      };
      hljs2.versionString = version;
      for (const key in MODES) {
        if (typeof MODES[key] === "object") {
          deepFreezeEs6(MODES[key]);
        }
      }
      Object.assign(hljs2, MODES);
      hljs2.addPlugin(brPlugin);
      hljs2.addPlugin(mergeHTMLPlugin);
      hljs2.addPlugin(tabReplacePlugin);
      return hljs2;
    };
    var highlight = HLJS({});
    module.exports = highlight;
  });

  // node_modules/highlight.js/lib/languages/javascript.js
  var require_javascript = __commonJS((exports, module) => {
    var IDENT_RE = "[A-Za-z$_][0-9A-Za-z$_]*";
    var KEYWORDS = [
      "as",
      "in",
      "of",
      "if",
      "for",
      "while",
      "finally",
      "var",
      "new",
      "function",
      "do",
      "return",
      "void",
      "else",
      "break",
      "catch",
      "instanceof",
      "with",
      "throw",
      "case",
      "default",
      "try",
      "switch",
      "continue",
      "typeof",
      "delete",
      "let",
      "yield",
      "const",
      "class",
      "debugger",
      "async",
      "await",
      "static",
      "import",
      "from",
      "export",
      "extends"
    ];
    var LITERALS = [
      "true",
      "false",
      "null",
      "undefined",
      "NaN",
      "Infinity"
    ];
    var TYPES = [
      "Intl",
      "DataView",
      "Number",
      "Math",
      "Date",
      "String",
      "RegExp",
      "Object",
      "Function",
      "Boolean",
      "Error",
      "Symbol",
      "Set",
      "Map",
      "WeakSet",
      "WeakMap",
      "Proxy",
      "Reflect",
      "JSON",
      "Promise",
      "Float64Array",
      "Int16Array",
      "Int32Array",
      "Int8Array",
      "Uint16Array",
      "Uint32Array",
      "Float32Array",
      "Array",
      "Uint8Array",
      "Uint8ClampedArray",
      "ArrayBuffer",
      "BigInt64Array",
      "BigUint64Array",
      "BigInt"
    ];
    var ERROR_TYPES = [
      "EvalError",
      "InternalError",
      "RangeError",
      "ReferenceError",
      "SyntaxError",
      "TypeError",
      "URIError"
    ];
    var BUILT_IN_GLOBALS = [
      "setInterval",
      "setTimeout",
      "clearInterval",
      "clearTimeout",
      "require",
      "exports",
      "eval",
      "isFinite",
      "isNaN",
      "parseFloat",
      "parseInt",
      "decodeURI",
      "decodeURIComponent",
      "encodeURI",
      "encodeURIComponent",
      "escape",
      "unescape"
    ];
    var BUILT_IN_VARIABLES = [
      "arguments",
      "this",
      "super",
      "console",
      "window",
      "document",
      "localStorage",
      "module",
      "global"
    ];
    var BUILT_INS = [].concat(BUILT_IN_GLOBALS, BUILT_IN_VARIABLES, TYPES, ERROR_TYPES);
    function source(re) {
      if (!re)
        return null;
      if (typeof re === "string")
        return re;
      return re.source;
    }
    function lookahead(re) {
      return concat("(?=", re, ")");
    }
    function concat(...args) {
      const joined = args.map((x) => source(x)).join("");
      return joined;
    }
    function javascript2(hljs2) {
      const hasClosingTag = (match, {after}) => {
        const tag = "</" + match[0].slice(1);
        const pos = match.input.indexOf(tag, after);
        return pos !== -1;
      };
      const IDENT_RE$1 = IDENT_RE;
      const FRAGMENT = {
        begin: "<>",
        end: "</>"
      };
      const XML_TAG = {
        begin: /<[A-Za-z0-9\\._:-]+/,
        end: /\/[A-Za-z0-9\\._:-]+>|\/>/,
        isTrulyOpeningTag: (match, response) => {
          const afterMatchIndex = match[0].length + match.index;
          const nextChar = match.input[afterMatchIndex];
          if (nextChar === "<") {
            response.ignoreMatch();
            return;
          }
          if (nextChar === ">") {
            if (!hasClosingTag(match, {after: afterMatchIndex})) {
              response.ignoreMatch();
            }
          }
        }
      };
      const KEYWORDS$1 = {
        $pattern: IDENT_RE,
        keyword: KEYWORDS,
        literal: LITERALS,
        built_in: BUILT_INS
      };
      const decimalDigits = "[0-9](_?[0-9])*";
      const frac = `\\.(${decimalDigits})`;
      const decimalInteger = `0|[1-9](_?[0-9])*|0[0-7]*[89][0-9]*`;
      const NUMBER = {
        className: "number",
        variants: [
          {begin: `(\\b(${decimalInteger})((${frac})|\\.)?|(${frac}))[eE][+-]?(${decimalDigits})\\b`},
          {begin: `\\b(${decimalInteger})\\b((${frac})\\b|\\.)?|(${frac})\\b`},
          {begin: `\\b(0|[1-9](_?[0-9])*)n\\b`},
          {begin: "\\b0[xX][0-9a-fA-F](_?[0-9a-fA-F])*n?\\b"},
          {begin: "\\b0[bB][0-1](_?[0-1])*n?\\b"},
          {begin: "\\b0[oO][0-7](_?[0-7])*n?\\b"},
          {begin: "\\b0[0-7]+n?\\b"}
        ],
        relevance: 0
      };
      const SUBST = {
        className: "subst",
        begin: "\\$\\{",
        end: "\\}",
        keywords: KEYWORDS$1,
        contains: []
      };
      const HTML_TEMPLATE = {
        begin: "html`",
        end: "",
        starts: {
          end: "`",
          returnEnd: false,
          contains: [
            hljs2.BACKSLASH_ESCAPE,
            SUBST
          ],
          subLanguage: "xml"
        }
      };
      const CSS_TEMPLATE = {
        begin: "css`",
        end: "",
        starts: {
          end: "`",
          returnEnd: false,
          contains: [
            hljs2.BACKSLASH_ESCAPE,
            SUBST
          ],
          subLanguage: "css"
        }
      };
      const TEMPLATE_STRING = {
        className: "string",
        begin: "`",
        end: "`",
        contains: [
          hljs2.BACKSLASH_ESCAPE,
          SUBST
        ]
      };
      const JSDOC_COMMENT = hljs2.COMMENT(/\/\*\*(?!\/)/, "\\*/", {
        relevance: 0,
        contains: [
          {
            className: "doctag",
            begin: "@[A-Za-z]+",
            contains: [
              {
                className: "type",
                begin: "\\{",
                end: "\\}",
                relevance: 0
              },
              {
                className: "variable",
                begin: IDENT_RE$1 + "(?=\\s*(-)|$)",
                endsParent: true,
                relevance: 0
              },
              {
                begin: /(?=[^\n])\s/,
                relevance: 0
              }
            ]
          }
        ]
      });
      const COMMENT = {
        className: "comment",
        variants: [
          JSDOC_COMMENT,
          hljs2.C_BLOCK_COMMENT_MODE,
          hljs2.C_LINE_COMMENT_MODE
        ]
      };
      const SUBST_INTERNALS = [
        hljs2.APOS_STRING_MODE,
        hljs2.QUOTE_STRING_MODE,
        HTML_TEMPLATE,
        CSS_TEMPLATE,
        TEMPLATE_STRING,
        NUMBER,
        hljs2.REGEXP_MODE
      ];
      SUBST.contains = SUBST_INTERNALS.concat({
        begin: /\{/,
        end: /\}/,
        keywords: KEYWORDS$1,
        contains: [
          "self"
        ].concat(SUBST_INTERNALS)
      });
      const SUBST_AND_COMMENTS = [].concat(COMMENT, SUBST.contains);
      const PARAMS_CONTAINS = SUBST_AND_COMMENTS.concat([
        {
          begin: /\(/,
          end: /\)/,
          keywords: KEYWORDS$1,
          contains: ["self"].concat(SUBST_AND_COMMENTS)
        }
      ]);
      const PARAMS = {
        className: "params",
        begin: /\(/,
        end: /\)/,
        excludeBegin: true,
        excludeEnd: true,
        keywords: KEYWORDS$1,
        contains: PARAMS_CONTAINS
      };
      return {
        name: "Javascript",
        aliases: ["js", "jsx", "mjs", "cjs"],
        keywords: KEYWORDS$1,
        exports: {PARAMS_CONTAINS},
        illegal: /#(?![$_A-z])/,
        contains: [
          hljs2.SHEBANG({
            label: "shebang",
            binary: "node",
            relevance: 5
          }),
          {
            label: "use_strict",
            className: "meta",
            relevance: 10,
            begin: /^\s*['"]use (strict|asm)['"]/
          },
          hljs2.APOS_STRING_MODE,
          hljs2.QUOTE_STRING_MODE,
          HTML_TEMPLATE,
          CSS_TEMPLATE,
          TEMPLATE_STRING,
          COMMENT,
          NUMBER,
          {
            begin: concat(/[{,\n]\s*/, lookahead(concat(/(((\/\/.*$)|(\/\*(\*[^/]|[^*])*\*\/))\s*)*/, IDENT_RE$1 + "\\s*:"))),
            relevance: 0,
            contains: [
              {
                className: "attr",
                begin: IDENT_RE$1 + lookahead("\\s*:"),
                relevance: 0
              }
            ]
          },
          {
            begin: "(" + hljs2.RE_STARTERS_RE + "|\\b(case|return|throw)\\b)\\s*",
            keywords: "return throw case",
            contains: [
              COMMENT,
              hljs2.REGEXP_MODE,
              {
                className: "function",
                begin: "(\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)|" + hljs2.UNDERSCORE_IDENT_RE + ")\\s*=>",
                returnBegin: true,
                end: "\\s*=>",
                contains: [
                  {
                    className: "params",
                    variants: [
                      {
                        begin: hljs2.UNDERSCORE_IDENT_RE,
                        relevance: 0
                      },
                      {
                        className: null,
                        begin: /\(\s*\)/,
                        skip: true
                      },
                      {
                        begin: /\(/,
                        end: /\)/,
                        excludeBegin: true,
                        excludeEnd: true,
                        keywords: KEYWORDS$1,
                        contains: PARAMS_CONTAINS
                      }
                    ]
                  }
                ]
              },
              {
                begin: /,/,
                relevance: 0
              },
              {
                className: "",
                begin: /\s/,
                end: /\s*/,
                skip: true
              },
              {
                variants: [
                  {begin: FRAGMENT.begin, end: FRAGMENT.end},
                  {
                    begin: XML_TAG.begin,
                    "on:begin": XML_TAG.isTrulyOpeningTag,
                    end: XML_TAG.end
                  }
                ],
                subLanguage: "xml",
                contains: [
                  {
                    begin: XML_TAG.begin,
                    end: XML_TAG.end,
                    skip: true,
                    contains: ["self"]
                  }
                ]
              }
            ],
            relevance: 0
          },
          {
            className: "function",
            beginKeywords: "function",
            end: /[{;]/,
            excludeEnd: true,
            keywords: KEYWORDS$1,
            contains: [
              "self",
              hljs2.inherit(hljs2.TITLE_MODE, {begin: IDENT_RE$1}),
              PARAMS
            ],
            illegal: /%/
          },
          {
            beginKeywords: "while if switch catch for"
          },
          {
            className: "function",
            begin: hljs2.UNDERSCORE_IDENT_RE + "\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)\\s*\\{",
            returnBegin: true,
            contains: [
              PARAMS,
              hljs2.inherit(hljs2.TITLE_MODE, {begin: IDENT_RE$1})
            ]
          },
          {
            variants: [
              {begin: "\\." + IDENT_RE$1},
              {begin: "\\$" + IDENT_RE$1}
            ],
            relevance: 0
          },
          {
            className: "class",
            beginKeywords: "class",
            end: /[{;=]/,
            excludeEnd: true,
            illegal: /[:"[\]]/,
            contains: [
              {beginKeywords: "extends"},
              hljs2.UNDERSCORE_TITLE_MODE
            ]
          },
          {
            begin: /\b(?=constructor)/,
            end: /[{;]/,
            excludeEnd: true,
            contains: [
              hljs2.inherit(hljs2.TITLE_MODE, {begin: IDENT_RE$1}),
              "self",
              PARAMS
            ]
          },
          {
            begin: "(get|set)\\s+(?=" + IDENT_RE$1 + "\\()",
            end: /\{/,
            keywords: "get set",
            contains: [
              hljs2.inherit(hljs2.TITLE_MODE, {begin: IDENT_RE$1}),
              {begin: /\(\)/},
              PARAMS
            ]
          },
          {
            begin: /\$[(.]/
          }
        ]
      };
    }
    module.exports = javascript2;
  });

  // node_modules/highlight.js/lib/languages/json.js
  var require_json = __commonJS((exports, module) => {
    function json2(hljs2) {
      const LITERALS = {
        literal: "true false null"
      };
      const ALLOWED_COMMENTS = [
        hljs2.C_LINE_COMMENT_MODE,
        hljs2.C_BLOCK_COMMENT_MODE
      ];
      const TYPES = [
        hljs2.QUOTE_STRING_MODE,
        hljs2.C_NUMBER_MODE
      ];
      const VALUE_CONTAINER = {
        end: ",",
        endsWithParent: true,
        excludeEnd: true,
        contains: TYPES,
        keywords: LITERALS
      };
      const OBJECT = {
        begin: /\{/,
        end: /\}/,
        contains: [
          {
            className: "attr",
            begin: /"/,
            end: /"/,
            contains: [hljs2.BACKSLASH_ESCAPE],
            illegal: "\\n"
          },
          hljs2.inherit(VALUE_CONTAINER, {
            begin: /:/
          })
        ].concat(ALLOWED_COMMENTS),
        illegal: "\\S"
      };
      const ARRAY = {
        begin: "\\[",
        end: "\\]",
        contains: [hljs2.inherit(VALUE_CONTAINER)],
        illegal: "\\S"
      };
      TYPES.push(OBJECT, ARRAY);
      ALLOWED_COMMENTS.forEach(function(rule) {
        TYPES.push(rule);
      });
      return {
        name: "JSON",
        contains: TYPES,
        keywords: LITERALS,
        illegal: "\\S"
      };
    }
    module.exports = json2;
  });

  // node_modules/highlight.js/lib/languages/bash.js
  var require_bash = __commonJS((exports, module) => {
    function source(re) {
      if (!re)
        return null;
      if (typeof re === "string")
        return re;
      return re.source;
    }
    function concat(...args) {
      const joined = args.map((x) => source(x)).join("");
      return joined;
    }
    function bash2(hljs2) {
      const VAR = {};
      const BRACED_VAR = {
        begin: /\$\{/,
        end: /\}/,
        contains: [
          "self",
          {
            begin: /:-/,
            contains: [VAR]
          }
        ]
      };
      Object.assign(VAR, {
        className: "variable",
        variants: [
          {begin: concat(/\$[\w\d#@][\w\d_]*/, `(?![\\w\\d])(?![$])`)},
          BRACED_VAR
        ]
      });
      const SUBST = {
        className: "subst",
        begin: /\$\(/,
        end: /\)/,
        contains: [hljs2.BACKSLASH_ESCAPE]
      };
      const HERE_DOC = {
        begin: /<<-?\s*(?=\w+)/,
        starts: {
          contains: [
            hljs2.END_SAME_AS_BEGIN({
              begin: /(\w+)/,
              end: /(\w+)/,
              className: "string"
            })
          ]
        }
      };
      const QUOTE_STRING = {
        className: "string",
        begin: /"/,
        end: /"/,
        contains: [
          hljs2.BACKSLASH_ESCAPE,
          VAR,
          SUBST
        ]
      };
      SUBST.contains.push(QUOTE_STRING);
      const ESCAPED_QUOTE = {
        className: "",
        begin: /\\"/
      };
      const APOS_STRING = {
        className: "string",
        begin: /'/,
        end: /'/
      };
      const ARITHMETIC = {
        begin: /\$\(\(/,
        end: /\)\)/,
        contains: [
          {begin: /\d+#[0-9a-f]+/, className: "number"},
          hljs2.NUMBER_MODE,
          VAR
        ]
      };
      const SH_LIKE_SHELLS = [
        "fish",
        "bash",
        "zsh",
        "sh",
        "csh",
        "ksh",
        "tcsh",
        "dash",
        "scsh"
      ];
      const KNOWN_SHEBANG = hljs2.SHEBANG({
        binary: `(${SH_LIKE_SHELLS.join("|")})`,
        relevance: 10
      });
      const FUNCTION = {
        className: "function",
        begin: /\w[\w\d_]*\s*\(\s*\)\s*\{/,
        returnBegin: true,
        contains: [hljs2.inherit(hljs2.TITLE_MODE, {begin: /\w[\w\d_]*/})],
        relevance: 0
      };
      return {
        name: "Bash",
        aliases: ["sh", "zsh"],
        keywords: {
          $pattern: /\b[a-z._-]+\b/,
          keyword: "if then else elif fi for while in do done case esac function",
          literal: "true false",
          built_in: "break cd continue eval exec exit export getopts hash pwd readonly return shift test times trap umask unset alias bind builtin caller command declare echo enable help let local logout mapfile printf read readarray source type typeset ulimit unalias set shopt autoload bg bindkey bye cap chdir clone comparguments compcall compctl compdescribe compfiles compgroups compquote comptags comptry compvalues dirs disable disown echotc echoti emulate fc fg float functions getcap getln history integer jobs kill limit log noglob popd print pushd pushln rehash sched setcap setopt stat suspend ttyctl unfunction unhash unlimit unsetopt vared wait whence where which zcompile zformat zftp zle zmodload zparseopts zprof zpty zregexparse zsocket zstyle ztcp"
        },
        contains: [
          KNOWN_SHEBANG,
          hljs2.SHEBANG(),
          FUNCTION,
          ARITHMETIC,
          hljs2.HASH_COMMENT_MODE,
          HERE_DOC,
          QUOTE_STRING,
          ESCAPED_QUOTE,
          APOS_STRING,
          VAR
        ]
      };
    }
    module.exports = bash2;
  });

  // node_modules/highlight.js/lib/languages/htmlbars.js
  var require_htmlbars = __commonJS((exports, module) => {
    function source(re) {
      if (!re)
        return null;
      if (typeof re === "string")
        return re;
      return re.source;
    }
    function anyNumberOfTimes(re) {
      return concat("(", re, ")*");
    }
    function optional(re) {
      return concat("(", re, ")?");
    }
    function concat(...args) {
      const joined = args.map((x) => source(x)).join("");
      return joined;
    }
    function either(...args) {
      const joined = "(" + args.map((x) => source(x)).join("|") + ")";
      return joined;
    }
    function handlebars(hljs2) {
      const BUILT_INS = {
        "builtin-name": [
          "action",
          "bindattr",
          "collection",
          "component",
          "concat",
          "debugger",
          "each",
          "each-in",
          "get",
          "hash",
          "if",
          "in",
          "input",
          "link-to",
          "loc",
          "log",
          "lookup",
          "mut",
          "outlet",
          "partial",
          "query-params",
          "render",
          "template",
          "textarea",
          "unbound",
          "unless",
          "view",
          "with",
          "yield"
        ]
      };
      const LITERALS = {
        literal: [
          "true",
          "false",
          "undefined",
          "null"
        ]
      };
      const DOUBLE_QUOTED_ID_REGEX = /""|"[^"]+"/;
      const SINGLE_QUOTED_ID_REGEX = /''|'[^']+'/;
      const BRACKET_QUOTED_ID_REGEX = /\[\]|\[[^\]]+\]/;
      const PLAIN_ID_REGEX = /[^\s!"#%&'()*+,.\/;<=>@\[\\\]^`{|}~]+/;
      const PATH_DELIMITER_REGEX = /(\.|\/)/;
      const ANY_ID = either(DOUBLE_QUOTED_ID_REGEX, SINGLE_QUOTED_ID_REGEX, BRACKET_QUOTED_ID_REGEX, PLAIN_ID_REGEX);
      const IDENTIFIER_REGEX = concat(optional(/\.|\.\/|\//), ANY_ID, anyNumberOfTimes(concat(PATH_DELIMITER_REGEX, ANY_ID)));
      const HASH_PARAM_REGEX = concat("(", BRACKET_QUOTED_ID_REGEX, "|", PLAIN_ID_REGEX, ")(?==)");
      const HELPER_NAME_OR_PATH_EXPRESSION = {
        begin: IDENTIFIER_REGEX,
        lexemes: /[\w.\/]+/
      };
      const HELPER_PARAMETER = hljs2.inherit(HELPER_NAME_OR_PATH_EXPRESSION, {
        keywords: LITERALS
      });
      const SUB_EXPRESSION = {
        begin: /\(/,
        end: /\)/
      };
      const HASH = {
        className: "attr",
        begin: HASH_PARAM_REGEX,
        relevance: 0,
        starts: {
          begin: /=/,
          end: /=/,
          starts: {
            contains: [
              hljs2.NUMBER_MODE,
              hljs2.QUOTE_STRING_MODE,
              hljs2.APOS_STRING_MODE,
              HELPER_PARAMETER,
              SUB_EXPRESSION
            ]
          }
        }
      };
      const BLOCK_PARAMS = {
        begin: /as\s+\|/,
        keywords: {
          keyword: "as"
        },
        end: /\|/,
        contains: [
          {
            begin: /\w+/
          }
        ]
      };
      const HELPER_PARAMETERS = {
        contains: [
          hljs2.NUMBER_MODE,
          hljs2.QUOTE_STRING_MODE,
          hljs2.APOS_STRING_MODE,
          BLOCK_PARAMS,
          HASH,
          HELPER_PARAMETER,
          SUB_EXPRESSION
        ],
        returnEnd: true
      };
      const SUB_EXPRESSION_CONTENTS = hljs2.inherit(HELPER_NAME_OR_PATH_EXPRESSION, {
        className: "name",
        keywords: BUILT_INS,
        starts: hljs2.inherit(HELPER_PARAMETERS, {
          end: /\)/
        })
      });
      SUB_EXPRESSION.contains = [SUB_EXPRESSION_CONTENTS];
      const OPENING_BLOCK_MUSTACHE_CONTENTS = hljs2.inherit(HELPER_NAME_OR_PATH_EXPRESSION, {
        keywords: BUILT_INS,
        className: "name",
        starts: hljs2.inherit(HELPER_PARAMETERS, {
          end: /\}\}/
        })
      });
      const CLOSING_BLOCK_MUSTACHE_CONTENTS = hljs2.inherit(HELPER_NAME_OR_PATH_EXPRESSION, {
        keywords: BUILT_INS,
        className: "name"
      });
      const BASIC_MUSTACHE_CONTENTS = hljs2.inherit(HELPER_NAME_OR_PATH_EXPRESSION, {
        className: "name",
        keywords: BUILT_INS,
        starts: hljs2.inherit(HELPER_PARAMETERS, {
          end: /\}\}/
        })
      });
      const ESCAPE_MUSTACHE_WITH_PRECEEDING_BACKSLASH = {
        begin: /\\\{\{/,
        skip: true
      };
      const PREVENT_ESCAPE_WITH_ANOTHER_PRECEEDING_BACKSLASH = {
        begin: /\\\\(?=\{\{)/,
        skip: true
      };
      return {
        name: "Handlebars",
        aliases: [
          "hbs",
          "html.hbs",
          "html.handlebars",
          "htmlbars"
        ],
        case_insensitive: true,
        subLanguage: "xml",
        contains: [
          ESCAPE_MUSTACHE_WITH_PRECEEDING_BACKSLASH,
          PREVENT_ESCAPE_WITH_ANOTHER_PRECEEDING_BACKSLASH,
          hljs2.COMMENT(/\{\{!--/, /--\}\}/),
          hljs2.COMMENT(/\{\{!/, /\}\}/),
          {
            className: "template-tag",
            begin: /\{\{\{\{(?!\/)/,
            end: /\}\}\}\}/,
            contains: [OPENING_BLOCK_MUSTACHE_CONTENTS],
            starts: {
              end: /\{\{\{\{\//,
              returnEnd: true,
              subLanguage: "xml"
            }
          },
          {
            className: "template-tag",
            begin: /\{\{\{\{\//,
            end: /\}\}\}\}/,
            contains: [CLOSING_BLOCK_MUSTACHE_CONTENTS]
          },
          {
            className: "template-tag",
            begin: /\{\{#/,
            end: /\}\}/,
            contains: [OPENING_BLOCK_MUSTACHE_CONTENTS]
          },
          {
            className: "template-tag",
            begin: /\{\{(?=else\}\})/,
            end: /\}\}/,
            keywords: "else"
          },
          {
            className: "template-tag",
            begin: /\{\{(?=else if)/,
            end: /\}\}/,
            keywords: "else if"
          },
          {
            className: "template-tag",
            begin: /\{\{\//,
            end: /\}\}/,
            contains: [CLOSING_BLOCK_MUSTACHE_CONTENTS]
          },
          {
            className: "template-variable",
            begin: /\{\{\{/,
            end: /\}\}\}/,
            contains: [BASIC_MUSTACHE_CONTENTS]
          },
          {
            className: "template-variable",
            begin: /\{\{/,
            end: /\}\}/,
            contains: [BASIC_MUSTACHE_CONTENTS]
          }
        ]
      };
    }
    function htmlbars2(hljs2) {
      const definition = handlebars(hljs2);
      definition.name = "HTMLbars";
      if (hljs2.getLanguage("handlebars")) {
        definition.disableAutodetect = true;
      }
      return definition;
    }
    module.exports = htmlbars2;
  });

  // node_modules/highlight.js/lib/languages/ini.js
  var require_ini = __commonJS((exports, module) => {
    function source(re) {
      if (!re)
        return null;
      if (typeof re === "string")
        return re;
      return re.source;
    }
    function lookahead(re) {
      return concat("(?=", re, ")");
    }
    function concat(...args) {
      const joined = args.map((x) => source(x)).join("");
      return joined;
    }
    function either(...args) {
      const joined = "(" + args.map((x) => source(x)).join("|") + ")";
      return joined;
    }
    function ini2(hljs2) {
      const NUMBERS = {
        className: "number",
        relevance: 0,
        variants: [
          {
            begin: /([+-]+)?[\d]+_[\d_]+/
          },
          {
            begin: hljs2.NUMBER_RE
          }
        ]
      };
      const COMMENTS = hljs2.COMMENT();
      COMMENTS.variants = [
        {
          begin: /;/,
          end: /$/
        },
        {
          begin: /#/,
          end: /$/
        }
      ];
      const VARIABLES = {
        className: "variable",
        variants: [
          {
            begin: /\$[\w\d"][\w\d_]*/
          },
          {
            begin: /\$\{(.*?)\}/
          }
        ]
      };
      const LITERALS = {
        className: "literal",
        begin: /\bon|off|true|false|yes|no\b/
      };
      const STRINGS = {
        className: "string",
        contains: [hljs2.BACKSLASH_ESCAPE],
        variants: [
          {
            begin: "'''",
            end: "'''",
            relevance: 10
          },
          {
            begin: '"""',
            end: '"""',
            relevance: 10
          },
          {
            begin: '"',
            end: '"'
          },
          {
            begin: "'",
            end: "'"
          }
        ]
      };
      const ARRAY = {
        begin: /\[/,
        end: /\]/,
        contains: [
          COMMENTS,
          LITERALS,
          VARIABLES,
          STRINGS,
          NUMBERS,
          "self"
        ],
        relevance: 0
      };
      const BARE_KEY = /[A-Za-z0-9_-]+/;
      const QUOTED_KEY_DOUBLE_QUOTE = /"(\\"|[^"])*"/;
      const QUOTED_KEY_SINGLE_QUOTE = /'[^']*'/;
      const ANY_KEY = either(BARE_KEY, QUOTED_KEY_DOUBLE_QUOTE, QUOTED_KEY_SINGLE_QUOTE);
      const DOTTED_KEY = concat(ANY_KEY, "(\\s*\\.\\s*", ANY_KEY, ")*", lookahead(/\s*=\s*[^#\s]/));
      return {
        name: "TOML, also INI",
        aliases: ["toml"],
        case_insensitive: true,
        illegal: /\S/,
        contains: [
          COMMENTS,
          {
            className: "section",
            begin: /\[+/,
            end: /\]+/
          },
          {
            begin: DOTTED_KEY,
            className: "attr",
            starts: {
              end: /$/,
              contains: [
                COMMENTS,
                ARRAY,
                LITERALS,
                VARIABLES,
                STRINGS,
                NUMBERS
              ]
            }
          }
        ]
      };
    }
    module.exports = ini2;
  });

  // node_modules/highlight.js/lib/languages/yaml.js
  var require_yaml = __commonJS((exports, module) => {
    function yaml2(hljs2) {
      var LITERALS = "true false yes no null";
      var URI_CHARACTERS = "[\\w#;/?:@&=+$,.~*'()[\\]]+";
      var KEY = {
        className: "attr",
        variants: [
          {begin: "\\w[\\w :\\/.-]*:(?=[ 	]|$)"},
          {begin: '"\\w[\\w :\\/.-]*":(?=[ 	]|$)'},
          {begin: "'\\w[\\w :\\/.-]*':(?=[ 	]|$)"}
        ]
      };
      var TEMPLATE_VARIABLES = {
        className: "template-variable",
        variants: [
          {begin: /\{\{/, end: /\}\}/},
          {begin: /%\{/, end: /\}/}
        ]
      };
      var STRING = {
        className: "string",
        relevance: 0,
        variants: [
          {begin: /'/, end: /'/},
          {begin: /"/, end: /"/},
          {begin: /\S+/}
        ],
        contains: [
          hljs2.BACKSLASH_ESCAPE,
          TEMPLATE_VARIABLES
        ]
      };
      var CONTAINER_STRING = hljs2.inherit(STRING, {
        variants: [
          {begin: /'/, end: /'/},
          {begin: /"/, end: /"/},
          {begin: /[^\s,{}[\]]+/}
        ]
      });
      var DATE_RE = "[0-9]{4}(-[0-9][0-9]){0,2}";
      var TIME_RE = "([Tt \\t][0-9][0-9]?(:[0-9][0-9]){2})?";
      var FRACTION_RE = "(\\.[0-9]*)?";
      var ZONE_RE = "([ \\t])*(Z|[-+][0-9][0-9]?(:[0-9][0-9])?)?";
      var TIMESTAMP = {
        className: "number",
        begin: "\\b" + DATE_RE + TIME_RE + FRACTION_RE + ZONE_RE + "\\b"
      };
      var VALUE_CONTAINER = {
        end: ",",
        endsWithParent: true,
        excludeEnd: true,
        keywords: LITERALS,
        relevance: 0
      };
      var OBJECT = {
        begin: /\{/,
        end: /\}/,
        contains: [VALUE_CONTAINER],
        illegal: "\\n",
        relevance: 0
      };
      var ARRAY = {
        begin: "\\[",
        end: "\\]",
        contains: [VALUE_CONTAINER],
        illegal: "\\n",
        relevance: 0
      };
      var MODES = [
        KEY,
        {
          className: "meta",
          begin: "^---\\s*$",
          relevance: 10
        },
        {
          className: "string",
          begin: "[\\|>]([1-9]?[+-])?[ ]*\\n( +)[^ ][^\\n]*\\n(\\2[^\\n]+\\n?)*"
        },
        {
          begin: "<%[%=-]?",
          end: "[%-]?%>",
          subLanguage: "ruby",
          excludeBegin: true,
          excludeEnd: true,
          relevance: 0
        },
        {
          className: "type",
          begin: "!\\w+!" + URI_CHARACTERS
        },
        {
          className: "type",
          begin: "!<" + URI_CHARACTERS + ">"
        },
        {
          className: "type",
          begin: "!" + URI_CHARACTERS
        },
        {
          className: "type",
          begin: "!!" + URI_CHARACTERS
        },
        {
          className: "meta",
          begin: "&" + hljs2.UNDERSCORE_IDENT_RE + "$"
        },
        {
          className: "meta",
          begin: "\\*" + hljs2.UNDERSCORE_IDENT_RE + "$"
        },
        {
          className: "bullet",
          begin: "-(?=[ ]|$)",
          relevance: 0
        },
        hljs2.HASH_COMMENT_MODE,
        {
          beginKeywords: LITERALS,
          keywords: {literal: LITERALS}
        },
        TIMESTAMP,
        {
          className: "number",
          begin: hljs2.C_NUMBER_RE + "\\b",
          relevance: 0
        },
        OBJECT,
        ARRAY,
        STRING
      ];
      var VALUE_MODES = [...MODES];
      VALUE_MODES.pop();
      VALUE_MODES.push(CONTAINER_STRING);
      VALUE_CONTAINER.contains = VALUE_MODES;
      return {
        name: "YAML",
        case_insensitive: true,
        aliases: ["yml"],
        contains: MODES
      };
    }
    module.exports = yaml2;
  });

  // node_modules/highlight.js/lib/languages/markdown.js
  var require_markdown = __commonJS((exports, module) => {
    function source(re) {
      if (!re)
        return null;
      if (typeof re === "string")
        return re;
      return re.source;
    }
    function concat(...args) {
      const joined = args.map((x) => source(x)).join("");
      return joined;
    }
    function markdown2(hljs2) {
      const INLINE_HTML = {
        begin: /<\/?[A-Za-z_]/,
        end: ">",
        subLanguage: "xml",
        relevance: 0
      };
      const HORIZONTAL_RULE = {
        begin: "^[-\\*]{3,}",
        end: "$"
      };
      const CODE = {
        className: "code",
        variants: [
          {
            begin: "(`{3,})[^`](.|\\n)*?\\1`*[ ]*"
          },
          {
            begin: "(~{3,})[^~](.|\\n)*?\\1~*[ ]*"
          },
          {
            begin: "```",
            end: "```+[ ]*$"
          },
          {
            begin: "~~~",
            end: "~~~+[ ]*$"
          },
          {
            begin: "`.+?`"
          },
          {
            begin: "(?=^( {4}|\\t))",
            contains: [
              {
                begin: "^( {4}|\\t)",
                end: "(\\n)$"
              }
            ],
            relevance: 0
          }
        ]
      };
      const LIST = {
        className: "bullet",
        begin: "^[ 	]*([*+-]|(\\d+\\.))(?=\\s+)",
        end: "\\s+",
        excludeEnd: true
      };
      const LINK_REFERENCE = {
        begin: /^\[[^\n]+\]:/,
        returnBegin: true,
        contains: [
          {
            className: "symbol",
            begin: /\[/,
            end: /\]/,
            excludeBegin: true,
            excludeEnd: true
          },
          {
            className: "link",
            begin: /:\s*/,
            end: /$/,
            excludeBegin: true
          }
        ]
      };
      const URL_SCHEME = /[A-Za-z][A-Za-z0-9+.-]*/;
      const LINK = {
        variants: [
          {
            begin: /\[.+?\]\[.*?\]/,
            relevance: 0
          },
          {
            begin: /\[.+?\]\(((data|javascript|mailto):|(?:http|ftp)s?:\/\/).*?\)/,
            relevance: 2
          },
          {
            begin: concat(/\[.+?\]\(/, URL_SCHEME, /:\/\/.*?\)/),
            relevance: 2
          },
          {
            begin: /\[.+?\]\([./?&#].*?\)/,
            relevance: 1
          },
          {
            begin: /\[.+?\]\(.*?\)/,
            relevance: 0
          }
        ],
        returnBegin: true,
        contains: [
          {
            className: "string",
            relevance: 0,
            begin: "\\[",
            end: "\\]",
            excludeBegin: true,
            returnEnd: true
          },
          {
            className: "link",
            relevance: 0,
            begin: "\\]\\(",
            end: "\\)",
            excludeBegin: true,
            excludeEnd: true
          },
          {
            className: "symbol",
            relevance: 0,
            begin: "\\]\\[",
            end: "\\]",
            excludeBegin: true,
            excludeEnd: true
          }
        ]
      };
      const BOLD = {
        className: "strong",
        contains: [],
        variants: [
          {
            begin: /_{2}/,
            end: /_{2}/
          },
          {
            begin: /\*{2}/,
            end: /\*{2}/
          }
        ]
      };
      const ITALIC = {
        className: "emphasis",
        contains: [],
        variants: [
          {
            begin: /\*(?!\*)/,
            end: /\*/
          },
          {
            begin: /_(?!_)/,
            end: /_/,
            relevance: 0
          }
        ]
      };
      BOLD.contains.push(ITALIC);
      ITALIC.contains.push(BOLD);
      let CONTAINABLE = [
        INLINE_HTML,
        LINK
      ];
      BOLD.contains = BOLD.contains.concat(CONTAINABLE);
      ITALIC.contains = ITALIC.contains.concat(CONTAINABLE);
      CONTAINABLE = CONTAINABLE.concat(BOLD, ITALIC);
      const HEADER = {
        className: "section",
        variants: [
          {
            begin: "^#{1,6}",
            end: "$",
            contains: CONTAINABLE
          },
          {
            begin: "(?=^.+?\\n[=-]{2,}$)",
            contains: [
              {
                begin: "^[=-]*$"
              },
              {
                begin: "^",
                end: "\\n",
                contains: CONTAINABLE
              }
            ]
          }
        ]
      };
      const BLOCKQUOTE = {
        className: "quote",
        begin: "^>\\s+",
        contains: CONTAINABLE,
        end: "$"
      };
      return {
        name: "Markdown",
        aliases: [
          "md",
          "mkdown",
          "mkd"
        ],
        contains: [
          HEADER,
          INLINE_HTML,
          LIST,
          BOLD,
          ITALIC,
          BLOCKQUOTE,
          CODE,
          HORIZONTAL_RULE,
          LINK,
          LINK_REFERENCE
        ]
      };
    }
    module.exports = markdown2;
  });

  // <stdin>
  var import_core = __toModule(require_core());
  var import_javascript = __toModule(require_javascript());
  var import_json = __toModule(require_json());
  var import_bash = __toModule(require_bash());
  var import_htmlbars = __toModule(require_htmlbars());
  var import_ini = __toModule(require_ini());
  var import_yaml = __toModule(require_yaml());
  var import_markdown = __toModule(require_markdown());
  import_core.default.registerLanguage("javascript", import_javascript.default);
  import_core.default.registerLanguage("json", import_json.default);
  import_core.default.registerLanguage("bash", import_bash.default);
  import_core.default.registerLanguage("html", import_htmlbars.default);
  import_core.default.registerLanguage("ini", import_ini.default);
  import_core.default.registerLanguage("toml", import_ini.default);
  import_core.default.registerLanguage("yaml", import_yaml.default);
  import_core.default.registerLanguage("md", import_markdown.default);
  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("pre code").forEach((block) => {
      import_core.default.highlightBlock(block);
    });
  });
})();
