import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getCompanyProfile,
  createCompanyProfile,
  updateCompanyProfile,
} from "../../api/companyApi";

function CompanyProfile() {
  const navigate = useNavigate();

  const [company, setCompany] = useState({
    companyName: "",
    description: "",
    website: "",
    location: "",
    industry: "",
  });

  const [companyExists, setCompanyExists] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Load company profile
  useEffect(() => {
    loadCompanyProfile();
  }, []);

  const loadCompanyProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getCompanyProfile();

      console.log("Company profile:", data);

      // Handle object or array response
      const companyData = Array.isArray(data) ? data[0] : data;

      if (companyData) {
        setCompany({
          companyName: companyData.companyName || "",
          description: companyData.description || "",
          website: companyData.website || "",
          location: companyData.location || "",
          industry: companyData.industry || "",
        });

        setCompanyExists(true);
      }
    } catch (err) {
      console.log("Company profile error:", err);

      if (err.response?.status === 404) {
        // Company profile doesn't exist
        setCompanyExists(false);
      } else {
        setError(
          err.response?.data?.message ||
            "Failed to load company profile."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle input
  const handleChange = (e) => {
    const { name, value } = e.target;

    setCompany((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Create / Update company
  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    // Basic validation
    if (!company.companyName.trim()) {
      setError("Company name is required.");
      return;
    }

    if (!company.description.trim()) {
      setError("Company description is required.");
      return;
    }

    if (!company.location.trim()) {
      setError("Company location is required.");
      return;
    }

    if (!company.industry.trim()) {
      setError("Industry is required.");
      return;
    }

    try {
      setSaving(true);

      if (companyExists) {
        await updateCompanyProfile(company);

        setMessage("Company profile updated successfully.");
      } else {
        await createCompanyProfile(company);

        setCompanyExists(true);

        setMessage("Company profile created successfully.");
      }
    } catch (err) {
      console.log("Save company error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to save company profile."
      );
    } finally {
      setSaving(false);
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

  const completionFields = [
    company.companyName,
    company.description,
    company.location,
    company.industry,
  ];
  const filledCount = completionFields.filter(
    (f) => f !== "" && f !== null && f !== undefined
  ).length;
  const completion = Math.round((filledCount / completionFields.length) * 100);

  // ---------- Loading State ----------
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

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
              Loading company profile...
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
          onClick={() => navigate("/recruiter/dashboard")}
          className="inline-flex items-center gap-2 px-4 py-2 mb-5 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Dashboard
        </button>

        {/* Page Heading */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Company Profile
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {companyExists
              ? "Update your company information."
              : "Create your company profile to start posting jobs."}
          </p>
        </div>

        {/* Company Header Card */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-6 sm:p-8 mb-6 shadow-xl shadow-indigo-300/30">
          <div className="absolute top-[-40%] right-[-5%] w-64 h-64 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-[-50%] left-[15%] w-72 h-72 bg-white/10 rounded-full blur-2xl"></div>

          <div className="relative flex flex-col sm:flex-row items-center sm:items-end gap-5">

            {/* Company Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white/20 backdrop-blur-md border-2 border-white/40 flex items-center justify-center text-white text-2xl sm:text-3xl font-bold shadow-lg">
                {getInitials(company.companyName)}
              </div>
              {companyExists && (
                <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </div>

            {/* Company Name + meta */}
            <div className="flex-1 text-center sm:text-left pb-1 min-w-0">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold text-white bg-white/20 backdrop-blur-md rounded-full uppercase tracking-wider mb-2">
                <span className="w-1.5 h-1.5 bg-emerald-300 rounded-full animate-pulse"></span>
                {companyExists ? "Verified Company" : "New Company"}
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight truncate">
                {company.companyName || "Your Company"}
              </h2>
              <p className="text-blue-100 text-sm mt-1 flex items-center justify-center sm:justify-start gap-1.5 truncate">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="truncate">
                  {company.location || "Add your location"}
                  {company.industry && ` • ${company.industry}`}
                </span>
              </p>
            </div>

            {/* Completion Ring */}
            <div className="flex flex-col items-center sm:items-end gap-1">
              <div className="relative w-16 h-16">
                <svg className="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15.9155" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="3" />
                  <circle
                    cx="18"
                    cy="18"
                    r="15.9155"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="3"
                    strokeDasharray={`${completion}, 100`}
                    strokeLinecap="round"
                    className="transition-all duration-700"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-bold text-white">{completion}%</span>
                </div>
              </div>
              <p className="text-[10px] text-blue-100 uppercase tracking-wider font-semibold">
                Complete
              </p>
            </div>
          </div>
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

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Form (2 cols) */}
          <form
            onSubmit={handleSubmit}
            className="lg:col-span-2 space-y-6"
          >

            {/* Section: Basic Information */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-7">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-300/50">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Basic Information</h3>
                  <p className="text-xs text-slate-500">Core company details</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                {/* Company Name */}
                <div className="sm:col-span-2">
                  <label htmlFor="companyName" className="block text-sm font-semibold text-slate-700 mb-2">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <input
                      id="companyName"
                      type="text"
                      name="companyName"
                      value={company.companyName}
                      onChange={handleChange}
                      placeholder="Enter company name"
                      className="w-full pl-11 pr-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="sm:col-span-2">
                  <label htmlFor="description" className="block text-sm font-semibold text-slate-700 mb-2">
                    Company Description <span className="text-red-500">*</span>
                  </label>
                  <div className="relative group">
                    <div className="absolute top-3.5 left-0 pl-3.5 flex items-start pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <textarea
                      id="description"
                      name="description"
                      value={company.description}
                      onChange={handleChange}
                      placeholder="Tell candidates about your company — mission, culture, values..."
                      rows="5"
                      className="w-full pl-11 pr-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all duration-200 resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section: Location & Industry */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-7">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-300/50">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Location & Industry</h3>
                  <p className="text-xs text-slate-500">Where you operate</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                {/* Location */}
                <div>
                  <label htmlFor="location" className="block text-sm font-semibold text-slate-700 mb-2">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <input
                      id="location"
                      type="text"
                      name="location"
                      value={company.location}
                      onChange={handleChange}
                      placeholder="Example: Pune, Maharashtra"
                      className="w-full pl-11 pr-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Industry */}
                <div>
                  <label htmlFor="industry" className="block text-sm font-semibold text-slate-700 mb-2">
                    Industry <span className="text-red-500">*</span>
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <input
                      id="industry"
                      type="text"
                      name="industry"
                      value={company.industry}
                      onChange={handleChange}
                      placeholder="Example: Information Technology"
                      className="w-full pl-11 pr-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all duration-200"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section: Website */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-7">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white shadow-md shadow-purple-300/50">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Website</h3>
                  <p className="text-xs text-slate-500">
                    Optional — link to your company's official website
                  </p>
                </div>
              </div>

              <div>
                <label htmlFor="website" className="block text-sm font-semibold text-slate-700 mb-2">
                  Website URL <span className="text-slate-400 text-xs font-normal">(optional)</span>
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  </div>
                  <input
                    id="website"
                    type="url"
                    name="website"
                    value={company.website}
                    onChange={handleChange}
                    placeholder="https://example.com"
                    className="w-full pl-11 pr-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all duration-200"
                  />
                </div>

                {company.website && (
                  <div className="mt-3 flex items-center gap-2 p-3 bg-indigo-50 border border-indigo-100 rounded-lg animate-fadeIn">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-indigo-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-indigo-700 hover:text-indigo-800 hover:underline truncate flex-1"
                    >
                      Visit website
                    </a>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                )}
              </div>
            </div>

            {/* Submit */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 sticky bottom-4 bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-100 shadow-lg p-4">
              <p className="text-xs text-slate-500 mr-auto hidden sm:block">
                <span className="font-semibold text-slate-700">{filledCount}</span> of{" "}
                <span className="font-semibold text-slate-700">{completionFields.length}</span> required fields filled
              </p>

              <button
                type="submit"
                disabled={saving}
                className={`w-full sm:w-auto px-6 py-3 text-sm font-semibold text-white rounded-xl shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 ${
                  companyExists
                    ? "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-indigo-300/50 hover:shadow-xl hover:shadow-indigo-400/50 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 focus:ring-indigo-500"
                    : "bg-gradient-to-r from-amber-500 via-orange-500 to-pink-500 shadow-orange-300/50 hover:shadow-xl hover:shadow-orange-400/50 hover:from-amber-600 hover:via-orange-600 hover:to-pink-600 focus:ring-orange-500"
                }`}
              >
                {saving ? (
                  <>
                    <svg className="animate-spin w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>{companyExists ? "Updating..." : "Creating..."}</span>
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      {companyExists ? (
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                      )}
                    </svg>
                    <span>{companyExists ? "Update Company" : "Create Company"}</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Sidebar */}
          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">

            {/* Profile Strength Card */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-md shadow-indigo-300/50">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Profile Strength</h3>
                  <p className="text-xs text-slate-500">Boost your credibility</p>
                </div>
              </div>

              <div className="mb-3">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-slate-700">
                    {completion >= 100
                      ? "Complete"
                      : completion >= 60
                      ? "Almost there"
                      : "Just started"}
                  </span>
                  <span className="text-xs font-bold text-slate-900">
                    {completion}%
                  </span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      completion >= 100
                        ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                        : completion >= 60
                        ? "bg-gradient-to-r from-blue-500 to-indigo-500"
                        : "bg-gradient-to-r from-amber-500 to-orange-500"
                    }`}
                    style={{ width: `${completion}%` }}
                  ></div>
                </div>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed">
                {completion >= 100
                  ? "Great job! Your company profile is complete. 🎉"
                  : "Complete your profile to build trust with candidates. 💼"}
              </p>
            </div>

            {/* Why it matters */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-md shadow-amber-300/50">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Why it matters</h3>
                  <p className="text-xs text-slate-500">Attract top talent</p>
                </div>
              </div>

              <ul className="space-y-3">
                {[
                  { icon: "🎯", text: "Complete profiles get 4x more qualified applicants" },
                  { icon: "🤝", text: "Candidates trust companies with detailed info" },
                  { icon: "🚀", text: "Faster hiring with better job-candidate matching" },
                  { icon: "⭐", text: "Stand out from competitors in searches" },
                ].map((tip, i) => (
                  <li key={i} className="flex gap-2.5 text-xs text-slate-600 leading-relaxed">
                    <span className="text-sm flex-shrink-0">{tip.icon}</span>
                    <span>{tip.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Preview Card */}
            {companyExists && company.website && (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-indigo-100 p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-white/80 flex items-center justify-center text-indigo-600 shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">How candidates see you</h3>
                </div>
                <p className="text-xs text-indigo-700 leading-relaxed">
                  Your company profile is visible to candidates when they browse jobs from <span className="font-semibold">{company.companyName}</span>.
                </p>
              </div>
            )}

          </aside>
        </div>

      </main>
    </div>
  );
}

export default CompanyProfile;