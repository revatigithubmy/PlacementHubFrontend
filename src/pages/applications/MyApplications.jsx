import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getMyApplications,
  deleteMyApplication,
} from "../../api/applicationApi";

function MyApplications() {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);

  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Load applications
  const loadApplications = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMyApplications();

      console.log("My applications:", data);

      setApplications(data);
    } catch (err) {
      console.error("Error loading applications:", err);

      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Unable to load applications.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  // Delete application
  const handleDelete = async (applicationId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this application?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setDeletingId(applicationId);
      setError("");
      setSuccess("");

      console.log(
        "Deleting application:",
        applicationId
      );

      await deleteMyApplication(applicationId);

      // Remove deleted application from screen
      setApplications((previousApplications) =>
        previousApplications.filter(
          (application) =>
            application.applicationId !== applicationId
        )
      );

      setSuccess(
        "Application deleted successfully."
      );
    } catch (err) {
      console.error(
        "Error deleting application:",
        err
      );

      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError(
          "Unable to delete application."
        );
      }
    } finally {
      setDeletingId(null);
    }
  };

  // ---- Visual helpers ----
  const getCompanyInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
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

  // Status config
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
      PENDING: {
        label: "Pending",
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
        label: "Not Selected",
        bg: "bg-red-50",
        text: "text-red-700",
        border: "border-red-200",
        dot: "bg-red-500",
        gradient: "from-red-500 to-rose-500",
      },
    };
    return configs[key] || configs.APPLIED;
  };

  // ---------- Loading State ----------
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* Back to Dashboard */}
          <button
            onClick={() => navigate("/student/dashboard")}
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
              Loading applications...
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Back to Dashboard */}
        <button
          onClick={() => navigate("/student/dashboard")}
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
                {applications.length} total{" "}
                {applications.length === 1 ? "application" : "applications"}
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                My Applications
              </h1>
              <p className="text-blue-100 mt-2 text-sm sm:text-base max-w-xl">
                Track your job applications and stay updated on their status.
              </p>
            </div>

            <button
              onClick={() => navigate("/student/jobs")}
              className="self-start sm:self-auto flex items-center gap-2 px-5 py-3 bg-white text-indigo-700 font-semibold rounded-xl shadow-lg hover:shadow-xl hover:bg-indigo-50 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600 whitespace-nowrap"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Apply to New Job
            </button>
          </div>
        </div>

        {/* Success Alert */}
        {success && (
          <div className="mb-5 flex items-start gap-3 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl animate-fadeIn">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-emerald-700 font-medium">{success}</p>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-5 flex items-start gap-3 p-3.5 bg-red-50 border border-red-200 rounded-xl animate-shake">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-sm text-red-700 font-medium">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!error && applications.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-10 sm:p-16 text-center">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 flex items-center justify-center mb-5">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              No applications found
            </h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
              You have not applied for any jobs yet. Start exploring opportunities and land your dream job!
            </p>
            <button
              onClick={() => navigate("/student/jobs")}
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg shadow-indigo-300/50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Explore Jobs
            </button>
          </div>
        )}

        {/* Applications List */}
        {applications.length > 0 && (
          <>
            {/* Results Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900">
                All Applications
              </h2>
              <span className="text-sm text-slate-500 font-medium">
                {applications.length}{" "}
                {applications.length === 1 ? "result" : "results"}
              </span>
            </div>

            <div className="space-y-4">
              {applications.map((application) => {
                const statusConfig = getStatusConfig(application.status);
                const isDeleting =
                  deletingId === application.applicationId;

                return (
                  <div
                    key={application.applicationId}
                    className="group relative bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all duration-300 overflow-hidden"
                  >
                    {/* Colored left accent bar */}
                    <div
                      className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${statusConfig.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                    ></div>

                    <div className="p-5 sm:p-6">

                      {/* Top Row */}
                      <div className="flex items-start gap-4">

                        {/* Company Avatar */}
                        <div
                          className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${statusConfig.gradient} flex items-center justify-center text-white text-lg font-bold shadow-lg flex-shrink-0`}
                        >
                          {getCompanyInitials(application.companyName)}
                        </div>

                        {/* Job Title + Company */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-slate-900 text-base sm:text-lg tracking-tight truncate group-hover:text-indigo-700 transition-colors">
                            {application.jobTitle || "Untitled Position"}
                          </h3>
                          <p className="text-sm text-slate-500 mt-0.5 flex items-center gap-1.5 truncate">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            {application.companyName || "Unknown Company"}
                          </p>
                        </div>

                        {/* Status Badge */}
                        <div
                          className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border} border rounded-full whitespace-nowrap`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot} ${
                              statusConfig.label === "Interview" ? "animate-pulse" : ""
                            }`}
                          ></span>
                          {statusConfig.label}
                        </div>
                      </div>

                      {/* Mobile Status Badge */}
                      <div className="sm:hidden mt-3">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border} border rounded-full`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`}></span>
                          {statusConfig.label}
                        </span>
                      </div>

                      {/* Meta Info Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-5 pt-4 border-t border-slate-100">

                        <div className="min-w-0">
                          <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 mb-1">
                            Application ID
                          </p>
                          <p className="text-xs font-semibold text-slate-700 truncate font-mono">
                            #{application.applicationId || "N/A"}
                          </p>
                        </div>

                        <div className="min-w-0">
                          <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 mb-1">
                            Applied At
                          </p>
                          <p className="text-xs font-semibold text-slate-700 truncate flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {formatDate(application.appliedAt)}
                          </p>
                        </div>

                        <div className="min-w-0 hidden sm:block">
                          <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 mb-1">
                            Status
                          </p>
                          <p className={`text-xs font-semibold ${statusConfig.text}`}>
                            {statusConfig.label}
                          </p>
                        </div>
                      </div>

                      {/* Delete Action */}
                      <div className="flex items-center justify-end mt-5 pt-4 border-t border-slate-100">
                        <button
                          onClick={() =>
                            handleDelete(application.applicationId)
                          }
                          disabled={isDeleting}
                          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-red-600 bg-red-50 border border-red-100 rounded-lg hover:bg-red-100 hover:border-red-200 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
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
                              <span>Deleting...</span>
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
                              <span>Delete Application</span>
                            </>
                          )}
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

export default MyApplications;