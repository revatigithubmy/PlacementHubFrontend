import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getJobApplications } from "../../api/recruiterApplicationApi";

function JobApplicants() {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadApplications();
  }, [jobId]);

  const loadApplications = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getJobApplications(jobId);

      console.log("Job applications:", data);

      if (Array.isArray(data)) {
        setApplications(data);
      } else {
        setApplications([]);
      }
    } catch (err) {
      console.log("Get applications error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load applications."
      );
    } finally {
      setLoading(false);
    }
  };

  // ---- Visual helpers ----
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

  const getStatusConfig = (status) => {
    const key = (status || "").toUpperCase();
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
    return configs[key] || configs.APPLIED;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not available";
    try {
      return new Date(dateString).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Not available";
    }
  };

  // ---------- Loading ----------
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          <button
            onClick={() => navigate("/recruiter/jobs")}
            className="inline-flex items-center gap-2 px-4 py-2 mb-5 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to My Jobs
          </button>

          <div className="flex flex-col items-center gap-3 py-20">
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="text-sm font-medium text-slate-600">Loading applications...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Back to My Jobs */}
        <button
          onClick={() => navigate("/recruiter/jobs")}
          className="inline-flex items-center gap-2 px-4 py-2 mb-5 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to My Jobs
        </button>

        {/* Hero Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-6 sm:p-8 mb-6 shadow-xl shadow-indigo-300/30">
          <div className="absolute top-[-40%] right-[-5%] w-64 h-64 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-[-50%] left-[15%] w-72 h-72 bg-white/10 rounded-full blur-2xl"></div>

          <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
            <div>
              <p className="text-blue-100 text-sm font-medium mb-1 flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                {applications.length} {applications.length === 1 ? "applicant" : "applicants"}
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Job Applicants
              </h1>
              <p className="text-blue-100 mt-2 text-sm sm:text-base max-w-xl">
                Applications received for Job ID: <span className="font-semibold text-white">#{jobId}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 flex items-start gap-3 p-3.5 bg-red-50 border border-red-200 rounded-xl animate-shake">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-sm text-red-700 font-medium">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {applications.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-10 sm:p-16 text-center">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 flex items-center justify-center mb-5">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              No Applications Found
            </h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              No students have applied for this job yet. Share the job posting to attract applicants.
            </p>
          </div>
        ) : (
          <>
            {/* Results Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900">All Applicants</h2>
              <span className="text-sm text-slate-500 font-medium">
                {applications.length} {applications.length === 1 ? "result" : "results"}
              </span>
            </div>

            {/* Applications Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {applications.map((application) => {
                const applicationId = application.applicationId ?? application.id;
                const statusConfig = getStatusConfig(application.status);

                return (
                  <div
                    key={applicationId}
                    className="group relative bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-indigo-100 transition-all duration-300 overflow-hidden"
                  >
                    {/* Colored left accent */}
                    <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${statusConfig.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>

                    <div className="p-5">

                      {/* Header */}
                      <div className="flex items-start gap-3 mb-4">
                        {/* Avatar */}
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${statusConfig.gradient} flex items-center justify-center text-white text-base font-bold shadow-md flex-shrink-0 group-hover:scale-105 group-hover:rotate-3 transition-transform duration-300`}>
                          {getInitials(application.studentName || "Student")}
                        </div>

                        {/* Name + Status */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-slate-900 text-base truncate group-hover:text-indigo-700 transition-colors">
                            {application.studentName || "Student"}
                          </h3>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Application #{applicationId}
                          </p>
                        </div>
                      </div>

                      {/* Status badge */}
                      <div className="mb-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border} border rounded-full`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot} ${statusConfig.status === "INTERVIEW" ? "animate-pulse" : ""}`}></span>
                          {statusConfig.label}
                        </span>
                      </div>

                      {/* Meta grid */}
                      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100">

                        <div className="min-w-0">
                          <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 mb-0.5">
                            Job
                          </p>
                          <p className="text-xs font-semibold text-slate-700 truncate">
                            {application.jobTitle || "N/A"}
                          </p>
                        </div>

                        <div className="min-w-0">
                          <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 mb-0.5">
                            Company
                          </p>
                          <p className="text-xs font-semibold text-slate-700 truncate">
                            {application.companyName || "N/A"}
                          </p>
                        </div>

                        <div className="col-span-2 min-w-0">
                          <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 mb-0.5">
                            Applied On
                          </p>
                          <p className="text-xs font-semibold text-slate-700 flex items-center gap-1 truncate">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {formatDate(application.appliedAt)}
                          </p>
                        </div>
                      </div>

                      {/* Action */}
                      <button
                        onClick={() => navigate(`/recruiter/applications/${applicationId}`)}
                        className="w-full mt-4 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-md shadow-indigo-300/50 hover:shadow-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        View Application
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Footer Navigation */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => navigate("/recruiter/jobs")}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 hover:text-indigo-600 transition-all duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            My Jobs
          </button>

          <button
            onClick={() => navigate("/recruiter/dashboard")}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 hover:text-indigo-600 transition-all duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Dashboard
          </button>
        </div>

      </main>
    </div>
  );
}

export default JobApplicants;