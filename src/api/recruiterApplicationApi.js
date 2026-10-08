import axiosInstance from "./axiosInstance";

// Get all applications for one job
export const getJobApplications = async (jobId) => {
  const response = await axiosInstance.get(
    `/api/recruiter/jobs/${jobId}/applications`
  );

  return response.data;
};

// Get one application / applicant details
export const getApplicationDetails = async (
  applicationId
) => {
  const response = await axiosInstance.get(
    `/api/recruiter/applications/${applicationId}`
  );

  return response.data;
};

// Update application status
export const updateApplicationStatus = async (
  applicationId,
  status
) => {
  const response = await axiosInstance.put(
    `/api/recruiter/applications/${applicationId}/status`,
    {
      status: status,
    }
  );

  return response.data;
};