import axiosInstance from "./axiosInstance";

export const getStudentProfile = async () => {
  const response = await axiosInstance.get("/api/student/profile");
  return response.data;
};

export const createStudentProfile = async (profileData) => {
  const response = await axiosInstance.post(
    "/api/student/profile",
    profileData
  );

  return response.data;
};

export const updateStudentProfile = async (profileData) => {
  const response = await axiosInstance.put(
    "/api/student/profile",
    profileData
  );

  return response.data;
};