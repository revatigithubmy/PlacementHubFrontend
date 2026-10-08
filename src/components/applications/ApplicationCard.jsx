import { useNavigate } from "react-router-dom";

function ApplicationCard({ application }) {
  const navigate = useNavigate();

  // ---- Status config ----
  const statusConfig = {
    APPLIED: {
      label: "Applied",
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-200",
      dot: "bg-blue-500",
      gradient: "from-blue-500 to-indigo-500",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    SHORTLISTED: {
      label: "Shortlisted",
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-200",
      dot: "bg-emerald-500",
      gradient: "from-emerald-500 to-teal-500",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    INTERVIEW: {
      label: "Interview Scheduled",
      bg: "bg-purple-50",
      text: "text-purple-700",
      border: "border-purple-200",
      dot: "bg-purple-500",
      gradient: "from-purple-500 to-pink-500",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    REJECTED: {
      label: "Not Selected",
      bg: "bg-red-50",
      text: "text-red-700",
      border: "border-red-200",
      dot: "bg-red-500",
      gradient: "from-red-500 to-rose-500",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      ),
    },
  };

  const statusKey = application.status?.toUpperCase() || "APPLIED";
  const status = statusConfig[statusKey] || statusConfig.APPLIED;

  // ---- Helpers ----
  const getCompanyInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
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

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-indigo-100 transition-all duration-300 overflow-hidden">

      {/* Colored left accent bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${status.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>

      <div className="p-5 sm:p-6">

        {/* Top Row: Company Avatar + Job Info + Status */}
        <div className="flex items-start gap-4">

          {/* Company Avatar */}
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${status.gradient} flex items-center justify-center text-white text-lg font-bold shadow-lg flex-shrink-0 group-hover:scale-105 group-hover:rotate-3 transition-transform duration-300`}>
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
          <div className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold ${status.bg} ${status.text} ${status.border} border rounded-full whitespace-nowrap`}>
            <span className={`w-1.5 h-1.5 rounded-full ${status.dot} ${statusKey === "INTERVIEW" ? "animate-pulse" : ""}`}></span>
            {status.icon}
            {status.label}
          </div>
        </div>

        {/* Mobile Status Badge */}
        <div className="sm:hidden mt-3">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold ${status.bg} ${status.text} ${status.border} border rounded-full`}>
            <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`}></span>
            {status.label}
          </span>
        </div>

        {/* Meta Info Row */}
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
              Applied On
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
            <p className={`text-xs font-semibold ${status.text}`}>
              {status.label}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ApplicationCard;