import axiosInstance from "./axiosInstance";

// Create company
export const createCompanyProfile = async (companyData) => {
  const response = await axiosInstance.post(
    "/api/recruiter/company",
    companyData
  );

  return response.data;
};

// Get company
export const getCompanyProfile = async () => {
  const response = await axiosInstance.get(
    "/api/recruiter/company"
  );

  return response.data;
};

// Update company
export const updateCompanyProfile = async (companyData) => {
  const response = await axiosInstance.put(
    "/api/recruiter/company",
    companyData
  );

  return response.data;
};

// Delete company
export const deleteCompanyProfile = async () => {
  const response = await axiosInstance.delete(
    "/api/recruiter/company"
  );

  return response.data;
};