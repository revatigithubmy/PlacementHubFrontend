import axiosInstance from "./axiosInstance";


export const getMyJobs = async () => {
  const response = await axiosInstance.get("/api/recruiter/jobs");
  return response.data;
};

export const getRecruiterJobById = async (jobId) => {
  const response = await axiosInstance.get(
    `/api/recruiter/jobs/${jobId}`
  );

  return response.data;
};


export const createJob = async (jobData) => {
  const response = await axiosInstance.post(
    "/api/recruiter/jobs",
    jobData
  );

  return response.data;
};

export const updateJob = async (jobId, jobData) => {
  const response = await axiosInstance.put(
    `/api/recruiter/jobs/${jobId}`,
    jobData
  );

  return response.data;
};


export const deleteJob = async (jobId) => {
  const response = await axiosInstance.delete(
    `/api/recruiter/jobs/${jobId}`
  );

  return response.data;
};