// src/components/ConfirmationModal.jsx
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Phone,
  Wifi,
  Zap,
  Gift,
} from "lucide-react";
import { useToast } from "../context/ToastContext";

// Map transaction type to icon
const icons = {
  success: <CheckCircle2 size={26} className="text-green-400" />,
  alert: <AlertTriangle size={26} className="text-yellow-400" />,
  airtime: <Phone size={26} className="text-yellow-400" />,
  data: <Wifi size={26} className="text-yellow-400" />,
  bills: <Zap size={26} className="text-yellow-400" />,
  rewards: <Gift size={26} className="text-yellow-400" />,
};

// Map billType to emoji for dynamic display
const billEmojis = {
  airtime: "📱",
  data: "🌐",
  electricity: "⚡",
  tv: "📺",
  internet: "💻",
  education: "🎓",
  betting: "🎰",
  water: "🚰",
  tax: "💰",
  insurance: "🛡️",
  transport: "🚌",
};

const ConfirmationModal = ({
  isOpen,
  title = "Confirm Transaction",
  transactionType = "Bank Transfer",
  amount = 0,
  recipient = "",
  accountNumber = "",
  bankName = "",
  network = "",
  networkLogo = null,
  planLabel = "",
  billType = "",
  pointsToRedeem = 0,
  narration = "—",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  iconType = "alert",
  processing = false,
  requirePin = false,
  userBalance = 0,
  feeConfig = { flat: 50, percent: 0.5 },
}) => {
  const { showToast } = useToast();
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState("");
  const [fee, setFee] = useState(0);
  const [totalDebit, setTotalDebit] = useState(0);
  const [balanceAfter, setBalanceAfter] = useState(userBalance);
  const inputRefs = useRef([]);

  // Reset PIN when modal opens
  useEffect(() => {
    if (isOpen) {
      setPin("");
      setPinError("");
      inputRefs.current[0]?.focus();
    }
  }, [isOpen]);

  // Calculate fee and totals
  useEffect(() => {
    const calculatedFee =
      transactionType === "Bank Transfer"
        ? feeConfig.flat + (amount * feeConfig.percent) / 100
        : 0;

    setFee(calculatedFee);
    const total = Number(amount) + calculatedFee;
    setTotalDebit(total);
    setBalanceAfter(userBalance - total);
  }, [amount, userBalance, feeConfig, transactionType]);

  const handleConfirm = () => {
    if (requirePin && pin.length < 4) {
      setPinError("Enter your 4-digit PIN");
      showToast("error", "Enter your 4-digit PIN");
      return;
    }

    if (
      ["Bank Transfer", "Data", "Airtime", "Bills"].includes(transactionType) &&
      balanceAfter < 0
    ) {
      showToast("error", "Insufficient balance for this transaction");
      return;
    }

    setPinError("");
    onConfirm?.(pin);
    setPin("");
  };

  const handlePinChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newPin = pin.split("");
    newPin[index] = value;
    setPin(newPin.join(""));
    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const renderDetails = () => {
    switch (transactionType) {
      case "Bank Transfer":
        return (
          <>
            <Detail label="Recipient" value={recipient} />
            <Detail label="Bank" value={bankName} />
            <Detail label="Account Number" value={accountNumber} />
            <Detail label="Fee" value={`₦${fee.toLocaleString()}`} />
            <Detail label="Total Debit" value={`₦${totalDebit.toLocaleString()}`} bold />
            <Detail
              label="Balance After"
              value={`₦${balanceAfter.toLocaleString()}`}
              bold
              valueClass={balanceAfter < 0 ? "text-red-500" : "text-yellow-400"}
            />
          </>
        );
      case "Airtime":
      case "Data":
        return (
          <>
            <div className="flex items-center gap-3 mb-2">
              {networkLogo && (
                <img src={networkLogo} alt={network} className="w-8 h-8 object-contain" />
              )}
              <Detail label="Network" value={network} />
            </div>
            {transactionType === "Data" && <Detail label="Plan" value={planLabel} />}
            <Detail label="Phone Number" value={recipient} />
            <Detail
              label={transactionType === "Airtime" ? "Amount" : "Total Debit"}
              value={`₦${(transactionType === "Airtime" ? amount : totalDebit).toLocaleString()}`}
              bold
            />
            <Detail
              label="Balance After"
              value={`₦${balanceAfter.toLocaleString()}`}
              bold
              valueClass={balanceAfter < 0 ? "text-red-500" : "text-yellow-400"}
            />
          </>
        );
      case "Bills":
        return (
          <>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{billEmojis[billType] || "🧾"}</span>
              <Detail label="Bill Type" value={billType} />
            </div>
            <Detail label="Account / Meter Number" value={accountNumber || recipient} />
            <Detail label="Amount" value={`₦${amount.toLocaleString()}`} bold />
            <Detail
              label="Balance After"
              value={`₦${balanceAfter.toLocaleString()}`}
              bold
              valueClass={balanceAfter < 0 ? "text-red-500" : "text-yellow-400"}
            />
          </>
        );
      case "Rewards":
        return <Detail label="Points to Redeem" value={`${pointsToRedeem} pts`} />;
      default:
        return null;
    }
  };

  const canConfirm =
    !processing &&
    (["Bank Transfer", "Data", "Airtime", "Bills"].includes(transactionType)
      ? balanceAfter >= 0
      : true);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-black/90 border border-yellow-600/40 rounded-2xl w-full max-w-md lg:max-w-lg p-6 sm:p-8 text-yellow-100 shadow-[0_0_50px_rgba(255,215,0,0.2)]"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-yellow-900/30 border border-yellow-700/40">
                  {icons[iconType] || icons.alert}
                </div>
                <h3 className="text-xl font-bold text-yellow-300">{title}</h3>
              </div>
              <button
                onClick={() => {
                  !processing && onCancel?.();
                  showToast("alert", "Transaction canceled");
                }}
                disabled={processing}
                className="text-yellow-400 hover:text-yellow-200 transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Transaction Details */}
            <div className="mb-5 space-y-3 text-sm sm:text-base text-yellow-200/90">
              {renderDetails()}
              <Detail label="Narration" value={narration} />
              <Detail label="Transaction Type" value={transactionType} />
              {balanceAfter < 0 && (
                <p className="text-red-500 text-sm mt-2 text-center">
                  Insufficient balance for this transaction!
                </p>
              )}
            </div>

            {/* PIN Section */}
            {requirePin && (
              <div className="mb-6">
                <label className="block text-sm text-yellow-400 mb-3 font-semibold text-center">
                  Enter Transaction PIN
                </label>
                <div className="flex justify-center gap-4">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl border-2 flex items-center justify-center
                      bg-yellow-950/40 border-yellow-700/40 focus-within:border-yellow-500 focus-within:ring-2 focus-within:ring-yellow-500/50 relative"
                    >
                      <input
                        ref={(el) => (inputRefs.current[i] = el)}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={pin[i] || ""}
                        onChange={(e) => handlePinChange(e.target.value, i)}
                        onKeyDown={(e) => handleKeyDown(e, i)}
                        className="absolute inset-0 w-full h-full text-transparent text-center outline-none"
                      />
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: pin[i] ? 1 : 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-yellow-500 pointer-events-none"
                      />
                    </div>
                  ))}
                </div>
                {pinError && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-red-400 mt-2 text-center"
                  >
                    {pinError}
                  </motion.p>
                )}
                <p className="text-[11px] text-yellow-600 mt-3 text-center opacity-70">
                  Your 4-digit transaction PIN keeps your transfers secure
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <button
                onClick={() => {
                  !processing && onCancel?.();
                  showToast("alert", "Transaction canceled");
                }}
                disabled={processing}
                className="px-5 py-2.5 rounded-lg border border-yellow-700/40 text-yellow-300 hover:bg-yellow-800/20 transition"
              >
                {cancelText}
              </button>
              <button
                onClick={handleConfirm}
                disabled={!canConfirm}
                className={`px-6 py-2.5 rounded-lg bg-yellow-500 text-black font-semibold flex items-center justify-center gap-2 hover:bg-yellow-400 transition-all ${
                  !canConfirm ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {processing && <Loader2 className="animate-spin" size={16} />}
                {confirmText}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Detail component
const Detail = ({ label, value, bold = false, valueClass = "" }) => (
  <div className="flex justify-between">
    <span className={`font-medium ${bold ? "text-yellow-300" : ""}`}>{label}</span>
    <span className={`${bold ? "font-semibold" : ""} ${valueClass}`}>{value || "—"}</span>
  </div>
);

export default ConfirmationModal;
