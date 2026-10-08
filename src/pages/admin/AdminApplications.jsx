import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getAllApplications,
  getApplicationsByStatus,
} from "../../api/adminApi";

function AdminApplications() {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setLoading(true);

      const data = await getAllApplications();

      setApplications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusFilter = async (selectedStatus) => {
    setStatus(selectedStatus);

    if (!selectedStatus) {
      loadApplications();
      return;
    }

    try {
      setLoading(true);

      const data = await getApplicationsByStatus(selectedStatus);

      setApplications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
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
        border: "border-blue-100",
        dot: "bg-blue-500",
      },
      UNDER_REVIEW: {
        label: "Under Review",
        bg: "bg-amber-50",
        text: "text-amber-700",
        border: "border-amber-100",
        dot: "bg-amber-500",
      },
      SHORTLISTED: {
        label: "Shortlisted",
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        border: "border-emerald-100",
        dot: "bg-emerald-500",
      },
      INTERVIEW: {
        label: "Interview",
        bg: "bg-purple-50",
        text: "text-purple-700",
        border: "border-purple-100",
        dot: "bg-purple-500",
      },
      SELECTED: {
        label: "Selected",
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        border: "border-emerald-100",
        dot: "bg-emerald-500",
      },
      REJECTED: {
        label: "Rejected",
        bg: "bg-red-50",
        text: "text-red-700",
        border: "border-red-100",
        dot: "bg-red-500",
      },
    };
    return (
      configs[key] || {
        label: statusValue || "Unknown",
        bg: "bg-slate-50",
        text: "text-slate-700",
        border: "border-slate-100",
        dot: "bg-slate-500",
      }
    );
  };

  // ==================== CLIENT-SIDE FILTER (on top of API filter) ====================

  const filteredApplications = applications.filter((app) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      (app.studentName || "").toLowerCase().includes(term) ||
      (app.jobTitle || "").toLowerCase().includes(term) ||
      (app.companyName || "").toLowerCase().includes(term) ||
      String(app.applicationId || "").includes(term)
    );
  });

  // ==================== DERIVED STATS ====================

  const totalApplications = applications.length;
  const shortlistedCount = applications.filter(
    (a) => (a.status || "").toUpperCase() === "SHORTLISTED"
  ).length;
  const interviewCount = applications.filter(
    (a) => (a.status || "").toUpperCase() === "INTERVIEW"
  ).length;
  const selectedCount = applications.filter(
    (a) => (a.status || "").toUpperCase() === "SELECTED"
  ).length;

  // Filter tabs (visual shortcuts for the dropdown)
  const statusTabs = [
    { value: "", label: "All" },
    { value: "APPLIED", label: "Applied" },
    { value: "UNDER_REVIEW", label: "Under Review" },
    { value: "SHORTLISTED", label: "Shortlisted" },
    { value: "INTERVIEW", label: "Interview" },
    { value: "SELECTED", label: "Selected" },
    { value: "REJECTED", label: "Rejected" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">

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
        <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-6 sm:p-8 mb-6 shadow-xl shadow-purple-300/30">
          <div className="absolute top-[-40%] right-[-5%] w-64 h-64 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-[-50%] left-[15%] w-72 h-72 bg-white/10 rounded-full blur-2xl"></div>

          <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
            <div>
              <p className="text-purple-100 text-sm font-medium mb-1 flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                {totalApplications} total{" "}
                {totalApplications === 1 ? "application" : "applications"}
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                All Applications
              </h1>
              <p className="text-purple-100 mt-2 text-sm sm:text-base max-w-xl">
                Browse, filter, and manage every job application across the platform.
              </p>
            </div>

            <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-xl px-5 py-4 text-white self-start sm:self-auto">
              <p className="text-xs text-purple-100 font-medium">
                Total Applications
              </p>
              <p className="text-3xl font-bold tracking-tight mt-0.5">
                {totalApplications}
              </p>
            </div>
          </div>
        </div>

        {/* ==================== QUICK STATS ==================== */}
        {!loading && applications.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Total */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-md shadow-indigo-300/50 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <span className="text-[10px] font-semibold px-2 py-1 rounded-full bg-indigo-50 text-indigo-600">
                  Total
                </span>
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                {totalApplications}
              </p>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                Applications
              </p>
            </div>

            {/* Shortlisted */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-300/50 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-[10px] font-semibold px-2 py-1 rounded-full bg-emerald-50 text-emerald-600">
                  Shortlisted
                </span>
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                {shortlistedCount}
              </p>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                Candidates
              </p>
            </div>

            {/* Interview */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white shadow-md shadow-purple-300/50 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-[10px] font-semibold px-2 py-1 rounded-full bg-purple-50 text-purple-600">
                  Interviews
                </span>
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                {interviewCount}
              </p>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                Scheduled
              </p>
            </div>

            {/* Selected */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-md shadow-amber-300/50 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <span className="text-[10px] font-semibold px-2 py-1 rounded-full bg-amber-50 text-amber-600">
                  Selected
                </span>
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                {selectedCount}
              </p>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                Offers
              </p>
            </div>
          </div>
        )}

        {/* ==================== FILTER + SEARCH BAR ==================== */}
        {!loading && applications.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-5 mb-5">

            {/* Status filter tabs */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-3 border-b border-slate-100">
              <span className="text-xs font-semibold text-slate-500 whitespace-nowrap pr-2">
                Filter:
              </span>
              {statusTabs.map((tab) => {
                const isActive = status === tab.value;
                return (
                  <button
                    key={tab.value}
                    onClick={() => handleStatusFilter(tab.value)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-full whitespace-nowrap transition-all duration-200 ${
                      isActive
                        ? "text-white bg-gradient-to-r from-indigo-600 to-purple-600 shadow-md shadow-indigo-300/50"
                        : "text-slate-600 bg-slate-50 border border-slate-200 hover:bg-slate-100 hover:border-slate-300"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Search + Refresh */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1 group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by student, job, company, or application ID..."
                  className="w-full pl-12 pr-10 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all duration-200"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-indigo-600 transition-colors"
                    aria-label="Clear search"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>

              <button
                onClick={() => {
                  setSearchTerm("");
                  handleStatusFilter("");
                }}
                className="group inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 transition-all duration-200 whitespace-nowrap"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500"
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
                Reset
              </button>
            </div>
          </div>
        )}

        {/* ==================== MAIN CARD ==================== */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

          {/* ---- LOADING ---- */}
          {loading ? (
            <div className="p-10 sm:p-16">
              <div className="flex flex-col items-center gap-3 mb-8">
                <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                <p className="text-sm font-medium text-slate-600">
                  Loading applications...
                </p>
              </div>

              <div className="space-y-3 max-w-4xl mx-auto">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="h-16 bg-slate-100 rounded-xl shimmer"
                  ></div>
                ))}
              </div>
            </div>
          ) : applications.length === 0 ? (
            /* ---- EMPTY ---- */
            <div className="p-10 sm:p-16 text-center">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center mb-5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-10 h-10 text-indigo-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                No applications found
              </h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                {status
                  ? `No applications with status "${status}". Try a different filter.`
                  : "No applications have been submitted yet."}
              </p>
            </div>
          ) : filteredApplications.length === 0 ? (
            /* ---- NO SEARCH MATCH ---- */
            <div className="p-10 sm:p-16 text-center">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-8 h-8 text-slate-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">
                No matching applications
              </h3>
              <p className="text-sm text-slate-500 mb-4">
                Try a different search keyword.
              </p>
              <button
                onClick={() => setSearchTerm("")}
                className="px-5 py-2.5 text-sm font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors"
              >
                Clear Search
              </button>
            </div>
          ) : (
            /* ---- TABLE ---- */
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px]">
                <thead>
                  <tr className="bg-gradient-to-r from-slate-50 to-slate-100/50 border-b border-slate-200">
                    <th className="p-4 text-left text-[11px] uppercase tracking-wider font-bold text-slate-500">
                      Application
                    </th>
                    <th className="p-4 text-left text-[11px] uppercase tracking-wider font-bold text-slate-500">
                      Student
                    </th>
                    <th className="p-4 text-left text-[11px] uppercase tracking-wider font-bold text-slate-500">
                      Job
                    </th>
                    <th className="p-4 text-left text-[11px] uppercase tracking-wider font-bold text-slate-500">
                      Company
                    </th>
                    <th className="p-4 text-left text-[11px] uppercase tracking-wider font-bold text-slate-500">
                      Status
                    </th>
                    <th className="p-4 text-right text-[11px] uppercase tracking-wider font-bold text-slate-500">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredApplications.map((application) => {
                    const statusConfig = getStatusConfig(application.status);
                    const gradient = getAvatarGradient(
                      application.studentName
                    );

                    return (
                      <tr
                        key={application.applicationId}
                        className="hover:bg-indigo-50/40 transition-colors duration-150 group"
                      >
                        {/* Application ID */}
                        <td className="p-4">
                          <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-lg">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-3 h-3 text-slate-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2.5}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                              />
                            </svg>
                            <span className="text-xs font-semibold text-slate-700 font-mono">
                              #{application.applicationId}
                            </span>
                          </div>
                        </td>

                        {/* Student */}
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-9 h-9 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-[10px] font-bold shadow-md flex-shrink-0 group-hover:scale-105 transition-transform duration-300`}
                            >
                              {getInitials(application.studentName)}
                            </div>
                            <span className="text-sm font-semibold text-slate-900 truncate">
                              {application.studentName || "—"}
                            </span>
                          </div>
                        </td>

                        {/* Job */}
                        <td className="p-4">
                          <p className="text-sm font-medium text-slate-700 truncate max-w-[200px]">
                            {application.jobTitle || "—"}
                          </p>
                        </td>

                        {/* Company */}
                        <td className="p-4">
                          <div className="flex items-center gap-2 text-sm text-slate-700">
                            {application.companyName ? (
                              <>
                                <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
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
                                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                    />
                                  </svg>
                                </div>
                                <span className="truncate max-w-[160px]">
                                  {application.companyName}
                                </span>
                              </>
                            ) : (
                              <span className="text-slate-400 text-xs italic">
                                Not provided
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Status */}
                        <td className="p-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border} border rounded-full`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot} ${
                                (application.status || "").toUpperCase() ===
                                "INTERVIEW"
                                  ? "animate-pulse"
                                  : ""
                              }`}
                            ></span>
                            {statusConfig.label}
                          </span>
                        </td>

                        {/* Action */}
                        <td className="p-4">
                          <div className="flex justify-end">
                            <button
                              onClick={() =>
                                navigate(
                                  `/admin/applications/${application.applicationId}`
                                )
                              }
                              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-md shadow-indigo-300/50 hover:shadow-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
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
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                              </svg>
                              View
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Footer summary */}
              <div className="px-4 sm:px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs">
                <span className="text-slate-500">
                  Showing{" "}
                  <span className="font-bold text-slate-700">
                    {filteredApplications.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-bold text-slate-700">
                    {applications.length}
                  </span>{" "}
                  applications
                </span>

                {(searchTerm || status) && (
                  <span className="text-slate-500 flex items-center gap-1.5 flex-wrap">
                    Filters:
                    {status && (
                      <span className="font-semibold text-indigo-600">
                        {status}
                      </span>
                    )}
                    {searchTerm && (
                      <span className="font-semibold text-purple-600">
                        "{searchTerm}"
                      </span>
                    )}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default AdminApplications;