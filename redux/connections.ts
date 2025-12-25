import {
  createConnector,
  createDispatch,
  createStateSelector,
  createStateSelectorHook,
} from "react-redux-methods";

import {actions, selectors} from "./reducers";
import { store } from "./store";



export const reduxConnector = createConnector( selectors, actions );
export const dispatch = createDispatch( store.dispatch, actions );
export const getState= createStateSelector( store, selectors );
export const useGetState= createStateSelectorHook( selectors );


