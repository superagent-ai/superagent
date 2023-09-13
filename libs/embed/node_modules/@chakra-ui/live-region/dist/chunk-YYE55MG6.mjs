'use client'
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};

// src/live-region.ts
function isDom() {
  return Boolean(globalThis == null ? void 0 : globalThis.document);
}
var isBrowser = isDom();
var LiveRegion = class {
  constructor(options) {
    __publicField(this, "region");
    __publicField(this, "options");
    __publicField(this, "parentNode");
    this.options = getOptions(options);
    this.region = getRegion(this.options);
    this.parentNode = this.options.parentNode;
    if (this.region) {
      this.parentNode.appendChild(this.region);
    }
  }
  speak(message) {
    this.clear();
    if (this.region) {
      this.region.innerText = message;
    }
  }
  destroy() {
    var _a;
    if (this.region) {
      (_a = this.region.parentNode) == null ? void 0 : _a.removeChild(this.region);
    }
  }
  clear() {
    if (this.region) {
      this.region.innerText = "";
    }
  }
};
function getOptions(options) {
  const defaultOptions = {
    "aria-live": "polite",
    "aria-atomic": "true",
    "aria-relevant": "all",
    role: "status",
    id: "chakra-a11y-live-region",
    parentNode: isBrowser ? document.body : void 0
  };
  if (options) {
    return Object.assign(defaultOptions, options);
  }
  return defaultOptions;
}
function getRegion(options) {
  let region = isBrowser ? document.getElementById(options.id) : null;
  if (region)
    return region;
  if (isBrowser) {
    region = document.createElement("div");
    setup(region, options);
  }
  return region;
}
function setup(region, options) {
  region.id = options.id || "chakra-live-region";
  region.className = "__chakra-live-region";
  region.setAttribute("aria-live", options["aria-live"]);
  region.setAttribute("role", options.role);
  region.setAttribute("aria-relevant", options["aria-relevant"]);
  region.setAttribute("aria-atomic", String(options["aria-atomic"]));
  Object.assign(region.style, {
    border: "0px",
    clip: "rect(0px, 0px, 0px, 0px)",
    height: "1px",
    width: "1px",
    margin: "-1px",
    padding: "0px",
    overflow: "hidden",
    whiteSpace: "nowrap",
    position: "absolute"
  });
}

export {
  LiveRegion
};
//# sourceMappingURL=chunk-YYE55MG6.mjs.map