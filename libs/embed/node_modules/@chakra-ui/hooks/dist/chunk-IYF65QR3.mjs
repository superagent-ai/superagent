// src/use-safe-layout-effect.ts
import { isBrowser } from "@chakra-ui/utils";
import { useEffect, useLayoutEffect } from "react";
var useSafeLayoutEffect = isBrowser ? useLayoutEffect : useEffect;

export {
  useSafeLayoutEffect
};
