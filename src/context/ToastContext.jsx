// src/context/ToastContext.jsx
import React, { createContext, useContext } from "react";
import toast from "react-hot-toast";
import CustomToast from "../components/CustomToast";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const showToast = (type, message) => {
    toast.custom((t) => (
      <CustomToast toastId={t.id} type={type} message={message} />
    ));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
