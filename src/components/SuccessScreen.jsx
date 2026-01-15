// src/components/SuccessScreen.jsx
import React from "react";
import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion"; // required


const generateConfetti = (count = 25) =>
  Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 100, // %
    delay: Math.random() * 1.5, // seconds
    size: Math.random() * 8 + 4, // px
    duration: Math.random() * 2 + 2, // seconds
  }));

const confettiPieces = generateConfetti(30);

const SuccessScreen = ({ title, message, onRepeat, onHome, onViewReceipt }) => {
  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black text-center px-6 py-12 overflow-hidden">
      {/* Soft Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,215,0,0.1),transparent_70%)] pointer-events-none"></div>

      {/* 🎇 Confetti Layer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {confettiPieces.map(({ id, left, delay, size, duration }) => (
          <motion.div
            key={id}
            initial={{ y: -50, opacity: 0 }}
            animate={{
              y: "110vh",
              opacity: [0, 1, 1, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              delay,
              duration,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-0"
            style={{
              left: `${left}%`,
              width: size,
              height: size,
              borderRadius: "2px",
              background:
                Math.random() > 0.5
                  ? "linear-gradient(45deg, #FFD700, #FFB700)"
                  : "linear-gradient(45deg, #FFEC8B, #FFC107)",
              boxShadow: "0 0 10px rgba(255,215,0,0.5)",
            }}
          />
        ))}
      </div>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 bg-black/80 border border-yellow-500/40 shadow-[0_0_50px_rgba(255,215,0,0.15)] rounded-3xl p-10 sm:p-12 w-full max-w-md lg:max-w-lg text-yellow-500 backdrop-blur-xl"
      >
        {/* Animated Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 120, damping: 10 }}
          className="flex justify-center mb-8"
        >
          <div className="bg-yellow-500/10 p-6 rounded-full border border-yellow-500/40 shadow-[0_0_30px_rgba(255,215,0,0.25)]">
            <CheckCircle2 className="text-yellow-400" size={80} />
          </div>
        </motion.div>

        {/* Title & Message */}
        <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 text-yellow-400 tracking-wide drop-shadow-[0_0_6px_rgba(255,215,0,0.4)]">
          {title}
        </h2>
        <p className="text-gray-400 text-base sm:text-lg leading-relaxed max-w-lg mx-auto mb-10">
          {message}
        </p>

        {/* Buttons */}
        <div className="flex flex-col gap-4">
          {onViewReceipt && (
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={onViewReceipt}
              className="relative w-full overflow-hidden border border-yellow-500 text-yellow-500 py-3 sm:py-4 rounded-xl font-semibold group"
            >
              <span className="relative z-10">View Receipt</span>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-400 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
            </motion.button>
          )}

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={onRepeat}
            className="relative w-full bg-yellow-500 text-black py-3 sm:py-4 rounded-xl font-semibold shadow-md hover:shadow-yellow-500/20 transition-all duration-300"
          >
            <span className="relative z-10">Make Another Payment</span>
            <div className="absolute inset-0 bg-yellow-400 opacity-0 hover:opacity-100 transition-all duration-300"></div>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={onHome}
            className="w-full border border-gray-700 text-gray-300 py-3 sm:py-4 rounded-xl font-semibold hover:bg-gray-900/80 hover:text-yellow-400 transition-all duration-300"
          >
            Go Home
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default SuccessScreen;
