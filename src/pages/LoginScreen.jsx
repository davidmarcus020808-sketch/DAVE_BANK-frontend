import React, { useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn, Phone, Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../context/ToastContext";
import { AccountContext } from "../context/AccountContext";
import axiosInstance from "../api/axiosInstance";

export default function LoginScreen() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { fetchAccount, fetchTransactions, setAccount } = useContext(AccountContext);

  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState(["", "", "", ""]);
  const [showPin, setShowPin] = useState(false);
  const [loading, setLoading] = useState(false);
  const pinRefs = useRef([]);

  const handlePinChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    if (value && index < 3) pinRefs.current[index + 1]?.focus();
    if (!value && index > 0) pinRefs.current[index - 1]?.focus();
  };

const handleLogin = async (e) => {
  e.preventDefault();
  const enteredPin = pin.join("");

  if (enteredPin.length !== 4) {
    showToast("error", "Please enter your 4-digit PIN");
    return;
  }

  setLoading(true);
  try {
    // 1️⃣ Call login endpoint
    const res = await axiosInstance.post("/login/", { phone, pin: enteredPin });

    if (!res.data.success) {
      showToast("error", res.data.message || "Invalid login credentials");
      setPin(["", "", "", ""]);
      pinRefs.current[0]?.focus();
      return;
    }

    // 2️⃣ Save access token to localStorage
    const accessToken = res.data.access;
    localStorage.setItem("accessToken", accessToken);

    // 3️⃣ Set Authorization header for axiosInstance
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

    // 4️⃣ Wait briefly to ensure refresh_token cookie is stored
    await new Promise(resolve => setTimeout(resolve, 50));

    // 5️⃣ Fetch account info & transactions in sequence
    try {
      await fetchAccount();           // fetch user account
      await fetchTransactions();      // fetch latest transactions
    } catch (fetchError) {
      console.error("Error fetching account or transactions:", fetchError);
      showToast("error", "Failed to load account data. Try refreshing.");
    }

    // 6️⃣ Navigate to dashboard
    showToast("success", res.data.message || "Login successful!");
    navigate("/dashboard");

  } catch (err) {
    console.error("Login error:", err);
    showToast(err.response?.data?.message || "Login failed. Try again.");
    setPin(["", "", "", ""]);
    pinRefs.current[0]?.focus();
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black px-6 text-yellow-50">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center mb-12"
      >
        <div className="w-24 h-24 bg-gradient-to-br from-yellow-600 to-yellow-400 rounded-3xl flex items-center justify-center text-black font-extrabold text-4xl shadow-lg">
          D
        </div>
        <h1 className="text-4xl font-bold mt-3 tracking-wide text-yellow-400">
          DAVE<span className="text-yellow-200">BANK</span>
        </h1>
        <p className="text-yellow-200/70 text-sm mt-1 text-center">Smart banking for everyone</p>
      </motion.div>

      <motion.form
        onSubmit={handleLogin}
        autoComplete="off"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-lg bg-[#111]/80 border border-yellow-800/40 rounded-3xl shadow-xl p-10 space-y-6"
      >
        {/* Phone Input */}
        <div>
          <label className="text-sm text-yellow-200/90 mb-2 block font-medium">Phone Number</label>
          <div className="flex items-center border border-yellow-700/50 rounded-xl px-4 bg-black/40 focus-within:border-yellow-500/70 transition">
            <Phone size={20} className="text-yellow-400" />
            <input
              type="tel"
              value={phone}
              autoComplete="new-password"
              onChange={(e) => setPhone(e.target.value.slice(0, 11))}
              placeholder="Enter phone number"
              className="flex-1 bg-transparent text-yellow-50 placeholder-yellow-400/40 p-3 outline-none text-base"
              maxLength={11}
              required
            />
          </div>
        </div>

        {/* PIN Input */}
        <div>
          <label className="text-sm text-yellow-200/90 mb-2 block font-medium">4-Digit PIN</label>
          <div className="flex justify-between gap-4">
            {pin.map((digit, idx) => (
              <div
                key={idx}
                className="w-16 h-16 md:w-20 md:h-20 border border-yellow-700/50 rounded-xl flex items-center justify-center bg-black/40 relative shadow-sm"
              >
                <input
                  ref={(el) => (pinRefs.current[idx] = el)}
                  type={showPin ? "text" : "password"}
                  inputMode="numeric"
                  autoComplete="new-password"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handlePinChange(idx, e.target.value)}
                  className="bg-transparent text-center text-yellow-50 text-2xl font-bold w-full h-full outline-none"
                />

                <AnimatePresence>
                  {digit && !showPin && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="w-4 h-4 bg-yellow-400 rounded-full absolute"
                    />
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setShowPin(!showPin)}
            className="text-yellow-400/80 hover:text-yellow-300 text-sm mt-3 flex items-center gap-1 float-right"
          >
            {showPin ? <EyeOff size={16} /> : <Eye size={16} />} {showPin ? "Hide PIN" : "Show PIN"}
          </button>
        </div>

        <motion.button
          whileTap={{ scale: 0.96 }}
          disabled={loading}
          type="submit"
          className="w-full py-3 md:py-4 rounded-xl font-semibold text-black bg-gradient-to-r from-yellow-500 to-yellow-300 hover:from-yellow-400 hover:to-yellow-200 transition-all shadow-md flex justify-center items-center"
        >
          {loading ? <span className="animate-pulse">Logging in...</span> : (<><LogIn size={20} className="mr-2" /> Login</>)}
        </motion.button>

        <p className="text-center text-yellow-200/70 text-sm mt-3">
          Don’t have an account?{' '}
          <span
            onClick={() => navigate('/register')}
            className="text-yellow-400 font-semibold cursor-pointer hover:underline"
          >
            Register
          </span>
        </p>
      </motion.form>

      <p className="text-xs text-yellow-500/60 mt-10">© {new Date().getFullYear()} DAVE Bank</p>
    </div>
  );
}
