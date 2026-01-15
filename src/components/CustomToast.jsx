// src/components/CustomToast.jsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, AlertTriangle, Info, Bell } from "lucide-react";
import toast from "react-hot-toast";

// Icon mapping
const icons = {
  success: <CheckCircle2 size={20} className="text-yellow-400" />,
  error: <AlertTriangle size={20} className="text-red-400" />,
  info: <Info size={20} className="text-blue-400" />,
  alert: <Bell size={20} className="text-yellow-400" />,
};

// Background colors for different types
const bgColors = {
  success: "bg-black/80 border-yellow-600",
  error: "bg-black/80 border-red-600",
  info: "bg-black/80 border-blue-600",
  alert: "bg-black/80 border-yellow-600",
};

const CustomToast = ({ toastId, type = "info", message }) => {
  return (
    <AnimatePresence>
      <motion.div
        layout
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ duration: 0.25 }}
        className={`flex items-center gap-3 px-5 py-4 rounded-2xl border shadow-xl backdrop-blur-md text-yellow-50 ${bgColors[type]} w-[350px] md:w-[400px]`}
      >
        <div className="mt-0.5">{icons[type]}</div>
        <div className="flex-1 text-sm md:text-base leading-snug">{message}</div>
        <button
          onClick={() => toast.dismiss(toastId)}
          className="text-yellow-300/70 hover:text-yellow-100 transition"
        >
          <X size={18} />
        </button>
      </motion.div>
    </AnimatePresence>
  );
};

export default CustomToast;
