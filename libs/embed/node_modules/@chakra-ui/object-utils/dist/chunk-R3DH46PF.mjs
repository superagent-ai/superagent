// src/compact.ts
function compact(object) {
  const clone = Object.assign({}, object);
  for (let key in clone) {
    if (clone[key] === void 0)
      delete clone[key];
  }
  return clone;
}

export {
  compact
};
