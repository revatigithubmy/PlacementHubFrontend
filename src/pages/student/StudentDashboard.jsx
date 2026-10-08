import { useNavigate } from "react-router-dom";
import StudentNavbar from "../../components/student/StudentNavbar";
import { useAuth } from "../../context/AuthContext";

function StudentDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const userName = user?.fullName || user?.name || "Student";
  const firstName = userName.split(" ")[0];

  // Greeting based on time of day
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const stats = [
    {
      label: "Applied Jobs",
      value: "12",
      trend: "+3 this week",
      trendUp: true,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      gradient: "from-blue-500 to-indigo-500",
      bg: "bg-blue-50",
      text: "text-blue-600",
    },
    {
      label: "Shortlisted",
      value: "4",
      trend: "2 active",
      trendUp: true,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      gradient: "from-emerald-500 to-teal-500",
      bg: "bg-emerald-50",
      text: "text-emerald-600",
    },
    {
      label: "Interviews",
      value: "2",
      trend: "1 upcoming",
      trendUp: false,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      gradient: "from-purple-500 to-pink-500",
      bg: "bg-purple-50",
      text: "text-purple-600",
    },
    {
      label: "Notifications",
      value: "5",
      trend: "3 new",
      trendUp: true,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      ),
      gradient: "from-orange-500 to-amber-500",
      bg: "bg-orange-50",
      text: "text-orange-600",
    },
  ];

  const quickActions = [
    {
      title: "Find Jobs",
      desc: "Browse latest openings matched to your skills",
      onClick: () => navigate("/student/jobs"),
      gradient: "from-blue-600 to-indigo-600",
      shadow: "shadow-blue-300/50",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
    },
    {
      title: "My Applications",
      desc: "Track status of every job you've applied to",
      onClick: () => navigate("/student/applications"),
      gradient: "from-emerald-600 to-teal-600",
      shadow: "shadow-emerald-300/50",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
    },
    {
      title: "Notifications",
      desc: "Stay updated on interviews & recruiter replies",
      onClick: () => navigate("/student/notifications"),
      gradient: "from-purple-600 to-pink-600",
      shadow: "shadow-purple-300/50",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      ),
    },
    {
      title: "My Profile",
      desc: "Update resume, skills, and personal details",
      onClick: () => navigate("/student/profile"),
      gradient: "from-orange-500 to-amber-500",
      shadow: "shadow-orange-300/50",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
  ];

  // Recent activity (realistic feel)
  const recentActivity = [
    { icon: "🎯", title: "Interview scheduled", company: "TCS", time: "Tomorrow, 10:00 AM", color: "bg-blue-50" },
    { icon: "✅", title: "Application shortlisted", company: "Infosys • SDE Intern", time: "5 hours ago", color: "bg-emerald-50" },
    { icon: "💼", title: "Applied to Google", company: "SDE-1 Role", time: "1 day ago", color: "bg-purple-50" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <StudentNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Welcome Hero */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-6 sm:p-8 mb-8 shadow-xl shadow-indigo-300/30">
          <div className="absolute top-[-40%] right-[-5%] w-64 h-64 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-[-50%] left-[20%] w-72 h-72 bg-white/10 rounded-full blur-2xl"></div>

          <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
            <div>
              <p className="text-blue-100 text-sm font-medium mb-1 flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                {greeting}, {firstName} 👋
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Ready to land your dream job?
              </h1>
              <p className="text-blue-100 mt-2 text-sm sm:text-base max-w-xl">
                You have <span className="font-bold text-white">2 interviews</span> and <span className="font-bold text-white">4 shortlisted applications</span> waiting for you.
              </p>
            </div>

            <button
              onClick={() => navigate("/student/jobs")}
              className="self-start sm:self-auto flex items-center gap-2 px-5 py-3 bg-white text-indigo-700 font-semibold rounded-xl shadow-lg hover:shadow-xl hover:bg-indigo-50 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600 whitespace-nowrap"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>Explore Jobs</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center text-white shadow-md group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                  {stat.icon}
                </div>
                <span className={`text-[10px] font-semibold px-2 py-1 rounded-full ${stat.bg} ${stat.text} whitespace-nowrap`}>
                  {stat.trend}
                </span>
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                {stat.value}
              </p>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Main Grid: Quick Actions + Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <div className="mb-4">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                Quick Actions
              </h2>
              <p className="text-sm text-slate-500 mt-0.5">
                Everything you need, one click away
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {quickActions.map((action, i) => (
                <button
                  key={i}
                  onClick={action.onClick}
                  className="group relative bg-white rounded-2xl p-5 border border-slate-100 shadow-sm text-left hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${action.gradient} scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500`}></div>

                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center text-white shadow-lg ${action.shadow} mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                    {action.icon}
                  </div>

                  <h3 className="font-semibold text-slate-900 mb-1 group-hover:text-indigo-700 transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {action.desc}
                  </p>

                  <div className="flex items-center gap-1 mt-3 text-xs font-semibold text-slate-400 group-hover:text-indigo-600 transition-colors">
                    <span>Open</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Activity Sidebar */}
          <div>
            <div className="mb-4">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                Recent Activity
              </h2>
              <p className="text-sm text-slate-500 mt-0.5">
                Latest updates on your applications
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-2">
              {recentActivity.map((activity, i) => (
                <div
                  key={i}
                  className="flex gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <div className={`w-10 h-10 rounded-lg ${activity.color} flex items-center justify-center text-lg flex-shrink-0`}>
                    {activity.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-900 truncate">
                      {activity.title}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {activity.company}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}

              <button
                onClick={() => navigate("/student/applications")}
                className="w-full mt-1 py-2.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
              >
                View all applications →
              </button>
            </div>
          </div>
        </div>

        {/* Motivation Banner */}
        <div className="relative overflow-hidden bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8">
          <div className="absolute right-[-5%] top-1/2 -translate-y-1/2 w-40 h-40 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full blur-2xl opacity-70"></div>

          <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-indigo-300/50 flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-900 mb-1">
                Boost your profile to get noticed 🚀
              </h3>
              <p className="text-sm text-slate-500">
                Students with a complete profile get <span className="font-semibold text-indigo-600">3x more recruiter views</span>. Add your skills, projects, and resume today.
              </p>
            </div>
            <button
              onClick={() => navigate("/student/profile")}
              className="self-start sm:self-auto px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg shadow-indigo-300/50 hover:shadow-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 whitespace-nowrap"
            >
              Complete Profile
            </button>
          </div>
        </div>

      </main>
    </div>
  );
}

export default StudentDashboard;