// src/pages/AddMoney.jsx
import React, { useState, useContext } from "react";
import { AccountContext } from "../context/AccountContext";
import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";

const MIN_AMOUNT = 100;

const AddMoney = () => {
  const { account, verifyFlutterwavePayment, addNotification } =
    useContext(AccountContext);

  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");

  // -----------------------------
  // Amount validation
  // -----------------------------
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

  const isValidAmount = amount !== "" && !error;

  // -----------------------------
  // Flutterwave configuration
  // -----------------------------
  const flutterwaveConfig = {
    public_key: import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY,
    tx_ref: `TX-${Date.now()}`,
    amount: Number(amount),
    currency: "NGN",
    payment_options: paymentMethod,
    customer: {
      email: account?.email,
      phonenumber: account?.phone,
      name: account?.full_name,
    },
    customizations: {
      title: "DaveBank Wallet Top-Up",
      description: "Add money to your wallet",
    },
  };

  const handleFlutterwaveResponse = async (response) => {
    closePaymentModal();

    if (response.status !== "successful") {
      addNotification(
        response.message || "Payment was cancelled",
        "error",
        { title: "Payment Failed" }
      );
      return;
    }

    setLoading(true);

    try {
      // 🔥 EXACTLY what your backend expects
      const result = await verifyFlutterwavePayment(
        response.tx_ref,
        response.transaction_id
      );

      addNotification(
        `Wallet credited with ₦${Number(result.amount).toLocaleString()}`,
        "success",
        { title: "Payment Successful" }
      );

      setAmount("");
    } catch (error) {
      addNotification(
        "Payment verification failed. Please contact support.",
        "error",
        { title: "Verification Error" }
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePay = useFlutterwave(flutterwaveConfig);

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-gray-900 via-black to-gray-800 p-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-700 bg-black/80 p-6 shadow-2xl">
        <h2 className="mb-6 text-center text-2xl font-extrabold text-yellow-400">
          💰 Add Money to Wallet
        </h2>

        {/* Amount */}
        <div className="mb-4">
          <label className="mb-1 block text-gray-300">Amount (₦)</label>
          <input
            type="number"
            min={MIN_AMOUNT}
            value={amount}
            onChange={handleAmountChange}
            disabled={loading}
            className={`w-full rounded-xl bg-black/70 p-3 text-yellow-400 border ${
              error ? "border-red-500" : "border-yellow-500"
            }`}
            placeholder={`Minimum ₦${MIN_AMOUNT}`}
          />
          {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
        </div>

        {/* Payment Method */}
        <div className="mb-6">
          <label className="mb-1 block text-gray-300">Payment Method</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            disabled={loading}
            className="w-full rounded-xl bg-black/70 p-3 text-yellow-400 border border-yellow-500"
          >
            <option value="card">Card</option>
            <option value="ussd">USSD</option>
            <option value="banktransfer">Bank Transfer</option>
          </select>
        </div>

        {/* Pay Button */}
        <button
          onClick={() => handlePay(handleFlutterwaveResponse)}
          disabled={!isValidAmount || loading}
          className={`w-full rounded-xl py-3 font-bold text-black transition ${
            isValidAmount && !loading
              ? "bg-yellow-500 hover:bg-yellow-600"
              : "bg-gray-500 cursor-not-allowed"
          }`}
        >
          {loading ? "Processing..." : `Pay ₦${amount || 0}`}
        </button>

        <p className="mt-4 text-center text-sm text-gray-400">
          Minimum top-up: ₦{MIN_AMOUNT}
        </p>
      </div>
    </div>
  );
};

export default AddMoney;
