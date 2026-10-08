import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getStudentProfile,
  createStudentProfile,
  updateStudentProfile,
} from "../../api/studentApi";

function StudentProfile() {
  const navigate = useNavigate();

  const emptyProfile = {
    fullName: "",
    phone: "",
    college: "",
    branch: "",
    cgpa: "",
    graduationYear: "",
    resumeUrl: "",
  };

  const [profile, setProfile] = useState(emptyProfile);

  const [profileExists, setProfileExists] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Load profile
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const data = await getStudentProfile();

      console.log("Student profile response:", data);

      /*
       * Your backend currently returns:
       *
       * [
       *   {
       *     fullName: "...",
       *     phone: "...",
       *     ...
       *   }
       * ]
       */

      const studentData = Array.isArray(data)
        ? data[0]
        : data;

      if (!studentData) {
        setProfileExists(false);
        setProfile(emptyProfile);
        return;
      }

      setProfile({
        fullName: studentData.fullName || "",
        phone: studentData.phone || "",
        college: studentData.college || "",
        branch: studentData.branch || "",
        cgpa: studentData.cgpa ?? "",
        graduationYear: studentData.graduationYear ?? "",
        resumeUrl: studentData.resumeUrl || "",
      });

      setProfileExists(true);
    } catch (err) {
      console.error("Error loading student profile:", err);

      /*
       * If backend says:
       * Student profile not found
       *
       * it means the student has not created
       * a profile yet.
       */

      const message =
        err.response?.data?.message ||
        err.response?.data ||
        "";

      if (
        err.response?.status === 404 ||
        String(message).toLowerCase().includes("student profile not found")
      ) {
        setProfileExists(false);
        setProfile(emptyProfile);
        setError("");
      } else {
        setError("Unable to load student profile.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfile((previousProfile) => ({
      ...previousProfile,
      [name]: value,
    }));
  };

  // Create or Update profile
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const profileData = {
        fullName: profile.fullName,
        phone: profile.phone,
        college: profile.college,
        branch: profile.branch,
        cgpa: profile.cgpa,
        graduationYear: profile.graduationYear,
        resumeUrl: profile.resumeUrl,
      };

      console.log("Profile data:", profileData);

      let response;

      if (profileExists) {
        // Existing profile → UPDATE
        response = await updateStudentProfile(profileData);

        setSuccess(
          "Student profile updated successfully!"
        );
      } else {
        // No profile → CREATE
        response = await createStudentProfile(profileData);

        setProfileExists(true);

        setSuccess(
          "Student profile created successfully!"
        );
      }

      console.log("Profile save response:", response);

      // Update screen with backend response
      if (response) {
        const updatedData = Array.isArray(response)
          ? response[0]
          : response;

        if (updatedData) {
          setProfile({
            fullName: updatedData.fullName || "",
            phone: updatedData.phone || "",
            college: updatedData.college || "",
            branch: updatedData.branch || "",
            cgpa: updatedData.cgpa ?? "",
            graduationYear:
              updatedData.graduationYear ?? "",
            resumeUrl: updatedData.resumeUrl || "",
          });
        }
      }
    } catch (err) {
      console.error("Error saving student profile:", err);

      console.log("Backend error:", err.response?.data);

      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (typeof err.response?.data === "string") {
        setError(err.response.data);
      } else {
        setError(
          profileExists
            ? "Unable to update student profile."
            : "Unable to create student profile."
        );
      }
    } finally {
      setSaving(false);
    }
  };

  // ---- Visual helpers (no backend impact) ----
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

  // Live completion
  const completionFields = [
    profile.fullName,
    profile.phone,
    profile.college,
    profile.branch,
    profile.cgpa,
    profile.graduationYear,
    profile.resumeUrl,
  ];
  const filledCount = completionFields.filter(
    (f) => f !== "" && f !== null && f !== undefined
  ).length;
  const completion = Math.round((filledCount / completionFields.length) * 100);

  const getCompletionLabel = () => {
    if (completion >= 100) return { label: "Complete" };
    if (completion >= 70) return { label: "Almost there" };
    if (completion >= 40) return { label: "Getting there" };
    return { label: "Just started" };
  };
  const completionInfo = getCompletionLabel();

  // ---------- Loading State ----------
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

          {/* Header skeleton */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8 mb-6 shimmer">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5">
              <div className="w-24 h-24 rounded-2xl bg-slate-200"></div>
              <div className="flex-1 space-y-3 w-full">
                <div className="h-6 bg-slate-200 rounded w-1/3 mx-auto sm:mx-0"></div>
                <div className="h-4 bg-slate-200 rounded w-1/2 mx-auto sm:mx-0"></div>
              </div>
            </div>
          </div>

          {/* Form skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8 shimmer">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-3 bg-slate-200 rounded w-1/3"></div>
                    <div className="h-11 bg-slate-100 rounded-xl"></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 shimmer h-64"></div>
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
          onClick={() => navigate("/student/dashboard")}
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
            Student Profile
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Keep your details up to date to get matched with the right opportunities.
          </p>
        </div>

        {/* ================= Status Banner ================= */}

        {/* Create Mode Banner */}
        {!profileExists && (
          <div className="mb-6 relative overflow-hidden bg-gradient-to-r from-amber-500 via-orange-500 to-pink-500 rounded-2xl p-6 sm:p-8 shadow-xl shadow-orange-300/30">
            <div className="absolute top-[-40%] right-[-5%] w-64 h-64 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-[-50%] left-[15%] w-72 h-72 bg-white/10 rounded-full blur-2xl"></div>

            <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md border-2 border-white/40 flex items-center justify-center text-3xl shadow-lg flex-shrink-0">
                🚀
              </div>
              <div className="flex-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold text-white bg-white/20 backdrop-blur-md rounded-full uppercase tracking-wider mb-2">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                  New Profile
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Create Your Student Profile
                </h2>
                <p className="text-orange-50 mt-1.5 text-sm sm:text-base max-w-2xl">
                  Your student account is created successfully. Complete your profile before applying for jobs to unlock all opportunities.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Edit Mode Banner */}
        {profileExists && (
          <div className="mb-6 relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-6 sm:p-8 shadow-xl shadow-indigo-300/30">
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
                  Edit Mode
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight truncate">
                  {profile.fullName || "Your Name"}
                </h2>
                <p className="text-blue-100 text-sm mt-1 flex items-center justify-center sm:justify-start gap-1.5 truncate">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  </svg>
                  <span className="truncate">
                    {profile.branch || "Add your branch"}
                    {profile.college && ` • ${profile.college}`}
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
                  {completionInfo.label}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Alerts */}
        {success && (
          <div className="mb-5 flex items-start gap-3 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl animate-fadeIn">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm text-emerald-700 font-semibold">{success}</p>
              <p className="text-xs text-emerald-600 mt-0.5">
                Your updates are now visible to recruiters.
              </p>
            </div>
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

          {/* ---------- Form (2 cols) ---------- */}
          <form
            onSubmit={handleSubmit}
            className="lg:col-span-2 space-y-6"
          >

            {/* Section: Personal Information */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-7">
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Full Name */}
                <div>
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
                      required
                      className="w-full pl-11 pr-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
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
                      placeholder="Enter your phone number"
                      required
                      className="w-full pl-11 pr-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all duration-200"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section: Academic Details */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-7">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white shadow-md shadow-purple-300/50">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Academic Details</h3>
                  <p className="text-xs text-slate-500">Your education background</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* College */}
                <div className="sm:col-span-2">
                  <label htmlFor="college" className="block text-sm font-semibold text-slate-700 mb-2">
                    College
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <input
                      id="college"
                      type="text"
                      name="college"
                      value={profile.college}
                      onChange={handleChange}
                      placeholder="Enter your college"
                      required
                      className="w-full pl-11 pr-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Branch */}
                <div>
                  <label htmlFor="branch" className="block text-sm font-semibold text-slate-700 mb-2">
                    Branch
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <input
                      id="branch"
                      type="text"
                      name="branch"
                      value={profile.branch}
                      onChange={handleChange}
                      placeholder="Enter your branch"
                      required
                      className="w-full pl-11 pr-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all duration-200"
                    />
                  </div>
                </div>

                {/* CGPA */}
                <div>
                  <label htmlFor="cgpa" className="block text-sm font-semibold text-slate-700 mb-2">
                    CGPA
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <input
                      id="cgpa"
                      type="number"
                      name="cgpa"
                      step="0.01"
                      min="0"
                      max="10"
                      value={profile.cgpa}
                      onChange={handleChange}
                      placeholder="Enter your CGPA"
                      required
                      className="w-full pl-11 pr-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Graduation Year */}
                <div>
                  <label htmlFor="graduationYear" className="block text-sm font-semibold text-slate-700 mb-2">
                    Graduation Year
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <input
                      id="graduationYear"
                      type="number"
                      name="graduationYear"
                      value={profile.graduationYear}
                      onChange={handleChange}
                      placeholder="Enter graduation year"
                      required
                      className="w-full pl-11 pr-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all duration-200"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section: Resume */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-7">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-300/50">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Resume</h3>
                  <p className="text-xs text-slate-500">
                    Link to your latest resume <span className="text-slate-400">(optional)</span>
                  </p>
                </div>
              </div>

              <div>
                <label htmlFor="resumeUrl" className="block text-sm font-semibold text-slate-700 mb-2">
                  Resume URL
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  </div>
                  <input
                    id="resumeUrl"
                    type="text"
                    name="resumeUrl"
                    value={profile.resumeUrl}
                    onChange={handleChange}
                    placeholder="https://example.com/your-resume.pdf"
                    className="w-full pl-11 pr-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all duration-200"
                  />
                </div>

                {profile.resumeUrl && (
                  <div className="mt-3 flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-100 rounded-lg animate-fadeIn">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-emerald-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <a
                      href={profile.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline truncate flex-1"
                    >
                      Preview resume
                    </a>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
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

          {/* ---------- Right Sidebar ---------- */}
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
                    {completionInfo.label}
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
                        : completion >= 70
                        ? "bg-gradient-to-r from-blue-500 to-indigo-500"
                        : completion >= 40
                        ? "bg-gradient-to-r from-amber-500 to-orange-500"
                        : "bg-gradient-to-r from-red-500 to-rose-500"
                    }`}
                    style={{ width: `${completion}%` }}
                  ></div>
                </div>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed">
                {completion >= 100
                  ? "Great job! Your profile is complete and looks professional. 🎉"
                  : completion >= 70
                  ? "Almost there! Just a few more details to go. 🚀"
                  : "Complete your profile to get 3x more recruiter views. 💼"}
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
                  <p className="text-xs text-slate-500">Stand out to recruiters</p>
                </div>
              </div>

              <ul className="space-y-3">
                {[
                  { icon: "✅", text: "Use a professional resume link (Google Drive, Dropbox)" },
                  { icon: "📱", text: "Add a phone number recruiters can reach you on" },
                  { icon: "🎓", text: "Keep your CGPA updated after each semester" },
                  { icon: "🌐", text: "Mention your branch for role-specific matches" },
                ].map((tip, i) => (
                  <li key={i} className="flex gap-2.5 text-xs text-slate-600 leading-relaxed">
                    <span className="text-sm flex-shrink-0">{tip.icon}</span>
                    <span>{tip.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* How Recruiters See You */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-indigo-100 p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg bg-white/80 flex items-center justify-center text-indigo-600 shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h3 className="font-bold text-slate-900 text-sm">How recruiters see you</h3>
              </div>
              <p className="text-xs text-indigo-700 leading-relaxed">
                Your profile appears in recruiter searches when you fill in your name, college, branch, and CGPA.
              </p>
            </div>

          </aside>
        </div>

      </main>
    </div>
  );
}

export default StudentProfile;