import { useEffect, useState } from "react";
import axios from "axios";
import { CONFIG } from "@/constants";
import { toast } from "sonner";
import { createSocketConnection } from "@/lib/socket";

import useAuthentication from "./useAuthentication";

const useNotifications = () => {
  const { user } = useAuthentication();
  const [notifications, setNotifications] = useState([]);
  const unReadNotificationsCount = notifications.filter(
    (noti) => !noti.read
  ).length;

  useEffect(() => {
    const socket = createSocketConnection();

    socket.emit("join_room", `user-${user.id}`);

    socket.on("new_notification", (data) => {
      setNotifications((prev) => [data, ...prev]);
    });

    fetchNotifications();

    return () => {
      socket.disconnect();
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(
        `${CONFIG.BACKEND_API_URL}/notifications`,
        { withCredentials: true }
      );
      const notifications = response.data.data;
      setNotifications(notifications);
    } catch (error) {
      console.error("Error occured while fetching notifications", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.post(
        `${CONFIG.BACKEND_API_URL}/notifications/mark-all-as-read`,
        {},
        { withCredentials: true }
      );
      const updatedNotis = notifications.map((noti) => {
        noti.read = true;
        return noti;
      });
      setNotifications(updatedNotis);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";
      toast.error(errorMessage);
    }
  };
  const markAsRead = async (notificationId) => {
    try {
      await axios.post(
        `${CONFIG.BACKEND_API_URL}/notifications/read/${notificationId}`,
        {},
        { withCredentials: true }
      );
      const updatedNotis = notifications.map((noti) => {
        if (noti.id === notificationId) {
          noti.read = true;
          return noti;
        }
        return noti;
      });
      setNotifications(updatedNotis);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";
      toast.error(errorMessage);
    }
  };

  const clearAllNotifications = async () => {
    try {
      await axios.delete(`${CONFIG.BACKEND_API_URL}/notifications/clear`, {
        withCredentials: true,
      });
      setNotifications([]);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";
      toast.error(errorMessage);
    }
  };

  // const NOTI_POLL_INTERVAL = 7000000;
  // useEffect(() => {
  //   const intervalId = setInterval(fetchNotifications, NOTI_POLL_INTERVAL);
  //   fetchNotifications();
  //   return () => {
  //     clearInterval(intervalId);
  //   };
  // }, []);

  return {
    notifications,
    markAllAsRead,
    unReadNotificationsCount,
    markAsRead,
    clearAllNotifications,
  };
};

export default useNotifications;
