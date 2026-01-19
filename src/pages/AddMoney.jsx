// src/pages/AddMoney.jsx
import React, { useState, useContext } from "react";
import { AccountContext } from "../context/AccountContext";
import { FlutterWaveButton, closePaymentModal } from "flutterwave-react-v4";
import api from "../api/axiosInstance";
import Footer from "../components/Footer";
import ConfirmationModal from "../components/ConfirmationModal";

const MIN_AMOUNT = 100;

const AddMoney = () => {
  const { refreshAccount, addNotification, account } = useContext(AccountContext);
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [paidAmount, setPaidAmount] = useState(0); // store actual paid amount

  const validateAmount = (value) => {
    const num = Number(value);
    if (!value) return "Amount is required";
    if (isNaN(num)) return "Invalid amount";
    if (num < MIN_AMOUNT) return `Minimum amount is ₦${MIN_AMOUNT}`;
    return "";
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    setAmount(value);
    setError(validateAmount(value));
  };

  const isValidAmount = amount && !error;

  const baseConfig = {
    public_key: import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY,
    amount: Number(amount),
    currency: "NGN",
    payment_options: "card,ussd,banktransfer",
    customer: {
      email: account?.email || "user@example.com",
      phonenumber: account?.phone || "0000000000",
      name: account?.full_name || "DaveBank User",
    },
    customizations: {
      title: "DaveBank Wallet Top-Up",
      description: "Add money to your wallet",
    },
  };

  const handleFlutterwaveResponse = (response) => {
    // store paid amount before clearing input
    setPaidAmount(Number(amount));
    setModalOpen(true); // open confirmation modal
    setAmount(""); // reset input
    setTimeout(() => refreshAccount(), 2000); // refresh account after webhook
  };

  const handlePay = useFlutterwave(baseConfig);

  const startPayment = async () => {
    setError(validateAmount(amount));
    if (!isValidAmount) return;

    try {
      setLoading(true);
      const res = await api.post("/flutterwave/init/", { amount: Number(amount) });

      handlePay({
        tx_ref: res.data.tx_ref,
        customer: {
          email: res.data.email,
          phonenumber: res.data.phone,
          name: res.data.name,
        },
      }).then(handleFlutterwaveResponse);
    } catch (err) {
      addNotification("Unable to start payment", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-yellow-400">
      {/* Main content */}
      <div className="flex-1 flex justify-center items-center p-4">
        <div className="w-full max-w-md p-6 rounded-xl bg-gray-900">
          <h2 className="text-2xl font-bold mb-6 text-center text-yellow-400">
            Add Money
          </h2>

          <input
            type="number"
            min={MIN_AMOUNT}
            value={amount}
            onChange={handleAmountChange}
            placeholder={`Enter amount (₦${MIN_AMOUNT}+ )`}
            className="w-full p-3 mb-2 rounded bg-black text-yellow-400 placeholder-yellow-600"
          />
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

          <button
            onClick={startPayment}
            disabled={!isValidAmount || loading}
            className={`w-full mt-4 py-3 rounded font-bold ${
              isValidAmount
                ? "bg-yellow-500 text-black hover:bg-yellow-400"
                : "bg-gray-600 cursor-not-allowed"
            }`}
          >
            {loading ? "Processing..." : `Pay ₦${amount || 0}`}
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto px-4 py-2 sm:px-6 sm:py-4">
        <Footer />
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={modalOpen}
        title="Payment Successful"
        transactionType="Wallet Top-Up"
        amount={paidAmount} // show actual paid amount
        iconType="success"
        confirmText="Done"
        onConfirm={() => setModalOpen(false)}
        onCancel={() => setModalOpen(false)}
      />
    </div>
  );
};

export default AddMoney;
