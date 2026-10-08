import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from "../../api/notificationApi";

function Notifications() {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [processingId, setProcessingId] = useState(null);
  const [markingAll, setMarkingAll] = useState(false);

  // Load notifications
  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getNotifications();

      console.log("Notifications received:", data);

      setNotifications(data);
    } catch (err) {
      console.error(
        "Error loading notifications:",
        err
      );

      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Unable to load notifications.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  // Mark one notification as read
  const handleMarkAsRead = async (notificationId) => {
    try {
      setProcessingId(notificationId);
      setError("");

      await markNotificationAsRead(notificationId);

      setNotifications((previousNotifications) =>
        previousNotifications.map((notification) =>
          notification.id === notificationId
            ? {
                ...notification,
                read: true,
              }
            : notification
        )
      );
    } catch (err) {
      console.error(
        "Error marking notification as read:",
        err
      );

      setError(
        "Unable to mark notification as read."
      );
    } finally {
      setProcessingId(null);
    }
  };

  // Mark all as read
  const handleMarkAllAsRead = async () => {
    try {
      setMarkingAll(true);
      setError("");

      await markAllNotificationsAsRead();

      setNotifications((previousNotifications) =>
        previousNotifications.map(
          (notification) => ({
            ...notification,
            read: true,
          })
        )
      );
    } catch (err) {
      console.error(
        "Error marking all notifications:",
        err
      );

      setError(
        "Unable to mark all notifications as read."
      );
    } finally {
      setMarkingAll(false);
    }
  };

  // Delete notification
  const handleDelete = async (notificationId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this notification?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setProcessingId(notificationId);
      setError("");

      await deleteNotification(notificationId);

      setNotifications((previousNotifications) =>
        previousNotifications.filter(
          (notification) =>
            notification.id !== notificationId
        )
      );
    } catch (err) {
      console.error(
        "Error deleting notification:",
        err
      );

      setError(
        "Unable to delete notification."
      );
    } finally {
      setProcessingId(null);
    }
  };

  // ---- Visual helpers ----
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
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
      return dateString;
    }
  };

  // Icon/color based on message content
  const getNotificationStyle = (message) => {
    const msg = (message || "").toLowerCase();
    if (msg.includes("interview")) {
      return {
        icon: "🎯",
        gradient: "from-purple-500 to-pink-500",
        bg: "bg-purple-50",
        text: "text-purple-700",
      };
    }
    if (msg.includes("shortlist") || msg.includes("selected")) {
      return {
        icon: "✅",
        gradient: "from-emerald-500 to-teal-500",
        bg: "bg-emerald-50",
        text: "text-emerald-700",
      };
    }
    if (msg.includes("reject") || msg.includes("not selected")) {
      return {
        icon: "❌",
        gradient: "from-red-500 to-rose-500",
        bg: "bg-red-50",
        text: "text-red-700",
      };
    }
    if (msg.includes("apply") || msg.includes("application")) {
      return {
        icon: "📝",
        gradient: "from-blue-500 to-indigo-500",
        bg: "bg-blue-50",
        text: "text-blue-700",
      };
    }
    if (msg.includes("job") || msg.includes("opening")) {
      return {
        icon: "💼",
        gradient: "from-amber-500 to-orange-500",
        bg: "bg-amber-50",
        text: "text-amber-700",
      };
    }
    return {
      icon: "🔔",
      gradient: "from-indigo-500 to-purple-500",
      bg: "bg-indigo-50",
      text: "text-indigo-700",
    };
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  // ---------- Loading State ----------
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* Back to Dashboard */}
          <button
            onClick={() => navigate("/student/dashboard")}
            className="inline-flex items-center gap-2 px-4 py-2 mb-5 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </button>

          <div className="flex flex-col items-center gap-3 py-20">
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="text-sm font-medium text-slate-600">
              Loading notifications...
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Back to Dashboard */}
        <button
          onClick={() => navigate("/student/dashboard")}
          className="inline-flex items-center gap-2 px-4 py-2 mb-5 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Dashboard
        </button>

        {/* Hero Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-6 sm:p-8 mb-6 shadow-xl shadow-indigo-300/30">
          <div className="absolute top-[-40%] right-[-5%] w-64 h-64 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-[-50%] left-[15%] w-72 h-72 bg-white/10 rounded-full blur-2xl"></div>

          <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
            <div>
              <p className="text-blue-100 text-sm font-medium mb-1 flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                {unreadCount > 0
                  ? `${unreadCount} unread ${unreadCount === 1 ? "notification" : "notifications"}`
                  : "You're all caught up!"}
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Notifications
              </h1>
              <p className="text-blue-100 mt-2 text-sm sm:text-base max-w-xl">
                Stay updated on your applications, interviews, and new opportunities.
              </p>
            </div>

            {/* Mark All as Read */}
            {notifications.length > 0 && unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                disabled={markingAll}
                className="self-start sm:self-auto flex items-center gap-2 px-5 py-3 bg-white text-indigo-700 font-semibold rounded-xl shadow-lg hover:shadow-xl hover:bg-indigo-50 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none whitespace-nowrap"
              >
                {markingAll ? (
                  <>
                    <svg className="animate-spin w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Marking...</span>
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Mark All as Read</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-5 flex items-start gap-3 p-3.5 bg-red-50 border border-red-200 rounded-xl animate-shake">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-sm text-red-700 font-medium">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {notifications.length === 0 && !error && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-10 sm:p-16 text-center">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 flex items-center justify-center mb-5">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              No notifications
            </h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
              You don't have any notifications yet. We'll notify you as soon as there's an update on your applications.
            </p>
            <button
              onClick={() => navigate("/student/jobs")}
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg shadow-indigo-300/50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Explore Jobs
            </button>
          </div>
        )}

        {/* Notifications List */}
        {notifications.length > 0 && (
          <>
            {/* Results Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900">
                All Notifications
              </h2>
              <span className="text-sm text-slate-500 font-medium">
                {notifications.length}{" "}
                {notifications.length === 1 ? "notification" : "notifications"}
              </span>
            </div>

            <div className="space-y-3">
              {notifications.map((notification) => {
                const style = getNotificationStyle(notification.message);
                const isProcessing = processingId === notification.id;
                const isUnread = !notification.read;

                return (
                  <div
                    key={notification.id}
                    className={`group relative overflow-hidden rounded-2xl border shadow-sm transition-all duration-300 hover:shadow-lg ${
                      isUnread
                        ? "bg-gradient-to-br from-blue-50 to-indigo-50 border-indigo-200/60"
                        : "bg-white border-slate-100"
                    }`}
                  >
                    {/* Unread indicator bar */}
                    {isUnread && (
                      <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${style.gradient}`}></div>
                    )}

                    <div className="p-4 sm:p-5">

                      <div className="flex items-start gap-4">

                        {/* Icon */}
                        <div
                          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${style.gradient} flex items-center justify-center text-xl shadow-md flex-shrink-0 group-hover:scale-105 transition-transform duration-300`}
                        >
                          {style.icon}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">

                          {/* Top row: label + unread dot */}
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full ${style.bg} ${style.text}`}>
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
                          <p className={`text-sm leading-relaxed ${isUnread ? "text-slate-900 font-medium" : "text-slate-600"}`}>
                            {notification.message}
                          </p>

                          {/* Meta info */}
                          <div className="mt-2 flex items-center gap-3 text-[11px] text-slate-400">
                            <span className="flex items-center gap-1">
                              <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                              </svg>
                              ID: #{notification.id}
                            </span>
                            <span className="flex items-center gap-1">
                              <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                {notification.read ? (
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                ) : (
                                  <circle cx="12" cy="12" r="9" />
                                )}
                              </svg>
                              {notification.read ? "Read" : "Unread"}
                            </span>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2 mt-4 flex-wrap">

                            {/* Mark as read */}
                            {isUnread && (
                              <button
                                onClick={() => handleMarkAsRead(notification.id)}
                                disabled={isProcessing}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-lg hover:bg-indigo-100 hover:border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-1 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                              >
                                {isProcessing ? (
                                  <>
                                    <svg className="animate-spin w-3 h-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>Processing...</span>
                                  </>
                                ) : (
                                  <>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Mark as Read</span>
                                  </>
                                )}
                              </button>
                            )}

                            {/* Delete */}
                            <button
                              onClick={() => handleDelete(notification.id)}
                              disabled={isProcessing}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 border border-red-100 rounded-lg hover:bg-red-100 hover:border-red-200 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

      </main>
    </div>
  );
}

export default Notifications;