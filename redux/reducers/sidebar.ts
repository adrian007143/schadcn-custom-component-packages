import { createReduxMethods } from "react-redux-methods";



export type SidebarStateProps = {
  isOpen: boolean;
};

export const sidebarState: SidebarStateProps = {
  isOpen: true,
};

const [sidebarReducer, SidebarActions, sidebarSelectors] = createReduxMethods({
  initialState: sidebarState,
  reducers: {
    setSidebarHide: (state) => ({
      ...state,
      isOpen: false,
    }),
    setSidebarShow: () => sidebarState,
  },
  selectionNode: "sidebar",
  selectors: {
    getSidebarStatus: (s) => s.isOpen,
  },
});

// export all
export { sidebarReducer, SidebarActions, sidebarSelectors };
