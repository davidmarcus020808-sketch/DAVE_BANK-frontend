// src/pages/Betting.jsx
import React, { useContext, useState, useEffect, useRef } from "react";
import { ArrowLeft, Wallet, X, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AccountContext } from "../context/AccountContext";
import Receipt from "../components/Receipt";
import SuccessScreen from "../components/SuccessScreen";
import ConfirmationModal from "../components/ConfirmationModal";
import { useToast } from "../context/ToastContext";
import api from "../api/axiosInstance";

// Logos
import TonyBetLogo from "../assets/tonybet.png";
import BetlionLogo from "../assets/betlion.png";
import Bet22Logo from "../assets/22bet.png";
import MerryBetLogo from "../assets/merrybet.png";
import BetWayLogo from "../assets/betway.png";
import SportyBetLogo from "../assets/sportybet.png";
import NairaBetLogo from "../assets/nairabet.png";
import BetKingLogo from "../assets/betking.png";
import Bet9jaLogo from "../assets/bet9ja.jpeg";

// Footer
import Footer from "../components/Footer";

const Betting = () => {
  const navigate = useNavigate();
  const { account, addTransaction } = useContext(AccountContext);
  const { showToast } = useToast();

  // Form States
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [amount, setAmount] = useState("");

  // Transaction States
  const [lastTransaction, setLastTransaction] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Modal States
  const [modalOpen, setModalOpen] = useState(false);
  const [requirePin, setRequirePin] = useState(true);

  // Verification Debounce
  const verificationTimer = useRef(null);

  const bettingPlatforms = [
    { name: "SportyBet", logo: SportyBetLogo },
    { name: "Bet9ja", logo: Bet9jaLogo },
    { name: "BetKing", logo: BetKingLogo },
    { name: "BetWay", logo: BetWayLogo },
    { name: "NairaBet", logo: NairaBetLogo },
    { name: "22Bet", logo: Bet22Logo },
    { name: "MerryBet", logo: MerryBetLogo },
    { name: "TonyBet", logo: TonyBetLogo },
    { name: "BetLion", logo: BetlionLogo },
  ];

  // -------------------
  // Account Verification (Backend)
  // -------------------
  useEffect(() => {
    if (accountNumber.length === 10 && selectedPlatform?.name) {
      setIsVerified(false);
      setAccountName("");
      setIsProcessing(true);

      verificationTimer.current = setTimeout(async () => {
        try {
          const response = await api.post("/transfer/verify/", {
            account_number: accountNumber,
            bank_name: selectedPlatform.name,
          });

          if (response.data.success) {
            setAccountName(response.data.account_name);
            setIsVerified(true);
          } else {
            setAccountName("");
            setIsVerified(false);
            showToast("error", response.data.error || "Verification failed");
          }
        } catch (err) {
          console.error(err);
          setAccountName("");
          setIsVerified(false);
          showToast("error", "Account verification failed");
        } finally {
          setIsProcessing(false);
        }
      }, 500);

      return () => clearTimeout(verificationTimer.current);
    } else {
      setAccountName("");
      setIsVerified(false);
    }
  }, [accountNumber, selectedPlatform]);

  // -------------------
  // Input Handlers
  // -------------------
  const handleAccountNumberChange = (value) => {
    const sanitized = value.replace(/\D/g, "").slice(0, 10);
    setAccountNumber(sanitized);
  };

  const handleAmountChange = (value) => {
    const sanitized = value.replace(/\D/g, "");
    setAmount(sanitized);
  };

  const shakeInputs = () => {
    const inputs = document.querySelectorAll("input");
    inputs.forEach((el) => {
      el.classList.add("animate-shake");
      setTimeout(() => el.classList.remove("animate-shake"), 500);
    });
  };

  // -------------------
  // Payment Flow
  // -------------------
  const handlePaymentClick = () => {
    if (!selectedPlatform || !amount || !accountNumber || !isVerified) {
      shakeInputs();
      showToast("alert", "Please fill all required fields");
      return;
    }

    if (Number(amount) > (account?.balance || 0)) {
      showToast("error", "Insufficient balance");
      return;
    }

    setModalOpen(true);
  };

  const handleConfirm = async (pin) => {
    setModalOpen(false);
    setIsProcessing(true);

    try {
      const transactionRes = await addTransaction({
        type: "Betting",
        amount: Number(amount),
        account_name: accountName,
        recipient: accountName,
        provider: selectedPlatform.name,
        account_number: accountNumber,
        pin: pin,
      });

      const latestTx =
        transactionRes?.transactions?.[0] ||
        transactionRes?.transaction ||
        transactionRes;

      setLastTransaction(latestTx);

      if (latestTx) {
        setShowSuccess(true);
      } else {
        showToast("error", "Transaction returned no data");
      }
    } catch (err) {
      console.error("Transaction error:", err);
      showToast("error", "Transaction failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const resetForm = () => {
    setAmount("");
    setAccountNumber("");
    setAccountName("");
    setIsVerified(false);
    setSelectedPlatform(null);
  };

  // -------------------
  // Receipt + Success Screens
  // -------------------
  if (showReceipt && lastTransaction) {
    return (
      <Receipt
        transaction={lastTransaction}
        onHome={() => {
          setShowReceipt(false);
          setShowSuccess(false);
          resetForm();
          navigate("/dashboard");
        }}
      />
    );
  }

  if (showSuccess && lastTransaction) {
    return (
      <SuccessScreen
        title="Payment Successful 🎉"
        message={`₦${Number(amount).toLocaleString()} has been sent to ${selectedPlatform?.name} (${accountName})`}
        onViewReceipt={() => setShowReceipt(true)}
        onRepeat={() => resetForm()}
        onHome={() => navigate("/dashboard")}
      />
    );
  }

  // -------------------
  // Render
  // -------------------
  return (
    <div className="relative min-h-screen bg-black text-yellow-400 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 bg-black/90 sticky top-0 z-10 border-b border-yellow-500">
        <ArrowLeft
          className="cursor-pointer hover:text-yellow-300"
          size={24}
          onClick={() => navigate(-1)}
        />
        <h1 className="text-xl font-semibold">Betting</h1>
      </div>

      {/* Balance */}
      <div className="bg-gradient-to-r from-black via-yellow-700 to-yellow-500 rounded-3xl mx-5 mt-5 mb-4 p-6 shadow-2xl flex justify-between items-center border border-yellow-500">
        <div>
          <p className="text-yellow-200 text-sm opacity-80">Available Balance</p>
          <h2 className="text-3xl font-bold mt-1 text-yellow-50">
            ₦{(account?.balance || 0).toLocaleString()}
          </h2>
        </div>
        <Wallet size={40} className="text-yellow-400" />
      </div>

      {/* Platforms Grid */}
      <div className="px-5 pb-5 flex-1">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {bettingPlatforms.map((bet) => (
            <div
              key={bet.name}
              onClick={() => setSelectedPlatform(bet)}
              className={`relative cursor-pointer flex flex-col items-center justify-center
                bg-black/90 border border-yellow-500 rounded-2xl p-4 shadow-md
                ${selectedPlatform?.name === bet.name ? "scale-105 shadow-2xl" : ""}`}
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mb-2">
                <img
                  src={bet.logo}
                  alt={bet.name}
                  className="object-contain w-full h-full"
                />
              </div>
              <p className="text-center text-sm font-semibold text-yellow-300">
                {bet.name}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Modal */}
      {selectedPlatform && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setSelectedPlatform(null)}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            className="bg-black w-full h-[85vh] sm:h-[65vh] rounded-t-3xl shadow-2xl border-t-4 border-yellow-500"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 border-b border-yellow-500">
              <h2 className="text-lg font-semibold text-yellow-300">
                Pay to {selectedPlatform?.name}
              </h2>
              <X
                className="cursor-pointer text-yellow-400"
                onClick={() => setSelectedPlatform(null)}
              />
            </div>

            {/* Modal Content */}
            <div className="px-6 py-4 space-y-4">
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => handleAccountNumberChange(e.target.value)}
                placeholder="Enter 10-digit Account ID"
                className="w-full border border-yellow-500 rounded-2xl p-4 text-lg bg-black text-yellow-400"
              />

              <div className="w-full border border-yellow-500 rounded-2xl p-4 text-lg text-yellow-400 bg-black flex items-center">
                {isProcessing ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={18} />
                    Verifying...
                  </>
                ) : accountName ? (
                  accountName
                ) : (
                  "Account name will appear here"
                )}
              </div>

              <input
                type="text"
                value={amount}
                onChange={(e) => handleAmountChange(e.target.value)}
                placeholder="Amount"
                className="w-full border border-yellow-500 rounded-2xl p-4 text-lg text-yellow-400 bg-black"
              />
            </div>

            {/* Pay Button */}
            <div className="p-6 border-t border-yellow-500 bg-black">
              <motion.button
                whileTap={{ scale: 0.95 }}
                disabled={!isVerified || !amount || isProcessing}
                onClick={handlePaymentClick}
                className="w-full py-2.5 sm:py-3 rounded-2xl font-semibold bg-yellow-500 text-black"
              >
                {isProcessing ? "Processing..." : `Pay ₦${Number(amount).toLocaleString()}`}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={modalOpen}
        title="Confirm Betting Payment"
        transactionType="Betting"
        amount={Number(amount) || 0}
        recipient={accountName || "Unknown Account"}
        network={selectedPlatform?.name}
        networkLogo={selectedPlatform?.logo}
        planLabel={`Betting Wallet - ${selectedPlatform?.name}`}
        requirePin={requirePin}
        userBalance={account?.balance || 0}
        confirmText="Confirm Payment"
        cancelText="Cancel"
        onConfirm={handleConfirm}
        onCancel={() => setModalOpen(false)}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Betting;
