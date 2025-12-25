import { combineReducers } from "redux";

import {
  notificationsReducer,
  notificationsActions,
  notificationsSelectors,
  notifacationState,
  
} from "./notification";

import { SidebarActions, sidebarReducer, sidebarSelectors, sidebarState } from "./sidebar";
import { todoActions, todoReducer, todoSelectors, todoState } from "./todo";

export const rootReducer = combineReducers({
  notifications: notificationsReducer, // <--- key should match 'selectionNode' value
  sidebar: sidebarReducer,
  todo: todoReducer 
});

export const actions = {
  ...notificationsActions,
  ...SidebarActions,
  ...todoActions
};

export const selectors = {
  ...notificationsSelectors,
  ...sidebarSelectors,
  ...todoSelectors
};


export const initialState = {
  notifications: notifacationState, // <--- key should match 'selectionNode' value
  sidebar: sidebarState,
  todo: todoState
};