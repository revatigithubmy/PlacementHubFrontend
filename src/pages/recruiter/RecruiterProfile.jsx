import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getRecruiterProfile,
  createRecruiterProfile,
  updateRecruiterProfile,
} from "../../api/recruiterApi";

function RecruiterProfile() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    fullName: "",
    phone: "",
    designation: "",
  });

  const [profileExists, setProfileExists] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Load recruiter profile
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getRecruiterProfile();

      console.log("Recruiter profile:", data);

      // Backend normally returns recruiter profile object
      // Handle array response also, just in case
      const recruiterData = Array.isArray(data) ? data[0] : data;

      if (recruiterData) {
        setProfile({
          fullName: recruiterData.fullName || "",
          phone: recruiterData.phone || "",
          designation: recruiterData.designation || "",
        });

        setProfileExists(true);
      }
    } catch (err) {
      console.log("Profile error:", err);

      // Profile does not exist yet
      if (err.response?.status === 404) {
        setProfileExists(false);
      } else {
        setError(
          err.response?.data?.message ||
            "Failed to load recruiter profile."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Create / Update profile
  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!profile.fullName.trim()) {
      setError("Full name is required.");
      return;
    }

    if (!profile.phone.trim()) {
      setError("Phone number is required.");
      return;
    }

    if (!profile.designation.trim()) {
      setError("Designation is required.");
      return;
    }

    try {
      setSaving(true);

      if (profileExists) {
        await updateRecruiterProfile(profile);

        setMessage("Recruiter profile updated successfully.");
      } else {
        await createRecruiterProfile(profile);

        setProfileExists(true);

        setMessage("Recruiter profile created successfully.");
      }
    } catch (err) {
      console.log("Save profile error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to save recruiter profile."
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
    profile.fullName,
    profile.phone,
    profile.designation,
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
              Loading recruiter profile...
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
            Recruiter Profile
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {profileExists
              ? "Update your recruiter profile to keep your details current."
              : "Create your recruiter profile to start posting jobs."}
          </p>
        </div>

        {/* Profile Header Card */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-6 sm:p-8 mb-6 shadow-xl shadow-indigo-300/30">
          <div className="absolute top-[-40%] right-[-5%] w-64 h-64 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-[-50%] left-[15%] w-72 h-72 bg-white/10 rounded-full blur-2xl"></div>

          <div className="relative flex flex-col sm:flex-row items-center sm:items-end gap-5">

            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white/20 backdrop-blur-md border-2 border-white/40 flex items-center justify-center text-white text-2xl sm:text-3xl font-bold shadow-lg">
                {getInitials(profile.fullName)}
              </div>
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            {/* Name + meta */}
            <div className="flex-1 text-center sm:text-left pb-1 min-w-0">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold text-white bg-white/20 backdrop-blur-md rounded-full uppercase tracking-wider mb-2">
                <span className="w-1.5 h-1.5 bg-emerald-300 rounded-full animate-pulse"></span>
                {profileExists ? "Recruiter" : "New Recruiter"}
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight truncate">
                {profile.fullName || "Your Name"}
              </h2>
              <p className="text-blue-100 text-sm mt-1 truncate">
                {profile.designation || "Add your designation"}
                {profile.phone && ` • ${profile.phone}`}
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
            className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-7"
          >

            {/* Section Header */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-300/50">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Personal Information</h3>
                <p className="text-xs text-slate-500">Your basic contact details</p>
              </div>
            </div>

            {/* Full Name */}
            <div className="mb-5">
              <label htmlFor="fullName" className="block text-sm font-semibold text-slate-700 mb-2">
                Full Name
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  id="fullName"
                  type="text"
                  name="fullName"
                  value={profile.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full pl-11 pr-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all duration-200"
                />
              </div>
            </div>

            {/* Phone */}
            <div className="mb-5">
              <label htmlFor="phone" className="block text-sm font-semibold text-slate-700 mb-2">
                Phone
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <input
                  id="phone"
                  type="text"
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  className="w-full pl-11 pr-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all duration-200"
                />
              </div>
            </div>

            {/* Designation */}
            <div className="mb-6">
              <label htmlFor="designation" className="block text-sm font-semibold text-slate-700 mb-2">
                Designation
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  id="designation"
                  type="text"
                  name="designation"
                  value={profile.designation}
                  onChange={handleChange}
                  placeholder="Example: HR Manager"
                  className="w-full pl-11 pr-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all duration-200"
                />
              </div>
            </div>

            {/* Submit */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-5 border-t border-slate-100">
              <p className="text-xs text-slate-500 mr-auto hidden sm:block">
                <span className="font-semibold text-slate-700">{filledCount}</span> of{" "}
                <span className="font-semibold text-slate-700">{completionFields.length}</span> fields filled
              </p>

              <button
                type="submit"
                disabled={saving}
                className={`w-full sm:w-auto px-6 py-3 text-sm font-semibold text-white rounded-xl shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 ${
                  profileExists
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
                    <span>{profileExists ? "Updating..." : "Creating..."}</span>
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      {profileExists ? (
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                      )}
                    </svg>
                    <span>{profileExists ? "Update Profile" : "Create Profile"}</span>
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
                  <p className="text-xs text-slate-500">Boost your visibility</p>
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
                  ? "Great job! Your recruiter profile is complete. 🎉"
                  : "Complete your profile to build trust with candidates. 💼"}
              </p>
            </div>

            {/* Pro Tips */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-md shadow-amber-300/50">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Pro Tips</h3>
                  <p className="text-xs text-slate-500">Attract top talent</p>
                </div>
              </div>

              <ul className="space-y-3">
                {[
                  { icon: "🏢", text: "Complete your company profile for credibility" },
                  { icon: "📝", text: "Write detailed job descriptions with clear requirements" },
                  { icon: "⚡", text: "Respond to applications within 48 hours" },
                  { icon: "🎯", text: "Use specific skill tags to attract the right candidates" },
                ].map((tip, i) => (
                  <li key={i} className="flex gap-2.5 text-xs text-slate-600 leading-relaxed">
                    <span className="text-sm flex-shrink-0">{tip.icon}</span>
                    <span>{tip.text}</span>
                  </li>
                ))}
              </ul>
            </div>

          </aside>
        </div>

      </main>
    </div>
  );
}

export default RecruiterProfile;