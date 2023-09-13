'use client'
"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  ColorModeContext: () => ColorModeContext,
  ColorModeProvider: () => ColorModeProvider,
  ColorModeScript: () => ColorModeScript,
  DarkMode: () => DarkMode,
  LightMode: () => LightMode,
  cookieStorageManager: () => cookieStorageManager,
  cookieStorageManagerSSR: () => cookieStorageManagerSSR,
  createCookieStorageManager: () => createCookieStorageManager,
  createLocalStorageManager: () => createLocalStorageManager,
  getScriptSrc: () => getScriptSrc,
  localStorageManager: () => localStorageManager,
  useColorMode: () => useColorMode,
  useColorModeValue: () => useColorModeValue
});
module.exports = __toCommonJS(src_exports);

// src/color-mode-provider.tsx
var import_react_use_safe_layout_effect = require("@chakra-ui/react-use-safe-layout-effect");
var import_react2 = require("react");

// src/color-mode-context.ts
var import_react = require("react");
var ColorModeContext = (0, import_react.createContext)({});
ColorModeContext.displayName = "ColorModeContext";
function useColorMode() {
  const context = (0, import_react.useContext)(ColorModeContext);
  if (context === void 0) {
    throw new Error("useColorMode must be used within a ColorModeProvider");
  }
  return context;
}
function useColorModeValue(light, dark) {
  const { colorMode } = useColorMode();
  return colorMode === "dark" ? dark : light;
}

// src/color-mode.utils.ts
var classNames = {
  light: "chakra-ui-light",
  dark: "chakra-ui-dark"
};
function getColorModeUtils(options = {}) {
  const { preventTransition = true } = options;
  const utils = {
    setDataset: (value) => {
      const cleanup = preventTransition ? utils.preventTransition() : void 0;
      document.documentElement.dataset.theme = value;
      document.documentElement.style.colorScheme = value;
      cleanup == null ? void 0 : cleanup();
    },
    setClassName(dark) {
      document.body.classList.add(dark ? classNames.dark : classNames.light);
      document.body.classList.remove(dark ? classNames.light : classNames.dark);
    },
    query() {
      return window.matchMedia("(prefers-color-scheme: dark)");
    },
    getSystemTheme(fallback) {
      var _a;
      const dark = (_a = utils.query().matches) != null ? _a : fallback === "dark";
      return dark ? "dark" : "light";
    },
    addListener(fn) {
      const mql = utils.query();
      const listener = (e) => {
        fn(e.matches ? "dark" : "light");
      };
      if (typeof mql.addListener === "function")
        mql.addListener(listener);
      else
        mql.addEventListener("change", listener);
      return () => {
        if (typeof mql.removeListener === "function")
          mql.removeListener(listener);
        else
          mql.removeEventListener("change", listener);
      };
    },
    preventTransition() {
      const css = document.createElement("style");
      css.appendChild(
        document.createTextNode(
          `*{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}`
        )
      );
      document.head.appendChild(css);
      return () => {
        ;
        (() => window.getComputedStyle(document.body))();
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            document.head.removeChild(css);
          });
        });
      };
    }
  };
  return utils;
}

// src/storage-manager.ts
var STORAGE_KEY = "chakra-ui-color-mode";
function createLocalStorageManager(key) {
  return {
    ssr: false,
    type: "localStorage",
    get(init) {
      if (!(globalThis == null ? void 0 : globalThis.document))
        return init;
      let value;
      try {
        value = localStorage.getItem(key) || init;
      } catch (e) {
      }
      return value || init;
    },
    set(value) {
      try {
        localStorage.setItem(key, value);
      } catch (e) {
      }
    }
  };
}
var localStorageManager = createLocalStorageManager(STORAGE_KEY);
function parseCookie(cookie, key) {
  const match = cookie.match(new RegExp(`(^| )${key}=([^;]+)`));
  return match == null ? void 0 : match[2];
}
function createCookieStorageManager(key, cookie) {
  return {
    ssr: !!cookie,
    type: "cookie",
    get(init) {
      if (cookie)
        return parseCookie(cookie, key);
      if (!(globalThis == null ? void 0 : globalThis.document))
        return init;
      return parseCookie(document.cookie, key) || init;
    },
    set(value) {
      document.cookie = `${key}=${value}; max-age=31536000; path=/`;
    }
  };
}
var cookieStorageManager = createCookieStorageManager(STORAGE_KEY);
var cookieStorageManagerSSR = (cookie) => createCookieStorageManager(STORAGE_KEY, cookie);

// src/color-mode-provider.tsx
var import_jsx_runtime = require("react/jsx-runtime");
var noop = () => {
};
function getTheme(manager, fallback) {
  return manager.type === "cookie" && manager.ssr ? manager.get(fallback) : fallback;
}
function ColorModeProvider(props) {
  const {
    value,
    children,
    options: {
      useSystemColorMode,
      initialColorMode,
      disableTransitionOnChange
    } = {},
    colorModeManager = localStorageManager
  } = props;
  const defaultColorMode = initialColorMode === "dark" ? "dark" : "light";
  const [colorMode, rawSetColorMode] = (0, import_react2.useState)(
    () => getTheme(colorModeManager, defaultColorMode)
  );
  const [resolvedColorMode, setResolvedColorMode] = (0, import_react2.useState)(
    () => getTheme(colorModeManager)
  );
  const { getSystemTheme, setClassName, setDataset, addListener } = (0, import_react2.useMemo)(
    () => getColorModeUtils({ preventTransition: disableTransitionOnChange }),
    [disableTransitionOnChange]
  );
  const resolvedValue = initialColorMode === "system" && !colorMode ? resolvedColorMode : colorMode;
  const setColorMode = (0, import_react2.useCallback)(
    (value2) => {
      const resolved = value2 === "system" ? getSystemTheme() : value2;
      rawSetColorMode(resolved);
      setClassName(resolved === "dark");
      setDataset(resolved);
      colorModeManager.set(resolved);
    },
    [colorModeManager, getSystemTheme, setClassName, setDataset]
  );
  (0, import_react_use_safe_layout_effect.useSafeLayoutEffect)(() => {
    if (initialColorMode === "system") {
      setResolvedColorMode(getSystemTheme());
    }
  }, []);
  (0, import_react2.useEffect)(() => {
    const managerValue = colorModeManager.get();
    if (managerValue) {
      setColorMode(managerValue);
      return;
    }
    if (initialColorMode === "system") {
      setColorMode("system");
      return;
    }
    setColorMode(defaultColorMode);
  }, [colorModeManager, defaultColorMode, initialColorMode, setColorMode]);
  const toggleColorMode = (0, import_react2.useCallback)(() => {
    setColorMode(resolvedValue === "dark" ? "light" : "dark");
  }, [resolvedValue, setColorMode]);
  (0, import_react2.useEffect)(() => {
    if (!useSystemColorMode)
      return;
    return addListener(setColorMode);
  }, [useSystemColorMode, addListener, setColorMode]);
  const context = (0, import_react2.useMemo)(
    () => ({
      colorMode: value != null ? value : resolvedValue,
      toggleColorMode: value ? noop : toggleColorMode,
      setColorMode: value ? noop : setColorMode,
      forced: value !== void 0
    }),
    [resolvedValue, toggleColorMode, setColorMode, value]
  );
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ColorModeContext.Provider, { value: context, children });
}
ColorModeProvider.displayName = "ColorModeProvider";
function DarkMode(props) {
  const context = (0, import_react2.useMemo)(
    () => ({
      colorMode: "dark",
      toggleColorMode: noop,
      setColorMode: noop,
      forced: true
    }),
    []
  );
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ColorModeContext.Provider, { value: context, ...props });
}
DarkMode.displayName = "DarkMode";
function LightMode(props) {
  const context = (0, import_react2.useMemo)(
    () => ({
      colorMode: "light",
      toggleColorMode: noop,
      setColorMode: noop,
      forced: true
    }),
    []
  );
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ColorModeContext.Provider, { value: context, ...props });
}
LightMode.displayName = "LightMode";

// src/color-mode-script.tsx
var import_jsx_runtime2 = require("react/jsx-runtime");
var VALID_VALUES = /* @__PURE__ */ new Set(["dark", "light", "system"]);
function normalize(initialColorMode) {
  let value = initialColorMode;
  if (!VALID_VALUES.has(value))
    value = "light";
  return value;
}
function getScriptSrc(props = {}) {
  const {
    initialColorMode = "light",
    type = "localStorage",
    storageKey: key = "chakra-ui-color-mode"
  } = props;
  const init = normalize(initialColorMode);
  const isCookie = type === "cookie";
  const cookieScript = `(function(){try{var a=function(o){var l="(prefers-color-scheme: dark)",v=window.matchMedia(l).matches?"dark":"light",e=o==="system"?v:o,d=document.documentElement,m=document.body,i="chakra-ui-light",n="chakra-ui-dark",s=e==="dark";return m.classList.add(s?n:i),m.classList.remove(s?i:n),d.style.colorScheme=e,d.dataset.theme=e,e},u=a,h="${init}",r="${key}",t=document.cookie.match(new RegExp("(^| )".concat(r,"=([^;]+)"))),c=t?t[2]:null;c?a(c):document.cookie="".concat(r,"=").concat(a(h),"; max-age=31536000; path=/")}catch(a){}})();
  `;
  const localStorageScript = `(function(){try{var a=function(c){var v="(prefers-color-scheme: dark)",h=window.matchMedia(v).matches?"dark":"light",r=c==="system"?h:c,o=document.documentElement,s=document.body,l="chakra-ui-light",d="chakra-ui-dark",i=r==="dark";return s.classList.add(i?d:l),s.classList.remove(i?l:d),o.style.colorScheme=r,o.dataset.theme=r,r},n=a,m="${init}",e="${key}",t=localStorage.getItem(e);t?a(t):localStorage.setItem(e,a(m))}catch(a){}})();
  `;
  const fn = isCookie ? cookieScript : localStorageScript;
  return `!${fn}`.trim();
}
function ColorModeScript(props = {}) {
  const { nonce } = props;
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
    "script",
    {
      id: "chakra-script",
      nonce,
      dangerouslySetInnerHTML: { __html: getScriptSrc(props) }
    }
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ColorModeContext,
  ColorModeProvider,
  ColorModeScript,
  DarkMode,
  LightMode,
  cookieStorageManager,
  cookieStorageManagerSSR,
  createCookieStorageManager,
  createLocalStorageManager,
  getScriptSrc,
  localStorageManager,
  useColorMode,
  useColorModeValue
});
//# sourceMappingURL=index.js.map