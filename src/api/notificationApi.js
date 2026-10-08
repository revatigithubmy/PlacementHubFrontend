import axiosInstance from "./axiosInstance";

// Get all notifications of logged-in user
export const getNotifications = async () => {
  const response = await axiosInstance.get("/api/notifications");
  return response.data;
};

// Get unread notifications
export const getUnreadNotifications = async () => {
  const response = await axiosInstance.get(
    "/api/notifications/unread"
  );
  return response.data;
};

// Get unread notification count
export const getUnreadNotificationCount = async () => {
  const response = await axiosInstance.get(
    "/api/notifications/unread/count"
  );
  return response.data;
};

// Mark one notification as read
export const markNotificationAsRead = async (notificationId) => {
  const response = await axiosInstance.put(
    `/api/notifications/${notificationId}/read`
  );
  return response.data;
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async () => {
  const response = await axiosInstance.put(
    "/api/notifications/read-all"
  );
  return response.data;
};

// Delete one notification
export const deleteNotification = async (notificationId) => {
  const response = await axiosInstance.delete(
    `/api/notifications/${notificationId}`
  );
  return response.data;
};