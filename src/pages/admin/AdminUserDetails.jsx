import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getUserById } from "../../api/adminApi";

function AdminUserDetails() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadUser();
  }, [userId]);

  const loadUser = async () => {
    try {
      setLoading(true);

      const data = await getUserById(userId);

      setUser(data);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to load user."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==================== VISUAL HELPERS ====================

  const getInitials = (email) => {
    if (!email) return "?";
    return email.slice(0, 2).toUpperCase();
  };

  const getRoleConfig = (role) => {
    const key = (role || "").toUpperCase();
    const configs = {
      ADMIN: {
        label: "Administrator",
        description: "Full platform access",
        bg: "bg-red-50",
        text: "text-red-700",
        border: "border-red-200",
        gradient: "from-red-500 to-rose-500",
        shadow: "shadow-red-300/50",
        dot: "bg-red-500",
        ring: "ring-red-200",
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        ),
      },
      RECRUITER: {
        label: "Recruiter",
        description: "Hiring & job management",
        bg: "bg-purple-50",
        text: "text-purple-700",
        border: "border-purple-200",
        gradient: "from-purple-500 to-pink-500",
        shadow: "shadow-purple-300/50",
        dot: "bg-purple-500",
        ring: "ring-purple-200",
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        ),
      },
      STUDENT: {
        label: "Student",
        description: "Job seeker account",
        bg: "bg-blue-50",
        text: "text-blue-700",
        border: "border-blue-200",
        gradient: "from-blue-500 to-indigo-500",
        shadow: "shadow-blue-300/50",
        dot: "bg-blue-500",
        ring: "ring-blue-200",
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
          </svg>
        ),
      },
    };
    return configs[key] || {
      label: role || "Unknown",
      description: "User account",
      bg: "bg-slate-50",
      text: "text-slate-700",
      border: "border-slate-200",
      gradient: "from-slate-500 to-slate-600",
      shadow: "shadow-slate-300/50",
      dot: "bg-slate-500",
      ring: "ring-slate-200",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    };
  };

  // ==================== LOADING STATE ====================
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-3xl mx-auto">

          {/* Back skeleton */}
          <div className="h-10 w-40 bg-slate-200 rounded-xl mb-5 shimmer"></div>

          {/* Hero skeleton */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8 mb-6 shimmer">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5">
              <div className="w-20 h-20 rounded-2xl bg-slate-200"></div>
              <div className="flex-1 space-y-3 w-full">
                <div className="h-5 bg-slate-200 rounded w-1/2 mx-auto sm:mx-0"></div>
                <div className="h-4 bg-slate-200 rounded w-1/3 mx-auto sm:mx-0"></div>
              </div>
            </div>
          </div>

          {/* Role badge skeleton */}
          <div className="h-20 bg-slate-100 rounded-2xl mb-6 shimmer"></div>

          {/* Info card skeleton */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8 shimmer">
            <div className="space-y-5">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-3 bg-slate-200 rounded w-1/4"></div>
                  <div className="h-12 bg-slate-100 rounded-xl"></div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    );
  }

  const roleConfig = getRoleConfig(user?.role);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto">

        {/* ==================== BACK BUTTON ==================== */}
        <button
          onClick={() => navigate("/admin/users")}
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
          Back to Users
        </button>

        {/* ==================== ERROR STATE ==================== */}
        {error ? (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-10 sm:p-14 text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-red-50 flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8 text-red-500"
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
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Oops! Something went wrong
            </h3>
            <p className="text-sm text-slate-500 mb-6">{error}</p>
            <button
              onClick={() => navigate("/admin/users")}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
            >
              Back to Users
            </button>
          </div>
        ) : (
          <>
            {/* ==================== HERO HEADER ==================== */}
            <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-6 sm:p-8 mb-6 shadow-xl shadow-indigo-300/30">
              <div className="absolute top-[-40%] right-[-5%] w-64 h-64 bg-white/10 rounded-full blur-2xl"></div>
              <div className="absolute bottom-[-50%] left-[15%] w-72 h-72 bg-white/10 rounded-full blur-2xl"></div>
              <div className="absolute top-[30%] left-[40%] w-32 h-32 bg-white/5 rounded-full blur-xl"></div>

              <div className="relative flex flex-col sm:flex-row items-center sm:items-end gap-5">

                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div
                    className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br ${roleConfig.gradient} flex items-center justify-center text-white text-2xl sm:text-3xl font-bold shadow-lg border-2 border-white/40`}
                  >
                    {getInitials(user?.email)}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center shadow-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-3.5 h-3.5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 text-center sm:text-left pb-1 min-w-0">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold text-white bg-white/20 backdrop-blur-md rounded-full uppercase tracking-wider mb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse"></span>
                    {roleConfig.label}
                  </div>
                  <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight break-all">
                    {user?.email || "Unknown User"}
                  </h1>
                  <p className="text-blue-100 text-sm mt-1">
                    User ID:{" "}
                    <span className="font-semibold text-white">
                      #{user?.id ?? "—"}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* ==================== ROLE CARD ==================== */}
            <div
              className={`mb-6 flex items-center gap-3 p-4 sm:p-5 ${roleConfig.bg} ${roleConfig.border} border rounded-2xl`}
            >
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${roleConfig.gradient} flex items-center justify-center text-white shadow-md ${roleConfig.shadow} flex-shrink-0`}
              >
                {roleConfig.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] uppercase tracking-wider font-bold text-slate-500">
                  Account Type
                </p>
                <p className={`text-base font-bold ${roleConfig.text}`}>
                  {roleConfig.label}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {roleConfig.description}
                </p>
              </div>
              <span
                className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold uppercase tracking-wider ${roleConfig.bg} ${roleConfig.text} ${roleConfig.border} border rounded-full`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${roleConfig.dot} animate-pulse`}
                ></span>
                Active
              </span>
            </div>

            {/* ==================== INFO CARD ==================== */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

              {/* Card Header */}
              <div className="px-6 sm:px-8 py-5 border-b border-slate-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-300/50">
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
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="font-bold text-slate-900">
                    User Information
                  </h2>
                  <p className="text-xs text-slate-500">
                    Account details and identity
                  </p>
                </div>
              </div>

              {/* Info Rows */}
              <div className="p-6 sm:p-8 space-y-5">

                <InfoRow
                  label="User ID"
                  value={user?.id}
                  mono
                  icon={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5 text-indigo-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                      />
                    </svg>
                  }
                />

                <InfoRow
                  label="Email Address"
                  value={user?.email}
                  icon={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5 text-blue-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  }
                />

                <InfoRow
                  label="Role"
                  value={roleConfig.label}
                  icon={roleConfig.icon}
                  valueClass={roleConfig.text}
                />

              </div>

              {/* Footer */}
              <div className="px-6 sm:px-8 py-4 bg-slate-50 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-3.5 h-3.5 text-slate-400 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>
                  User details are read-only in this view.
                </span>
              </div>
            </div>

            {/* ==================== QUICK ACTIONS ==================== */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => navigate("/admin/users")}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 hover:text-indigo-600 transition-all duration-200"
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
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                All Users
              </button>

              <button
                onClick={() => navigate("/admin/dashboard")}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 hover:text-indigo-600 transition-all duration-200"
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
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                Dashboard
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
}

// ==================== INFO ROW COMPONENT ====================
function InfoRow({
  label,
  value,
  icon,
  mono = false,
  valueClass = "text-slate-900",
}) {
  return (
    <div className="group">
      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
        {label}
      </label>
      <div className="relative flex items-center gap-3 px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl transition-all duration-200 hover:border-indigo-200 hover:bg-indigo-50/30 hover:shadow-sm">
        <div className="flex-shrink-0">{icon}</div>
        <p
          className={`text-sm font-semibold ${valueClass} truncate ${
            mono ? "font-mono" : ""
          }`}
        >
          {value ?? "—"}
        </p>
      </div>
    </div>
  );
}

export default AdminUserDetails;