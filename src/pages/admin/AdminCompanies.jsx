import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getAllCompanies,
  getCompanyJobs,
} from "../../api/adminApi";

function AdminCompanies() {
  const navigate = useNavigate();

  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      const data = await getAllCompanies();

      setCompanies(Array.isArray(data) ? data : []);
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

  const getCompanyGradient = (name) => {
    const gradients = [
      "from-blue-500 to-indigo-500",
      "from-emerald-500 to-teal-500",
      "from-purple-500 to-pink-500",
      "from-orange-500 to-amber-500",
      "from-rose-500 to-red-500",
      "from-cyan-500 to-blue-500",
      "from-violet-500 to-purple-500",
      "from-lime-500 to-emerald-500",
    ];
    if (!name) return gradients[0];
    const idx = name.charCodeAt(0) % gradients.length;
    return gradients[idx];
  };

  const getIndustryStyle = (industry) => {
    const i = (industry || "").toLowerCase();
    if (i.includes("tech") || i.includes("software") || i.includes("it"))
      return { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-100" };
    if (i.includes("finance") || i.includes("bank"))
      return { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-100" };
    if (i.includes("health") || i.includes("medical"))
      return { bg: "bg-red-50", text: "text-red-700", border: "border-red-100" };
    if (i.includes("education") || i.includes("edtech"))
      return { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-100" };
    if (i.includes("market") || i.includes("advertis"))
      return { bg: "bg-pink-50", text: "text-pink-700", border: "border-pink-100" };
    if (i.includes("manufact") || i.includes("industrial"))
      return { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-100" };
    return { bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-100" };
  };

  const getWebsiteDisplay = (url) => {
    if (!url) return null;
    try {
      const parsed = new URL(url.startsWith("http") ? url : `https://${url}`);
      return parsed.hostname.replace(/^www\./, "");
    } catch {
      return url;
    }
  };

  // ==================== CLIENT-SIDE FILTER ====================

  const filteredCompanies = companies.filter((c) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      (c.companyName || "").toLowerCase().includes(term) ||
      (c.industry || "").toLowerCase().includes(term) ||
      (c.location || "").toLowerCase().includes(term) ||
      String(c.id || "").includes(term)
    );
  });

  // ==================== DERIVED STATS ====================

  const totalCompanies = companies.length;
  const uniqueIndustries = new Set(
    companies.map((c) => c.industry).filter(Boolean)
  ).size;
  const uniqueLocations = new Set(
    companies.map((c) => c.location).filter(Boolean)
  ).size;
  const withWebsite = companies.filter(
    (c) => c.website && c.website.trim()
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">

        {/* ==================== BACK BUTTON ==================== */}
        <button
          onClick={() => navigate("/admin/dashboard")}
          className="group inline-flex items-center gap-2 px-4 py-2 mb-5 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 hover:text-indigo-600 transition-all duration-200 shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Dashboard
        </button>

        {/* ==================== HERO HEADER ==================== */}
        <div className="relative overflow-hidden bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-2xl p-6 sm:p-8 mb-6 shadow-xl shadow-emerald-300/30">
          <div className="absolute top-[-40%] right-[-5%] w-64 h-64 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-[-50%] left-[15%] w-72 h-72 bg-white/10 rounded-full blur-2xl"></div>

          <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
            <div>
              <p className="text-emerald-100 text-sm font-medium mb-1 flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 bg-emerald-300 rounded-full animate-pulse"></span>
                {totalCompanies} registered {totalCompanies === 1 ? "company" : "companies"}
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                All Companies
              </h1>
              <p className="text-emerald-100 mt-2 text-sm sm:text-base max-w-xl">
                Browse and manage every company registered on PlacementHub.
              </p>
            </div>

            <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-xl px-5 py-4 text-white self-start sm:self-auto">
              <p className="text-xs text-emerald-100 font-medium">Total Companies</p>
              <p className="text-3xl font-bold tracking-tight mt-0.5">
                {totalCompanies}
              </p>
            </div>
          </div>
        </div>

        {/* ==================== QUICK STATS ==================== */}
        {!loading && companies.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Total */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-300/50 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <span className="text-[10px] font-semibold px-2 py-1 rounded-full bg-emerald-50 text-emerald-600">
                  Total
                </span>
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                {totalCompanies}
              </p>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                Registered
              </p>
            </div>

            {/* Industries */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-300/50 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-[10px] font-semibold px-2 py-1 rounded-full bg-blue-50 text-blue-600">
                  Unique
                </span>
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                {uniqueIndustries}
              </p>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                Industries
              </p>
            </div>

            {/* Locations */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white shadow-md shadow-purple-300/50 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span className="text-[10px] font-semibold px-2 py-1 rounded-full bg-purple-50 text-purple-600">
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

            {/* Websites */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-300/50 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                <span className="text-[10px] font-semibold px-2 py-1 rounded-full bg-orange-50 text-orange-600">
                  Online
                </span>
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                {withWebsite}
              </p>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                With Website
              </p>
            </div>
          </div>
        )}

        {/* ==================== SEARCH BAR ==================== */}
        {!loading && companies.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-5 mb-5">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1 group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by company name, industry, or location..."
                  className="w-full pl-12 pr-10 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent focus:bg-white transition-all duration-200"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-emerald-600 transition-colors"
                    aria-label="Clear search"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              <button
                onClick={loadCompanies}
                className="group inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 hover:text-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1 transition-all duration-200 whitespace-nowrap"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
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
              <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
              <p className="text-sm font-medium text-slate-600">
                Loading companies...
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-56 bg-slate-100 rounded-2xl shimmer"></div>
              ))}
            </div>
          </div>
        ) : companies.length === 0 ? (
          /* ---- EMPTY ---- */
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-10 sm:p-16 text-center">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-emerald-100 via-teal-100 to-cyan-100 flex items-center justify-center mb-5">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              No companies found
            </h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              No companies have registered on PlacementHub yet.
            </p>
          </div>
        ) : filteredCompanies.length === 0 ? (
          /* ---- NO SEARCH MATCH ---- */
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-10 sm:p-16 text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              No matching companies
            </h3>
            <p className="text-sm text-slate-500 mb-4">
              Try a different search keyword.
            </p>
            <button
              onClick={() => setSearchTerm("")}
              className="px-5 py-2.5 text-sm font-semibold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors"
            >
              Clear Search
            </button>
          </div>
        ) : (
          /* ---- COMPANY GRID ---- */
          <>
            {/* Results Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900">
                All Companies
              </h2>
              <span className="text-sm text-slate-500 font-medium">
                {filteredCompanies.length}{" "}
                {filteredCompanies.length === 1 ? "result" : "results"}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredCompanies.map((company) => {
                const gradient = getCompanyGradient(company.companyName);
                const industryStyle = getIndustryStyle(company.industry);
                const websiteDisplay = getWebsiteDisplay(company.website);

                return (
                  <div
                    key={company.id}
                    className="group relative bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-emerald-100 transition-all duration-300 overflow-hidden"
                  >
                    {/* Top gradient accent bar */}
                    <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${gradient} scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500`}></div>

                    <div className="p-6">

                      {/* Header: Avatar + Industry badge */}
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-lg font-bold shadow-lg flex-shrink-0 group-hover:scale-105 group-hover:rotate-3 transition-transform duration-300`}>
                          {getInitials(company.companyName)}
                          <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-white"></span>
                        </div>

                        {company.industry && (
                          <span className={`inline-flex items-center px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${industryStyle.bg} ${industryStyle.text} ${industryStyle.border} border rounded-full`}>
                            {company.industry}
                          </span>
                        )}
                      </div>

                      {/* Company Name */}
                      <h2 className="text-lg font-bold text-slate-900 tracking-tight truncate group-hover:text-emerald-700 transition-colors">
                        {company.companyName || "Unnamed Company"}
                      </h2>

                      {/* Meta Grid */}
                      <div className="space-y-3 mt-4 pt-4 border-t border-slate-100">

                        {/* Location */}
                        <div className="flex items-center gap-2.5 text-sm text-slate-600">
                          <div className="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600 flex-shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </div>
                          <span className="truncate">
                            {company.location || "Location not specified"}
                          </span>
                        </div>

                        {/* Website */}
                        {websiteDisplay && (
                          <div className="flex items-center gap-2.5 text-sm text-slate-600">
                            <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
                              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                              </svg>
                            </div>
                            <a
                              href={company.website.startsWith("http") ? company.website : `https://${company.website}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="truncate font-medium text-blue-600 hover:text-blue-700 hover:underline"
                            >
                              {websiteDisplay}
                            </a>
                          </div>
                        )}
                      </div>

                      {/* Action */}
                      <button
                        onClick={() => navigate(`/admin/companies/${company.id}/jobs`)}
                        className="w-full mt-5 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl shadow-md shadow-emerald-300/50 hover:shadow-lg hover:from-emerald-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        View Jobs
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
                  {filteredCompanies.length}
                </span>{" "}
                of{" "}
                <span className="font-bold text-slate-700">
                  {companies.length}
                </span>{" "}
                companies
              </span>
              {searchTerm && (
                <span className="text-slate-500">
                  Filtered by:{" "}
                  <span className="font-semibold text-emerald-600">
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

export default AdminCompanies;