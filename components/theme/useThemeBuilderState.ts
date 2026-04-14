"use client";

import { useSyncExternalStore } from "react";

import { store } from "@/redux/store";

export function useThemeBuilderState() {
  return useSyncExternalStore(
    store.subscribe,
    () => store.getState().theme,
    () => store.getState().theme
  );
}
