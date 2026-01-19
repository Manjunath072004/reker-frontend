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

export const archiveNotificationsBulk = (ids) =>
  axios.post("/notifications/archive/", { ids });


export const fetchArchivedNotifications = () =>
  axios.get("/notifications/archived/");

export const restoreNotificationsBulk = (ids) =>
  axios.post("/notifications/restore/", { ids });
