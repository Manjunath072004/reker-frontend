import axios from "./axios";

export const fetchNotifications = () =>
  axios.get("/notifications/list/");

export const markNotificationRead = (id) =>
  axios.post(`/notifications/read/${id}/`);

export const fetchUnreadCount = () =>
  axios.get("/notifications/unread-count/");

export const markAllNotificationsRead = () =>
  axios.post("/notifications/read-all/");

export const deleteNotificationsBulk = (ids) =>
  axios.post("/notifications/delete-bulk/", { ids });
