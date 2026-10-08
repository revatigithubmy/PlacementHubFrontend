import axiosInstance from "./axiosInstance";

// Get recruiter profile
export const getRecruiterProfile = async () => {
  const response = await axiosInstance.get("/api/recruiter/profile");
  return response.data;
};

// Create recruiter profile
export const createRecruiterProfile = async (profileData) => {
  const response = await axiosInstance.post(
    "/api/recruiter/profile",
    profileData
  );
  return response.data;
};

// Update recruiter profile
export const updateRecruiterProfile = async (profileData) => {
  const response = await axiosInstance.put(
    "/api/recruiter/profile",
    profileData
  );
  return response.data;
};