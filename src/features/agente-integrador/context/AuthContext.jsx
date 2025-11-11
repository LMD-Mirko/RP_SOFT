import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState(null); // "admin" o "user"

  const selectRole = (selectedRole) => setRole(selectedRole);
  const logout = () => setRole(null);

  return (
    <AuthContext.Provider value={{ role, selectRole, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
