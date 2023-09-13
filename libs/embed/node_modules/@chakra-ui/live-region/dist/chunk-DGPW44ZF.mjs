'use client'
import {
  LiveRegion
} from "./chunk-YYE55MG6.mjs";

// src/use-live-region.ts
import { useEffect, useState } from "react";
function useLiveRegion(options) {
  const [liveRegion] = useState(() => new LiveRegion(options));
  useEffect(
    () => () => {
      liveRegion.destroy();
    },
    [liveRegion]
  );
  return liveRegion;
}
var use_live_region_default = useLiveRegion;

export {
  useLiveRegion,
  use_live_region_default
};
//# sourceMappingURL=chunk-DGPW44ZF.mjs.map