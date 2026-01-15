// src/components/Services.jsx
import React from "react";
import { motion } from "framer-motion";

const ServiceButton = ({ onClick, icon: Icon, label, index }) => (
  <motion.button
    onClick={onClick}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05, duration: 0.3 }}
    className="flex flex-col items-center justify-center gap-2 bg-black rounded-xl p-4 sm:p-5 shadow-sm border border-yellow-500/20 hover:shadow-[0_0_12px_rgba(255,215,0,0.4)] hover:border-yellow-400 transition-all duration-300"
  >
    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-yellow-400/10 flex items-center justify-center text-yellow-400">
      <Icon size={22} />
    </div>
    <span className="text-xs sm:text-sm font-medium text-yellow-300 text-center">
      {label}
    </span>
  </motion.button>
);

const Services = ({ services, onServiceClick }) => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.05 } },
      }}
      className="bg-black rounded-2xl p-6 shadow-lg border border-yellow-500/20"
    >
      <h4 className="text-md sm:text-lg font-semibold text-yellow-400 mb-5">
        Services
      </h4>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 xl:grid-cols-4 gap-4 sm:gap-5">
        {services.map((s, index) => (
          <ServiceButton
            key={s.id}
            index={index}
            onClick={() => onServiceClick(s.id, s.label)}
            icon={s.icon}
            label={s.label}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default Services;
