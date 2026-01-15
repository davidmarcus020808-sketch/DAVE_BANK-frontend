// src/components/ProtectedRoute.jsx
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AccountContext } from "../context/AccountContext";

const ProtectedRoute = ({ children }) => {
  const { account, loading } = useContext(AccountContext);

  if (loading) {
    // Show a loading screen while checking session
    return (
      <div className="flex items-center justify-center min-h-screen text-yellow-400 bg-black">
        Loading...
      </div>
    );
  }

  if (!account) {
    // If no account (not logged in), redirect to login
    return <Navigate to="/login" replace />;
  }

  // User is logged in, render children
  return children;
};

export default ProtectedRoute;
