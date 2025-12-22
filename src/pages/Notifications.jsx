import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  CheckCircle,
  Info,
  AlertTriangle
} from "lucide-react";
import {
  fetchNotifications,
  markNotificationRead
} from "../api/notifications";

/* ---------- ICON MAP ---------- */
const typeIcon = (type) => {
  switch (type) {
    case "SUCCESS":
      return <CheckCircle className="text-green-600" size={20} />;
    case "WARNING":
      return <AlertTriangle className="text-yellow-600" size={20} />;
    default:
      return <Info className="text-blue-600" size={20} />;
  }
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ---------- FETCH ---------- */
  const loadNotifications = async () => {
    try {
      setLoading(true);
      const res = await fetchNotifications();
      setNotifications(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* ---------- MARK READ ---------- */
  const handleRead = async (id) => {
    await markNotificationRead(id);
    loadNotifications();
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const unread = notifications.filter(n => !n.is_read);
  const read = notifications.filter(n => n.is_read);

  return (
    <div className="min-h-screen px-6 py-10 bg-gradient-to-br from-green-50 to-white">

      {/* ================= HEADER ================= */}
      <div className="mb-10">
        <div className="flex items-center gap-3">
          <Bell className="text-green-600" size={28} />
          <h2 className="text-3xl font-bold tracking-tight">
            Notifications
          </h2>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          System alerts, payment updates & account activity
        </p>
      </div>

      {/* ================= LOADING ================= */}
      {loading && (
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-20 rounded-2xl bg-white/60 backdrop-blur border"
            />
          ))}
        </div>
      )}

      {/* ================= EMPTY ================= */}
      {!loading && notifications.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <Bell size={40} className="mx-auto mb-4 opacity-40" />
          <p>No notifications yet</p>
        </div>
      )}

      {/* ================= UNREAD ================= */}
      {unread.length > 0 && (
        <section className="mb-10">
          <h3 className="text-sm font-semibold text-gray-600 mb-4 uppercase tracking-wide">
            Unread
          </h3>

          <AnimatePresence>
            {unread.map((n) => (
              <NotificationCard
                key={n.id}
                notification={n}
                onRead={handleRead}
                unread
              />
            ))}
          </AnimatePresence>
        </section>
      )}

      {/* ================= READ ================= */}
      {read.length > 0 && (
        <section>
          <h3 className="text-sm font-semibold text-gray-600 mb-4 uppercase tracking-wide">
            Earlier
          </h3>

          <AnimatePresence>
            {read.map((n) => (
              <NotificationCard
                key={n.id}
                notification={n}
                onRead={handleRead}
              />
            ))}
          </AnimatePresence>
        </section>
      )}
    </div>
  );
}

/* ================= CARD ================= */

function NotificationCard({ notification, onRead, unread }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25 }}
      className={`
        relative mb-4 rounded-2xl border
        backdrop-blur-xl shadow-lg
        transition-all
        ${unread
          ? "bg-white/90 border-green-400"
          : "bg-white/60 border-gray-200"}
      `}
    >
      {/* LEFT ACCENT */}
      {unread && (
        <span className="absolute left-0 top-0 h-full w-1 bg-green-500 rounded-l-2xl" />
      )}

      <div className="flex gap-4 p-5">
        {/* ICON */}
        <div className="mt-1">
          {typeIcon(notification.type)}
        </div>

        {/* CONTENT */}
        <div className="flex-1">
          <h4 className="font-semibold text-gray-800">
            {notification.title}
          </h4>
          <p className="text-sm text-gray-600 mt-1">
            {notification.message}
          </p>
          <p className="text-xs text-gray-400 mt-2">
            {new Date(notification.created_at).toLocaleString()}
          </p>
        </div>

        {/* ACTION */}
        {!notification.is_read && (
          <button
            onClick={() => onRead(notification.id)}
            className="text-green-600 text-sm font-medium hover:underline"
          >
            Mark read
          </button>
        )}
      </div>
    </motion.div>
  );
}
