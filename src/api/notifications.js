import axios from "./axios";

export const fetchNotifications = () =>
  axios.get("/notifications/list/");

export const markNotificationRead = (id) =>
  axios.post(`/notifications/read/${id}/`);

export const fetchUnreadCount = () =>
  axios.get("/notifications/unread-count/");
