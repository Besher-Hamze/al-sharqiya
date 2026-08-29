"use client";

import { useState } from "react";

/**
 * Keeps a mutable local draft in sync with a query result without useEffect.
 * `key` should be a stable identity (document id, or Boolean(data) on first load).
 */
export function useSyncedDraft<T>(key: unknown, factory: () => T | null) {
  const [draft, setDraft] = useState<T | null>(null);
  const [seen, setSeen] = useState<unknown>(undefined);

  if (key !== seen) {
    setSeen(key);
    setDraft(factory());
  }

  return [draft, setDraft] as const;
}
