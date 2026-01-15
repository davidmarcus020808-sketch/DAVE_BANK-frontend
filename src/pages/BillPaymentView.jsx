// src/pages/BillPaymentView.jsx
import React, { useState, useEffect, useRef, useContext } from "react";
import { ArrowLeft, CreditCard, Loader, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import SuccessScreen from "../components/SuccessScreen";
import Footer from "../components/Footer";
import { AccountContext } from "../context/AccountContext";
import { useToast } from "../context/ToastContext";
import ConfirmationModal from "../components/ConfirmationModal";

const BillPaymentView = () => {
  const navigate = useNavigate();
  const { account, addTransaction } = useContext(AccountContext);
  const { showToast } = useToast();

  const [selectedBill, setSelectedBill] = useState(null);
  const [form, setForm] = useState({
    provider: "",
    accountNumber: "",
    amount: "", // stored as raw numbers
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [success, setSuccess] = useState(false);
  const [lastTransaction, setLastTransaction] = useState(null);

  const modalRef = useRef(null);

  const billTypes = [
    { id: "airtime", name: "Airtime", emoji: "📱" },
    { id: "data", name: "Data", emoji: "🌐" },
    { id: "electricity", name: "Electricity", emoji: "⚡" },
    { id: "tv", name: "Cable TV", emoji: "📺" },
    { id: "internet", name: "Internet", emoji: "💻" },
    { id: "education", name: "Education", emoji: "🎓" },
    { id: "betting", name: "Betting", emoji: "🎰" },
    { id: "water", name: "Water", emoji: "🚰" },
    { id: "tax", name: "Tax", emoji: "💰" },
    { id: "insurance", name: "Insurance", emoji: "🛡️" },
    { id: "transport", name: "Transport", emoji: "🚌" },
  ];

  const providers = {
    airtime: ["MTN", "Airtel", "Glo", "9mobile"],
    data: ["MTN Data", "Airtel Data", "Glo Data", "9mobile Data"],
    electricity: ["Ikeja Electric", "Eko Electric", "Abuja Electric"],
    tv: ["DSTV", "GOTV", "Startimes", "Netflix Gift Card"],
    internet: ["Spectranet", "Smile", "Tizeti", "IPNX"],
    education: ["WAEC PIN", "NECO Token", "JAMB Checker", "School Fees"],
    betting: ["Bet9ja", "SportyBet", "BetKing", "MSport"],
    water: ["Lagos Water Board", "Abuja Water"],
    tax: ["FIRS", "LIRS", "PAYE"],
    insurance: ["AXA Mansard", "Leadway", "AIICO"],
    transport: ["LAGBUS", "BRT", "Ferry"],
  };

  const shakeInputs = () => {
    const inputs = document.querySelectorAll("input, select");
    inputs.forEach((el) => {
      el.classList.add("animate-shake");
      setTimeout(() => el.classList.remove("animate-shake"), 500);
    });
  };

  /** 🔥 NEW — Proper money & input sanitation */
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "amount") {
      const clean = value.replace(/\D/g, "");
      setForm((prev) => ({ ...prev, amount: clean }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // OPEN CONFIRMATION MODAL
const handleSubmit = (e) => {
  e.preventDefault();

  if (!selectedBill) {
    showToast("error", "Please select a bill type");
    shakeInputs();
    return;
  }

  if (!form.provider) {
    showToast("alert", "Please select a provider");
    shakeInputs();
    return;
  }

  if (!form.amount || Number(form.amount) <= 0) {
    showToast("error", "Enter a valid amount");
    shakeInputs();
    return;
  }

  if (Number(form.amount) > (account?.balance || 0)) {
    showToast("error", "Insufficient balance");
    shakeInputs();
    return;
  }

  setModalOpen(true);
};

  /** 🔥 NEW — Backend transaction format aligned */
const handleConfirm = async (pin) => {
  if (!selectedBill) {
    showToast("error", "Please select a bill type");
    return;
  }

  if (!form.provider) {
    showToast("error", "Please select a provider");
    return;
  }

  if (!pin) {
    showToast("error", "Please enter your PIN");
    return;
  }

  setModalOpen(false);
  setLoading(true);

  const payload = {
    type: "Bill Payment",
    category: selectedBill,           // Bill type
    recipient: form.provider,         // Provider
    amount: Number(form.amount),      // Clean number
    account_number: form.accountNumber || null,
    pin,
  };

  console.log("Sending Bill Payment:", payload);

  try {
    const res = await addTransaction(payload);

    if (!res.success) {
      showToast("error", res.message || "Payment failed");
      return;
    }

    // Use the first transaction as lastTransaction
    setLastTransaction(res.transactions[0]);
    setSuccess(true);
    showToast("success", `Bill Payment Successful`);
  } catch (err) {
    showToast("error", "Payment failed. See console for details.");
    console.error("Bill Payment failed:", err.response?.data || err);
  } finally {
    setLoading(false);
  }
};

  const handleReset = () => {
    setSuccess(false);
    setSelectedBill(null);
    setForm({ provider: "", accountNumber: "", amount: "" });
  };

  // CLOSE ON OUTSIDE CLICK
useEffect(() => {
  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      // only reset if modal is closed
      if (!modalOpen) setSelectedBill(null);
    }
  };
  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, [selectedBill, modalOpen]);

  return (
    <div className="min-h-screen bg-black text-yellow-400 flex flex-col justify-between px-6 py-8 lg:px-5 lg:py-12">
      <div className="flex flex-col w-full gap-10">
        <div className="flex items-center gap-3 p-4 border-b border-yellow-500">
          <ArrowLeft size={24} onClick={() => navigate(-1)} />
          <h1 className="flex-1 text-center text-2xl font-bold">
            Bill Payments
          </h1>
        </div>

        {success && lastTransaction ? (
          <SuccessScreen
            title="Payment Successful 🎉"
            message={`You paid ₦${lastTransaction.amount.toLocaleString()} to ${lastTransaction.recipient}.`}
            onRepeat={handleReset}
            onHome={() => navigate("/dashboard")}
          />
        ) : (
          <>
            <h2 className="text-yellow-300 text-sm mb-3 ml-1">Select Bill Type</h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mb-8">
              {billTypes.map((bill) => (
                <button
                  key={bill.id}
                  onClick={() => {
                    setSelectedBill(bill.id);
                    setForm({ provider: "", accountNumber: "", amount: "" });
                  }}
                  className="flex flex-col items-center p-5 rounded-2xl bg-yellow-900/30"
                >
                  <span className="text-3xl">{bill.emoji}</span>
                  <span className="mt-2 text-sm">{bill.name}</span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* SLIDE-UP FORM */}
      <AnimatePresence>
        {selectedBill && !success && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex justify-center items-end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              ref={modalRef}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 120, damping: 18 }}
              className="w-full bg-black/90 text-yellow-400 rounded-t-3xl p-6"
              style={{ maxHeight: "90vh", overflowY: "auto" }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-lg capitalize">
                  {selectedBill} Payment
                </h2>
                <button onClick={() => setSelectedBill(null)}>
                  <X size={20} />
                </button>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit}>
                {/* Provider */}
                <div>
                  <label className="block mb-1">Provider</label>
                  <select
                    name="provider"
                    value={form.provider}
                    onChange={handleChange}
                    className="w-full border rounded-xl px-4 py-2 bg-black/80"
                  >
                    <option value="">Select Provider</option>
                    {providers[selectedBill]?.map((prov) => (
                      <option key={prov} value={prov}>
                        {prov}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Dynamic ID field */}
                {selectedBill !== "airtime" && selectedBill !== "data" && (
                  <div>
                    <label className="block mb-1">Customer / ID</label>
                    <input
                      type="text"
                      name="accountNumber"
                      value={form.accountNumber}
                      onChange={handleChange}
                      className="w-full border rounded-xl px-4 py-2 bg-black/80"
                    />
                  </div>
                )}

                {/* Amount */}
                <div>
                  <label className="block mb-1">Amount</label>
                  <input
                    type="text"
                    name="amount"
                    value={
                      form.amount
                        ? `₦${Number(form.amount).toLocaleString()}`
                        : ""
                    }
                    onChange={handleChange}
                    className="w-full border rounded-xl px-4 py-2 bg-black/80"
                  />
                </div>

                {/* PAY BUTTON */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-yellow-500 text-black rounded-xl py-3"
                >
                  {loading ? (
                    <Loader className="animate-spin" size={18} />
                  ) : (
                    <>
                      <CreditCard size={18} /> Pay Bill
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🔥 NEW — Correct modal props */}
      <ConfirmationModal
        isOpen={modalOpen}
        title="Confirm Bill Payment"
        transactionType="Bills"          // modal uses this label
        billType={selectedBill}          // 🔥 required for modal
        amount={Number(form.amount)}
        recipient={form.provider}
        accountNumber={form.accountNumber}
        requirePin={true}
        userBalance={account?.balance || 0}
        confirmText="Pay Bill"
        cancelText="Cancel"
        onConfirm={handleConfirm}
        onCancel={() => setModalOpen(false)}
      />

      <Footer />
    </div>
  );
};

export default BillPaymentView;
