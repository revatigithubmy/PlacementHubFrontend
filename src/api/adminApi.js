import axiosInstance from "./axiosInstance";


// 1. Get all users
export const getAllUsers = async () => {
  const response = await axiosInstance.get("/api/admin/users");
  return response.data;
};

// 2. Get one user
export const getUserById = async (userId) => {
  const response = await axiosInstance.get(
    `/api/admin/users/${userId}`
  );
  return response.data;
};

// 3. Delete user
export const deleteUser = async (userId) => {
  const response = await axiosInstance.delete(
    `/api/admin/users/${userId}`
  );
  return response.data;
};

// 4. Get all students
export const getAllStudents = async () => {
  const response = await axiosInstance.get(
    "/api/admin/students"
  );
  return response.data;
};

// 5. Get all recruiters
export const getAllRecruiters = async () => {
  const response = await axiosInstance.get(
    "/api/admin/recruiters"
  );
  return response.data;
};

// 6. Get all companies
export const getAllCompanies = async () => {
  const response = await axiosInstance.get(
    "/api/admin/companies"
  );
  return response.data;
};

// 7. Get all jobs
export const getAllJobs = async () => {
  const response = await axiosInstance.get(
    "/api/admin/jobs"
  );
  return response.data;
};

// 8. Delete job
export const deleteJob = async (jobId) => {
  const response = await axiosInstance.delete(
    `/api/admin/jobs/${jobId}`
  );
  return response.data;
};


// 11.1 Admin dashboard
export const getAdminDashboard = async () => {
  const response = await axiosInstance.get(
    "/api/admin/dashboard"
  );
  return response.data;
};

// 11.2 Get all applications
export const getAllApplications = async () => {
  const response = await axiosInstance.get(
    "/api/admin/applications"
  );
  return response.data;
};

// 11.3 Get one application
export const getApplicationById = async (applicationId) => {
  const response = await axiosInstance.get(
    `/api/admin/applications/${applicationId}`
  );
  return response.data;
};

// 11.4 Get applications by status
export const getApplicationsByStatus = async (status) => {
  const response = await axiosInstance.get(
    `/api/admin/applications/status/${status}`
  );
  return response.data;
};

// 11.5 Get applications for a job
export const getJobApplications = async (jobId) => {
  const response = await axiosInstance.get(
    `/api/admin/jobs/${jobId}/applications`
  );
  return response.data;
};

// 11.6 Get jobs of a company
export const getCompanyJobs = async (companyId) => {
  const response = await axiosInstance.get(
    `/api/admin/companies/${companyId}/jobs`
  );
  return response.data;
};

// 11.7 Search users by email
export const searchUsersByEmail = async (email) => {
  const response = await axiosInstance.get(
    "/api/admin/users/search",
    {
      params: {
        email: email,
      },
    }
  );

  return response.data;
};

// 11.8 Get users by role
export const getUsersByRole = async (role) => {
  const response = await axiosInstance.get(
    `/api/admin/users/role/${role}`
  );
  return response.data;
};