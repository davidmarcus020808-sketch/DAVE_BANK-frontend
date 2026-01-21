// src/pages/SettingsPage.jsx
import React, { useEffect, useRef, useState } from "react";
import { ArrowLeft, Moon, Sun, Lock, Fingerprint, Key, Info, HelpCircle, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Footer from "../components/Footer";
import { useToast } from "../context/ToastContext";
import axiosInstance from "../api/axiosInstance";

const weakPins = ["1234", "1111", "0000", "1212", "4321", "2222", "9999"];
const isWeakPin = (pin) => weakPins.includes(pin) || !/^\d{4}$/.test(pin);

const MasterPinInput = ({ length = 4, values, setValues, inputRefs, autoFocus }) => {
  const [show, setShow] = useState(Array(length).fill(false));

  useEffect(() => {
    if (autoFocus) {
      const idx = values.findIndex((v) => !v) || 0;
      inputRefs.current[idx]?.focus();
    }
  }, [autoFocus, values, inputRefs]);

  const maskDigit = (idx) => {
    setShow((s) => { const next = [...s]; next[idx] = true; return next; });
    setTimeout(() => setShow((s) => { const next = [...s]; next[idx] = false; return next; }), 450);
  };

  const handleChange = (e, idx) => {
    let v = e.target.value.replace(/\D/g, "").slice(-1);
    const next = [...values];
    next[idx] = v;
    setValues(next);
    if (v && idx < length - 1) inputRefs.current[idx + 1]?.focus();
    if (v) maskDigit(idx);
  };

  const handleKeyDown = (e, idx) => {
    const next = [...values];
    if (e.key === "Backspace") {
      e.preventDefault();
      if (next[idx]) next[idx] = "";
      else if (idx > 0) {
        next[idx - 1] = "";
        inputRefs.current[idx - 1]?.focus();
      }
      setValues(next);
    }
    if (e.key === "ArrowLeft" && idx > 0) inputRefs.current[idx - 1]?.focus();
    if (e.key === "ArrowRight" && idx < length - 1) inputRefs.current[idx + 1]?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteArr = (e.clipboardData.getData("text") || "").replace(/\D/g, "").slice(0, length).split("");
    const next = [...values];
    pasteArr.forEach((v, i) => { next[i] = v; maskDigit(i); });
    setValues(next);
    const firstEmpty = next.findIndex((v) => !v);
    inputRefs.current[firstEmpty === -1 ? length - 1 : firstEmpty]?.focus();
  };

  return (
    <div className="grid grid-cols-4 gap-4 justify-center mt-3">
      {Array.from({ length }).map((_, idx) => (
        <input
          key={idx}
          ref={(el) => (inputRefs.current[idx] = el)}
          inputMode="numeric"
          autoComplete="off"
          className="w-16 h-16 rounded-2xl bg-black/65 border-2 border-yellow-800/40 text-center text-3xl font-bold text-yellow-100 outline-none
                     focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400 transition"
          value={show[idx] ? values[idx] : values[idx] ? "•" : ""}
          onChange={(e) => handleChange(e, idx)}
          onKeyDown={(e) => handleKeyDown(e, idx)}
          onPaste={handlePaste}
          maxLength={1}
        />
      ))}
    </div>
  );
};

const SettingCard = ({ icon, title, toggle, onClick, isToggle }) => (
  <div
    onClick={onClick}
    className="flex items-center justify-between bg-[#0b0b0b]/85 border border-yellow-900/40 rounded-2xl p-4 cursor-pointer hover:shadow-[0_0_20px_rgba(255,215,0,0.12)] transition"
  >
    <div className="flex items-center gap-3">
      {icon}
      <span className="text-lg font-semibold">{title}</span>
    </div>
    {isToggle ? toggle : <span className="text-yellow-300 text-2xl font-bold">&gt;</span>}
  </div>
);

const SettingsPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [darkMode, setDarkMode] = useState(true);
  const [biometrics, setBiometrics] = useState(false);
  const [twoFA, setTwoFA] = useState(false);

  const [modalStep, setModalStep] = useState(0);
  const [oldPinVals, setOldPinVals] = useState(["", "", "", ""]);
  const [newPinVals, setNewPinVals] = useState(["", "", "", ""]);
  const [confirmPinVals, setConfirmPinVals] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);

  const oldRefs = useRef([]);
  const newRefs = useRef([]);
  const confirmRefs = useRef([]);

  const openChangePin = () => {
    setOldPinVals(["", "", "", ""]);
    setNewPinVals(["", "", "", ""]);
    setConfirmPinVals(["", "", "", ""]);
    setModalStep(1);
  };

  const handleOldSubmit = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.post("/validate-pin/", { pin: oldPinVals.join("") });

      if (res.data.valid) setModalStep(2);
      else {
        showToast("error", "Incorrect current PIN");
        setOldPinVals(["", "", "", ""]);
        oldRefs.current[0]?.focus();
      }
    } catch {
      showToast("error", "Failed to validate PIN. Try again.");
    } finally { setLoading(false); }
  };

  const handleNewSubmit = () => {
    const newPin = newPinVals.join("");
    if (newPin.length < 4) { showToast("alert", "Enter a 4-digit PIN"); return; }
    if (isWeakPin(newPin)) { 
      showToast("error", "Weak PIN detected. Choose a stronger PIN."); 
      setNewPinVals(["", "", "", ""]); 
      newRefs.current[0]?.focus(); 
      return; 
    }
    setModalStep(3);
  };

const handleConfirmSubmit = async () => {
  if (newPinVals.join("") !== confirmPinVals.join("")) {
    showToast("error", "PINs do not match");
    setConfirmPinVals(["", "", "", ""]);
    confirmRefs.current[0]?.focus();
    return;
  }
try {
  setLoading(true);
  await axiosInstance.post("/update-pin/", { pin: newPinVals.join("") });

  setModalStep(0);
  showToast("success", "PIN changed successfully"); // show success immediately

  // Refresh account, but handle errors silently
  try {
    await fetchAccount();
  } catch (err) {
    console.error("Failed to refresh account after PIN change:", err);
  }

  setNewPinVals(["", "", "", ""]);
  setConfirmPinVals(["", "", "", ""]);
} catch {
  showToast("error", "Failed to update PIN. Try again.");
} finally { 
  setLoading(false); 
}
};

  return (
    <div className="min-h-screen bg-black text-yellow-50 w-full px-6 py-8 flex flex-col">
      <div className="w-full max-w-3xl mx-auto">
        <div className="flex items-center mb-8">
          <button onClick={() => navigate(-1)} className="absolute top-5 left-5 bg-white/10 p-3 rounded-full hover:bg-white/20 transition">
            <ArrowLeft className="mr-2" /> Back
          </button>
          <h1 className="text-3xl font-bold ml-4">Settings</h1>
        </div>

        <div className="space-y-5">
          <SettingCard icon={darkMode ? <Moon /> : <Sun />} title="Dark Mode" isToggle toggle={
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={darkMode} onChange={() => setDarkMode(!darkMode)} className="sr-only peer" />
              <div className="w-12 h-6 bg-yellow-700/50 rounded-full peer-checked:bg-yellow-400 transition" />
              <div className={`absolute left-1 top-1 bg-black w-4 h-4 rounded-full transition-transform ${darkMode ? "translate-x-6" : ""}`} />
            </label>
          }/>
          <SettingCard icon={<Lock />} title="Change PIN" onClick={openChangePin} />
          <SettingCard icon={<Key />} title="Two-Factor Authentication" isToggle toggle={
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={twoFA} onChange={() => setTwoFA(!twoFA)} className="sr-only peer" />
              <div className="w-12 h-6 bg-yellow-700/50 rounded-full peer-checked:bg-yellow-400 transition" />
              <div className={`absolute left-1 top-1 bg-black w-4 h-4 rounded-full transition-transform ${twoFA ? "translate-x-6" : ""}`} />
            </label>
          }/>
          <SettingCard icon={<Fingerprint />} title="Biometrics" isToggle toggle={
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={biometrics} onChange={() => setBiometrics(!biometrics)} className="sr-only peer" />
              <div className="w-12 h-6 bg-yellow-700/50 rounded-full peer-checked:bg-yellow-400 transition" />
              <div className={`absolute left-1 top-1 bg-black w-4 h-4 rounded-full transition-transform ${biometrics ? "translate-x-6" : ""}`} />
            </label>
          }/>
          <SettingCard icon={<HelpCircle />} title="Help Center" onClick={() => navigate("/help-center")} />
          <SettingCard icon={<Info />} title="About" onClick={() => navigate("/about")} />
          <SettingCard icon={<LogOut className="text-red-500" />} title="Logout" onClick={() => navigate("/logout")} />
        </div>
      </div>

      <div className="mt-10 pt-6 border-t border-yellow-900/10"><Footer /></div>

      {/* PIN Modal */}
      <AnimatePresence>
        {modalStep > 0 && (
          <motion.div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="bg-[#111]/95 rounded-3xl p-6 max-w-md w-full text-yellow-50 shadow-[0_0_40px_rgba(255,215,0,0.18)]"
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}
              transition={{ type: "spring", stiffness: 250, damping: 25 }}>

              <div className="flex justify-center gap-2 mb-4">
                {[1,2,3].map(s => <div key={s} className={`w-3 h-3 rounded-full ${modalStep >= s ? "bg-yellow-400" : "bg-yellow-700/40"}`} />)}
              </div>

              {modalStep === 1 && <>
                <h3 className="text-xl font-bold text-center mb-2">Enter Current PIN</h3>
                <p className="text-sm text-yellow-300 text-center mb-3">Type your current 4-digit PIN</p>
                <MasterPinInput length={4} values={oldPinVals} setValues={setOldPinVals} inputRefs={oldRefs} autoFocus />
                <button onClick={handleOldSubmit} disabled={loading} className="w-full mt-5 py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-yellow-300 text-black font-semibold hover:from-yellow-400 hover:to-yellow-200 transition">
                  {loading ? "Validating..." : "Next"}
                </button>
              </>}

              {modalStep === 2 && <>
                <h3 className="text-xl font-bold text-center mb-2">Create New PIN</h3>
                <p className="text-sm text-yellow-300 text-center mb-3">Choose a secure 4-digit PIN</p>
                <MasterPinInput length={4} values={newPinVals} setValues={setNewPinVals} inputRefs={newRefs} autoFocus />
                <button onClick={handleNewSubmit} className="w-full mt-5 py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-yellow-300 text-black font-semibold hover:from-yellow-400 hover:to-yellow-200 transition">
                  Next
                </button>
              </>}

              {modalStep === 3 && <>
                <h3 className="text-xl font-bold text-center mb-2">Confirm New PIN</h3>
                <p className="text-sm text-yellow-300 text-center mb-3">Re-enter your new PIN to confirm</p>
                <MasterPinInput length={4} values={confirmPinVals} setValues={setConfirmPinVals} inputRefs={confirmRefs} autoFocus />
                <button onClick={handleConfirmSubmit} disabled={loading} className="w-full mt-5 py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-yellow-300 text-black font-semibold hover:from-yellow-400 hover:to-yellow-200 transition">
                  {loading ? "Saving..." : "Save"}
                </button>
              </>}

              <button onClick={() => setModalStep(0)} className="w-full mt-3 py-3 rounded-xl border border-yellow-700 text-yellow-300 hover:bg-yellow-800/30 transition">
                Cancel
              </button>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SettingsPage;
