import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getAdminDashboard } from "../../api/adminApi";

function AdminDashboard() {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==================== LOGOUT STATE ====================
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAdminDashboard();

      console.log("Admin Dashboard:", data);

      setDashboard(data);
    } catch (err) {
      console.error("Dashboard error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==================== LOGOUT HANDLER ====================
  const handleLogout = () => {
    setLoggingOut(true);

    // Brief delay for smooth animation
    setTimeout(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("role");

      navigate("/login");
    }, 700);
  };

  // ==================== DERIVED STATS (UI ONLY) ====================

  const totalUsers = dashboard?.totalUsers ?? 0;
  const totalStudents = dashboard?.totalStudents ?? 0;
  const totalRecruiters = dashboard?.totalRecruiters ?? 0;
  const totalCompanies = dashboard?.totalCompanies ?? 0;
  const totalJobs = dashboard?.totalJobs ?? 0;
  const totalApplications = dashboard?.totalApplications ?? 0;
  const selectedStudents = dashboard?.selectedStudents ?? 0;

  const placementRate =
    totalStudents > 0
      ? Math.round((selectedStudents / totalStudents) * 100)
      : 0;

  const recruiterRatio =
    totalStudents > 0
      ? (totalRecruiters / totalStudents).toFixed(3)
      : "0.000";

  const appsPerJob =
    totalJobs > 0 ? Math.round(totalApplications / totalJobs) : 0;

  // ==================== STAT CARDS ====================

  const statCards = [
    {
      title: "Total Users",
      value: totalUsers,
      subtitle: "All registered accounts",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      gradient: "from-indigo-500 to-purple-500",
      shadow: "shadow-indigo-300/50",
      bg: "bg-indigo-50",
      text: "text-indigo-600",
      badge: "Platform",
    },
    {
      title: "Students",
      value: totalStudents,
      subtitle: "Active job seekers",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
        </svg>
      ),
      gradient: "from-blue-500 to-indigo-500",
      shadow: "shadow-blue-300/50",
      bg: "bg-blue-50",
      text: "text-blue-600",
      badge: "Active",
    },
    {
      title: "Recruiters",
      value: totalRecruiters,
      subtitle: "Hiring companies' staff",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      gradient: "from-purple-500 to-pink-500",
      shadow: "shadow-purple-300/50",
      bg: "bg-purple-50",
      text: "text-purple-600",
      badge: "Hiring",
    },
    {
      title: "Companies",
      value: totalCompanies,
      subtitle: "Registered employers",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      gradient: "from-emerald-500 to-teal-500",
      shadow: "shadow-emerald-300/50",
      bg: "bg-emerald-50",
      text: "text-emerald-600",
      badge: "Verified",
    },
    {
      title: "Jobs",
      value: totalJobs,
      subtitle: "Active job postings",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      gradient: "from-orange-500 to-amber-500",
      shadow: "shadow-orange-300/50",
      bg: "bg-orange-50",
      text: "text-orange-600",
      badge: "Live",
    },
    {
      title: "Applications",
      value: totalApplications,
      subtitle: "Total submitted",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
      gradient: "from-cyan-500 to-blue-500",
      shadow: "shadow-cyan-300/50",
      bg: "bg-cyan-50",
      text: "text-cyan-600",
      badge: "Received",
    },
    {
      title: "Selected Students",
      value: selectedStudents,
      subtitle: "Successfully placed",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
      gradient: "from-rose-500 to-red-500",
      shadow: "shadow-rose-300/50",
      bg: "bg-rose-50",
      text: "text-rose-600",
      badge: "Placed",
    },
    {
      title: "Placement Rate",
      value: `${placementRate}%`,
      subtitle: "Selected / Students",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      gradient: "from-violet-500 to-purple-500",
      shadow: "shadow-violet-300/50",
      bg: "bg-violet-50",
      text: "text-violet-600",
      badge: "KPI",
    },
  ];

  // ==================== QUICK ACTIONS ====================

  const quickActions = [
    {
      title: "Manage Users",
      desc: "View all platform accounts",
      path: "/admin/users",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      gradient: "from-indigo-500 to-purple-500",
      shadow: "shadow-indigo-300/50",
    },
    {
      title: "Students",
      desc: "Browse all students",
      path: "/admin/students",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
        </svg>
      ),
      gradient: "from-blue-500 to-indigo-500",
      shadow: "shadow-blue-300/50",
    },
    {
      title: "Recruiters",
      desc: "Browse all recruiters",
      path: "/admin/recruiters",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      gradient: "from-purple-500 to-pink-500",
      shadow: "shadow-purple-300/50",
    },
    {
      title: "Companies",
      desc: "Manage companies",
      path: "/admin/companies",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      gradient: "from-emerald-500 to-teal-500",
      shadow: "shadow-emerald-300/50",
    },
    {
      title: "Jobs",
      desc: "Manage job postings",
      path: "/admin/jobs",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      gradient: "from-orange-500 to-amber-500",
      shadow: "shadow-orange-300/50",
    },
    {
      title: "Applications",
      desc: "View all applications",
      path: "/admin/applications",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
      gradient: "from-cyan-500 to-blue-500",
      shadow: "shadow-cyan-300/50",
    },
    {
      title: "Notifications",
      desc: "View admin alerts",
      path: "/admin/notifications",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      ),
      gradient: "from-rose-500 to-red-500",
      shadow: "shadow-rose-300/50",
    },
  ];

  // ==================== LOADING ====================
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 mb-8 shimmer">
            <div className="space-y-3">
              <div className="h-8 bg-slate-200 rounded w-1/3"></div>
              <div className="h-4 bg-slate-200 rounded w-1/2"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-32 bg-slate-100 rounded-2xl shimmer"></div>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-8 shimmer">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="h-24 bg-slate-100 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==================== ERROR ====================
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-red-50 flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Oops! Something went wrong</h3>
          <p className="text-sm text-slate-500 mb-6">{error}</p>
          <button
            onClick={loadDashboard}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ==================== MAIN ====================
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">

        {/* ==================== HERO HEADER ==================== */}
        <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-6 sm:p-8 mb-8 shadow-xl shadow-indigo-300/30">
          <div className="absolute top-[-40%] right-[-5%] w-64 h-64 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-[-50%] left-[15%] w-72 h-72 bg-white/10 rounded-full blur-2xl"></div>

          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 text-[10px] font-bold text-white bg-white/20 backdrop-blur-md rounded-full uppercase tracking-wider mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse"></span>
                Admin Access
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Admin Dashboard
              </h1>
              <p className="text-purple-100 mt-2 text-sm sm:text-base max-w-xl">
                Manage users, companies, jobs, and applications across PlacementHub — all in one place.
              </p>
            </div>

            {/* Platform Snapshot + Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 self-start lg:self-auto w-full lg:w-auto">

              {/* Platform Snapshot */}
              <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-xl px-5 py-3 text-white flex-1 lg:flex-initial lg:min-w-[160px]">
                <p className="text-xs text-purple-100 font-medium">Platform Users</p>
                <p className="text-2xl font-bold tracking-tight mt-0.5">
                  {totalUsers}
                </p>
                <p className="text-[10px] text-purple-200 mt-0.5">
                  {totalStudents} students · {totalRecruiters} recruiters
                </p>
              </div>

              {/* Logout Button */}
              <button
                onClick={() => setShowLogoutModal(true)}
                className="group relative inline-flex items-center justify-center gap-2 px-5 py-3 bg-white/15 backdrop-blur-md text-white font-semibold rounded-xl border border-white/30 shadow-lg hover:bg-white/25 hover:border-white/50 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-purple-600 whitespace-nowrap"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* ==================== STATISTICS GRID ==================== */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                Platform Overview
              </h2>
              <p className="text-sm text-slate-500 mt-0.5">
                Real-time snapshot of your platform's activity
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {statCards.map((stat, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center text-white shadow-md ${stat.shadow} group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}
                  >
                    {stat.icon}
                  </div>
                  <span
                    className={`text-[10px] font-semibold px-2 py-1 rounded-full ${stat.bg} ${stat.text} whitespace-nowrap`}
                  >
                    {stat.badge}
                  </span>
                </div>

                <p className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                  {stat.value}
                </p>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                  {stat.title}
                </p>
                <p className="text-[10px] text-slate-400 mt-1">
                  {stat.subtitle}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ==================== SECONDARY KPIs ==================== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8">

          {/* Placement Rate */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-300/50">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Placement Rate</h3>
                <p className="text-xs text-slate-500">Selected / Total students</p>
              </div>
            </div>

            <div className="flex items-end justify-between mb-3">
              <p className="text-3xl font-bold text-slate-900 tracking-tight">{placementRate}%</p>
              <p className="text-xs text-slate-500 font-medium">
                {selectedStudents} / {totalStudents}
              </p>
            </div>

            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-700"
                style={{ width: `${Math.min(placementRate, 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Recruiter Ratio */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white shadow-md shadow-purple-300/50">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Recruiter Ratio</h3>
                <p className="text-xs text-slate-500">Recruiters / Students</p>
              </div>
            </div>

            <p className="text-3xl font-bold text-slate-900 tracking-tight">{recruiterRatio}</p>
            <p className="text-xs text-slate-500 mt-2">
              {totalRecruiters} recruiters serving {totalStudents} students
            </p>
          </div>

          {/* Apps per Job */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-300/50">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Applications / Job</h3>
                <p className="text-xs text-slate-500">Average applications per posting</p>
              </div>
            </div>

            <p className="text-3xl font-bold text-slate-900 tracking-tight">{appsPerJob}</p>
            <p className="text-xs text-slate-500 mt-2">
              {totalApplications} applications across {totalJobs} jobs
            </p>
          </div>
        </div>

        {/* ==================== QUICK ACTIONS ==================== */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-7">
          <div className="mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              Admin Management
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Jump to any management page
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, i) => (
              <button
                key={i}
                onClick={() => navigate(action.path)}
                className="group relative bg-white rounded-2xl p-5 border border-slate-200 text-left hover:shadow-xl hover:-translate-y-1 hover:border-indigo-200 transition-all duration-300 overflow-hidden focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <div
                  className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${action.gradient} scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500`}
                ></div>

                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center text-white shadow-lg ${action.shadow} mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}
                >
                  {action.icon}
                </div>

                <h3 className="font-bold text-slate-900 text-sm mb-1 group-hover:text-indigo-700 transition-colors">
                  {action.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-3">
                  {action.desc}
                </p>

                <div className="flex items-center gap-1 text-xs font-semibold text-slate-400 group-hover:text-indigo-600 transition-colors">
                  <span>Open</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ==================== MOTIVATION BANNER ==================== */}
        <div className="mt-8 relative overflow-hidden bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8">
          <div className="absolute right-[-5%] top-1/2 -translate-y-1/2 w-40 h-40 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full blur-2xl opacity-70"></div>

          <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-indigo-300/50 flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-900 mb-1">
                You're in full control 🛡️
              </h3>
              <p className="text-sm text-slate-500">
                Monitor platform activity, manage users, and keep the PlacementHub ecosystem healthy. Every action is logged and reversible.
              </p>
            </div>
            <button
              onClick={() => navigate("/admin/users")}
              className="self-start sm:self-auto px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg shadow-indigo-300/50 hover:shadow-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 whitespace-nowrap"
            >
              Manage Users
            </button>
          </div>
        </div>

      </div>

      {/* ==================== LOGOUT CONFIRMATION MODAL ==================== */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative bg-white rounded-3xl shadow-2xl shadow-indigo-300/30 border border-slate-100 max-w-md w-full overflow-hidden animate-scaleIn">

            {/* Decorative gradient top bar */}
            <div className="h-2 bg-gradient-to-r from-rose-500 via-red-500 to-orange-500"></div>

            {/* Decorative blobs */}
            <div className="absolute top-[-20%] right-[-10%] w-40 h-40 bg-gradient-to-br from-red-100 to-rose-100 rounded-full blur-2xl opacity-70"></div>

            <div className="relative p-6 sm:p-8 text-center">

              {/* Icon */}
              <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-rose-500 to-red-500 flex items-center justify-center shadow-xl shadow-red-300/50 mb-5">
                {loggingOut ? (
                  <svg
                    className="animate-spin w-10 h-10 text-white"
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
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-10 h-10 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                )}
              </div>

              {/* Title */}
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mb-2">
                {loggingOut ? "Logging you out..." : "Ready to leave?"}
              </h3>

              {/* Description */}
              <p className="text-sm text-slate-500 max-w-sm mx-auto mb-6">
                {loggingOut
                  ? "Securing your session and redirecting to login."
                  : "You'll be signed out of your admin account. Any unsaved changes will be lost."}
              </p>

              {/* Actions */}
              {!loggingOut && (
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => setShowLogoutModal(false)}
                    className="flex-1 px-5 py-3 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 transition-all duration-200"
                  >
                    Stay Logged In
                  </button>

                  <button
                    onClick={handleLogout}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-gradient-to-r from-rose-600 via-red-600 to-orange-600 rounded-xl shadow-lg shadow-red-300/50 hover:shadow-xl hover:from-rose-700 hover:via-red-700 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
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
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    Yes, Logout
                  </button>
                </div>
              )}

              {/* Small note */}
              {!loggingOut && (
                <p className="text-[10px] text-slate-400 mt-4 uppercase tracking-wider font-semibold">
                  🔒 Your data is safe and secure
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;