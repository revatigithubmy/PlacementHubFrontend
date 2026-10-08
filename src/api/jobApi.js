import axiosInstance from "./axiosInstance";

export const getAllJobs = async () => {
  const response = await axiosInstance.get("/api/jobs");

  return response.data;
};

export const getJobById = async (jobId) => {
  const response = await axiosInstance.get(
    `/api/jobs/${jobId}`
  );

  return response.data;
};

export const searchJobs = async (keyword) => {
  const response = await axiosInstance.get(
    "/api/jobs/search",
    {
      params: {
        keyword: keyword,
      },
    }
  );

  return response.data;
};