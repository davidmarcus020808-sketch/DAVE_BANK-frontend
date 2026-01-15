// src/pages/TransferView.jsx
import React, { useState, useEffect, useContext } from "react";
import { ArrowLeft, Send, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { NIGERIAN_BANKS } from "../data/banks";
import { AccountContext } from "../context/AccountContext";
import ConfirmationModal from "../components/ConfirmationModal";
import SuccessScreen from "../components/SuccessScreen";
import Receipt from "../components/Receipt";
import Footer from "../components/Footer";
import { useToast } from "../context/ToastContext";
import axiosInstance from "../api/axiosInstance";

// ✅ Standardize transaction types
const TRANSACTION_TYPES = {
  TRANSFER: "Transfer",
  BILL: "Bill Payment",
  AIRTIME: "Airtime Purchase",
  DATA: "Data Purchase",
};

const TransferView = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { account = { balance: 0, transactions: [] }, addTransaction } =
    useContext(AccountContext) || {};

  const [form, setForm] = useState({
    accountNumber: "",
    bankName: "",
    accountName: "",
    amount: "",
    narration: "",
  });

  const [showBanks, setShowBanks] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [transaction, setTransaction] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [processing, setProcessing] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Debounced account verification
  useEffect(() => {
    if (form.accountNumber.length === 10 && form.bankName) {
      setVerifying(true);
      setForm((prev) => ({ ...prev, accountName: "" }));

      const timer = setTimeout(async () => {
        try {
          const response = await axiosInstance.post("/transfer/verify/", {
            account_number: form.accountNumber,
            bank_name: form.bankName,
          });

          if (response.data.success) {
            setForm((prev) => ({ ...prev, accountName: response.data.account_name }));
          } else {
            setForm((prev) => ({ ...prev, accountName: "" }));
            showToast("error", response.data.error || "Verification failed");
          }
        } catch (err) {
          console.error(err);
          setForm((prev) => ({ ...prev, accountName: "" }));
          showToast("error", err.response?.data?.error || "Account verification failed");
        } finally {
          setVerifying(false);
        }
      }, 500);

      return () => clearTimeout(timer);
    } else {
      setForm((prev) => ({ ...prev, accountName: "" }));
      setVerifying(false);
    }
  }, [form.accountNumber, form.bankName]);

  // Open confirmation modal
  const openModal = (e) => {
    e.preventDefault();
    const amount = Number(form.amount);
    if (!form.accountNumber || !form.bankName || !form.accountName || !form.amount) {
      showToast("alert", "Please fill in all required fields");
      return;
    }
    if (amount <= 0) {
      showToast("alert", "Enter a valid amount greater than 0");
      return;
    }
    if (amount > (account.balance || 0)) {
      showToast("error", "Insufficient balance for this transfer");
      return;
    }
    setModalOpen(true);
  };

  const handleConfirmTransfer = async (enteredPin) => {
    setProcessing(true);
    try {
      const payload = {
        type: TRANSACTION_TYPES.TRANSFER,
        account_number: form.accountNumber,
        account_name: form.accountName,
        amount: Number(form.amount),
        description: form.narration || "",
        pin: enteredPin,
        bank_name: form.bankName,
        provider: form.bankName, // ✅ added provider to satisfy backend
        recipient: form.accountName, // optional but matches backend
      };

      const res = await addTransaction(payload);

      setModalOpen(false);
      setShowSuccess(true);
      setTransaction(res); // store for receipt

      showToast(
        "success",
        `₦${payload.amount.toLocaleString()} sent to ${payload.account_name}`
      );
    } catch (err) {
      console.error("Transfer error:", err.response?.data || err.message);
      let message = "Transfer failed. Please check your details and try again.";
      if (err.response?.data) {
        const data = err.response.data;
        message = Object.values(data).flat().join(" ") || message;
      }
      showToast("error", message);
    } finally {
      setProcessing(false);
    }
  };

  // Utility handlers
  const handleRepeat = () => {
    setShowSuccess(false);
    setShowReceipt(false);
    setTransaction(null);
    setForm({
      accountNumber: "",
      bankName: "",
      accountName: "",
      amount: "",
      narration: "",
    });
  };

  const handleHome = () => navigate("/dashboard");
  const handleViewReceipt = () => setShowReceipt(true);

  // Render receipt / success
  if (showReceipt && transaction) {
    return (
      <Receipt
        transaction={transaction}
        onBack={() => setShowReceipt(false)}
        onHome={handleHome}
        onRepeat={handleRepeat}
      />
    );
  }

  if (showSuccess && transaction) {
    return (
      <SuccessScreen
        title="Transfer Successful 🎉"
        message={`₦${Number(transaction.amount).toLocaleString()} sent to ${transaction.recipient}`}
        onRepeat={handleRepeat}
        onHome={handleHome}
        onViewReceipt={handleViewReceipt}
      />
    );
  }

  const headerHeight = Math.max(64 - scrollY / 10, 56);
  const headerOpacity = Math.max(1 - scrollY / 200, 0.95);

  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-br from-black via-gray-900 to-black text-yellow-400">
      {/* Header */}
      <div
        className="fixed top-0 left-0 w-full z-20 bg-black/90 text-yellow-400 flex items-center justify-center shadow-md transition-all duration-300 ease-in-out"
        style={{ height: `${headerHeight}px`, opacity: headerOpacity, backdropFilter: "blur(8px)" }}
      >
        <button
          onClick={() => navigate(-1)}
          className="absolute left-4 p-2 rounded-full hover:bg-yellow-700/20 transition"
        >
          <ArrowLeft size={22} />
        </button>
        <h1 className="text-[clamp(1.2rem,2vw,1.6rem)] font-semibold tracking-wide">Bank Transfer</h1>
      </div>

      {/* Main content */}
      <div className="flex-1 mt-[90px] px-6 sm:px-10 py-10 flex flex-col lg:flex-row gap-12 justify-center items-start">
        {/* Left Panel */}
        <div className="flex-1 max-w-md lg:sticky lg:top-28 space-y-8">
          <div className="rounded-3xl p-8 shadow-xl backdrop-blur-2xl bg-gradient-to-br from-yellow-900/10 to-black border border-yellow-700/30 hover:scale-[1.02] transition-all duration-300">
            <p className="text-yellow-300 text-sm font-medium mb-2">Available Balance</p>
            <h2 className="text-[3rem] font-bold text-yellow-400 tracking-wide mb-4">
              ₦{(account.balance || 0).toLocaleString()}
            </h2>
            <p className="text-yellow-600 text-sm">Make secure transfers to any Nigerian bank instantly 🚀</p>
          </div>

          <div className="rounded-3xl p-6 shadow-xl backdrop-blur-2xl bg-black/40 border border-yellow-700/30">
            <h3 className="text-yellow-300 font-semibold mb-4">Recent Transactions</h3>
            {(account.transactions || []).slice(0, 5).map((txn) => (
              <div
                key={txn.id}
                className="flex justify-between items-center mb-3 text-sm hover:bg-yellow-900/10 px-3 py-2 rounded-xl transition"
              >
                <span>{txn.recipient}</span>
                <span className="font-medium text-yellow-400">₦{txn.amount.toLocaleString()}</span>
              </div>
            ))}
            {(!account.transactions || account.transactions.length === 0) && (
              <p className="text-yellow-600 text-sm">No recent transactions</p>
            )}
          </div>
        </div>

        {/* Right Panel - Transfer Form */}
        <div className="flex-1 max-w-2xl w-full">
          <form
            onSubmit={openModal}
            className="backdrop-blur-2xl bg-black/40 border border-yellow-700/40 rounded-3xl shadow-xl p-8 space-y-6 hover:scale-[1.01] transition-all duration-300"
          >
            <h2 className="text-xl font-semibold text-yellow-300 mb-4">Transfer Funds</h2>

            {/* Account Number */}
            <div>
              <label className="block text-sm font-medium mb-1">Account Number</label>
              <input
                type="tel"
                name="accountNumber"
                value={form.accountNumber}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                  setForm({ ...form, accountNumber: value });
                }}
                placeholder="Enter 10-digit account number"
                required
                className="w-full border border-yellow-700/50 rounded-xl px-4 py-3 bg-black/30 text-yellow-400 outline-none focus:ring-2 focus:ring-yellow-400 placeholder-yellow-600 text-base"
              />
            </div>

            {/* Bank Name */}
            <div className="relative">
              <label className="block text-sm font-medium mb-1">Bank Name</label>
              <input
                type="text"
                placeholder="Search or select bank"
                value={form.bankName}
                onChange={(e) => setForm({ ...form, bankName: e.target.value })}
                onFocus={() => setShowBanks(true)}
                onBlur={() => setTimeout(() => setShowBanks(false), 200)}
                className="w-full border border-yellow-700/50 rounded-xl px-4 py-3 bg-black/30 text-yellow-400 outline-none focus:ring-2 focus:ring-yellow-400 placeholder-yellow-600 text-base"
              />
              {showBanks && (
                <div className="absolute z-10 mt-2 w-full bg-black/80 border border-yellow-700 rounded-xl shadow-lg max-h-60 overflow-y-auto text-yellow-400">
                  {NIGERIAN_BANKS.filter((bank) =>
                    bank.toLowerCase().includes(form.bankName.toLowerCase())
                  ).map((bank) => (
                    <div
                      key={bank}
                      onClick={() => {
                        setForm({ ...form, bankName: bank });
                        setShowBanks(false);
                      }}
                      className="px-4 py-2 cursor-pointer hover:bg-yellow-900 hover:text-black transition"
                    >
                      {bank}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Account Name */}
            <div>
              <label className="block text-sm font-medium mb-1">Account Name</label>
              <div className="w-full border border-yellow-700/50 rounded-xl px-4 py-3 bg-black/30 text-yellow-400 flex items-center text-base">
                {verifying ? (
                  <>
                    <Loader2 className="animate-spin mr-2 text-yellow-400" size={18} />
                    <span>Verifying...</span>
                  </>
                ) : form.accountName ? (
                  <span className="text-yellow-400 font-medium">{form.accountName}</span>
                ) : (
                  <span className="text-yellow-600">Enter details to verify</span>
                )}
              </div>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium mb-1">Amount</label>
              <div className="relative">
                <span className="absolute left-4 top-3 text-yellow-600 font-semibold">₦</span>
                <input
                  type="number"
                  name="amount"
                  value={form.amount}
                  onChange={handleChange}
                  placeholder="0.00"
                  required
                  className="w-full border border-yellow-700/50 rounded-xl pl-8 pr-4 py-3 bg-black/30 text-yellow-400 outline-none focus:ring-2 focus:ring-yellow-400 placeholder-yellow-600 text-base"
                />
              </div>
            </div>

            {/* Narration */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Narration <span className="text-yellow-600">(optional)</span>
              </label>
              <input
                type="text"
                name="narration"
                value={form.narration}
                onChange={(e) => {
                  if (e.target.value.length <= 60) setForm({ ...form, narration: e.target.value });
                }}
                placeholder="e.g. Rent payment, Gift for Mum"
                className="w-full border border-yellow-700/50 rounded-xl pl-4 pr-4 py-3 bg-black/30 text-yellow-400 outline-none focus:ring-2 focus:ring-yellow-400 placeholder-yellow-600 text-base"
              />
            </div>

            {/* Send Money Button */}
            <button
              type="submit"
              disabled={processing || verifying || !form.accountName}
              className={`w-full flex items-center justify-center gap-2 rounded-xl py-3 mt-4 font-semibold transition-all active:scale-95 shadow-md text-base
                ${processing || verifying
                  ? "bg-yellow-700 cursor-not-allowed"
                  : "bg-yellow-400 text-black hover:bg-yellow-300"
                }`}
            >
              {processing ? <Loader2 className="animate-spin mr-2" size={18} /> : <Send size={18} />}
              Send Money
            </button>
          </form>
        </div>
      </div>

      {/* Confirmation Modal */}
<ConfirmationModal
  isOpen={modalOpen}
  title="Confirm Transfer"
  transactionType={TRANSACTION_TYPES.TRANSFER}
  amount={Number(form.amount)}
  recipient={form.accountName}        // Recipient Name
  accountNumber={form.accountNumber}  // Account Number
  bankName={form.bankName}            // Bank Name
  narration={form.narration || "—"}
  userBalance={account.balance || 0}
  requirePin={true}
  processing={processing}
  onConfirm={(enteredPin) => handleConfirmTransfer(enteredPin)}
  onCancel={() => setModalOpen(false)}
/>


      {/* Footer */}
      <div className="mt-12">
        <Footer />
      </div>
    </div>
  );
};

export default TransferView;
