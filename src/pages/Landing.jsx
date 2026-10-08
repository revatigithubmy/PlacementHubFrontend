import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

function Landing() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  // ==================== THEME ====================
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("landing-theme");
    if (saved) return saved === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    localStorage.setItem("landing-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const navLinks = [
    { label: "Home", href: "#home" },
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how" },
    { label: "For Students", href: "#students" },
    { label: "For Recruiters", href: "#recruiters" },
  ];

  // ==================== THEME CLASSES ====================
  const theme = {
    pageBg: darkMode ? "bg-slate-950" : "bg-white",
    navBg: darkMode
      ? "bg-slate-900/85 border-slate-800/70"
      : "bg-white/85 border-slate-200/70",
    navText: darkMode
      ? "text-slate-300 hover:text-indigo-400"
      : "text-slate-600 hover:text-indigo-600",
    heading: darkMode ? "text-white" : "text-slate-900",
    subtext: darkMode ? "text-slate-400" : "text-slate-600",
    cardBg: darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100",
    cardInner: darkMode ? "bg-slate-800/60 border-slate-700" : "bg-slate-50 border-slate-100",
    sectionAlt: darkMode ? "bg-slate-900/50" : "bg-slate-50",
    sectionGradient: darkMode
      ? "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"
      : "bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50",
    border: darkMode ? "border-slate-800" : "border-slate-100",
    secondaryBtn: darkMode
      ? "text-slate-200 bg-slate-800 border-slate-700 hover:bg-slate-700 hover:border-slate-600"
      : "text-slate-700 bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300",
    footerBg: darkMode ? "bg-slate-950" : "bg-slate-900",
    featureCard: darkMode
      ? "bg-slate-900 border-slate-800 hover:border-indigo-500/40"
      : "bg-white border-slate-100 hover:border-indigo-100",
  };

  return (
    <div className={`min-h-screen overflow-x-hidden transition-colors duration-500 ${theme.pageBg}`}>

      {/* ==================== MOVING GRID BACKGROUND (Fixed, whole page) ==================== */}
      <div
        className={`fixed inset-0 pointer-events-none z-0 transition-opacity duration-500 ${darkMode ? "opacity-40" : "opacity-[0.14]"}`}
        style={{
          backgroundImage: darkMode
            ? `linear-gradient(rgba(99, 102, 241, 0.55) 1px, transparent 1px),
               linear-gradient(90deg, rgba(99, 102, 241, 0.55) 1px, transparent 1px)`
            : `linear-gradient(rgba(99, 102, 241, 0.8) 1px, transparent 1px),
               linear-gradient(90deg, rgba(99, 102, 241, 0.8) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
          animation: "gridMove 20s linear infinite",
        }}
      ></div>

      {/* Radial vignette on top of grid */}
      <div
        className={`fixed inset-0 pointer-events-none z-0 ${
          darkMode
            ? "bg-[radial-gradient(circle_at_50%_30%,transparent_0%,rgba(2,6,23,0.7)_80%)]"
            : "bg-[radial-gradient(circle_at_50%_30%,transparent_0%,rgba(255,255,255,0.6)_90%)]"
        }`}
      ></div>

      {/* Keyframe injection for moving grid */}
      <style>{`
        @keyframes gridMove {
          0% { background-position: 0 0; }
          100% { background-position: 48px 48px; }
        }
      `}</style>

      {/* ==================== NAVBAR (Compact) ==================== */}
      <nav className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-colors duration-500 ${theme.navBg}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-300/50 group-hover:scale-105 group-hover:rotate-3 transition-transform duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  </svg>
                </div>
                <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full animate-pulse"></span>
              </div>
              <div className="leading-tight">
                <p className={`text-xl font-bold tracking-tight ${darkMode ? "text-white" : "text-slate-900"}`}>
                  Placement<span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Hub</span>
                </p>
                <p className={`text-[10px] font-medium -mt-0.5 tracking-wide uppercase ${darkMode ? "text-slate-500" : "text-slate-400"}`}>Career Platform</p>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className={`relative px-3.5 py-2 rounded-lg text-sm font-medium transition-colors duration-200 group ${theme.navText}`}
                >
                  {link.label}
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full group-hover:w-6 transition-all duration-300"></span>
                </a>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">

              {/* Theme Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`relative w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 group ${
                  darkMode
                    ? "bg-slate-800 hover:bg-slate-700 text-amber-300"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                }`}
                aria-label="Toggle theme"
              >
                <div className="relative w-5 h-5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`absolute inset-0 w-5 h-5 transition-all duration-500 ${darkMode ? "opacity-100 rotate-0" : "opacity-0 -rotate-90"}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`absolute inset-0 w-5 h-5 transition-all duration-500 ${darkMode ? "opacity-0 rotate-90" : "opacity-100 rotate-0"}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                </div>
              </button>

              {/* Desktop Auth */}
              <div className="hidden md:flex items-center gap-2">
                <button
                  onClick={() => navigate("/login")}
                  className={`group inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg border transition-all duration-200 ${theme.secondaryBtn}`}
                >
                  Sign In
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>

                <button
                  onClick={() => navigate("/register")}
                  className="group inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-lg shadow-lg shadow-indigo-300/50 hover:shadow-xl hover:shadow-indigo-400/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  Sign Up
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </div>

              {/* Mobile Toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className={`lg:hidden p-2 rounded-lg transition-colors ${
                  darkMode ? "text-slate-300 hover:bg-slate-800" : "text-slate-600 hover:bg-slate-100"
                }`}
                aria-label="Toggle menu"
              >
                {mobileOpen ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileOpen && (
            <div className={`lg:hidden py-3 border-t animate-fadeIn ${theme.border}`}>
              <div className="flex flex-col gap-1 mb-3">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${theme.navText} ${darkMode ? "hover:bg-slate-800" : "hover:bg-slate-50"}`}
                  >
                    {link.label}
                  </a>
                ))}
              </div>

              <div className={`flex flex-col gap-2 pt-3 border-t ${theme.border}`}>
                <button
                  onClick={() => { setMobileOpen(false); navigate("/login"); }}
                  className={`w-full px-4 py-2.5 text-sm font-semibold rounded-lg border transition-all duration-200 ${theme.secondaryBtn}`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => { setMobileOpen(false); navigate("/register"); }}
                  className="group w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-lg shadow-lg shadow-indigo-300/50 transition-all duration-300"
                >
                  Sign Up
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* ==================== HERO ==================== */}
      <section id="home" className="relative z-10 py-16 sm:py-20">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left */}
            <div className="text-center lg:text-left">
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-full mb-5 ${
                darkMode
                  ? "text-indigo-200 bg-indigo-500/10 border border-indigo-500/30"
                  : "text-indigo-700 bg-indigo-50 border border-indigo-100"
              }`}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Trusted by 10,000+ students
              </div>

              <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight ${theme.heading}`}>
                Land Your{" "}
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Dream Job
                </span>{" "}
                Faster
              </h1>

              <p className={`text-lg mt-6 max-w-xl mx-auto lg:mx-0 leading-relaxed ${theme.subtext}`}>
                PlacementHub connects talented students with top recruiters. Track applications, discover opportunities, and get hired — all in one place.
              </p>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 mt-8">
                <button
                  onClick={() => navigate("/register")}
                  className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 text-base font-semibold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  Get Started Free
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>

                <button
                  onClick={() => navigate("/login")}
                  className={`group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 text-base font-semibold rounded-xl border shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 transition-all duration-200 ${theme.secondaryBtn}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Sign In
                </button>
              </div>

              {/* Trust */}
              <div className={`flex flex-wrap items-center justify-center lg:justify-start gap-5 mt-8 text-xs ${theme.subtext}`}>
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  No credit card required
                </div>
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Free forever for students
                </div>
              </div>

              {/* Mini social proof */}
              <div className="flex items-center justify-center lg:justify-start gap-3 mt-8">
                <div className="flex -space-x-2">
                  {[
                    "from-blue-500 to-indigo-500",
                    "from-emerald-500 to-teal-500",
                    "from-purple-500 to-pink-500",
                    "from-orange-500 to-amber-500",
                  ].map((g, i) => (
                    <div
                      key={i}
                      className={`w-8 h-8 rounded-full bg-gradient-to-br ${g} border-2 ${darkMode ? "border-slate-950" : "border-white"} flex items-center justify-center text-[10px] font-bold text-white`}
                    >
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                </div>
                <p className={`text-xs ${theme.subtext}`}>
                  <span className={`font-bold ${theme.heading}`}>10,000+</span> students joined this month
                </p>
              </div>
            </div>

            {/* Right: Preview Card */}
            <div className="relative">
              <div className={`relative rounded-3xl shadow-2xl p-6 sm:p-8 border transition-all duration-500 ${
                darkMode
                  ? "bg-slate-900 border-slate-800 shadow-indigo-500/10 hover:shadow-indigo-500/25"
                  : "bg-white border-slate-100 shadow-indigo-200/50 hover:shadow-indigo-300/60"
              }`}>

                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold shadow-md">
                      JS
                    </div>
                    <div>
                      <p className={`text-sm font-bold ${theme.heading}`}>Welcome back 👋</p>
                      <p className={`text-xs ${theme.subtext}`}>Your dashboard</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-full">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                    Active
                  </span>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mb-5">
                  {[
                    { label: "Applied", value: "12", gradient: "from-blue-500 to-indigo-500" },
                    { label: "Shortlisted", value: "4", gradient: "from-emerald-500 to-teal-500" },
                    { label: "Interviews", value: "2", gradient: "from-purple-500 to-pink-500" },
                  ].map((s, i) => (
                    <div key={i} className={`rounded-xl p-3 border ${theme.cardInner}`}>
                      <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${s.gradient} flex items-center justify-center text-white text-[10px] font-bold shadow-sm mb-2`}>
                        ✓
                      </div>
                      <p className={`text-lg font-bold ${theme.heading}`}>{s.value}</p>
                      <p className={`text-[10px] font-medium ${theme.subtext}`}>{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* Jobs */}
                <p className={`text-[10px] uppercase tracking-wider font-bold mb-3 ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
                  Recommended Jobs
                </p>
                <div className="space-y-2.5">
                  {[
                    { title: "Frontend Developer", company: "Google", gradient: "from-blue-500 to-indigo-500", badge: "Full Time" },
                    { title: "SDE Intern", company: "Microsoft", gradient: "from-emerald-500 to-teal-500", badge: "Internship" },
                    { title: "Backend Engineer", company: "Amazon", gradient: "from-orange-500 to-amber-500", badge: "Full Time" },
                  ].map((job, i) => (
                    <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 ${theme.cardInner} ${darkMode ? "hover:border-indigo-500/40 hover:bg-indigo-500/5" : "hover:border-indigo-200 hover:bg-indigo-50/30"}`}>
                      <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${job.gradient} flex items-center justify-center text-white text-xs font-bold shadow-sm flex-shrink-0`}>
                        {job.company[0]}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className={`text-xs font-bold truncate ${theme.heading}`}>{job.title}</p>
                        <p className={`text-[10px] truncate ${theme.subtext}`}>{job.company}</p>
                      </div>
                      <span className="text-[9px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-full px-2 py-0.5 whitespace-nowrap">
                        {job.badge}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating Cards */}
              <div className={`hidden sm:block absolute -top-6 -right-6 rounded-2xl shadow-xl border p-4 animate-float ${theme.cardBg}`}>
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className={`text-xs font-bold ${theme.heading}`}>Placement</p>
                    <p className="text-[10px] text-emerald-600 font-semibold">+38% this month</p>
                  </div>
                </div>
              </div>

              <div className={`hidden sm:block absolute -bottom-6 -left-6 rounded-2xl shadow-xl border p-4 animate-float animation-delay-500 ${theme.cardBg}`}>
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white shadow-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className={`text-xs font-bold ${theme.heading}`}>500+ Recruiters</p>
                    <p className="text-[10px] text-purple-600 font-semibold">Hiring now</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== TRUST BAR ==================== */}
      <section className={`relative z-10 py-8 border-y transition-colors duration-500 ${theme.border} ${darkMode ? "bg-slate-900/30" : "bg-white/50"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className={`text-center text-xs uppercase tracking-widest font-bold mb-5 ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
            Trusted by leading companies
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 opacity-60">
            {["Google", "Microsoft", "Amazon", "TCS", "Infosys", "Wipro"].map((name) => (
              <div key={name} className={`text-lg sm:text-xl font-bold tracking-tight ${theme.heading}`}>
                {name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== STATS ==================== */}
      <section className={`relative z-10 py-16 sm:py-20 transition-colors duration-500 ${darkMode ? "bg-slate-900/30" : "bg-slate-50/50"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { value: "10,000+", label: "Active Students", icon: "🎓", gradient: "from-blue-500 to-indigo-500", shadow: "shadow-blue-300/50" },
              { value: "500+", label: "Hiring Companies", icon: "🏢", gradient: "from-emerald-500 to-teal-500", shadow: "shadow-emerald-300/50" },
              { value: "25,000+", label: "Jobs Posted", icon: "💼", gradient: "from-purple-500 to-pink-500", shadow: "shadow-purple-300/50" },
              { value: "85%", label: "Placement Rate", icon: "🎯", gradient: "from-orange-500 to-amber-500", shadow: "shadow-orange-300/50" },
            ].map((stat, i) => (
              <div
                key={i}
                className={`rounded-2xl p-6 border shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-center group ${theme.cardBg}`}
              >
                <div className={`w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center text-2xl shadow-lg ${stat.shadow} mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                  {stat.icon}
                </div>
                <p className={`text-3xl sm:text-4xl font-bold tracking-tight ${theme.heading}`}>
                  {stat.value}
                </p>
                <p className={`text-sm mt-1 font-medium ${theme.subtext}`}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== FEATURES ==================== */}
      <section id="features" className="relative z-10 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-full mb-4 ${
              darkMode
                ? "text-indigo-300 bg-indigo-500/10 border border-indigo-500/30"
                : "text-indigo-700 bg-indigo-50 border border-indigo-100"
            }`}>
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
              Powerful Features
            </div>
            <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight ${theme.heading}`}>
              Everything You Need to{" "}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Get Hired
              </span>
            </h2>
            <p className={`text-lg mt-4 ${theme.subtext}`}>
              From discovering jobs to tracking applications — PlacementHub has all the tools you need to succeed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: (<svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>), title: "Smart Job Search", desc: "Find jobs that match your skills, location, and experience with our intelligent search.", gradient: "from-blue-500 to-indigo-500", shadow: "shadow-blue-300/50" },
              { icon: (<svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>), title: "Application Tracking", desc: "Track every application in real time. Know exactly where you stand with each recruiter.", gradient: "from-emerald-500 to-teal-500", shadow: "shadow-emerald-300/50" },
              { icon: (<svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>), title: "Instant Notifications", desc: "Get notified the moment a recruiter views, shortlists, or schedules your interview.", gradient: "from-purple-500 to-pink-500", shadow: "shadow-purple-300/50" },
              { icon: (<svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>), title: "Profile Builder", desc: "Showcase your skills, projects, and resume in a professional, recruiter-friendly format.", gradient: "from-orange-500 to-amber-500", shadow: "shadow-orange-300/50" },
              { icon: (<svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>), title: "Career Analytics", desc: "Track your progress with detailed insights on applications, interviews, and outcomes.", gradient: "from-cyan-500 to-blue-500", shadow: "shadow-cyan-300/50" },
              { icon: (<svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>), title: "Secure & Private", desc: "Your data is encrypted and visible only to verified recruiters you apply to.", gradient: "from-rose-500 to-red-500", shadow: "shadow-rose-300/50" },
            ].map((feature, i) => (
              <div
                key={i}
                className={`group relative rounded-2xl border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden p-6 ${theme.featureCard}`}
              >
                <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${feature.gradient} scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500`}></div>

                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white shadow-lg ${feature.shadow} mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                  {feature.icon}
                </div>

                <h3 className={`font-bold text-lg mb-2 group-hover:text-indigo-500 transition-colors ${theme.heading}`}>
                  {feature.title}
                </h3>
                <p className={`text-sm leading-relaxed ${theme.subtext}`}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== HOW IT WORKS ==================== */}
      <section id="how" className={`relative z-10 py-16 sm:py-24 transition-colors duration-500 ${darkMode ? "bg-slate-900/40" : "bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-full mb-4 ${
              darkMode
                ? "text-indigo-300 bg-slate-900 border border-indigo-500/30"
                : "text-indigo-700 bg-white border border-indigo-100"
            }`}>
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
              Simple Process
            </div>
            <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight ${theme.heading}`}>
              How It Works
            </h2>
            <p className={`text-lg mt-4 ${theme.subtext}`}>
              Get from sign-up to job offer in 4 simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: "01", title: "Create Profile", desc: "Sign up free and build your professional profile in minutes.", gradient: "from-blue-500 to-indigo-500", shadow: "shadow-blue-300/50" },
              { step: "02", title: "Find Jobs", desc: "Browse thousands of jobs matched to your skills and interests.", gradient: "from-emerald-500 to-teal-500", shadow: "shadow-emerald-300/50" },
              { step: "03", title: "Apply", desc: "Apply with one click and track your applications in real time.", gradient: "from-purple-500 to-pink-500", shadow: "shadow-purple-300/50" },
              { step: "04", title: "Get Hired", desc: "Interview, get selected, and start your dream career.", gradient: "from-orange-500 to-amber-500", shadow: "shadow-orange-300/50" },
            ].map((item, i) => (
              <div key={i} className="relative">
                <div className={`rounded-2xl border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-6 h-full ${theme.cardBg}`}>
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white text-lg font-bold shadow-lg ${item.shadow} mb-4`}>
                    {item.step}
                  </div>
                  <h3 className={`font-bold text-lg mb-2 ${theme.heading}`}>
                    {item.title}
                  </h3>
                  <p className={`text-sm leading-relaxed ${theme.subtext}`}>
                    {item.desc}
                  </p>
                </div>

                {i < 3 && (
                  <div className={`hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r ${darkMode ? "from-slate-700 to-transparent" : "from-slate-300 to-transparent"}`}></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== DUAL CTA ==================== */}
      <section id="students" className="relative z-10 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight ${theme.heading}`}>
              Built For{" "}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Everyone
              </span>
            </h2>
            <p className={`text-lg mt-4 ${theme.subtext}`}>
              Whether you're a student looking for your first job or a recruiter hunting top talent — we've got you covered.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Students */}
            <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 sm:p-10 shadow-xl shadow-indigo-500/20 text-white">
              <div className="absolute top-[-40%] right-[-5%] w-64 h-64 bg-white/10 rounded-full blur-2xl"></div>
              <div className="relative">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 text-[10px] font-bold bg-white/20 backdrop-blur-md rounded-full uppercase tracking-wider mb-4">
                  🎓 For Students
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">
                  Launch Your Career
                </h3>
                <p className="text-blue-100 mb-6 leading-relaxed">
                  Discover opportunities, apply with one click, and track your journey to your first job.
                </p>

                <ul className="space-y-3 mb-8">
                  {["Access to 25,000+ job postings", "Real-time application tracking", "Interview prep resources", "Free resume builder"].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm">
                      <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => navigate("/register")}
                  className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-indigo-700 font-semibold rounded-xl shadow-lg hover:shadow-xl hover:bg-indigo-50 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  Sign Up as Student
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Recruiters */}
            <div id="recruiters" className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 rounded-3xl p-8 sm:p-10 shadow-xl shadow-emerald-500/20 text-white">
              <div className="absolute top-[-40%] right-[-5%] w-64 h-64 bg-white/10 rounded-full blur-2xl"></div>
              <div className="relative">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 text-[10px] font-bold bg-white/20 backdrop-blur-md rounded-full uppercase tracking-wider mb-4">
                  💼 For Recruiters
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">
                  Hire Top Talent
                </h3>
                <p className="text-emerald-100 mb-6 leading-relaxed">
                  Post jobs, filter candidates, and hire smarter with our powerful recruiter tools.
                </p>

                <ul className="space-y-3 mb-8">
                  {["Post unlimited job openings", "Access verified candidate pool", "Advanced applicant filters", "Real-time hiring analytics"].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm">
                      <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => navigate("/register")}
                  className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-emerald-700 font-semibold rounded-xl shadow-lg hover:shadow-xl hover:bg-emerald-50 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  Sign Up as Recruiter
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== FINAL CTA ==================== */}
      <section className={`relative z-10 py-16 sm:py-20 transition-colors duration-500 ${darkMode ? "bg-slate-900/40" : "bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50"}`}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 sm:p-14 shadow-2xl shadow-indigo-500/30 text-center">
            <div className="absolute top-[-40%] left-[-5%] w-64 h-64 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-[-50%] right-[-5%] w-72 h-72 bg-white/10 rounded-full blur-2xl"></div>

            <div className="relative">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
                Ready to Start Your Journey?
              </h2>
              <p className="text-lg text-blue-100 mt-4 max-w-2xl mx-auto">
                Join 10,000+ students and 500+ companies already using PlacementHub. It's completely free to get started.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
                <button
                  onClick={() => navigate("/register")}
                  className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-indigo-700 bg-white rounded-xl shadow-xl hover:shadow-2xl hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  Get Started Free
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>

                <button
                  onClick={() => navigate("/login")}
                  className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white bg-white/15 backdrop-blur-md border border-white/30 rounded-xl hover:bg-white/25 hover:border-white/50 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  Already have an account? Sign In
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </div>

              <p className="text-xs text-blue-100 mt-6">
                ⚡ No credit card · 🎁 Free forever · 🚀 Get hired faster
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className={`relative z-10 text-slate-400 transition-colors duration-500 ${theme.footerBg}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">

            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  </svg>
                </div>
                <div className="leading-tight">
                  <p className="text-lg font-bold text-white tracking-tight">
                    Placement<span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Hub</span>
                  </p>
                  <p className="text-[10px] text-slate-500 font-medium -mt-0.5">Career Platform</p>
                </div>
              </div>
              <p className="text-sm leading-relaxed mb-4">
                The modern way to connect students with recruiters. Built for the next generation of talent.
              </p>
            </div>

            <div>
              <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">
                Product
              </h4>
              <ul className="space-y-2.5 text-sm">
                {["Features", "For Students", "For Recruiters", "Pricing"].map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-indigo-400 transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">
                Company
              </h4>
              <ul className="space-y-2.5 text-sm">
                {["About Us", "Careers", "Blog", "Contact"].map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-indigo-400 transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">
                Legal
              </h4>
              <ul className="space-y-2.5 text-sm">
                {["Privacy Policy", "Terms of Service", "Cookie Policy", "Security"].map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-indigo-400 transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs">
              © {new Date().getFullYear()} PlacementHub. All rights reserved.
            </p>

            <div className="flex items-center gap-4">
              {[
                { name: "Twitter", icon: "𝕏" },
                { name: "LinkedIn", icon: "in" },
                { name: "GitHub", icon: "⌘" },
              ].map((social) => (
                <a
                  key={social.name}
                  href="#"
                  aria-label={social.name}
                  className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-indigo-600 flex items-center justify-center text-sm font-bold text-white transition-all duration-300 hover:scale-110"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;