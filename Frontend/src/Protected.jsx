import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

// ✅ ADMIN PROTECTION
const ProtectedAdmin = ({ children }) => {
  const token = useSelector((state) => state.auth.token) || localStorage.getItem("token");
  const location = useLocation();

  let role;
  if (token) {
    try {
      const decoded = jwtDecode(token);
      role = decoded.role;
    } catch (error) {
      console.error("Invalid token", error);
    }
  }

  if (!token || role !== "admin") {
    return <Navigate to="/Login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
};

// ✅ USER PROTECTION
const ProtectedUser = ({ children }) => {
  const token = useSelector((state) => state.auth.token) || localStorage.getItem("token");
  const location = useLocation();

  let role;
  if (token) {
    try {
      const decoded = jwtDecode(token);
      role = decoded.role;
    } catch (error) {
      console.error("Invalid token", error);
    }
  }

  if (!token || role !== "user") {
    return <Navigate to="/Login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
};

export { ProtectedAdmin, ProtectedUser };
