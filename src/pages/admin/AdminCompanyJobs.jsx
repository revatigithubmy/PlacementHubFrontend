import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getCompanyJobs } from "../../api/adminApi";

function AdminCompanyJobs() {
  const { companyId } = useParams();
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadJobs();
  }, [companyId]);

  const loadJobs = async () => {
    try {
      const data = await getCompanyJobs(companyId);

      setJobs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ==================== VISUAL HELPERS (UI ONLY) ====================

  const getInitials = (title) => {
    if (!title) return "?";
    return title
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const getJobGradient = (title) => {
    const gradients = [
      "from-blue-500 to-indigo-500",
      "from-emerald-500 to-teal-500",
      "from-purple-500 to-pink-500",
      "from-orange-500 to-amber-500",
      "from-rose-500 to-red-500",
      "from-cyan-500 to-blue-500",
      "from-violet-500 to-purple-500",
    ];
    if (!title) return gradients[0];
    const idx = title.charCodeAt(0) % gradients.length;
    return gradients[idx];
  };

  const getJobTypeConfig = (type) => {
    const t = (type || "").toUpperCase();
    const configs = {
      FULL_TIME: {
        label: "Full Time",
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        border: "border-emerald-100",
        dot: "bg-emerald-500",
      },
      PART_TIME: {
        label: "Part Time",
        bg: "bg-amber-50",
        text: "text-amber-700",
        border: "border-amber-100",
        dot: "bg-amber-500",
      },
      INTERNSHIP: {
        label: "Internship",
        bg: "bg-purple-50",
        text: "text-purple-700",
        border: "border-purple-100",
        dot: "bg-purple-500",
      },
      CONTRACT: {
        label: "Contract",
        bg: "bg-orange-50",
        text: "text-orange-700",
        border: "border-orange-100",
        dot: "bg-orange-500",
      },
      REMOTE: {
        label: "Remote",
        bg: "bg-blue-50",
        text: "text-blue-700",
        border: "border-blue-100",
        dot: "bg-blue-500",
      },
    };
    return (
      configs[t] || {
        label: type || "N/A",
        bg: "bg-slate-50",
        text: "text-slate-700",
        border: "border-slate-100",
        dot: "bg-slate-500",
      }
    );
  };

  // ==================== CLIENT-SIDE FILTER ====================

  const filteredJobs = jobs.filter((job) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    const jobId = job.id ?? job.jobId;
    return (
      (job.title || "").toLowerCase().includes(term) ||
      (job.location || "").toLowerCase().includes(term) ||
      (job.jobType || "").toLowerCase().includes(term) ||
      String(jobId || "").includes(term)
    );
  });

  // ==================== DERIVED STATS ====================

  const totalJobs = jobs.length;
  const fullTimeCount = jobs.filter(
    (j) => (j.jobType || "").toUpperCase() === "FULL_TIME"
  ).length;
  const internshipCount = jobs.filter(
    (j) => (j.jobType || "").toUpperCase() === "INTERNSHIP"
  ).length;
  const uniqueLocations = new Set(
    jobs.map((j) => j.location).filter(Boolean)
  ).size;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">

        {/* ==================== BACK BUTTON ==================== */}
        <button
          onClick={() => navigate("/admin/companies")}
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
          Back to Companies
        </button>

        {/* ==================== HERO HEADER ==================== */}
        <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-2xl p-6 sm:p-8 mb-6 shadow-xl shadow-indigo-300/30">
          <div className="absolute top-[-40%] right-[-5%] w-64 h-64 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-[-50%] left-[15%] w-72 h-72 bg-white/10 rounded-full blur-2xl"></div>

          <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
            <div>
              <p className="text-blue-100 text-sm font-medium mb-1 flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                {totalJobs} active {totalJobs === 1 ? "job" : "jobs"}
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Company Jobs
              </h1>
              <p className="text-blue-100 mt-2 text-sm sm:text-base max-w-xl">
                All jobs posted by Company ID:{" "}
                <span className="font-semibold text-white">#{companyId}</span>
              </p>
            </div>

            <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-xl px-5 py-4 text-white self-start sm:self-auto">
              <p className="text-xs text-blue-100 font-medium">Total Jobs</p>
              <p className="text-3xl font-bold tracking-tight mt-0.5">
                {totalJobs}
              </p>
            </div>
          </div>
        </div>

        {/* ==================== QUICK STATS ==================== */}
        {!loading && jobs.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Total */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-300/50 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-[10px] font-semibold px-2 py-1 rounded-full bg-blue-50 text-blue-600">
                  Total
                </span>
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                {totalJobs}
              </p>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                Active Jobs
              </p>
            </div>

            {/* Full-time */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-300/50 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-[10px] font-semibold px-2 py-1 rounded-full bg-emerald-50 text-emerald-600">
                  Full Time
                </span>
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                {fullTimeCount}
              </p>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                Full-time Roles
              </p>
            </div>

            {/* Internships */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white shadow-md shadow-purple-300/50 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  </svg>
                </div>
                <span className="text-[10px] font-semibold px-2 py-1 rounded-full bg-purple-50 text-purple-600">
                  Intern
                </span>
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                {internshipCount}
              </p>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                Internships
              </p>
            </div>

            {/* Locations */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-300/50 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span className="text-[10px] font-semibold px-2 py-1 rounded-full bg-orange-50 text-orange-600">
                  Cities
                </span>
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                {uniqueLocations}
              </p>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                Locations
              </p>
            </div>
          </div>
        )}

        {/* ==================== SEARCH BAR ==================== */}
        {!loading && jobs.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-5 mb-5">
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
                  placeholder="Search by job title, location, or type..."
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
                onClick={loadJobs}
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
                Refresh
              </button>
            </div>
          </div>
        )}

        {/* ==================== CONTENT ==================== */}
        {loading ? (
          /* ---- LOADING ---- */
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-10 sm:p-16">
            <div className="flex flex-col items-center gap-3 mb-8">
              <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
              <p className="text-sm font-medium text-slate-600">
                Loading jobs...
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-52 bg-slate-100 rounded-2xl shimmer"
                ></div>
              ))}
            </div>
          </div>
        ) : jobs.length === 0 ? (
          /* ---- EMPTY ---- */
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-10 sm:p-16 text-center">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 flex items-center justify-center mb-5">
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
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              No jobs found
            </h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              This company hasn't posted any jobs yet.
            </p>
          </div>
        ) : filteredJobs.length === 0 ? (
          /* ---- NO SEARCH MATCH ---- */
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-10 sm:p-16 text-center">
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
              No matching jobs
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
          /* ---- JOB GRID ---- */
          <>
            {/* Results Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900">
                All Jobs
              </h2>
              <span className="text-sm text-slate-500 font-medium">
                {filteredJobs.length}{" "}
                {filteredJobs.length === 1 ? "result" : "results"}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredJobs.map((job) => {
                const jobId = job.id ?? job.jobId;
                const gradient = getJobGradient(job.title);
                const typeConfig = getJobTypeConfig(job.jobType);

                return (
                  <div
                    key={jobId}
                    className="group relative bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-indigo-100 transition-all duration-300 overflow-hidden"
                  >
                    {/* Top gradient accent bar */}
                    <div
                      className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${gradient} scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500`}
                    ></div>

                    <div className="p-6">

                      {/* Header: Avatar + Job Type */}
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div
                          className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-lg font-bold shadow-lg flex-shrink-0 group-hover:scale-105 group-hover:rotate-3 transition-transform duration-300`}
                        >
                          {getInitials(job.title)}
                          <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-white"></span>
                        </div>

                        {job.jobType && (
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${typeConfig.bg} ${typeConfig.text} ${typeConfig.border} border rounded-full`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${typeConfig.dot}`}
                            ></span>
                            {typeConfig.label}
                          </span>
                        )}
                      </div>

                      {/* Job Title */}
                      <h3 className="text-lg font-bold text-slate-900 tracking-tight truncate group-hover:text-indigo-700 transition-colors">
                        {job.title || "Untitled Job"}
                      </h3>

                      {/* Job ID */}
                      <p className="text-xs text-slate-400 font-mono mt-0.5">
                        Job ID #{jobId}
                      </p>

                      {/* Meta Grid */}
                      <div className="space-y-3 mt-4 pt-4 border-t border-slate-100">

                        {/* Location */}
                        <div className="flex items-center gap-2.5 text-sm text-slate-600">
                          <div className="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600 flex-shrink-0">
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
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                          </div>
                          <span className="truncate">
                            {job.location || "Location not specified"}
                          </span>
                        </div>

                        {/* Type */}
                        {job.jobType && (
                          <div className="flex items-center gap-2.5 text-sm text-slate-600">
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
                                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                />
                              </svg>
                            </div>
                            <span className="truncate">{typeConfig.label}</span>
                          </div>
                        )}
                      </div>

                      {/* Action */}
                      <button
                        onClick={() =>
                          navigate(`/admin/jobs/${jobId}/applications`)
                        }
                        className="w-full mt-5 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-md shadow-indigo-300/50 hover:shadow-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
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
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                          />
                        </svg>
                        View Applications
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer summary */}
            <div className="mt-6 bg-white rounded-xl border border-slate-100 shadow-sm px-4 sm:px-6 py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs">
              <span className="text-slate-500">
                Showing{" "}
                <span className="font-bold text-slate-700">
                  {filteredJobs.length}
                </span>{" "}
                of{" "}
                <span className="font-bold text-slate-700">
                  {jobs.length}
                </span>{" "}
                jobs
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
          </>
        )}

      </div>
    </div>
  );
}

export default AdminCompanyJobs;