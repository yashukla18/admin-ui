import { SyntheticEvent, useEffect } from 'react';
import { CoreSnackbar, CoreSnackbarProps } from '@youscience/core';
import { shallow } from 'zustand/shallow';
// stores
import { useNotifyStore } from '@stores/notifyStore';

export const Notification = () => {
  const notificationInfo = useNotifyStore((state) => state.notificationInfo, shallow);
  const notifications = useNotifyStore((state) => state.notifications, shallow);
  const setNotificationInfo = useNotifyStore((state) => state.setNotificationInfo);
  const setNotifications = useNotifyStore((state) => state.setNotifications);

  const defaultSnackbar: CoreSnackbarProps = {
    actionHandler: undefined,
    actionText: undefined,
    autoHideDuration: 3000,
    expanded: false,
    horizontal: 'right',
    message: '',
    severity: 'info',
    vertical: 'bottom',
  };

  useEffect(() => {
    if (notifications.length && !notificationInfo) {
      // Set a new snack when we don't have an active one
      setNotificationInfo({ ...notifications[0] });
      setNotifications([...notifications.slice(1)]);
    } else if (notifications.length && notificationInfo && notificationInfo.open) {
      // Close an active snack when a new one is added
      setNotificationInfo(undefined);
    }
  }, [notifications, notificationInfo, notificationInfo?.open]);

  const handleClose = (event: Event | SyntheticEvent<unknown, Event>, reason: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setNotificationInfo({ ...notificationInfo, open: false, message: '' });
  };

  const handleExited = () => {
    setNotificationInfo(undefined);
  };

  return notificationInfo ? (
    <CoreSnackbar
      {...defaultSnackbar}
      {...notificationInfo}
      onClose={handleClose}
      TransitionProps={{ onExited: handleExited }}
    />
  ) : null;
};
