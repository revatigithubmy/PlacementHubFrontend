import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getMyJobs,
  deleteJob,
} from "../../api/recruiterJobApi";

function MyJobs() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMyJobs();

      console.log("Jobs posted by recruiter:", data);

      if (Array.isArray(data)) {
        setJobs(data);
      } else {
        setJobs([]);
      }
    } catch (err) {
      console.log("Get jobs error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load jobs."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (jobId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this job?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await deleteJob(jobId);

      // Remove job from UI
      setJobs((previousJobs) =>
        previousJobs.filter(
          (job) => (job.jobId ?? job.id) !== jobId
        )
      );
    } catch (err) {
      console.log("Delete job error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to delete job."
      );
    }
  };

  // ---- Visual helpers ----
  const getInitials = (text) => {
    if (!text) return "?";
    return text
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const getJobTypeColor = (type) => {
    const t = (type || "").toLowerCase();
    if (t.includes("full")) return { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-500" };
    if (t.includes("part")) return { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", dot: "bg-amber-500" };
    if (t.includes("intern")) return { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200", dot: "bg-purple-500" };
    if (t.includes("contract")) return { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200", dot: "bg-orange-500" };
    if (t.includes("remote")) return { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", dot: "bg-blue-500" };
    return { bg: "bg-slate-50", text: "text-slate-700", border: "border-slate-200", dot: "bg-slate-500" };
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  // ---------- Loading State ----------
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* Back to Dashboard */}
          <button
            onClick={() => navigate("/recruiter/dashboard")}
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
              Loading jobs...
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Back to Dashboard */}
        <button
          onClick={() => navigate("/recruiter/dashboard")}
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
                {jobs.length} active {jobs.length === 1 ? "posting" : "postings"}
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                My Jobs
              </h1>
              <p className="text-blue-100 mt-2 text-sm sm:text-base max-w-xl">
                Manage all jobs posted by your company — edit, review applicants, or create new openings.
              </p>
            </div>

            <button
              onClick={() => navigate("/recruiter/jobs/create")}
              className="self-start sm:self-auto flex items-center gap-2 px-5 py-3 bg-white text-indigo-700 font-semibold rounded-xl shadow-lg hover:shadow-xl hover:bg-indigo-50 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600 whitespace-nowrap"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Create New Job
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 flex items-start gap-3 p-3.5 bg-red-50 border border-red-200 rounded-xl animate-shake">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-sm text-red-700 font-medium">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {jobs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-10 sm:p-16 text-center">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 flex items-center justify-center mb-5">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              No Jobs Found
            </h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
              You have not posted any jobs yet. Create your first job posting to start receiving applications.
            </p>
            <button
              onClick={() => navigate("/recruiter/jobs/create")}
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg shadow-indigo-300/50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Create Your First Job
            </button>
          </div>
        ) : (
          <>
            {/* Results Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900">
                All Job Postings
              </h2>
              <span className="text-sm text-slate-500 font-medium">
                {jobs.length} {jobs.length === 1 ? "job" : "jobs"}
              </span>
            </div>

            {/* Jobs List */}
            <div className="space-y-5">
              {jobs.map((job) => {
                const jobId = job.jobId ?? job.id;
                const typeColor = getJobTypeColor(job.jobType);

                return (
                  <div
                    key={jobId}
                    className="group relative bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all duration-300 overflow-hidden"
                  >
                    {/* Top gradient accent bar */}
                    <div className="h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500"></div>

                    <div className="p-5 sm:p-6">

                      {/* Header Row */}
                      <div className="flex items-start gap-4 flex-wrap">

                        {/* Company Avatar */}
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-lg font-bold shadow-lg flex-shrink-0 group-hover:scale-105 group-hover:rotate-3 transition-transform duration-300">
                          {getInitials(job.title)}
                        </div>

                        {/* Title + Job Type */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-slate-900 text-base sm:text-lg tracking-tight truncate group-hover:text-indigo-700 transition-colors">
                            {job.title}
                          </h3>

                          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                            {job.jobType && (
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${typeColor.bg} ${typeColor.text} ${typeColor.border} border rounded-full`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${typeColor.dot}`}></span>
                                {job.jobType}
                              </span>
                            )}
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold text-slate-500 bg-slate-50 border border-slate-200 rounded-full">
                              ID: #{jobId}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      {job.description && (
                        <p className="text-sm text-slate-600 leading-relaxed mt-4 line-clamp-2">
                          {job.description}
                        </p>
                      )}

                      {/* Meta Info Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-100">

                        {/* Location */}
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </div>
                          <div className="min-w-0">
                            <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">Location</p>
                            <p className="text-xs font-semibold text-slate-900 truncate">{job.location || "N/A"}</p>
                          </div>
                        </div>

                        {/* Salary */}
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 flex-shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div className="min-w-0">
                            <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">Salary</p>
                            <p className="text-xs font-semibold text-slate-900 truncate">{job.salary ?? "Not specified"}</p>
                          </div>
                        </div>

                        {/* Experience */}
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600 flex-shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div className="min-w-0">
                            <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">Experience</p>
                            <p className="text-xs font-semibold text-slate-900 truncate">{job.experienceRequired || "Not specified"}</p>
                          </div>
                        </div>

                        {/* Deadline */}
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600 flex-shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div className="min-w-0">
                            <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">Deadline</p>
                            <p className="text-xs font-semibold text-slate-900 truncate">{formatDate(job.applicationDeadline)}</p>
                          </div>
                        </div>
                      </div>

                      {/* Skills */}
                      {job.skills && (
                        <div className="mt-4 pt-4 border-t border-slate-100">
                          <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 mb-2">
                            Required Skills
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {job.skills.split(",").map((skill, i) => (
                              <span
                                key={i}
                                className="inline-flex items-center px-2.5 py-1 text-[11px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-full hover:bg-indigo-100 transition-colors"
                              >
                                {skill.trim()}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex flex-wrap items-center gap-2 mt-5 pt-4 border-t border-slate-100">

                        {/* Edit */}
                        <button
                          onClick={() => navigate(`/recruiter/jobs/${jobId}/edit`)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-1 transition-all duration-200"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </button>

                        {/* View Applicants */}
                        <button
                          onClick={() => navigate(`/recruiter/jobs/${jobId}/applications`)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-md shadow-indigo-300/50 hover:shadow-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          View Applicants
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => handleDelete(jobId)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 ml-auto text-xs font-semibold text-red-600 bg-red-50 border border-red-100 rounded-lg hover:bg-red-100 hover:border-red-200 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1 transition-all duration-200"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </button>
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

export default MyJobs;