import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getApplicationDetails,
  updateApplicationStatus,
} from "../../api/recruiterApplicationApi";

function ApplicationDetails() {
  const { applicationId } = useParams();
  const navigate = useNavigate();

  const [application, setApplication] = useState(null);

  const [status, setStatus] = useState("");

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadApplication();
  }, [applicationId]);

  const loadApplication = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getApplicationDetails(applicationId);

      console.log("Application details:", data);

      setApplication(data);

      setStatus(data.status || "");
    } catch (err) {
      console.log("Application details error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load application details."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!status) {
      setError("Please select an application status.");
      return;
    }

    try {
      setUpdating(true);
      setError("");
      setMessage("");

      const updatedApplication = await updateApplicationStatus(
        applicationId,
        status
      );

      console.log("Updated application:", updatedApplication);

      // If backend returns updated application
      if (updatedApplication) {
        setApplication(updatedApplication);

        if (updatedApplication.status) {
          setStatus(updatedApplication.status);
        }
      } else {
        setApplication((previous) => ({
          ...previous,
          status: status,
        }));
      }

      setMessage("Application status updated successfully.");
    } catch (err) {
      console.log("Update application status error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to update application status."
      );
    } finally {
      setUpdating(false);
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
      APPLIED: { label: "Applied", bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", dot: "bg-blue-500", gradient: "from-blue-500 to-indigo-500" },
      UNDER_REVIEW: { label: "Under Review", bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", dot: "bg-amber-500", gradient: "from-amber-500 to-orange-500" },
      SHORTLISTED: { label: "Shortlisted", bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-500", gradient: "from-emerald-500 to-teal-500" },
      INTERVIEW: { label: "Interview", bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200", dot: "bg-purple-500", gradient: "from-purple-500 to-pink-500" },
      SELECTED: { label: "Selected", bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-500", gradient: "from-emerald-500 to-teal-500" },
      REJECTED: { label: "Rejected", bg: "bg-red-50", text: "text-red-700", border: "border-red-200", dot: "bg-red-500", gradient: "from-red-500 to-rose-500" },
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
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

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
            <p className="text-sm font-medium text-slate-600">
              Loading application...
            </p>
          </div>
        </main>
      </div>
    );
  }

  // ---------- Not Found ----------
  if (!application) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            Application not found
          </h2>
          <p className="text-sm text-slate-500 mb-6">{error || "The application you're looking for doesn't exist."}</p>
          <button
            onClick={() => navigate("/recruiter/jobs")}
            className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
          >
            Back to My Jobs
          </button>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(application.status);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Back to Applicants */}
        <button
          onClick={() => navigate(`/recruiter/jobs/${application.jobId}/applications`)}
          className="inline-flex items-center gap-2 px-4 py-2 mb-5 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Applicants
        </button>

        {/* Page Heading */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Application Details
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Review the applicant and manage their application status.
          </p>
        </div>

        {/* Alerts */}
        {message && (
          <div className="mb-5 flex items-start gap-3 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl animate-fadeIn">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-emerald-700 font-medium">{message}</p>
          </div>
        )}

        {error && (
          <div className="mb-5 flex items-start gap-3 p-3.5 bg-red-50 border border-red-200 rounded-xl animate-shake">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-sm text-red-700 font-medium">{error}</p>
          </div>
        )}

        {/* Applicant Header Card */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-6 sm:p-8 mb-6 shadow-xl shadow-indigo-300/30">
          <div className="absolute top-[-40%] right-[-5%] w-64 h-64 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-[-50%] left-[15%] w-72 h-72 bg-white/10 rounded-full blur-2xl"></div>

          <div className="relative flex flex-col sm:flex-row items-center sm:items-end gap-5">

            {/* Avatar */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white/20 backdrop-blur-md border-2 border-white/40 flex items-center justify-center text-white text-2xl sm:text-3xl font-bold shadow-lg flex-shrink-0">
              {getInitials(application.studentName || "Student")}
            </div>

            {/* Info */}
            <div className="flex-1 text-center sm:text-left pb-1 min-w-0">
              <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold text-white bg-white/20 backdrop-blur-md rounded-full uppercase tracking-wider mb-2`}>
                <span className={`w-1.5 h-1.5 rounded-full bg-white ${statusConfig.label === "Interview" ? "animate-pulse" : ""}`}></span>
                {statusConfig.label}
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight truncate">
                {application.studentName || "Student"}
              </h2>
              <p className="text-blue-100 text-sm mt-1 truncate">
                Applied for <span className="font-semibold text-white">{application.jobTitle || "a position"}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left — Details (2 cols) */}
          <div className="lg:col-span-2 space-y-6">

            {/* Applicant Info */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-7">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-300/50">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Applicant Information</h3>
                  <p className="text-xs text-slate-500">Student details</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 mb-1">Student Name</p>
                  <p className="text-sm font-semibold text-slate-900 truncate">
                    {application.studentName || "Not available"}
                  </p>
                </div>

                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 mb-1">Student ID</p>
                  <p className="text-sm font-semibold text-slate-900 truncate font-mono">
                    {application.studentId || "Not available"}
                  </p>
                </div>
              </div>
            </div>

            {/* Job Info */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-7">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white shadow-md shadow-purple-300/50">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Job Information</h3>
                  <p className="text-xs text-slate-500">Position applied for</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 mb-1">Job Title</p>
                  <p className="text-sm font-semibold text-slate-900 truncate">
                    {application.jobTitle || "Not available"}
                  </p>
                </div>

                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 mb-1">Job ID</p>
                  <p className="text-sm font-semibold text-slate-900 truncate font-mono">
                    #{application.jobId || "N/A"}
                  </p>
                </div>

                <div className="sm:col-span-2 min-w-0">
                  <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 mb-1">Company</p>
                  <p className="text-sm font-semibold text-slate-900 truncate">
                    {application.companyName || "Not available"}
                  </p>
                </div>
              </div>
            </div>

            {/* Application Info */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-7">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-300/50">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Application Information</h3>
                  <p className="text-xs text-slate-500">Metadata</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 mb-1">Application ID</p>
                  <p className="text-sm font-semibold text-slate-900 truncate font-mono">
                    #{application.applicationId || application.id}
                  </p>
                </div>

                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 mb-1">Applied At</p>
                  <p className="text-sm font-semibold text-slate-900 truncate flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {formatDate(application.appliedAt)}
                  </p>
                </div>

                <div className="sm:col-span-2 min-w-0">
                  <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 mb-1">Current Status</p>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold uppercase tracking-wider ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border} border rounded-full`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`}></span>
                    {statusConfig.label}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right — Status Update (1 col) */}
          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-md shadow-indigo-300/50">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Update Status</h3>
                  <p className="text-xs text-slate-500">Move candidate forward</p>
                </div>
              </div>

              {/* Select */}
              <label htmlFor="status" className="block text-xs font-semibold text-slate-700 mb-2">
                Application Status
              </label>
              <div className="relative group mb-4">
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  disabled={updating}
                  className="w-full pl-3.5 pr-10 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all duration-200 appearance-none cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <option value="">Select Status</option>
                  <option value="APPLIED">Applied</option>
                  <option value="UNDER_REVIEW">Under Review</option>
                  <option value="SHORTLISTED">Shortlisted</option>
                  <option value="INTERVIEW">Interview</option>
                  <option value="SELECTED">Selected</option>
                  <option value="REJECTED">Rejected</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Status Preview */}
              {status && (
                <div className="mb-4 p-3 bg-slate-50 rounded-lg animate-fadeIn">
                  <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 mb-1.5">
                    Preview
                  </p>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold uppercase tracking-wider ${getStatusConfig(status).bg} ${getStatusConfig(status).text} ${getStatusConfig(status).border} border rounded-full`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${getStatusConfig(status).dot}`}></span>
                    {getStatusConfig(status).label}
                  </span>
                </div>
              )}

              {/* Update button */}
              <button
                onClick={handleStatusUpdate}
                disabled={updating || !status}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-xl shadow-lg shadow-indigo-300/50 hover:shadow-xl hover:shadow-indigo-400/50 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
              >
                {updating ? (
                  <>
                    <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Update Status</span>
                  </>
                )}
              </button>
            </div>

            {/* Navigation */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-md shadow-amber-300/50">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Quick Links</h3>
                  <p className="text-xs text-slate-500">Jump to other pages</p>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => navigate(`/recruiter/jobs/${application.jobId}/applications`)}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 hover:border-slate-300 hover:text-indigo-600 transition-all duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Back to Applicants
                </button>

                <button
                  onClick={() => navigate("/recruiter/jobs")}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 hover:border-slate-300 hover:text-indigo-600 transition-all duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  My Jobs
                </button>

                <button
                  onClick={() => navigate("/recruiter/dashboard")}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 hover:border-slate-300 hover:text-indigo-600 transition-all duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Dashboard
                </button>
              </div>
            </div>

          </aside>
        </div>

      </main>
    </div>
  );
}

export default ApplicationDetails;