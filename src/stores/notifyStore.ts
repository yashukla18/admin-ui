/* eslint-disable @typescript-eslint/no-unused-vars */
import { devtools } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';
import { uuidv7 } from 'uuidv7';

import { CoreSnackbarProps } from '@youscience/core';

export interface NotifyStoreState {
  notifications: NotifyOptions[];
  notificationInfo?: NotifyOptions | undefined;
}

export interface NotifyOptions extends CoreSnackbarProps {
  key?: string;
}

export interface NotifyStore extends NotifyStoreState {
  notify: (notification: CoreSnackbarProps) => void;
  setNotificationInfo: (notification?: NotifyOptions) => void;
  setNotifications: (notifications: NotifyOptions[]) => void;
  clearNotifications: () => void;
}

const initialState = {
  notifications: [],
  notificationInfo: undefined,
  notify: (notification: CoreSnackbarProps) => {},
  setNotificationInfo: (notification: NotifyOptions) => {},
  setNotifications: (notifications: NotifyOptions[]) => {},
  clearNotifications: () => {},
} as NotifyStore;

export const useNotifyStore = createWithEqualityFn<NotifyStore>()(
  devtools((set) => ({
    ...initialState,
    notify: (notification: NotifyOptions) => {
      const key = uuidv7();

      return set((state) => ({
        ...state,
        notificationInfo: {
          ...notification,
          key,
          open: true,
        },
        notifications: [...state.notifications, { ...notification, key, open: true }],
      }));
    },

    setNotificationInfo: (notificationInfo?: NotifyOptions) => {
      return set((state) => ({
        ...state,
        notificationInfo: notificationInfo ?? undefined,
      }));
    },

    setNotifications: (notifications: NotifyOptions[]) => {
      return set((state) => ({
        ...state,
        notifications: [...notifications],
      }));
    },

    clearNotifications: () => {
      return set((state) => ({
        ...state,
        notifications: [],
      }));
    },
  })),
  shallow,
);

export const notify: (notifyOptions: NotifyOptions) => void = (notifyOptions: NotifyOptions) => {
  const closure = useNotifyStore.getState().notify(notifyOptions);

  return closure;
};
