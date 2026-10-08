import { createContext, useContext, useState } from "react";
import { loginUser, registerUser } from "../api/authApi";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(
    localStorage.getItem("token")
  );

  const [role, setRole] = useState(
    localStorage.getItem("role")
  );

  const login = async (loginData) => {
    const response = await loginUser(loginData);

    console.log("Login Response:", response);

    localStorage.setItem("token", response.token);

    if (response.role) {
      localStorage.setItem("role", response.role);
      setRole(response.role);
    }

    setToken(response.token);

    return response;
  };

  const register = async (registerData) => {
    const response = await registerUser(registerData);

    console.log("Register Response:", response);

    return response;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    setToken(null);
    setRole(null);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{
        token,
        role,
        isAuthenticated,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};