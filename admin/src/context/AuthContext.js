import React, { createContext, useState, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [adminToken, setAdminToken] = useState(
    localStorage.getItem("adminToken") || null,
  );

  const login = (token) => {
    setAdminToken(token);
    localStorage.setItem("adminToken", token);
  };

  const logout = () => {
    setAdminToken(null);
    localStorage.removeItem("adminToken");
  };

  const isAuthenticated = () => {
    return !!adminToken;
  };

  return (
    <AuthContext.Provider
      value={{ adminToken, login, logout, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within AuthProvider");
  }
  return context;
};
