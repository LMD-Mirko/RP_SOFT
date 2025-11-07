import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RequireRole({ role, children }) {
  const { currentRole } = useAuth();
  return currentRole === role ? children : <Navigate to="/" replace />;
}
