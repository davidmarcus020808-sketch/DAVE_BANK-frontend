// src/pages/DataPage.jsx
import React, { useState, useContext } from "react";
import { ArrowLeft, Loader2, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AccountContext } from "../context/AccountContext";
import { useToast } from "../context/ToastContext";
import SuccessScreen from "../components/SuccessScreen";
import Receipt from "../components/Receipt";
import Footer from "../components/Footer";
import ConfirmationModal from "../components/ConfirmationModal";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "../api/axiosInstance";

import mtnLogo from "../assets/mtn.png";
import airtelLogo from "../assets/airtel.png";
import gloLogo from "../assets/glo.jpeg";
import nineMobileLogo from "../assets/9mobile.jpeg";

const countries = [
  { code: "+234", name: "Nigeria" },
  { code: "+1", name: "USA" },
  { code: "+44", name: "UK" },
  { code: "+233", name: "Ghana" },
];

const providers = [
  { name: "MTN", logo: mtnLogo },
  { name: "Airtel", logo: airtelLogo },
  { name: "GLO", logo: gloLogo },
  { name: "9mobile", logo: nineMobileLogo },
];

const plans = [
  { label: "50MB - ₦100", value: 100, duration: "Daily" },
  { label: "100MB - ₦200", value: 200, duration: "Daily" },
  { label: "500MB - ₦500", value: 500, duration: "Daily", recommended: true },
  { label: "1GB - ₦1000", value: 1000, duration: "Daily" },
  { label: "2GB - ₦2000", value: 2000, duration: "Daily" },
  { label: "10GB - ₦8500", value: 8500, duration: "Weekly", recommended: true },
  { label: "100GB - ₦65000", value: 65000, duration: "Monthly", recommended: true },
];

const DataPage = () => {
  const navigate = useNavigate();
  const { account = { balance: 0 }, addTransaction = () => {} } = useContext(AccountContext);
  const { showToast } = useToast();

  const [selectedProvider, setSelectedProvider] = useState(null);
  const [countryCode, setCountryCode] = useState("+234");
  const [phone, setPhone] = useState("");
  const [plan, setPlan] = useState(null);
  const [pin, setPin] = useState(""); // PIN only for modal
  const [loading, setLoading] = useState(false);
  const [transaction, setTransaction] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [tab, setTab] = useState("Daily");
  const [modalOpen, setModalOpen] = useState(false);

  const filteredPlans = plans.filter((p) => p.duration === tab);

  const calculateExpiry = (duration) => {
    const expiry = new Date();
    if (duration === "Daily") expiry.setDate(expiry.getDate() + 1);
    else if (duration === "Weekly") expiry.setDate(expiry.getDate() + 7);
    else if (duration === "Monthly") expiry.setMonth(expiry.getMonth() + 1);
    return expiry.toISOString().split("T")[0];
  };

  // Open confirmation modal
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedProvider || !phone || !plan) {
      showToast("error", "Please select provider, phone number, and plan");
      return;
    }
    if (plan.value > (account?.balance || 0)) {
      showToast("error", "Insufficient balance to complete this transaction");
      return;
    }
    setModalOpen(true);
  };

  // Confirm transaction with PIN
const handleConfirm = async (pin) => {
  if (!pin) {
    showToast("error", "Please enter your PIN to confirm");
    return;
  }

  setLoading(true);
  setModalOpen(false);

  try {
    const transactionRes = await addTransaction({
      type: "Data Purchase",
      provider: selectedProvider.name,
      phone: `${countryCode}${phone}`,
      amount: plan.value,
      planLabel: plan.label,
      expiry: calculateExpiry(plan.duration),
      pin,
    });

    console.log("Transaction Response:", transactionRes); // Debug

    const latestTx = {
      ...(transactionRes.transactions?.[0] || transactionRes.transaction),
      recipient: `${countryCode}${phone}`,
      provider: selectedProvider.name,
      expiry: calculateExpiry(plan.duration),
    };

    setTransaction(latestTx);
    setShowSuccess(true);
    setPin("");
  } catch (err) {
    console.error("Transaction error:", err);
    const message =
      err.response?.data?.message ||
      err.response?.data?.detail ||
      "Transaction failed. Please try again.";
    showToast("error", message);
  } finally {
    setLoading(false);
  }
};


  const handleRepeat = () => {
    setShowSuccess(false);
    setShowReceipt(false);
    setTransaction(null);
    setSelectedProvider(null);
    setPhone("");
    setPlan(null);
    setCountryCode("+234");
    setPin("");
  };

  const handleHome = () => navigate("/dashboard");
  const handleViewReceipt = () => setShowReceipt(true);

  if (showReceipt && transaction)
    return <Receipt transaction={transaction} onBack={() => setShowReceipt(false)} onHome={handleHome} onRepeat={handleRepeat} />;

  if (showSuccess && transaction)
    return <SuccessScreen
      title="Data Purchased ✅"
      message={`₦${Number(transaction.amount).toLocaleString()} sent to ${transaction.recipient} (${transaction.provider}). Expires: ${transaction.expiry}`}
      onRepeat={handleRepeat}
      onHome={handleHome}
      onViewReceipt={handleViewReceipt}
    />;

  return (
    <div className="min-h-screen bg-black flex flex-col items-center px-4 py-12 text-yellow-500 font-sans">
      {/* Header */}
      <div className="fixed top-0 left-0 w-full z-20 bg-black flex items-center justify-center shadow-md px-6 py-4">
        <button onClick={() => navigate(-1)} className="absolute left-4 p-2 rounded-full hover:bg-yellow-500/20 transition">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">Buy Data</h1>
      </div>

      {/* Balance */}
      <div className="w-full max-w-2xl mt-[90px] mb-10 rounded-2xl p-6 text-center shadow-xl bg-black/80 border border-yellow-600/50 backdrop-blur-md">
        <p className="text-sm text-yellow-400/80 uppercase tracking-wide">Available Balance</p>
        <h2 className="text-3xl font-bold mt-2">₦{(account?.balance || 0).toLocaleString()}</h2>
      </div>

      {/* Providers */}
      <div className="w-full max-w-2xl grid grid-cols-2 sm:grid-cols-4 gap-6 mb-6">
        {providers.map((prov) => (
          <button key={prov.name} onClick={() => setSelectedProvider(prov)} className="flex flex-col items-center p-3 bg-black/70 border border-yellow-600 rounded-xl hover:scale-105 transition shadow-sm">
            <img src={prov.logo} alt={prov.name} className="w-16 h-16 object-contain mb-2" />
            <span className="text-sm font-medium">{prov.name}</span>
          </button>
        ))}
      </div>

      {/* Duration Tabs */}
      <div className="w-full max-w-2xl flex justify-between mb-4">
        {["Daily", "Weekly", "Monthly"].map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`flex-1 py-2 text-center rounded-t-2xl font-semibold transition ${tab === t ? "bg-yellow-500 text-black shadow-lg" : "bg-black/70 text-yellow-400 border-b-2 border-yellow-500"}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Plan Selection */}
      <AnimatePresence>
        {selectedProvider && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex justify-center items-end bg-black/70 backdrop-blur-sm" onClick={() => setSelectedProvider(null)}>
            <motion.div
              drag="y"
              dragConstraints={{ top: 0, bottom: 300 }}
              onDragEnd={(event, info) => { if (info.point.y > 100) setSelectedProvider(null); }}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
              className="w-full bg-black/95 backdrop-blur-xl rounded-t-3xl p-6 pb-10 shadow-2xl border-t-4 border-yellow-500 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-lg font-bold mb-4 text-center text-yellow-400">
                {selectedProvider?.name} {tab} Data Plans
              </h2>
              <form className="space-y-5" onSubmit={handleSubmit}>
                {/* Phone Input */}
                <div>
                  <label className="block mb-1 text-sm font-medium text-yellow-300">Phone Number</label>
                  <div className="flex gap-2">
                    <select value={countryCode} onChange={(e) => setCountryCode(e.target.value)} className="px-4 py-3 rounded-2xl bg-black/80 border border-yellow-500 text-yellow-300 focus:ring-2 focus:ring-yellow-400 outline-none">
                      {countries.map((c) => <option key={c.code} value={c.code}>{c.name} ({c.code})</option>)}
                    </select>
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Enter phone number" className="flex-1 px-4 py-3 rounded-2xl bg-black/80 border border-yellow-500 text-yellow-300 focus:ring-2 focus:ring-yellow-400 outline-none" required />
                  </div>
                </div>

                {/* Plan Selection */}
                <div>
                  <label className="block mb-1 text-sm font-medium text-yellow-300">Select Plan</label>
                  <div className="overflow-x-auto flex gap-4 py-2 snap-x snap-mandatory">
                    {filteredPlans.map((p) => {
                      const expiry = calculateExpiry(p.duration);
                      const isSelected = plan?.value === p.value;
                      return (
                        <button key={p.value} type="button" onClick={() => setPlan(p)} className={`flex-shrink-0 w-44 p-4 rounded-2xl border-2 ${isSelected ? "border-yellow-400 bg-yellow-900/20" : "border-yellow-600/30 bg-black/70"} shadow-md hover:scale-105 transition flex flex-col items-center snap-start relative`}>
                          {p.recommended && (
                            <div className="absolute top-1 right-1 bg-yellow-500 px-2 py-1 rounded-full text-xs font-bold text-black flex items-center gap-1">
                              <Star size={12} /> Best
                            </div>
                          )}
                          <h3 className="font-bold text-yellow-400">{p.label.split(" - ")[0]}</h3>
                          <p className="text-yellow-200 font-medium mt-1">{p.label.split(" - ")[1]}</p>
                          <p className="text-yellow-300 text-xs mt-1">Expires: {expiry}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Submit */}
                <button type="submit" disabled={loading} className={`w-full flex items-center justify-center gap-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black py-3 rounded-2xl font-semibold shadow-lg transition active:scale-95 ${loading ? "opacity-70 cursor-not-allowed" : "hover:from-yellow-600 hover:to-yellow-500"}`}>
                  {loading ? <Loader2 className="animate-spin" size={20} /> : "Proceed"}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={modalOpen}
        title="Confirm Data Purchase"
        transactionType="Data"
        amount={plan?.value || 0}
        recipient={`${countryCode}${phone}`}
        network={selectedProvider?.name}
        networkLogo={selectedProvider?.logo}
        planLabel={plan?.label}
        requirePin={true}
        pin={pin}
        setPin={setPin}
        userBalance={account?.balance || 0}
        confirmText="Confirm Purchase"
        cancelText="Cancel"
        onConfirm={handleConfirm}
        onCancel={() => setModalOpen(false)}
      />

      <div className="mt-20 w-full"><Footer /></div>
    </div>
  );
};

export default DataPage;
