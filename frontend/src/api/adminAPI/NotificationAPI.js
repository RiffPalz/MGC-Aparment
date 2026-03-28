import api from "../config";

/** Fetch all notifications for the admin role */
export const fetchAdminNotifications = async () => {
  const res = await api.get("/notifications/role");
  return res.data; // { success, count, notifications[] }
};

/** Mark a single notification as read */
export const markNotificationRead = async (id) => {
  const res = await api.patch(`/notifications/${id}/read`);
  return res.data;
};

/** Mark all admin notifications as read */
export const markAllNotificationsRead = async () => {
  const res = await api.patch("/notifications/read-all");
  return res.data;
};
