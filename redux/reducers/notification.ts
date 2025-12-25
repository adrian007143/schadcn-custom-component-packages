import { createReduxMethods, ComposePayload } from 'react-redux-methods';

export type INotification = {
  isOpen: boolean;
  message: string;
}

export const notifacationState: INotification = {
  isOpen: false,
  message: 'Hello',
};

const [notificationsReducer, notificationsActions, notificationsSelectors] = createReduxMethods({
  initialState: notifacationState,
  reducers: {
    setNotificationShow: (state, action) => ({
      ...state,
      isOpen: true,
      message: action.payload,
    }),
    setNotificationHide: () => notifacationState,
   
    updateNotification: (s, a: ComposePayload<string>) => ({
      ...s,
      message: a.payload,
    }),
  },
  selectionNode: 'notifications', 
  selectors: {
    getNotificationStatus: (s) => s.isOpen,
    getNotificationMessage: (s) => s.message || "", 
  },
});

// export all
export { notificationsReducer, notificationsActions, notificationsSelectors };