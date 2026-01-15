import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";

const ConfirmModal = ({
  show,
  onClose,
  onConfirm,
  title,
  message,
  processing = false,
}) => {
  if (!show) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-gradient-to-b from-[#141414] to-[#0a0a0a] border border-yellow-700/40 
            rounded-3xl p-8 sm:p-10 text-yellow-50 w-[90%] sm:w-[480px] lg:w-[600px]
            shadow-[0_0_25px_rgba(255,215,0,0.15)] relative overflow-hidden"
            initial={{ y: 40, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {/* Glow Accent */}
            <div className="absolute inset-0 bg-gradient-to-tr from-yellow-500/5 to-transparent pointer-events-none" />

            {/* Content */}
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-yellow-300 tracking-tight mb-3">
                {title}
              </h2>

              <p className="text-yellow-200/70 text-base leading-relaxed">
                {message}
              </p>

              <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8">
                <button
                  onClick={onClose}
                  disabled={processing}
                  className="px-6 py-2.5 rounded-xl border border-yellow-700 text-yellow-300 
                  hover:bg-yellow-900/40 hover:text-yellow-200 transition font-semibold
                  disabled:opacity-50 text-sm sm:text-base"
                >
                  No, Cancel
                </button>

                <button
                  onClick={onConfirm}
                  disabled={processing}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 
                  hover:from-red-500 hover:to-red-600 text-white font-semibold flex items-center justify-center gap-2 
                  shadow-[0_0_15px_rgba(255,0,0,0.2)] transition disabled:opacity-50 text-sm sm:text-base"
                >
                  {processing && <Loader2 className="animate-spin h-4 w-4" />}
                  {processing ? "Logging out..." : "Yes, I’m sure"}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;
