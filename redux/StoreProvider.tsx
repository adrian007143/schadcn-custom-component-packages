"use client";

import React, { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { persistKeys, store } from "@/redux/store";
import { loadFromLocalStorage } from "@/lib/helper/storageLocal";
import type { RootState } from "@/redux/store";

// ✅ generic helper to assign values type-safely by key
function assignPersistedValue<K extends keyof RootState>(
  target: Partial<RootState>,
  key: K,
  value: RootState[K]
) {
  target[key] = value;
}

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const persisted: Partial<RootState> = {};

    persistKeys.forEach((key) => {
      const value = loadFromLocalStorage<RootState[typeof key]>(key);
      if (value !== undefined) {
        // ✅ type-safe assignment with helper
        assignPersistedValue(persisted, key, value);
      }
    });

    // Dispatch a rehydration event to Redux store
    store.dispatch({
      type: "__REHYDRATE__",
      payload: persisted,
    });

    // Prevent hydration mismatch (Next.js SSR safety)
    requestAnimationFrame(() => setReady(true));
  }, []);

  if (!ready) {
    return <div suppressHydrationWarning />;
  }

  return <Provider store={store}>{children}</Provider>;
}
