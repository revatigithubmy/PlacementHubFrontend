import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";

// =====================================================
// AUTHENTICATION
// =====================================================
import Landing from "./pages/Landing";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// =====================================================
// PROTECTED ROUTE
// =====================================================

import ProtectedRoute from "./routes/ProtectedRoute";

// =====================================================
// STUDENT PAGES
// =====================================================

import StudentDashboard from "./pages/student/StudentDashboard";
import StudentProfile from "./pages/student/StudentProfile";
import Notifications from "./pages/student/Notifications";

// =====================================================
// STUDENT JOB PAGES
// =====================================================

import JobList from "./pages/jobs/JobList";
import JobDetails from "./pages/jobs/JobDetails";

// =====================================================
// STUDENT APPLICATION PAGES
// =====================================================

import MyApplications from "./pages/applications/MyApplications";

// =====================================================
// RECRUITER PAGES
// =====================================================

import RecruiterDashboard from "./pages/recruiter/RecruiterDashboard";
import RecruiterProfile from "./pages/recruiter/RecruiterProfile";
import CompanyProfile from "./pages/recruiter/CompanyProfile";
import CreateJob from "./pages/recruiter/CreateJob";
import MyJobs from "./pages/recruiter/MyJobs";
import RecruiterNotifications from "./pages/recruiter/Notifications";

// =====================================================
// RECRUITER APPLICATION PAGES
// =====================================================

import JobApplicants from "./pages/recruiter/JobApplicants";
import ApplicationDetails from "./pages/recruiter/ApplicationDetails";

// =====================================================
// ADMIN DASHBOARD
// =====================================================

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminUserDetails from "./pages/admin/AdminUserDetails";
import AdminStudents from "./pages/admin/AdminStudents";
import AdminRecruiters from "./pages/admin/AdminRecruiters";
import AdminCompanies from "./pages/admin/AdminCompanies";
import AdminJobs from "./pages/admin/AdminJobs";
import AdminApplications from "./pages/admin/AdminApplications";
import AdminApplicationDetails from "./pages/admin/AdminApplicationDetails";
import AdminJobApplications from "./pages/admin/AdminJobApplications";
import AdminCompanyJobs from "./pages/admin/AdminCompanyJobs";
import AdminNotifications from "./pages/admin/AdminNotifications";

// =====================================================
// UNAUTHORIZED PAGE
// =====================================================

function Unauthorized() {
  return (
    <div>
      <h1>403 - Unauthorized</h1>

      <p>
        You don't have permission to access this page.
      </p>
    </div>
  );
}

// =====================================================
// APP
// =====================================================

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          {/* =================================================
              HOME — PUBLIC LANDING PAGE
          ================================================== */}

          <Route
            path="/"
            element={<Landing />}
          />

          {/* =================================================
              AUTHENTICATION
          ================================================== */}

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          {/* =================================================
              UNAUTHORIZED
          ================================================== */}

          <Route
            path="/unauthorized"
            element={<Unauthorized />}
          />

          {/* =================================================
              STUDENT ROUTES
          ================================================== */}

          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute
                allowedRoles={["STUDENT"]}
              >
                <StudentDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/profile"
            element={
              <ProtectedRoute
                allowedRoles={["STUDENT"]}
              >
                <StudentProfile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/jobs"
            element={
              <ProtectedRoute
                allowedRoles={["STUDENT"]}
              >
                <JobList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/jobs/:jobId"
            element={
              <ProtectedRoute
                allowedRoles={["STUDENT"]}
              >
                <JobDetails />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/applications"
            element={
              <ProtectedRoute
                allowedRoles={["STUDENT"]}
              >
                <MyApplications />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/notifications"
            element={
              <ProtectedRoute
                allowedRoles={["STUDENT"]}
              >
                <Notifications />
              </ProtectedRoute>
            }
          />

          {/* =================================================
              RECRUITER ROUTES
          ================================================== */}

          <Route
            path="/recruiter/dashboard"
            element={
              <ProtectedRoute
                allowedRoles={["RECRUITER"]}
              >
                <RecruiterDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/recruiter/profile"
            element={
              <ProtectedRoute
                allowedRoles={["RECRUITER"]}
              >
                <RecruiterProfile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/recruiter/company"
            element={
              <ProtectedRoute
                allowedRoles={["RECRUITER"]}
              >
                <CompanyProfile />
              </ProtectedRoute>
            }
          />

          {/* =================================================
              RECRUITER JOB MANAGEMENT
          ================================================== */}

          <Route
            path="/recruiter/jobs"
            element={
              <ProtectedRoute
                allowedRoles={["RECRUITER"]}
              >
                <MyJobs />
              </ProtectedRoute>
            }
          />

          <Route
            path="/recruiter/jobs/create"
            element={
              <ProtectedRoute
                allowedRoles={["RECRUITER"]}
              >
                <CreateJob />
              </ProtectedRoute>
            }
          />

          {/* =================================================
              RECRUITER APPLICATION MANAGEMENT
          ================================================== */}

          <Route
            path="/recruiter/jobs/:jobId/applications"
            element={
              <ProtectedRoute
                allowedRoles={["RECRUITER"]}
              >
                <JobApplicants />
              </ProtectedRoute>
            }
          />

          <Route
            path="/recruiter/applications/:applicationId"
            element={
              <ProtectedRoute
                allowedRoles={["RECRUITER"]}
              >
                <ApplicationDetails />
              </ProtectedRoute>
            }
          />

          <Route
            path="/recruiter/notifications"
            element={
              <ProtectedRoute
                allowedRoles={["RECRUITER"]}
              >
                <RecruiterNotifications />
              </ProtectedRoute>
            }
          />

          {/* =================================================
              ADMIN ROUTES
          ================================================== */}

          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AdminUsers />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/users/:userId"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AdminUserDetails />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/students"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AdminStudents />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/recruiters"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AdminRecruiters />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/companies"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AdminCompanies />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/companies/:companyId/jobs"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AdminCompanyJobs />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/jobs"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AdminJobs />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/jobs/:jobId/applications"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AdminJobApplications />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/applications"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AdminApplications />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/applications/:applicationId"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AdminApplicationDetails />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/notifications"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AdminNotifications />
              </ProtectedRoute>
            }
          />

          {/* =================================================
              UNKNOWN URL — FALLBACK
          ================================================== */}

          <Route
            path="*"
            element={
              <Navigate
                to="/"
                replace
              />
            }
          />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;