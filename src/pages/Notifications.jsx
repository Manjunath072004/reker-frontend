import { useEffect, useState } from "react";
import {
  fetchNotifications,
  markNotificationRead,
} from "../api/notifications";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  const loadNotifications = async () => {
    const res = await fetchNotifications();
    setNotifications(res.data);
  };

  const handleRead = async (id) => {
    await markNotificationRead(id);
    loadNotifications();
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Notifications</h1>

      {notifications.length === 0 && (
        <p className="text-gray-500">No notifications</p>
      )}

      {notifications.map((n) => (
        <div
          key={n.id}
          className={`border p-3 mb-3 rounded ${
            n.is_read ? "bg-gray-100" : "bg-white"
          }`}
        >
          <h3 className="font-semibold">{n.title}</h3>
          <p className="text-sm text-gray-600">{n.message}</p>

          {!n.is_read && (
            <button
              onClick={() => handleRead(n.id)}
              className="text-blue-600 text-sm mt-2"
            >
              Mark as read
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
