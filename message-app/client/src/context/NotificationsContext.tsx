import {
  useState,
  FC,
  createContext,
  ReactNode,
  useEffect,
  useMemo,
} from "react";
import { Notification } from "../types";
import { markRead } from "../api/notifications";
import { getUserNotifications } from "../api/users";
import useCurrentUser from "../hooks/useCurrentUser";

export type NotificationContextType = {
  notifications: Notification[] | undefined;
  isLoading: boolean;
  hasUnreadNotifications: boolean;
  addNotification: (notification: Notification) => void;
  markNotificationRead: (_id: string) => void;
  setIsLoading: (loading: boolean) => void;
};

const initState: NotificationContextType = {
  notifications: undefined,
  isLoading: true,
  hasUnreadNotifications: false,
  addNotification: () => {},
  markNotificationRead: () => {},
  setIsLoading: () => {},
};

export const NotificationsContext =
  createContext<NotificationContextType>(initState);

const NotificationsProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { currentUser, token } = useCurrentUser();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const hasUnreadNotifications = useMemo(() => {
    return notifications.some((notification) => !notification.isRead);
  }, [notifications]);

  const addNotification = (notification: Notification) => {
    console.log("Adding notification", notification);
    setNotifications((prev) => [notification, ...prev]);
  };

  const markNotificationRead = async (id: string) => {
    if (!currentUser?.sub || !token) return;
    const notification = notifications.find(
      (notification) => notification._id === id
    );
    if (!notification) return;
    const isRead = !notification.isRead;
    await markRead(isRead, notification._id, token);
    setNotifications((notifications) =>
      notifications.filter((notification) => notification._id !== id)
    );
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const fetchNotifications = async () => {
    if (!currentUser?.sub || !token) return;
    const { data } = await getUserNotifications({
      sub: currentUser.sub,
      token,
    });

    setNotifications(data);
    setIsLoading(false);
  };

  useEffect(() => {
    if (!currentUser?.sub || !token) return;
    fetchNotifications();
  }, [currentUser, token]);

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        isLoading,
        addNotification,
        markNotificationRead,
        setIsLoading,
        hasUnreadNotifications,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

export default NotificationsProvider;
