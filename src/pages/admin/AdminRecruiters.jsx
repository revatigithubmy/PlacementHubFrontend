import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getAllRecruiters } from "../../api/adminApi";

function AdminRecruiters() {
  const navigate = useNavigate();

  const [recruiters, setRecruiters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadRecruiters();
  }, []);

  const loadRecruiters = async () => {
    try {
      const data = await getAllRecruiters();

      setRecruiters(Array.isArray(data) ? data : []);
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
      "from-purple-500 to-pink-500",
      "from-blue-500 to-indigo-500",
      "from-emerald-500 to-teal-500",
      "from-orange-500 to-amber-500",
      "from-rose-500 to-red-500",
      "from-cyan-500 to-blue-500",
    ];
    if (!name) return gradients[0];
    const idx = name.charCodeAt(0) % gradients.length;
    return gradients[idx];
  };

  const getDesignationStyle = (designation) => {
    const d = (designation || "").toLowerCase();
    if (d.includes("hr") || d.includes("human"))
      return { bg: "bg-pink-50", text: "text-pink-700", border: "border-pink-100" };
    if (d.includes("tech") || d.includes("engineer") || d.includes("cto"))
      return { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-100" };
    if (d.includes("manager") || d.includes("lead"))
      return { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-100" };
    if (d.includes("ceo") || d.includes("founder") || d.includes("director"))
      return { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-100" };
    return { bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-100" };
  };

  // ==================== CLIENT-SIDE FILTER ====================

  const filteredRecruiters = recruiters.filter((r) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      (r.fullName || "").toLowerCase().includes(term) ||
      (r.designation || "").toLowerCase().includes(term) ||
      (r.phone || "").toLowerCase().includes(term) ||
      String(r.id || "").includes(term)
    );
  });

  // ==================== DERIVED STATS ====================

  const totalRecruiters = recruiters.length;
  const uniqueDesignations = new Set(
    recruiters.map((r) => r.designation).filter(Boolean)
  ).size;
  const withPhone = recruiters.filter((r) => r.phone && r.phone.trim()).length;
  const completionRate =
    totalRecruiters > 0
      ? Math.round((withPhone / totalRecruiters) * 100)
      : 0;

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
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Dashboard
        </button>

        {/* ==================== HERO HEADER ==================== */}
        <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-pink-600 to-rose-500 rounded-2xl p-6 sm:p-8 mb-6 shadow-xl shadow-purple-300/30">
          <div className="absolute top-[-40%] right-[-5%] w-64 h-64 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-[-50%] left-[15%] w-72 h-72 bg-white/10 rounded-full blur-2xl"></div>

          <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
            <div>
              <p className="text-pink-100 text-sm font-medium mb-1 flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                {totalRecruiters} registered{" "}
                {totalRecruiters === 1 ? "recruiter" : "recruiters"}
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                All Recruiters
              </h1>
              <p className="text-pink-100 mt-2 text-sm sm:text-base max-w-xl">
                Browse, search, and manage every recruiter registered on PlacementHub.
              </p>
            </div>

            <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-xl px-5 py-4 text-white self-start sm:self-auto">
              <p className="text-xs text-pink-100 font-medium">
                Total Recruiters
              </p>
              <p className="text-3xl font-bold tracking-tight mt-0.5">
                {totalRecruiters}
              </p>
            </div>
          </div>
        </div>

        {/* ==================== QUICK STATS ==================== */}
        {!loading && recruiters.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Total */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white shadow-md shadow-purple-300/50 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-[10px] font-semibold px-2 py-1 rounded-full bg-purple-50 text-purple-600">
                  Total
                </span>
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                {totalRecruiters}
              </p>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                Registered
              </p>
            </div>

            {/* Designations */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-300/50 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <span className="text-[10px] font-semibold px-2 py-1 rounded-full bg-blue-50 text-blue-600">
                  Unique
                </span>
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                {uniqueDesignations}
              </p>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                Designations
              </p>
            </div>

            {/* With Phone */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-300/50 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <span className="text-[10px] font-semibold px-2 py-1 rounded-full bg-emerald-50 text-emerald-600">
                  With Phone
                </span>
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                {withPhone}
              </p>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                Contactable
              </p>
            </div>

            {/* Completion */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-300/50 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-[10px] font-semibold px-2 py-1 rounded-full bg-orange-50 text-orange-600">
                  Profile
                </span>
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                {completionRate}%
              </p>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                Completion Rate
              </p>
            </div>
          </div>
        )}

        {/* ==================== SEARCH BAR ==================== */}
        {!loading && recruiters.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-5 mb-5">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1 group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-slate-400 group-focus-within:text-purple-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name, designation, phone, or ID..."
                  className="w-full pl-12 pr-10 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-white transition-all duration-200"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-purple-600 transition-colors"
                    aria-label="Clear search"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              <button
                onClick={loadRecruiters}
                className="group inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 hover:text-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-1 transition-all duration-200 whitespace-nowrap"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
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
                <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                <p className="text-sm font-medium text-slate-600">
                  Loading recruiters...
                </p>
              </div>

              <div className="space-y-3 max-w-3xl mx-auto">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-16 bg-slate-100 rounded-xl shimmer"></div>
                ))}
              </div>
            </div>
          ) : recruiters.length === 0 ? (
            /* ---- EMPTY ---- */
            <div className="p-10 sm:p-16 text-center">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-purple-100 via-pink-100 to-rose-100 flex items-center justify-center mb-5">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                No recruiters found
              </h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                No recruiters have registered on PlacementHub yet.
              </p>
            </div>
          ) : filteredRecruiters.length === 0 ? (
            /* ---- NO SEARCH MATCH ---- */
            <div className="p-10 sm:p-16 text-center">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">
                No matching recruiters
              </h3>
              <p className="text-sm text-slate-500 mb-4">
                Try a different search keyword.
              </p>
              <button
                onClick={() => setSearchTerm("")}
                className="px-5 py-2.5 text-sm font-semibold text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors"
              >
                Clear Search
              </button>
            </div>
          ) : (
            /* ---- TABLE ---- */
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="bg-gradient-to-r from-slate-50 to-slate-100/50 border-b border-slate-200">
                    <th className="p-4 text-left text-[11px] uppercase tracking-wider font-bold text-slate-500">
                      Recruiter
                    </th>
                    <th className="p-4 text-left text-[11px] uppercase tracking-wider font-bold text-slate-500">
                      Contact
                    </th>
                    <th className="p-4 text-left text-[11px] uppercase tracking-wider font-bold text-slate-500">
                      Designation
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredRecruiters.map((recruiter) => {
                    const gradient = getAvatarGradient(recruiter.fullName);
                    const designationStyle = getDesignationStyle(recruiter.designation);

                    return (
                      <tr
                        key={recruiter.id}
                        className="hover:bg-purple-50/40 transition-colors duration-150 group"
                      >
                        {/* Recruiter */}
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className={`relative w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-xs font-bold shadow-md flex-shrink-0 group-hover:scale-105 transition-transform duration-300`}>
                              {getInitials(recruiter.fullName)}
                              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white"></span>
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-slate-900 truncate text-sm">
                                {recruiter.fullName || "—"}
                              </p>
                              <p className="text-xs text-slate-400 font-mono">
                                ID #{recruiter.id}
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
                            <span className="truncate">{recruiter.phone || "—"}</span>
                          </div>
                        </td>

                        {/* Designation */}
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold ${designationStyle.bg} ${designationStyle.text} ${designationStyle.border} border rounded-full`}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            {recruiter.designation || "—"}
                          </span>
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
                    {filteredRecruiters.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-bold text-slate-700">
                    {recruiters.length}
                  </span>{" "}
                  recruiters
                </span>

                {searchTerm && (
                  <span className="text-slate-500">
                    Filtered by:{" "}
                    <span className="font-semibold text-purple-600">
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

export default AdminRecruiters;