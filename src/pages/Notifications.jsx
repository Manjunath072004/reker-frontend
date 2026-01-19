import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  CheckCircle,
  Info,
  AlertTriangle,
  Trash2,
  Archive
} from "lucide-react";
import {
  fetchNotifications,
  fetchArchivedNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotificationsBulk,
  archiveNotificationsBulk,
  restoreNotificationsBulk
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
  const [tab, setTab] = useState("inbox"); // inbox | archived
  const [notifications, setNotifications] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ---------- FETCH ---------- */
  const loadNotifications = async () => {
    setLoading(true);
    try {
      const res =
        tab === "archived"
          ? await fetchArchivedNotifications()
          : await fetchNotifications();

      setNotifications(res.data || []);
      setSelected([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, [tab]);

  /* ---------- READ ---------- */
  const handleRead = async (id) => {
    await markNotificationRead(id);
    loadNotifications();
  };

  const handleMarkAllRead = async () => {
    await markAllNotificationsRead();
    loadNotifications();
  };

  /* ---------- SELECTION ---------- */
  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selected.length === notifications.length) {
      setSelected([]);
    } else {
      setSelected(notifications.map((n) => n.id));
    }
  };

  /* ---------- BULK ACTIONS ---------- */
  const handleDeleteSelected = async () => {
    if (!selected.length) return;
    await deleteNotificationsBulk(selected);
    loadNotifications();
  };

  const handleArchiveSelected = async () => {
    if (!selected.length) return;
    await archiveNotificationsBulk(selected);
    loadNotifications();
  };

  const handleRestoreSelected = async () => {
    if (!selected.length) return;
    await restoreNotificationsBulk(selected);
    loadNotifications();
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div className="min-h-screen px-6 py-10 bg-gradient-to-br from-green-50 to-white">

      {/* ================= HEADER ================= */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <Bell className="text-green-600" size={28} />
            <h2 className="text-3xl font-bold">Notifications</h2>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            System alerts, payment updates & account activity
          </p>
        </div>

        {/* TABS */}
        <div className="flex gap-2">
          <button
            onClick={() => setTab("inbox")}
            className={`px-4 py-2 rounded-full text-sm ${
              tab === "inbox" ? "bg-green-600 text-white" : "border"
            }`}
          >
            Inbox
          </button>
          <button
            onClick={() => setTab("archived")}
            className={`px-4 py-2 rounded-full text-sm ${
              tab === "archived" ? "bg-gray-800 text-white" : "border"
            }`}
          >
            Archived
          </button>
        </div>
      </div>

      {/* ================= ACTION BAR ================= */}
      <div className="mb-6 flex flex-wrap gap-3">
        <button
          onClick={toggleSelectAll}
          className="px-4 py-2 rounded-full border text-sm"
        >
          {selected.length === notifications.length
            ? "Unselect all"
            : "Select all"}
        </button>

        {selected.length > 0 && (
          <>
            {tab === "inbox" && (
              <button
                onClick={handleArchiveSelected}
                className="px-4 py-2 rounded-full bg-yellow-500 text-white text-sm flex items-center gap-2"
              >
                <Archive size={16} />
                Archive ({selected.length})
              </button>
            )}

            {tab === "archived" && (
              <button
                onClick={handleRestoreSelected}
                className="px-4 py-2 rounded-full bg-blue-600 text-white text-sm flex items-center gap-2"
              >
                <RotateCcw size={16} />
                Restore ({selected.length})
              </button>
            )}

            <button
              onClick={handleDeleteSelected}
              className="px-4 py-2 rounded-full bg-red-600 text-white text-sm flex items-center gap-2"
            >
              <Trash2 size={16} />
              Delete ({selected.length})
            </button>
          </>
        )}

        {tab === "inbox" && unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="px-4 py-2 rounded-full bg-green-600 text-white text-sm"
          >
            Mark all read
          </button>
        )}
      </div>

      {/* ================= LOADING ================= */}
      {loading && (
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 rounded-2xl bg-white/60 border" />
          ))}
        </div>
      )}

      {/* ================= EMPTY ================= */}
      {!loading && notifications.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <Bell size={40} className="mx-auto mb-4 opacity-40" />
          <p>No notifications</p>
        </div>
      )}

      {/* ================= LIST ================= */}
      <AnimatePresence>
        {notifications.map((n) => (
          <NotificationCard
            key={n.id}
            notification={n}
            selected={selected.includes(n.id)}
            onSelect={toggleSelect}
            onRead={handleRead}
            showReadAction={tab === "inbox"}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

/* ================= CARD ================= */

function NotificationCard({
  notification,
  selected,
  onSelect,
  onRead,
  showReadAction
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`mb-4 rounded-2xl border shadow-lg
        ${
          notification.is_read
            ? "bg-white/60 border-gray-200"
            : "bg-white border-green-400"
        }
      `}
    >
      <div className="flex gap-4 p-5">
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onSelect(notification.id)}
          className="mt-1 accent-green-600"
        />

        <div className="mt-1">{typeIcon(notification.type)}</div>

        <div className="flex-1">
          <h4 className="font-semibold">{notification.title}</h4>
          <p className="text-sm text-gray-600">{notification.message}</p>
          <p className="text-xs text-gray-400 mt-1">
            {new Date(notification.created_at).toLocaleString()}
          </p>
        </div>

        {showReadAction && !notification.is_read && (
          <button
            onClick={() => onRead(notification.id)}
            className="text-green-600 text-sm hover:underline"
          >
            Mark read
          </button>
        )}
      </div>
    </motion.div>
  );
}