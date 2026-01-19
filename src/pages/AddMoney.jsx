// src/pages/AddMoney.jsx
import React, { useContext, useState, useMemo } from "react";
import { AccountContext } from "../context/AccountContext";
import { useFlutterwave, closePaymentModal } from "flutterwave-react";
import api from "../api/axiosInstance";
import Footer from "../components/Footer";
import ConfirmationModal from "../components/ConfirmationModal";

const MIN_AMOUNT = 100;

const AddMoney = () => {
  const { account, refreshAccount, addNotification } =
    useContext(AccountContext);

  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [paidAmount, setPaidAmount] = useState(0);

  /* ------------------ VALIDATION ------------------ */
  const validateAmount = (value) => {
    const num = Number(value);
    if (!value) return "Amount is required";
    if (Number.isNaN(num)) return "Invalid amount";
    if (num < MIN_AMOUNT) return `Minimum amount is ₦${MIN_AMOUNT}`;
    return "";
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    setAmount(value);
    setError(validateAmount(value));
  };

  const isValidAmount = amount && !error;

  /* ------------------ FLUTTERWAVE CONFIG ------------------ */
  const flutterwaveConfig = useMemo(
    () => ({
      public_key: import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY,
      tx_ref: "",
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
    }),
    [amount, account]
  );

  const handleFlutterwavePayment = useFlutterwave(flutterwaveConfig);

  /* ------------------ PAYMENT FLOW ------------------ */
  const startPayment = async () => {
    const validationError = validateAmount(amount);
    setError(validationError);
    if (validationError) return;

    try {
      setLoading(true);

      // Init transaction from backend
      const res = await api.post("/flutterwave/init/", {
        amount: Number(amount),
      });

      handleFlutterwavePayment({
        tx_ref: res.data.tx_ref,
        callback: () => {
          setPaidAmount(Number(amount));
          setModalOpen(true);
          setAmount("");
          closePaymentModal();

          // allow webhook to hit backend
          setTimeout(() => refreshAccount(), 2000);
        },
        onClose: () => {
          setLoading(false);
        },
      });
    } catch (err) {
      addNotification("Unable to start payment", "error");
    } finally {
      setLoading(false);
    }
  };

  /* ------------------ UI ------------------ */
  return (
    <div className="flex flex-col min-h-screen bg-black text-yellow-400">
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-gray-900 rounded-xl p-6">
          <h1 className="text-2xl font-bold text-center mb-6">
            Add Money
          </h1>

          <input
            type="number"
            min={MIN_AMOUNT}
            value={amount}
            onChange={handleAmountChange}
            placeholder={`Enter amount (₦${MIN_AMOUNT}+ )`}
            className="w-full p-3 rounded bg-black text-yellow-400 placeholder-yellow-600"
          />

          {error && (
            <p className="text-red-500 text-sm mt-2">{error}</p>
          )}

          <button
            onClick={startPayment}
            disabled={!isValidAmount || loading}
            className={`w-full mt-5 py-3 rounded font-bold transition ${
              isValidAmount
                ? "bg-yellow-500 text-black hover:bg-yellow-400"
                : "bg-gray-700 cursor-not-allowed"
            }`}
          >
            {loading ? "Processing..." : `Pay ₦${amount || 0}`}
          </button>
        </div>
      </main>

      <footer className="px-4 py-3">
        <Footer />
      </footer>

      <ConfirmationModal
        isOpen={modalOpen}
        title="Payment Successful"
        transactionType="Wallet Top-Up"
        amount={paidAmount}
        iconType="success"
        confirmText="Done"
        onConfirm={() => setModalOpen(false)}
        onCancel={() => setModalOpen(false)}
      />
    </div>
  );
};

export default AddMoney;
