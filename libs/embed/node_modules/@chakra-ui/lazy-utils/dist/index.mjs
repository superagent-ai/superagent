// src/index.ts
function lazyDisclosure(options) {
  const { wasSelected, enabled, isSelected, mode = "unmount" } = options;
  if (!enabled)
    return true;
  if (isSelected)
    return true;
  if (mode === "keepMounted" && wasSelected)
    return true;
  return false;
}
export {
  lazyDisclosure
};
