// src/pages/Register.jsx
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { User, Phone, Mail, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "../context/ToastContext";
import axiosInstance from "../api/axiosInstance";

// Nigerian states and cities
const nigeriaData = { /* ... same as your current object ... */ };
const nigeriaStates = Object.keys(nigeriaData);

const Register = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    phone: "",
    email: "",
    state: "",
    city: "",
    pin: Array(4).fill(""),
    confirmPin: Array(4).fill(""),
  });
  const [showPin, setShowPin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const pinRefs = useRef({ pin: [], confirmPin: [] });

  // --------------------------
  // Input handlers
  // --------------------------
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handlePinChange = (index, value, type = "pin") => {
    if (!/^\d*$/.test(value)) return;
    const newPin = [...formData[type]];
    newPin[index] = value;
    setFormData({ ...formData, [type]: newPin });

    if (value && index < 3) pinRefs.current[type][index + 1]?.focus();
    if (!value && index > 0) pinRefs.current[type][index - 1]?.focus();
  };

  const handleNext = () => {
    if (step === 1) {
      const { firstName, lastName, dob } = formData;
      if (!firstName || !lastName || !dob) {
        showToast("error", "Please fill all personal info fields ❌");
        return;
      }
    } else if (step === 2) {
      const { phone, email, state, city } = formData;
      if (!phone || !email || !state || !city) {
        showToast("error", "Please fill all contact & address fields ❌");
        return;
      }
    }
    setStep(step + 1);
  };

  const handleBack = () => setStep(step - 1);

  // --------------------------
  // Form submission
  // --------------------------
const handleRegister = async (e) => {
  e.preventDefault();
  const { pin, confirmPin } = formData;

  // Validate PINs first
  if (pin.includes("") || confirmPin.includes("")) {
    showToast("success", "Please enter and confirm your 4-digit PIN");
    return;
  }
  if (pin.join("") !== confirmPin.join("")) {
    showToast("error", "PINs do not match ❌");
    return;
  }
  if (!acceptedTerms) {
    showToast("error", "You must accept Terms & Conditions ❌");
    return;
  }

  setLoading(true);

  const payload = {
    firstName: formData.firstName,
    lastName: formData.lastName,
    dob: formData.dob,
    phone: formData.phone,
    email: formData.email,
    state: formData.state || "",
    city: formData.city || "",
    pin: pin.join(""), // Array -> string
  };

  console.log("Register payload:", payload); // ✅ log the payload

  try {
    const { data } = await axiosInstance.post("/register/", payload);
    console.log("Register response:", data); // ✅ log the response

    if (data.success) {
      showToast("success", data.message || "Account created successfully!");
      navigate("/login");
    } else {
      showToast("error", data.message || "Registration failed ❌");
    }
  } catch (error) {
    console.error("Registration error details:", error.response?.data || error);
    showToast(
      "error",
      error.response?.data?.errors
        ? JSON.stringify(error.response.data.errors)
        : "Network/server error ❌"
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black px-6 text-yellow-50">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center mb-10"
      >
        <div className="w-28 h-28 bg-gradient-to-br from-yellow-600 to-yellow-400 rounded-3xl flex items-center justify-center text-black font-extrabold text-5xl shadow-[0_0_25px_rgba(255,215,0,0.4)]">
          D
        </div>
        <h1 className="text-5xl font-bold mt-3 tracking-wide text-yellow-400 text-center">
          Welcome to <span className="text-yellow-200">DAVE BANK</span>
        </h1>
        <p className="text-yellow-200/70 text-lg mt-2 text-center max-w-2xl">
          Create your account in three easy steps.
        </p>
      </motion.div>

      {/* Form */}
      <motion.form
        onSubmit={handleRegister}
        className="w-full max-w-2xl bg-[#111]/80 border border-yellow-800/40 rounded-3xl shadow-[0_0_40px_rgba(255,215,0,0.15)] p-12 space-y-8"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        {/* Steps rendering */}
        {step === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[{ icon: <User />, label: "First Name", name: "firstName" },
              { icon: <User />, label: "Last Name", name: "lastName" },
              { icon: <Calendar />, label: "Date of Birth", name: "dob", type: "date" }]
              .map((field) => (
                <div key={field.name} className="flex flex-col">
                  <label className="text-lg text-yellow-200/80 mb-2">{field.label}</label>
                  <div className="flex items-center border border-yellow-700/50 rounded-xl px-4 py-3 bg-black/50">
                    {field.icon}
                    <input
                      type={field.type || "text"}
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                      className="flex-1 bg-transparent p-3 text-yellow-50 placeholder-yellow-400/50 outline-none text-lg"
                      required
                    />
                  </div>
                </div>
              ))}
          </div>
        )}

        {step === 2 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[{ icon: <Phone />, label: "Phone Number", name: "phone", type: "tel" },
              { icon: <Mail />, label: "Email", name: "email", type: "email" }]
              .map((field) => (
                <div key={field.name} className="flex flex-col">
                  <label className="text-lg text-yellow-200/80 mb-2">{field.label}</label>
                  <div className="flex items-center border border-yellow-700/50 rounded-xl px-4 py-3 bg-black/50">
                    {field.icon}
                    <input
                      type={field.type || "text"}
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                      className="flex-1 bg-transparent p-3 text-yellow-50 placeholder-yellow-400/50 outline-none text-lg"
                      required
                    />
                  </div>
                </div>
              ))}

            {/* State & City */}
            <div className="flex flex-col relative">
              <label className="text-lg text-yellow-200/80 mb-2">State</label>
              <input
                type="text"
                placeholder="Search state..."
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value, city: "" })}
                className="w-full p-3 bg-black/50 border border-yellow-700/50 rounded-xl outline-none text-yellow-50 mb-1"
              />
              {formData.state && (
                <div className="absolute z-10 w-full max-h-48 overflow-y-auto bg-black border border-yellow-700/50 rounded-xl mt-1">
                  {nigeriaStates.filter((s) => s.toLowerCase().includes(formData.state.toLowerCase()))
                    .map((s) => (
                      <div
                        key={s}
                        onClick={() => setFormData({ ...formData, state: s, city: "" })}
                        className="px-3 py-2 hover:bg-yellow-700/20 cursor-pointer text-yellow-50"
                      >
                        {s}
                      </div>
                    ))}
                </div>
              )}
            </div>

            <div className="flex flex-col relative">
              <label className="text-lg text-yellow-200/80 mb-2">City</label>
              <input
                type="text"
                placeholder={formData.state ? "Search city..." : "Select state first"}
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className={`w-full p-3 bg-black/50 border border-yellow-700/50 rounded-xl outline-none text-yellow-50 mb-1 ${!formData.state ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={!formData.state}
              />
              {formData.state && formData.city && (
                <div className="absolute z-10 w-full max-h-48 overflow-y-auto bg-black border border-yellow-700/50 rounded-xl mt-1">
                  {nigeriaData[formData.state]?.filter((c) => c.toLowerCase().includes(formData.city.toLowerCase()))
                    .map((c) => (
                      <div
                        key={c}
                        onClick={() => setFormData({ ...formData, city: c })}
                        className="px-3 py-2 hover:bg-yellow-700/20 cursor-pointer text-yellow-50"
                      >
                        {c}
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            {/* PIN Inputs */}
            {["pin", "confirmPin"].map((type) => (
              <div key={type} className="flex flex-col">
                <label className="text-lg text-yellow-200/80 mb-3">{type === "pin" ? "Create PIN" : "Confirm PIN"}</label>
                <div className="flex justify-between gap-4">
                  {formData[type].map((digit, idx) => (
                    <div key={idx} className="w-20 h-20 border border-yellow-700/50 rounded-xl flex items-center justify-center bg-black/50">
                      <input
                        ref={(el) => (pinRefs.current[type][idx] = el)}
                        type={showPin ? "text" : "password"}
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handlePinChange(idx, e.target.value, type)}
                        className="bg-transparent w-full h-full text-center text-yellow-50 text-2xl font-bold outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Terms */}
            <div className="flex items-center gap-3 mt-6">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="w-5 h-5 accent-yellow-400"
              />
              <label className="text-yellow-300 text-lg">
                I accept the{" "}
                <span className="underline cursor-pointer hover:text-yellow-200" onClick={() => navigate("/terms")}>
                  Terms and Conditions
                </span>
              </label>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center pt-4">
          {step > 1 ? (
            <button type="button" onClick={handleBack} className="text-yellow-200 font-semibold hover:text-yellow-400 transition">
              ← Back
            </button>
          ) : <div />}

          {step < 3 ? (
            <button type="button" onClick={handleNext} className="px-8 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl shadow-md transition">
              Next →
            </button>
          ) : (
            <button type="submit" disabled={loading} className="px-8 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl shadow-md transition disabled:opacity-60">
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          )}
        </div>
      </motion.form>

      {/* Login link */}
      <p className="mt-6 text-yellow-300/80 text-lg">
        Already have an account?{" "}
        <span className="text-yellow-400 cursor-pointer hover:underline" onClick={() => navigate("/login")}>
          Login
        </span>
      </p>
    </div>
  );
};

export default Register;
