import { combineReducers } from "redux";

import {
  notificationsReducer,
  notificationsActions,
  notificationsSelectors,
  notifacationState,

} from "./notification";

import { SidebarActions, sidebarReducer, sidebarSelectors, sidebarState } from "./sidebar";
import { todoActions, todoReducer, todoSelectors, todoState } from "./todo";
import { themeReducer, themeActions, themeSelectors, themeState } from "./theme";

export const rootReducer = combineReducers({
  notifications: notificationsReducer, // <--- key should match 'selectionNode' value
  sidebar: sidebarReducer,
  todo: todoReducer,
  theme: themeReducer,
});

export const actions = {
  ...notificationsActions,
  ...SidebarActions,
  ...todoActions,
  ...themeActions,
};

export const selectors = {
  ...notificationsSelectors,
  ...sidebarSelectors,
  ...todoSelectors,
  ...themeSelectors,
};


export const initialState = {
  notifications: notifacationState, // <--- key should match 'selectionNode' value
  sidebar: sidebarState,
  todo: todoState,
  theme: themeState,
};