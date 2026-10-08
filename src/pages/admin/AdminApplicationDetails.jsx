import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getApplicationById } from "../../api/adminApi";

function AdminApplicationDetails() {
  const { applicationId } = useParams();
  const navigate = useNavigate();

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadApplication();
  }, [applicationId]);

  const loadApplication = async () => {
    try {
      setLoading(true);

      const data = await getApplicationById(applicationId);

      setApplication(data);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to load application."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==================== VISUAL HELPERS (UI ONLY) ====================

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const getAvatarGradient = (name) => {
    const gradients = [
      "from-blue-500 to-indigo-500",
      "from-emerald-500 to-teal-500",
      "from-purple-500 to-pink-500",
      "from-orange-500 to-amber-500",
      "from-rose-500 to-red-500",
      "from-cyan-500 to-blue-500",
    ];
    if (!name) return gradients[0];
    const idx = name.charCodeAt(0) % gradients.length;
    return gradients[idx];
  };

  const getStatusConfig = (statusValue) => {
    const key = (statusValue || "").toUpperCase();
    const configs = {
      APPLIED: {
        label: "Applied",
        bg: "bg-blue-50",
        text: "text-blue-700",
        border: "border-blue-200",
        dot: "bg-blue-500",
        gradient: "from-blue-500 to-indigo-500",
      },
      UNDER_REVIEW: {
        label: "Under Review",
        bg: "bg-amber-50",
        text: "text-amber-700",
        border: "border-amber-200",
        dot: "bg-amber-500",
        gradient: "from-amber-500 to-orange-500",
      },
      SHORTLISTED: {
        label: "Shortlisted",
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        border: "border-emerald-200",
        dot: "bg-emerald-500",
        gradient: "from-emerald-500 to-teal-500",
      },
      INTERVIEW: {
        label: "Interview",
        bg: "bg-purple-50",
        text: "text-purple-700",
        border: "border-purple-200",
        dot: "bg-purple-500",
        gradient: "from-purple-500 to-pink-500",
      },
      SELECTED: {
        label: "Selected",
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        border: "border-emerald-200",
        dot: "bg-emerald-500",
        gradient: "from-emerald-500 to-teal-500",
      },
      REJECTED: {
        label: "Rejected",
        bg: "bg-red-50",
        text: "text-red-700",
        border: "border-red-200",
        dot: "bg-red-500",
        gradient: "from-red-500 to-rose-500",
      },
    };
    return (
      configs[key] || {
        label: statusValue || "Unknown",
        bg: "bg-slate-50",
        text: "text-slate-700",
        border: "border-slate-200",
        dot: "bg-slate-500",
        gradient: "from-slate-500 to-slate-600",
      }
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    try {
      return new Date(dateString).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "—";
    }
  };

  // ==================== LOADING STATE ====================
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">

          {/* Back button skeleton */}
          <div className="h-10 w-40 bg-slate-200 rounded-xl mb-5 shimmer"></div>

          {/* Hero skeleton */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8 mb-6 shimmer">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-2xl bg-slate-200"></div>
              <div className="flex-1 space-y-3">
                <div className="h-5 bg-slate-200 rounded w-1/2"></div>
                <div className="h-4 bg-slate-200 rounded w-1/3"></div>
              </div>
            </div>
          </div>

          {/* Info skeleton */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8 shimmer space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-3 bg-slate-200 rounded w-1/4"></div>
                <div className="h-10 bg-slate-100 rounded-xl"></div>
              </div>
            ))}
          </div>

        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(application?.status);
  const gradient = getAvatarGradient(application?.studentName);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">

        {/* ==================== BACK BUTTON ==================== */}
        <button
          onClick={() => navigate("/admin/applications")}
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
          Back to Applications
        </button>

        {error ? (
          /* ==================== ERROR STATE ==================== */
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
              onClick={() => navigate("/admin/applications")}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
            >
              Back to Applications
            </button>
          </div>
        ) : (
          <>
            {/* ==================== HERO HEADER ==================== */}
            <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-6 sm:p-8 mb-6 shadow-xl shadow-indigo-300/30">
              <div className="absolute top-[-40%] right-[-5%] w-64 h-64 bg-white/10 rounded-full blur-2xl"></div>
              <div className="absolute bottom-[-50%] left-[15%] w-72 h-72 bg-white/10 rounded-full blur-2xl"></div>

              <div className="relative flex flex-col sm:flex-row items-center sm:items-end gap-5">

                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div
                    className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-2xl sm:text-3xl font-bold shadow-lg border-2 border-white/40`}
                  >
                    {getInitials(application?.studentName)}
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
                  <div
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold text-white bg-white/20 backdrop-blur-md rounded-full uppercase tracking-wider mb-2`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full bg-white ${
                        statusConfig.label === "Interview"
                          ? "animate-pulse"
                          : ""
                      }`}
                    ></span>
                    {statusConfig.label}
                  </div>
                  <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight truncate">
                    {application?.studentName || "Unknown Student"}
                  </h1>
                  <p className="text-blue-100 text-sm mt-1 truncate">
                    Applied for{" "}
                    <span className="font-semibold text-white">
                      {application?.jobTitle || "a position"}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* ==================== STATUS CARD ==================== */}
            <div
              className={`mb-6 flex items-center gap-3 p-4 ${statusConfig.bg} ${statusConfig.border} border rounded-2xl`}
            >
              <div
                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${statusConfig.gradient} flex items-center justify-center text-white shadow-md flex-shrink-0`}
              >
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
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] uppercase tracking-wider font-bold text-slate-500">
                  Application Status
                </p>
                <p className={`text-sm font-bold ${statusConfig.text}`}>
                  {statusConfig.label}
                </p>
              </div>
              <span
                className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold uppercase tracking-wider ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border} border rounded-full`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot} ${
                    statusConfig.label === "Interview"
                      ? "animate-pulse"
                      : ""
                  }`}
                ></span>
                Active
              </span>
            </div>

            {/* ==================== MAIN GRID ==================== */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* Left: Application details (2 cols) */}
              <div className="lg:col-span-2 space-y-6">

                {/* Applicant Information */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  <div className="px-6 sm:px-7 py-5 border-b border-slate-100 flex items-center gap-3">
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
                        Applicant Information
                      </h2>
                      <p className="text-xs text-slate-500">
                        Student details
                      </p>
                    </div>
                  </div>

                  <div className="p-6 sm:p-7 space-y-5">
                    <InfoRow
                      label="Student Name"
                      value={application?.studentName}
                      icon={
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-5 h-5 text-slate-400"
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
                      }
                    />

                    <InfoRow
                      label="Student Email"
                      value={application?.studentEmail}
                      icon={
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-5 h-5 text-slate-400"
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
                  </div>
                </div>

                {/* Job Information */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  <div className="px-6 sm:px-7 py-5 border-b border-slate-100 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white shadow-md shadow-purple-300/50">
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
                          d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h2 className="font-bold text-slate-900">
                        Job Information
                      </h2>
                      <p className="text-xs text-slate-500">
                        Position applied for
                      </p>
                    </div>
                  </div>

                  <div className="p-6 sm:p-7 space-y-5">
                    <InfoRow
                      label="Job Title"
                      value={application?.jobTitle}
                      icon={
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-5 h-5 text-slate-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      }
                    />

                    <InfoRow
                      label="Company"
                      value={application?.companyName}
                      icon={
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-5 h-5 text-slate-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                          />
                        </svg>
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Right: Application metadata (1 col) */}
              <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">

                {/* Application Info */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-300/50">
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
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h2 className="font-bold text-slate-900 text-sm">
                        Application Info
                      </h2>
                      <p className="text-xs text-slate-500">
                        Metadata
                      </p>
                    </div>
                  </div>

                  <div className="p-5 space-y-4">
                    <SideStat
                      label="Application ID"
                      value={`#${application?.applicationId ?? "—"}`}
                      mono
                    />

                    <SideStat
                      label="Applied At"
                      value={formatDate(application?.appliedAt)}
                    />

                    <SideStat
                      label="Status"
                      value={statusConfig.label}
                      valueClass={statusConfig.text}
                    />
                  </div>
                </div>

                {/* Timeline Card */}
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-lg bg-white/80 flex items-center justify-center text-indigo-600 shadow-sm">
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
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm">
                      Application Timeline
                    </h3>
                  </div>

                  <div className="space-y-4">
                    {[
                      { label: "Applied", active: true, done: true },
                      { label: "Under Review", active: true, done: true },
                      { label: "Shortlisted", active: true, done: true },
                      { label: "Interview", active: true, done: true },
                      { label: "Decision", active: true, done: true },
                    ].map((step, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                            step.done
                              ? "bg-indigo-500 text-white shadow-md shadow-indigo-300/50"
                              : "bg-white border-2 border-slate-200"
                          }`}
                        >
                          {step.done && (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-3 h-3"
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
                          )}
                        </div>
                        <span
                          className={`text-xs font-semibold ${
                            step.done ? "text-slate-700" : "text-slate-400"
                          }`}
                        >
                          {step.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </aside>
            </div>
          </>
        )}

      </div>
    </div>
  );
}

// ==================== INFO ROW COMPONENT ====================
function InfoRow({ label, value, icon, valueClass = "text-slate-900" }) {
  return (
    <div className="group">
      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
        {label}
      </label>
      <div className="relative flex items-center gap-3 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl transition-all duration-200 hover:border-indigo-200 hover:bg-indigo-50/30">
        <div className="flex-shrink-0">{icon}</div>
        <p className={`text-sm font-semibold ${valueClass} truncate`}>
          {value ?? "—"}
        </p>
      </div>
    </div>
  );
}

// ==================== SIDE STAT COMPONENT ====================
function SideStat({ label, value, mono = false, valueClass = "text-slate-900" }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1">
        {label}
      </p>
      <p
        className={`text-sm font-semibold ${valueClass} ${
          mono ? "font-mono" : ""
        } truncate`}
      >
        {value ?? "—"}
      </p>
    </div>
  );
}

export default AdminApplicationDetails;