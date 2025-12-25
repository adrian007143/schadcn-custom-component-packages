// src/redux/store.ts
import { legacy_createStore as createStore, compose, Store } from "redux";
import { rootReducer, initialState } from "./reducers";
import { loadFromLocalStorage, saveToLocalStorage } from "@/lib/helper/storageLocal";

export type RootState = typeof initialState;
type StateKey = keyof RootState;

export const persistKeys: StateKey[] = ["notifications", "sidebar", "todo"];

const isBrowser = typeof window !== "undefined";

/**
 * Helper to safely assign state values
 */
export function assignStateValue<K extends keyof RootState>(
  state: RootState,
  key: K,
  value: RootState[K]
) {
  state[key] = value;
}

/**
 * Load persisted slices (client only)
 */
const loadInitialState = (): RootState => {
  if (!isBrowser) return initialState;

  const loaded: RootState = { ...initialState };

  persistKeys.forEach((key) => {
    const saved = loadFromLocalStorage<RootState[typeof key]>(key);
    if (saved !== undefined) {
      assignStateValue(loaded, key, saved as RootState[typeof key]);
    }
  });

  return loaded;
};

/**
 * Persist updated slices
 */
const savePersistedState = (store: Store<RootState>) => {
  const state = store.getState();
  persistKeys.forEach((key) => saveToLocalStorage(state[key], key));
};

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

const composeEnhancers =
  (isBrowser && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

let _store: Store<RootState> | undefined;

function getStoreSingleton(): Store<RootState> {
  if (_store) return _store;

  const preloadedState = loadInitialState();
  const store = createStore(rootReducer, preloadedState, composeEnhancers());
  if (isBrowser) store.subscribe(() => savePersistedState(store));

  _store = store;
  return store;
}

export const store = getStoreSingleton();
