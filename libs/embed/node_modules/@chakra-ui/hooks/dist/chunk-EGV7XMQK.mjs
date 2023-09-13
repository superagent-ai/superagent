// src/use-id.ts
import { useCallback, useId as useReactId, useMemo, useState } from "react";
function useId(idProp, prefix) {
  const id = useReactId();
  return useMemo(
    () => idProp || [prefix, id].filter(Boolean).join("-"),
    [idProp, prefix, id]
  );
}
function useIds(idProp, ...prefixes) {
  const id = useId(idProp);
  return useMemo(() => {
    return prefixes.map((prefix) => `${prefix}-${id}`);
  }, [id, prefixes]);
}
function useOptionalPart(partId) {
  const [id, setId] = useState(null);
  const ref = useCallback(
    (node) => {
      setId(node ? partId : null);
    },
    [partId]
  );
  return { ref, id, isRendered: Boolean(id) };
}

export {
  useId,
  useIds,
  useOptionalPart
};
