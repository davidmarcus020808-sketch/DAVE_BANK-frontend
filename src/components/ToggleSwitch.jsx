// src/components/ToggleSwitch.jsx
import React from "react";

const ToggleSwitch = ({ checked, onChange, darkMode }) => (
  <label className="relative inline-flex items-center cursor-pointer">
    <input type="checkbox" checked={checked} onChange={onChange} className="sr-only peer" />
    <div
      className={`w-12 h-6 rounded-full transition ${
        darkMode ? "bg-yellow-700/50 peer-checked:bg-yellow-400" : "bg-gray-300 peer-checked:bg-gray-500"
      }`}
    />
    <div
      className={`absolute left-1 top-1 w-4 h-4 rounded-full transition-transform ${
        darkMode ? "bg-black" : "bg-white"
      } ${checked ? "translate-x-6" : ""}`}
    />
  </label>
);

export default ToggleSwitch;
