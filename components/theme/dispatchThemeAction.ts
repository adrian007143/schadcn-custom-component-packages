"use client";

import { themeActions } from "@/redux/reducers/theme";
import { store } from "@/redux/store";

type ThemeActionMap = typeof themeActions;
type ThemeActionKey = keyof ThemeActionMap;

export function dispatchThemeAction<K extends ThemeActionKey>(
  key: K,
  ...args: Parameters<ThemeActionMap[K]>
) {
  const createAction = themeActions[key] as (
    ...params: Parameters<ThemeActionMap[K]>
  ) => unknown;

  store.dispatch(createAction(...args) as Parameters<typeof store.dispatch>[0]);
}
