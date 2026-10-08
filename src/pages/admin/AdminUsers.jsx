import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getAllUsers,
  deleteUser,
  searchUsersByEmail,
  getUsersByRole,
} from "../../api/adminApi";

function AdminUsers() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAllUsers();

      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to load users."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!email.trim()) {
      loadUsers();
      return;
    }

    try {
      setLoading(true);

      const data = await searchUsersByEmail(email);

      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to search users."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRoleFilter = async (selectedRole) => {
    setRole(selectedRole);

    if (!selectedRole) {
      loadUsers();
      return;
    }

    try {
      setLoading(true);

      const data = await getUsersByRole(selectedRole);

      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to filter users."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(userId);

      await deleteUser(userId);

      setUsers((previous) =>
        previous.filter(
          (user) => user.id !== userId
        )
      );
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to delete user."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // ==================== VISUAL HELPERS (UI ONLY) ====================

  const getInitials = (email) => {
    if (!email) return "?";
    return email.slice(0, 2).toUpperCase();
  };

  const getRoleConfig = (role) => {
    const key = (role || "").toUpperCase();
    const configs = {
      ADMIN: {
        label: "Admin",
        bg: "bg-red-50",
        text: "text-red-700",
        border: "border-red-200",
        gradient: "from-red-500 to-rose-500",
        dot: "bg-red-500",
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        ),
      },
      RECRUITER: {
        label: "Recruiter",
        bg: "bg-purple-50",
        text: "text-purple-700",
        border: "border-purple-200",
        gradient: "from-purple-500 to-pink-500",
        dot: "bg-purple-500",
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        ),
      },
      STUDENT: {
        label: "Student",
        bg: "bg-blue-50",
        text: "text-blue-700",
        border: "border-blue-200",
        gradient: "from-blue-500 to-indigo-500",
        dot: "bg-blue-500",
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
          </svg>
        ),
      },
    };
    return (
      configs[key] || {
        label: role || "Unknown",
        bg: "bg-slate-50",
        text: "text-slate-700",
        border: "border-slate-200",
        gradient: "from-slate-500 to-slate-600",
        dot: "bg-slate-500",
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        ),
      }
    );
  };

  // ==================== DERIVED STATS (UI ONLY) ====================

  const totalUsers = users.length;
  const adminCount = users.filter(
    (u) => (u.role || "").toUpperCase() === "ADMIN"
  ).length;
  const recruiterCount = users.filter(
    (u) => (u.role || "").toUpperCase() === "RECRUITER"
  ).length;
  const studentCount = users.filter(
    (u) => (u.role || "").toUpperCase() === "STUDENT"
  ).length;

  // Role filter tabs
  const roleTabs = [
    { value: "", label: "All", count: totalUsers },
    { value: "STUDENT", label: "Students", count: studentCount },
    { value: "RECRUITER", label: "Recruiters", count: recruiterCount },
    { value: "ADMIN", label: "Admins", count: adminCount },
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
        <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-6 sm:p-8 mb-6 shadow-xl shadow-indigo-300/30">
          <div className="absolute top-[-40%] right-[-5%] w-64 h-64 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-[-50%] left-[15%] w-72 h-72 bg-white/10 rounded-full blur-2xl"></div>

          <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
            <div>
              <p className="text-purple-100 text-sm font-medium mb-1 flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                {totalUsers} {totalUsers === 1 ? "user" : "users"} in the system
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Manage Users
              </h1>
              <p className="text-purple-100 mt-2 text-sm sm:text-base max-w-xl">
                View, search, filter, and manage every account on PlacementHub.
              </p>
            </div>

            <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-xl px-5 py-4 text-white self-start sm:self-auto min-w-[180px]">
              <p className="text-xs text-purple-100 font-medium">
                Total Users
              </p>
              <p className="text-3xl font-bold tracking-tight mt-0.5">
                {totalUsers}
              </p>
              <p className="text-[10px] text-purple-200 mt-1">
                {studentCount} students · {recruiterCount} recruiters
              </p>
            </div>
          </div>
        </div>

        {/* ==================== KPI STATS ==================== */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {roleTabs.map((tab, i) => {
            const config = i === 0
              ? {
                  gradient: "from-indigo-500 to-purple-500",
                  shadow: "shadow-indigo-300/50",
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  ),
                  bg: "bg-indigo-50",
                  text: "text-indigo-600",
                }
              : i === 1
              ? {
                  gradient: "from-blue-500 to-indigo-500",
                  shadow: "shadow-blue-300/50",
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    </svg>
                  ),
                  bg: "bg-blue-50",
                  text: "text-blue-600",
                }
              : i === 2
              ? {
                  gradient: "from-purple-500 to-pink-500",
                  shadow: "shadow-purple-300/50",
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  ),
                  bg: "bg-purple-50",
                  text: "text-purple-600",
                }
              : {
                  gradient: "from-red-500 to-rose-500",
                  shadow: "shadow-red-300/50",
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  ),
                  bg: "bg-red-50",
                  text: "text-red-600",
                };

            return (
              <button
                key={tab.value}
                onClick={() => handleRoleFilter(tab.value)}
                className={`text-left bg-white rounded-2xl p-4 sm:p-5 border transition-all duration-300 group ${
                  role === tab.value
                    ? "border-indigo-300 shadow-lg shadow-indigo-200/50 -translate-y-1"
                    : "border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${config.gradient} flex items-center justify-center text-white shadow-md ${config.shadow} group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}
                  >
                    {config.icon}
                  </div>
                  <span
                    className={`text-[10px] font-semibold px-2 py-1 rounded-full ${config.bg} ${config.text}`}
                  >
                    {role === tab.value ? "Active" : "Filter"}
                  </span>
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                  {tab.count}
                </p>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                  {tab.label}
                </p>
              </button>
            );
          })}
        </div>

        {/* ==================== SEARCH + FILTER BAR ==================== */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-5 mb-5">
          <div className="flex flex-col sm:flex-row gap-3">

            {/* Email search */}
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
                placeholder="Search users by email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="w-full pl-12 pr-10 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all duration-200"
              />
              {email && (
                <button
                  onClick={() => setEmail("")}
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

            {/* Search button */}
            <button
              onClick={handleSearch}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-md shadow-indigo-300/50 hover:shadow-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 whitespace-nowrap"
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
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              Search
            </button>

            {/* Reset */}
            <button
              onClick={() => {
                setEmail("");
                setRole("");
                loadUsers();
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

        {/* ==================== ERROR ==================== */}
        {error && (
          <div className="mb-6 flex items-start gap-3 p-3.5 bg-red-50 border border-red-200 rounded-xl animate-shake">
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

        {/* ==================== MAIN CARD ==================== */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

          {/* ---- LOADING ---- */}
          {loading ? (
            <div className="p-10 sm:p-16">
              <div className="flex flex-col items-center gap-3 mb-8">
                <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                <p className="text-sm font-medium text-slate-600">
                  Loading users...
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
          ) : users.length === 0 ? (
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
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                No users found
              </h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                {email || role
                  ? "Try a different search or filter."
                  : "No users have registered yet."}
              </p>
              {(email || role) && (
                <button
                  onClick={() => {
                    setEmail("");
                    setRole("");
                    loadUsers();
                  }}
                  className="mt-4 px-5 py-2.5 text-sm font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors"
                >
                  Reset Filters
                </button>
              )}
            </div>
          ) : (
            /* ---- TABLE ---- */
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className="bg-gradient-to-r from-slate-50 to-slate-100/50 border-b border-slate-200">
                    <th className="p-4 text-left text-[11px] uppercase tracking-wider font-bold text-slate-500">
                      User
                    </th>
                    <th className="p-4 text-left text-[11px] uppercase tracking-wider font-bold text-slate-500">
                      Email
                    </th>
                    <th className="p-4 text-left text-[11px] uppercase tracking-wider font-bold text-slate-500">
                      Role
                    </th>
                    <th className="p-4 text-right text-[11px] uppercase tracking-wider font-bold text-slate-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {users.map((user) => {
                    const roleConfig = getRoleConfig(user.role);
                    const isDeleting = deletingId === user.id;

                    return (
                      <tr
                        key={user.id}
                        className="hover:bg-indigo-50/40 transition-colors duration-150 group"
                      >
                        {/* User */}
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`relative w-11 h-11 rounded-xl bg-gradient-to-br ${roleConfig.gradient} flex items-center justify-center text-white text-xs font-bold shadow-md flex-shrink-0 group-hover:scale-105 transition-transform duration-300`}
                            >
                              {getInitials(user.email)}
                              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white"></span>
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-slate-900 text-sm truncate">
                                {user.email?.split("@")[0] || "user"}
                              </p>
                              <p className="text-xs text-slate-400 font-mono">
                                ID #{user.id}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Email */}
                        <td className="p-4">
                          <div className="flex items-center gap-2 text-sm text-slate-700">
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
                                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                />
                              </svg>
                            </div>
                            <span className="truncate max-w-[250px]">
                              {user.email || "—"}
                            </span>
                          </div>
                        </td>

                        {/* Role */}
                        <td className="p-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold ${roleConfig.bg} ${roleConfig.text} ${roleConfig.border} border rounded-full`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${roleConfig.dot}`}
                            ></span>
                            {roleConfig.icon}
                            {roleConfig.label}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="p-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() =>
                                navigate(`/admin/users/${user.id}`)
                              }
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-100 rounded-lg hover:bg-blue-100 hover:border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 transition-all duration-200"
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

                            <button
                              onClick={() => handleDelete(user.id)}
                              disabled={isDeleting}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 border border-red-100 rounded-lg hover:bg-red-100 hover:border-red-200 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                              {isDeleting ? (
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
                                  Deleting...
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
                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                  </svg>
                                  Delete
                                </>
                              )}
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
                    {users.length}
                  </span>{" "}
                  {users.length === 1 ? "user" : "users"}
                </span>

                {(email || role) && (
                  <span className="text-slate-500 flex items-center gap-1.5 flex-wrap">
                    Filters:
                    {role && (
                      <span className="font-semibold text-indigo-600">
                        {role}
                      </span>
                    )}
                    {email && (
                      <span className="font-semibold text-purple-600">
                        "{email}"
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

export default AdminUsers;