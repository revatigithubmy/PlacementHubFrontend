import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from "../../api/notificationApi";

function AdminNotifications() {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [processingId, setProcessingId] = useState(null);
  const [markingAll, setMarkingAll] = useState(false);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getNotifications();

      setNotifications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to load notifications."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      setProcessingId(notificationId);

      await markNotificationAsRead(notificationId);

      setNotifications((previous) =>
        previous.map((notification) =>
          notification.notificationId === notificationId
            ? {
                ...notification,
                isRead: true,
              }
            : notification
        )
      );

      setMessage("Notification marked as read.");

      setTimeout(() => {
        setMessage("");
      }, 2000);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to mark notification as read."
      );
    } finally {
      setProcessingId(null);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      setMarkingAll(true);

      await markAllNotificationsAsRead();

      setNotifications((previous) =>
        previous.map((notification) => ({
          ...notification,
          isRead: true,
        }))
      );

      setMessage("All notifications marked as read.");

      setTimeout(() => {
        setMessage("");
      }, 2000);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to mark notifications."
      );
    } finally {
      setMarkingAll(false);
    }
  };

  const handleDelete = async (notificationId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this notification?"
    );

    if (!confirmed) return;

    try {
      setProcessingId(notificationId);

      await deleteNotification(notificationId);

      setNotifications((previous) =>
        previous.filter(
          (notification) =>
            notification.notificationId !== notificationId
        )
      );

      setMessage("Notification deleted successfully.");

      setTimeout(() => {
        setMessage("");
      }, 2000);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to delete notification."
      );
    } finally {
      setProcessingId(null);
    }
  };

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  // ==================== VISUAL HELPERS (UI ONLY) ====================

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;

      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "—";
    }
  };

  const getNotificationStyle = (msg) => {
    const m = (msg || "").toLowerCase();
    if (m.includes("interview")) {
      return {
        icon: "🎯",
        gradient: "from-purple-500 to-pink-500",
        bg: "bg-purple-50",
        text: "text-purple-700",
        border: "border-purple-200",
      };
    }
    if (m.includes("shortlist") || m.includes("selected")) {
      return {
        icon: "✅",
        gradient: "from-emerald-500 to-teal-500",
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        border: "border-emerald-200",
      };
    }
    if (m.includes("reject") || m.includes("not selected")) {
      return {
        icon: "❌",
        gradient: "from-red-500 to-rose-500",
        bg: "bg-red-50",
        text: "text-red-700",
        border: "border-red-200",
      };
    }
    if (
      m.includes("apply") ||
      m.includes("application") ||
      m.includes("applied")
    ) {
      return {
        icon: "📨",
        gradient: "from-blue-500 to-indigo-500",
        bg: "bg-blue-50",
        text: "text-blue-700",
        border: "border-blue-200",
      };
    }
    if (
      m.includes("job") ||
      m.includes("post") ||
      m.includes("opening")
    ) {
      return {
        icon: "💼",
        gradient: "from-amber-500 to-orange-500",
        bg: "bg-amber-50",
        text: "text-amber-700",
        border: "border-amber-200",
      };
    }
    if (m.includes("user") || m.includes("register")) {
      return {
        icon: "👤",
        gradient: "from-cyan-500 to-blue-500",
        bg: "bg-cyan-50",
        text: "text-cyan-700",
        border: "border-cyan-200",
      };
    }
    return {
      icon: "🔔",
      gradient: "from-indigo-500 to-purple-500",
      bg: "bg-indigo-50",
      text: "text-indigo-700",
      border: "border-indigo-200",
    };
  };

  // ==================== LOADING STATE ====================
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-5xl mx-auto">

          {/* Back button skeleton */}
          <div className="h-10 w-40 bg-slate-200 rounded-xl mb-5 shimmer"></div>

          {/* Hero skeleton */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8 mb-6 shimmer">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-slate-200"></div>
              <div className="flex-1 space-y-3">
                <div className="h-6 bg-slate-200 rounded w-1/3"></div>
                <div className="h-4 bg-slate-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>

          {/* List skeleton */}
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-24 bg-slate-100 rounded-2xl shimmer"
              ></div>
            ))}
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">

        {/* ==================== BACK BUTTON ==================== */}
        <button
          onClick={() => navigate("/admin/dashboard")}
          className="group inline-flex items-center gap-2 px-4 py-2 mb-5 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 hover:text-indigo-600 transition-all duration-200 shadow-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Dashboard
        </button>

        {/* ==================== HERO HEADER ==================== */}
        <div className="relative overflow-hidden bg-gradient-to-r from-rose-500 via-red-500 to-orange-500 rounded-2xl p-6 sm:p-8 mb-6 shadow-xl shadow-red-200/40">
          <div className="absolute top-[-50%] right-[-5%] w-64 h-64 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-[-50%] left-[20%] w-72 h-72 bg-white/10 rounded-full blur-2xl"></div>

          <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
            <div>
              <div className="flex items-center gap-2 text-red-100 text-sm font-medium mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                Admin Notifications
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Notifications
              </h1>
              <p className="text-red-100 mt-2 text-sm sm:text-base">
                Stay updated on applications, jobs, users, and platform activity.
              </p>
            </div>

            <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-xl px-5 py-4 text-white self-start sm:self-auto">
              <p className="text-xs text-red-100 font-medium">
                Unread Notifications
              </p>
              <p className="text-3xl font-bold tracking-tight mt-0.5">
                {unreadCount}
              </p>
            </div>
          </div>
        </div>

        {/* ==================== SUCCESS MESSAGE ==================== */}
        {message && (
          <div className="mb-5 flex items-start gap-3 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl animate-fadeIn">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-sm text-emerald-700 font-medium">{message}</p>
          </div>
        )}

        {/* ==================== ERROR MESSAGE ==================== */}
        {error && (
          <div className="mb-5 flex items-start gap-3 p-3.5 bg-red-50 border border-red-200 rounded-xl animate-shake">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <p className="text-sm text-red-700 font-medium">{error}</p>
          </div>
        )}

        {/* ==================== ACTION BAR ==================== */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="font-bold text-slate-900">
              All Notifications
            </h2>
            <p className="text-sm text-slate-500">
              {notifications.length} notification
              {notifications.length !== 1 ? "s" : ""}
              {unreadCount > 0 && (
                <>
                  {" • "}
                  <span className="font-semibold text-indigo-600">
                    {unreadCount} unread
                  </span>
                </>
              )}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                disabled={markingAll}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-md shadow-indigo-300/50 hover:shadow-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
              >
                {markingAll ? (
                  <>
                    <svg
                      className="animate-spin w-4 h-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Marking...
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Mark All as Read
                  </>
                )}
              </button>
            )}

            <button
              onClick={loadNotifications}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-100 border border-slate-200 rounded-lg hover:bg-slate-200 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-1 transition-all duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Refresh
            </button>
          </div>
        </div>

        {/* ==================== NOTIFICATIONS LIST ==================== */}
        {notifications.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-10 sm:p-16 text-center">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-rose-100 via-red-100 to-orange-100 flex items-center justify-center mb-5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-10 h-10 text-rose-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              No notifications found
            </h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              You don't have any notifications yet. We'll notify you about platform activity here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => {
              const style = getNotificationStyle(notification.message);
              const isUnread = !notification.isRead;
              const isProcessing =
                processingId === notification.notificationId;

              return (
                <div
                  key={notification.notificationId}
                  className={`group relative overflow-hidden bg-white rounded-2xl border shadow-sm hover:shadow-lg transition-all duration-300 ${
                    isUnread
                      ? "border-indigo-200 bg-gradient-to-br from-indigo-50/60 to-blue-50/40"
                      : "border-slate-100"
                  }`}
                >
                  {/* Unread accent bar */}
                  {isUnread && (
                    <div
                      className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${style.gradient}`}
                    ></div>
                  )}

                  <div className="p-5">
                    <div className="flex flex-col sm:flex-row gap-4">

                      {/* Icon */}
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-xl shadow-md ${
                          isUnread
                            ? `bg-gradient-to-br ${style.gradient} text-white group-hover:scale-105 transition-transform duration-300`
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {style.icon}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">

                        {/* Badge + Time Row */}
                        <div className="flex items-center gap-2 flex-wrap mb-2">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full ${style.bg} ${style.text} ${style.border} border`}
                          >
                            {isUnread && (
                              <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
                            )}
                            {isUnread ? "New" : "Notification"}
                          </span>

                          <span className="text-[11px] text-slate-400 font-medium">
                            {formatDate(notification.createdAt)}
                          </span>
                        </div>

                        {/* Message */}
                        <p
                          className={`text-sm leading-relaxed ${
                            isUnread
                              ? "text-slate-900 font-semibold"
                              : "text-slate-600"
                          }`}
                        >
                          {notification.message}
                        </p>

                        {/* Actions */}
                        <div className="flex flex-wrap gap-2 mt-4">

                          {isUnread && (
                            <button
                              onClick={() =>
                                handleMarkAsRead(
                                  notification.notificationId
                                )
                              }
                              disabled={isProcessing}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-lg hover:bg-indigo-100 hover:border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-1 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                              {isProcessing ? (
                                <>
                                  <svg
                                    className="animate-spin w-3.5 h-3.5"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                  >
                                    <circle
                                      className="opacity-25"
                                      cx="12"
                                      cy="12"
                                      r="10"
                                      stroke="currentColor"
                                      strokeWidth="4"
                                    ></circle>
                                    <path
                                      className="opacity-75"
                                      fill="currentColor"
                                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                  </svg>
                                  Processing...
                                </>
                              ) : (
                                <>
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-3.5 h-3.5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M5 13l4 4L19 7"
                                    />
                                  </svg>
                                  Mark as Read
                                </>
                              )}
                            </button>
                          )}

                          <button
                            onClick={() =>
                              handleDelete(
                                notification.notificationId
                              )
                            }
                            disabled={isProcessing}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 border border-red-100 rounded-lg hover:bg-red-100 hover:border-red-200 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-3.5 h-3.5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}

export default AdminNotifications;