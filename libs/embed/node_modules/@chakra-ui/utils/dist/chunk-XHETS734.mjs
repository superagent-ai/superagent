// src/lazy.ts
function determineLazyBehavior(options) {
  const {
    hasBeenSelected,
    isLazy,
    isSelected,
    lazyBehavior = "unmount"
  } = options;
  if (!isLazy)
    return true;
  if (isSelected)
    return true;
  if (lazyBehavior === "keepMounted" && hasBeenSelected)
    return true;
  return false;
}

export {
  determineLazyBehavior
};
