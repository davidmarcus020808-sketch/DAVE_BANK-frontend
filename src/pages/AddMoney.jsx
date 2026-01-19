import React, { useState, useContext } from "react";
import { AccountContext } from "../context/AccountContext";
import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";
import api from "../api/axiosInstance";

const MIN_AMOUNT = 100;

const AddMoney = () => {
  const { refreshAccount, addNotification } = useContext(AccountContext);

  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
    customizations: {
      title: "DaveBank Wallet Top-Up",
      description: "Add money to your wallet",
    },
  };

  const handleFlutterwaveResponse = () => {
    closePaymentModal();
    addNotification("Payment successful. Wallet will update shortly.", "success");
    setAmount("");

    // Wait for webhook to process, then refresh account
    setTimeout(() => refreshAccount(), 2000);
  };

  const handlePay = useFlutterwave(baseConfig);

  const startPayment = async () => {
    try {
      setLoading(true);

      const res = await api.post("/flutterwave/init/", { amount: Number(amount) });

      handlePay({
        ...baseConfig,
        tx_ref: res.data.tx_ref,
        customer: {
          email: res.data.email,
          phonenumber: res.data.phone,
          name: res.data.name,
        },
      })(handleFlutterwaveResponse);
    } catch {
      addNotification("Unable to start payment", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-black p-4">
      <div className="w-full max-w-md p-6 rounded-xl bg-gray-900">
        <h2 className="text-xl text-yellow-400 mb-6 text-center">Add Money</h2>

        <input
          type="number"
          min={MIN_AMOUNT}
          value={amount}
          onChange={handleAmountChange}
          className="w-full p-3 mb-2 rounded bg-black text-yellow-400"
        />
        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button
          onClick={startPayment}
          disabled={!isValidAmount || loading}
          className={`w-full mt-4 py-3 rounded font-bold ${
            isValidAmount ? "bg-yellow-500 text-black" : "bg-gray-600 cursor-not-allowed"
          }`}
        >
          {loading ? "Processing..." : `Pay ₦${amount || 0}`}
        </button>
      </div>
    </div>
  );
};

export default AddMoney;
