import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getAllStudents } from "../../api/adminApi";

function AdminStudents() {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const data = await getAllStudents();

      setStudents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ---- Visual helpers (UI only) ----
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

  const getCgpaConfig = (cgpa) => {
    const value = parseFloat(cgpa);
    if (isNaN(value))
      return {
        bg: "bg-slate-50",
        text: "text-slate-600",
        border: "border-slate-200",
        label: "N/A",
      };
    if (value >= 8.5)
      return {
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        border: "border-emerald-200",
        label: "Excellent",
      };
    if (value >= 7)
      return {
        bg: "bg-blue-50",
        text: "text-blue-700",
        border: "border-blue-200",
        label: "Good",
      };
    if (value >= 5.5)
      return {
        bg: "bg-amber-50",
        text: "text-amber-700",
        border: "border-amber-200",
        label: "Average",
      };
    return {
      bg: "bg-red-50",
      text: "text-red-700",
      border: "border-red-200",
      label: "Low",
    };
  };

  // ---- Client-side filtering (UI only) ----
  const filteredStudents = students.filter((s) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      (s.fullName || "").toLowerCase().includes(term) ||
      (s.college || "").toLowerCase().includes(term) ||
      (s.branch || "").toLowerCase().includes(term) ||
      String(s.id || "").includes(term)
    );
  });

  // ---- Quick stats (derived from loaded data) ----
  const totalStudents = students.length;
  const excellentCount = students.filter((s) => parseFloat(s.cgpa) >= 8.5).length;
  const avgCgpa =
    students.length > 0
      ? (
          students.reduce((sum, s) => sum + (parseFloat(s.cgpa) || 0), 0) /
          students.filter((s) => !isNaN(parseFloat(s.cgpa))).length
        ).toFixed(2)
      : "—";
  const uniqueColleges = new Set(
    students.map((s) => s.college).filter(Boolean)
  ).size;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">

      <div className="max-w-7xl mx-auto">

        {/* Back to Dashboard */}
        <button
          onClick={() => navigate("/admin/dashboard")}
          className="inline-flex items-center gap-2 px-4 py-2 mb-5 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Dashboard
        </button>

        {/* ==================== HERO HEADER ==================== */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-6 sm:p-8 mb-6 shadow-xl shadow-indigo-300/30">
          <div className="absolute top-[-40%] right-[-5%] w-64 h-64 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-[-50%] left-[15%] w-72 h-72 bg-white/10 rounded-full blur-2xl"></div>

          <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
            <div>
              <p className="text-blue-100 text-sm font-medium mb-1 flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                {totalStudents} registered {totalStudents === 1 ? "student" : "students"}
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                All Students
              </h1>
              <p className="text-blue-100 mt-2 text-sm sm:text-base max-w-xl">
                Browse, search, and manage every student registered on PlacementHub.
              </p>
            </div>

            <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-xl px-5 py-4 text-white self-start sm:self-auto">
              <p className="text-xs text-blue-100 font-medium">Total Students</p>
              <p className="text-3xl font-bold tracking-tight mt-0.5">
                {totalStudents}
              </p>
            </div>
          </div>
        </div>

        {/* ==================== QUICK STATS ==================== */}
        {!loading && students.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Total */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-300/50 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                {totalStudents}
              </p>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                Total Students
              </p>
            </div>

            {/* Excellent CGPA */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-300/50 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                {excellentCount}
              </p>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                CGPA ≥ 8.5
              </p>
            </div>

            {/* Avg CGPA */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white shadow-md shadow-purple-300/50 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                {avgCgpa}
              </p>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                Average CGPA
              </p>
            </div>

            {/* Colleges */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-300/50 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                {uniqueColleges}
              </p>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                Unique Colleges
              </p>
            </div>
          </div>
        )}

        {/* ==================== SEARCH BAR ==================== */}
        {!loading && students.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-5 mb-5">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1 group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name, college, branch, or ID..."
                  className="w-full pl-12 pr-10 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all duration-200"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-indigo-600 transition-colors"
                    aria-label="Clear search"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              <button
                onClick={loadStudents}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-1 transition-all duration-200 whitespace-nowrap"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            </div>
          </div>
        )}

        {/* ==================== MAIN CARD ==================== */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

          {/* ---- LOADING STATE ---- */}
          {loading ? (
            <div className="p-10 sm:p-16">
              <div className="flex flex-col items-center gap-3 mb-8">
                <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                <p className="text-sm font-medium text-slate-600">
                  Loading students...
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
          ) : students.length === 0 ? (
            /* ---- EMPTY STATE ---- */
            <div className="p-10 sm:p-16 text-center">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 flex items-center justify-center mb-5">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                No students found
              </h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                No students have registered on PlacementHub yet.
              </p>
            </div>
          ) : filteredStudents.length === 0 ? (
            /* ---- NO SEARCH MATCH ---- */
            <div className="p-10 sm:p-16 text-center">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">
                No matching students
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
                      Student
                    </th>
                    <th className="p-4 text-left text-[11px] uppercase tracking-wider font-bold text-slate-500">
                      Contact
                    </th>
                    <th className="p-4 text-left text-[11px] uppercase tracking-wider font-bold text-slate-500">
                      College
                    </th>
                    <th className="p-4 text-left text-[11px] uppercase tracking-wider font-bold text-slate-500">
                      Branch
                    </th>
                    <th className="p-4 text-left text-[11px] uppercase tracking-wider font-bold text-slate-500">
                      CGPA
                    </th>
                    <th className="p-4 text-left text-[11px] uppercase tracking-wider font-bold text-slate-500">
                      Graduation
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.map((student) => {
                    const cgpaConfig = getCgpaConfig(student.cgpa);
                    const gradient = getAvatarGradient(student.fullName);

                    return (
                      <tr
                        key={student.id}
                        className="hover:bg-indigo-50/40 transition-colors duration-150 group"
                      >
                        {/* Student */}
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className={`relative w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-xs font-bold shadow-md flex-shrink-0 group-hover:scale-105 transition-transform duration-300`}>
                              {getInitials(student.fullName)}
                              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white"></span>
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-slate-900 truncate text-sm">
                                {student.fullName || "—"}
                              </p>
                              <p className="text-xs text-slate-400 font-mono">
                                ID #{student.id}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Phone */}
                        <td className="p-4">
                          <div className="flex items-center gap-2 text-sm text-slate-700">
                            <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
                              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                            </div>
                            <span className="truncate">{student.phone || "—"}</span>
                          </div>
                        </td>

                        {/* College */}
                        <td className="p-4">
                          <div className="flex items-center gap-2 text-sm text-slate-700">
                            <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 flex-shrink-0">
                              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                              </svg>
                            </div>
                            <span className="truncate max-w-[200px]">
                              {student.college || "—"}
                            </span>
                          </div>
                        </td>

                        {/* Branch */}
                        <td className="p-4">
                          <span className="inline-flex items-center px-2.5 py-1 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-full">
                            {student.branch || "—"}
                          </span>
                        </td>

                        {/* CGPA */}
                        <td className="p-4">
                          <div className="flex flex-col gap-1">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold ${cgpaConfig.bg} ${cgpaConfig.text} ${cgpaConfig.border} border rounded-full w-fit`}>
                              <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                              </svg>
                              {student.cgpa ?? "—"}
                            </span>
                            {!isNaN(parseFloat(student.cgpa)) && (
                              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider pl-1">
                                {cgpaConfig.label}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Graduation */}
                        <td className="p-4">
                          <div className="flex items-center gap-2 text-sm text-slate-700">
                            <div className="w-7 h-7 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600 flex-shrink-0">
                              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <span>{student.graduationYear || "—"}</span>
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
                    {filteredStudents.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-bold text-slate-700">
                    {students.length}
                  </span>{" "}
                  students
                </span>

                {searchTerm && (
                  <span className="text-slate-500">
                    Filtered by:{" "}
                    <span className="font-semibold text-indigo-600">
                      "{searchTerm}"
                    </span>
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

export default AdminStudents;