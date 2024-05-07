import { useContext } from "react";
import { NotificationsContext } from "../context/NotificationsContext";

const useNotifications = () => {
  const {
    notifications,
    isLoading,
    markNotificationRead,
    hasUnreadNotifications,
    addNotification,
  } = useContext(NotificationsContext);

  return {
    notifications,
    markNotificationRead,
    isLoading,
    addNotification,
    hasUnreadNotifications,
  };
};

export default useNotifications;
