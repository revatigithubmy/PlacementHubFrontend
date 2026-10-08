import axiosInstance from "./axiosInstance";

// Apply for a job
export const applyForJob = async (jobId) => {
  const response = await axiosInstance.post(
    `/api/student/applications/${jobId}`
  );

  return response.data;
};

// View all my applications
export const getMyApplications = async () => {
  const response = await axiosInstance.get(
    "/api/student/applications"
  );

  return response.data;
};

// View one application
export const getMyApplicationById = async (applicationId) => {
  const response = await axiosInstance.get(
    `/api/student/applications/${applicationId}`
  );

  return response.data;
};



  export const deleteMyApplication = async (applicationId) => {
  const response = await axiosInstance.delete(
    `/api/student/applications/${applicationId}`
  );

  return response.data;
};