import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Gamepad2,
  Building2,
  ShieldCheck,
  BarChart2,
  MoreHorizontal,
  ArrowLeft,
  Send,
} from "lucide-react";
import Footer from "../components/Footer";

const featureIcons = {
  Betting: <Gamepad2 className="w-12 h-12 text-yellow-400" />,
  Business: <Building2 className="w-12 h-12 text-yellow-400" />,
  Insurance: <ShieldCheck className="w-12 h-12 text-yellow-400" />,
  Finance: <BarChart2 className="w-12 h-12 text-yellow-400" />,
  More: <MoreHorizontal className="w-12 h-12 text-yellow-400" />,
};

const featureColors = {
  Betting: "from-yellow-400 to-yellow-600",
  Business: "from-yellow-400 to-yellow-600",
  Insurance: "from-yellow-400 to-yellow-600",
  Finance: "from-yellow-400 to-yellow-600",
  More: "from-yellow-400 to-yellow-500",
};

const ComingSoon = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [notified, setNotified] = useState(false);

  const feature = location.state?.feature || "Feature";
  const gradient = featureColors[feature] || "from-yellow-400 to-yellow-600";
  const icon = featureIcons[feature] || featureIcons["More"];

  const handleNotify = () => {
    if (!email.trim() || !email.includes("@")) return alert("Please enter a valid email.");
    setNotified(true);
    setEmail("");
  };

  // Generate background floating particles
  const particles = Array.from({ length: 40 }).map((_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 5,
    duration: Math.random() * 10 + 5,
  }));

  // Generate sparkles around icon
  const sparkles = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    size: Math.random() * 6 + 3,
    angle: Math.random() * 360,
    distance: Math.random() * 50 + 40,
    delay: Math.random() * 3,
  }));

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black relative overflow-hidden text-yellow-400 px-4 py-10">

      {/* Floating Particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-yellow-400 opacity-60"
          style={{ width: p.size, height: p.size, top: `${p.y}%`, left: `${p.x}%` }}
          animate={{ y: ["0%", "100%", "0%"], x: [`${p.x}%`, `${p.x + 5}%`, `${p.x}%`], opacity: [0.3, 0.8, 0.3] }}
          transition={{ repeat: Infinity, duration: p.duration, delay: p.delay, ease: "easeInOut" }}
        />
      ))}

      {/* Background glow circles */}
      <motion.div
        className={`absolute w-[500px] h-[500px] rounded-full blur-3xl opacity-20 bg-gradient-to-br ${gradient}`}
        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
        transition={{ repeat: Infinity, duration: 6 }}
      />
      <motion.div
        className={`absolute w-[400px] h-[400px] rounded-full blur-2xl opacity-15 bg-gradient-to-br ${gradient} top-1/4 left-1/4`}
        animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.25, 0.1] }}
        transition={{ repeat: Infinity, duration: 5 }}
      />

      {/* Glassmorphic Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-black/50 backdrop-blur-xl p-10 rounded-3xl shadow-2xl max-w-3xl w-full border border-yellow-600 flex flex-col items-center relative z-10"
      >
        {/* Icon with Sparkles */}
        <div className="relative w-28 h-28 mb-6">
          {sparkles.map((s) => (
            <motion.div
              key={s.id}
              className="absolute rounded-full bg-yellow-400 opacity-80"
              style={{
                width: s.size,
                height: s.size,
                top: "50%",
                left: "50%",
                translateX: "-50%",
                translateY: "-50%",
              }}
              animate={{
                x: [0, Math.cos((s.angle * Math.PI) / 180) * s.distance, 0],
                y: [0, Math.sin((s.angle * Math.PI) / 180) * s.distance, 0],
                opacity: [0.2, 0.8, 0.2],
              }}
              transition={{ repeat: Infinity, duration: 2 + Math.random() * 2, delay: s.delay }}
            />
          ))}
          <motion.div
            className={`absolute w-28 h-28 rounded-full bg-gradient-to-r ${gradient} flex items-center justify-center shadow-xl`}
            animate={{ scale: [1, 1.1, 1], boxShadow: ["0 0 25px rgba(255,215,0,0.3)", "0 0 45px rgba(255,215,0,0.5)", "0 0 25px rgba(255,215,0,0.3)"] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            {icon}
          </motion.div>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl lg:text-5xl font-bold text-yellow-400 mb-4 text-center"
        >
          {feature} Coming Soon 🚀
        </motion.h1>

        <p className="text-yellow-300 text-sm lg:text-base leading-relaxed mb-8 text-center max-w-xl">
          We're crafting something special for you. The{" "}
          <span className="font-semibold text-yellow-400">{feature.toLowerCase()}</span>{" "}
          feature will be available soon. Stay tuned for updates!
        </p>

        {/* Notify Section */}
        {!notified ? (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="flex flex-col sm:flex-row gap-4 w-full max-w-md mb-6">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-5 py-3 rounded-xl border border-yellow-600 bg-black/70 text-yellow-200 focus:ring-2 focus:ring-yellow-400 outline-none text-sm shadow-sm"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleNotify}
              className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-semibold rounded-xl shadow-md flex items-center justify-center gap-2"
            >
              <Send size={16} /> Notify Me
            </motion.button>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-green-400 font-medium text-sm mb-6">
            ✅ You’ll be notified when {feature.toLowerCase()} launches!
          </motion.div>
        )}

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate(-1)}
          className="w-full lg:w-1/2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-semibold py-3 rounded-xl shadow-md hover:shadow-lg transition mb-2"
        >
          <ArrowLeft className="inline-block mr-2 w-4 h-4" /> Back to Dashboard
        </motion.button>
      </motion.div>

      <p className="mt-8 text-xs text-yellow-400 z-10 text-center">
        © 2025 <span className="font-semibold text-yellow-400">DAVEBANK</span>. All Rights Reserved.
      </p>
      <Footer />
    </div>
    
  );
};

export default ComingSoon;
