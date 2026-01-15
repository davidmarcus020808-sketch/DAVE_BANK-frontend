import React, { useState, useContext, useRef, useEffect } from "react";
import { ArrowLeft, X, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AccountContext } from "../context/AccountContext";
import { useToast } from "../context/ToastContext";
import SuccessScreen from "../components/SuccessScreen";
import Footer from "../components/Footer";
import ConfirmationModal from "../components/ConfirmationModal";
import { motion, AnimatePresence } from "framer-motion";
import Receipt from "../components/Receipt";

import MTNLogo from "../assets/mtn.png";
import AirtelLogo from "../assets/airtel.png";
import GloLogo from "../assets/glo.jpeg";
import NineMobileLogo from "../assets/9mobile.jpeg";

const AirtimeView = () => {
  const navigate = useNavigate();
  const { account, addTransaction } = useContext(AccountContext);
  const { showToast } = useToast();

  const [selectedNetwork, setSelectedNetwork] = useState(null);
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [pin, setPin] = useState("");

  const [loading, setLoading] = useState(false); // For API confirm
  const [continueLoading, setContinueLoading] = useState(false); // For Continue button
  const [success, setSuccess] = useState(false);
  const [transaction, setTransaction] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);

  const modalRef = useRef(null);

  const networks = [
    { name: "MTN", logo: MTNLogo },
    { name: "Airtel", logo: AirtelLogo },
    { name: "GLO", logo: GloLogo },
    { name: "9mobile", logo: NineMobileLogo }
  ];

  // Close modal when clicking outside
  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setSelectedNetwork(null);
    }
  };

  useEffect(() => {
    if (selectedNetwork)
      document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [selectedNetwork]);

  // Show Receipt Page
  if (showReceipt && transaction) {
    return (
      <Receipt
        transaction={transaction}
        onHome={() => navigate("/dashboard")}
      />
    );
  }

  // Continue button → open confirmation modal
  const handleProceedToConfirm = (e) => {
    e.preventDefault();
    setContinueLoading(true);

    if (!selectedNetwork) {
      setContinueLoading(false);
      return showToast("error", "Select a network");
    }
    if (!phone) {
      setContinueLoading(false);
      return showToast("error", "Enter phone number");
    }
    if (!amount || Number(amount) <= 0) {
      setContinueLoading(false);
      return showToast("error", "Enter valid amount");
    }
    if (Number(amount) > (account?.balance || 0)) {
      setContinueLoading(false);
      return showToast("error", "Insufficient balance");
    }

    // Passed validation
// Passed validation – show spinner for visual feedback
setTimeout(() => {
  setContinueLoading(false);
  setShowConfirmModal(true);
}, 500); // 0.5 seconds

  };

  // Confirm transaction (API request)
  const handleConfirmTransaction = async (enteredPin) => {
    setShowConfirmModal(false);
    setLoading(true);

    try {
      const payload = {
        type: "Airtime Purchase",
        amount: Number(amount),
        phone,
        provider: selectedNetwork.name,
        pin: enteredPin
      };

      const res = await addTransaction(payload);
      const latestTxn = res.transactions?.[0] || null;

      setTransaction({
        reference: latestTxn?.reference,
        provider: selectedNetwork.name,
        recipient: phone,
        amount: Number(amount)
      });

      setSuccess(true);
      setPin("");
      showToast("success", `₦${amount} airtime sent to ${phone}`);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.detail ||
        "Transaction failed.";
      showToast("error", msg);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedNetwork(null);
    setPhone("");
    setAmount("");
    setPin("");
    setSuccess(false);
    setTransaction(null);
  };

  const handleViewReceipt = () => setShowReceipt(true);

  return (
    <div className="min-h-screen bg-black text-yellow-400 flex flex-col justify-between px-6 py-8">

      {/* Header */}
      <div className="flex items-center gap-3 p-4 bg-black/90 sticky top-0 z-10 border-b border-yellow-500">
        <ArrowLeft
          size={24}
          className="cursor-pointer hover:text-yellow-300"
          onClick={() => navigate(-1)}
        />
        <h1 className="flex-1 text-center text-2xl font-bold tracking-wide">
          Buy Airtime
        </h1>
      </div>

      {/* Success Screen */}
      {success && transaction ? (
        <SuccessScreen
          title="Airtime Purchase Successful 🎉"
          message={`₦${transaction.amount.toLocaleString()} sent to ${transaction.recipient}`}
          onRepeat={handleReset}
          onHome={() => navigate("/dashboard")}
          onViewReceipt={handleViewReceipt}
        />
      ) : (
        <>
          <h2 className="text-yellow-300 font-semibold text-sm mb-3 ml-1">
            Select Network
          </h2>

          <div className="grid grid-cols-2 gap-6 mb-8 w-full">
            {networks.map((net) => (
              <button
                key={net.name}
                onClick={() => setSelectedNetwork(net)}
                className="flex flex-col items-center justify-center p-5 rounded-2xl bg-yellow-900/30 text-yellow-300 shadow-lg hover:scale-105 transition"
              >
                <img src={net.logo} className="w-16 h-16 object-contain mb-2" />
                <span className="font-medium">{net.name}</span>
              </button>
            ))}
          </div>
        </>
      )}

      {/* Bottom Sheet Modal */}
      <AnimatePresence>
        {selectedNetwork && !success && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex justify-center items-end z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              ref={modalRef}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
              className="w-full bg-black/90 text-yellow-400 rounded-t-3xl p-6 shadow-2xl border-t border-yellow-400"
            >
              <div className="flex justify-between mb-4">
                <h2 className="font-bold text-lg">
                  {selectedNetwork?.name} Airtime
                </h2>
                <button onClick={() => setSelectedNetwork(null)}>
                  <X size={20} />
                </button>
              </div>

              {/* INPUT FORM */}
              <form className="space-y-4" onSubmit={handleProceedToConfirm}>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Phone number"
                  className="w-full border rounded-xl px-4 py-2 bg-black/80 text-yellow-300"
                />

                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="₦0.00"
                  className="w-full border rounded-xl px-4 py-2 bg-black/80 text-yellow-300"
                />

                {/* Continue Button With Spinner */}
                <button
                  disabled={continueLoading}
                  className="w-full bg-yellow-500 text-black py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
                >
                  {continueLoading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Continue"
                  )}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PIN Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        transactionType="Airtime"
        title="Confirm Airtime Purchase"
        amount={Number(amount)}
        recipient={phone}
        network={selectedNetwork?.name}
        networkLogo={selectedNetwork?.logo}
        requirePin={true}
        pin={pin}
        setPin={setPin}
        userBalance={account?.balance || 0}
        confirmText="Buy Airtime"
        cancelText="Cancel"
        processing={loading}   // ✅ FIXED HERE
        onCancel={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmTransaction}
      />

      <Footer />
    </div>
  );
};

export default AirtimeView;
