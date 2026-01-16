// src/pages/DashboardView.jsx
import React, { useContext } from "react";
import { motion } from "framer-motion";
import {
  Send,
  CreditCard,
  Wifi,
  PhoneCall,
  ArrowDownCircle,
  FileText,
  Gamepad2,
  Landmark,
  Building2,
  ShieldCheck,
  BarChart2,
  MoreHorizontal,
  MessageCircle,
  ChevronRight,
  User,
  Settings,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Services from "../components/Services";
import { AccountContext } from "../context/AccountContext";
import BalanceCard from "../components/BalanceCard";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import TopNav from "../components/TopNav";
import { useToast } from "../context/ToastContext";

const DashboardView = ({ changeView }) => {
  const { account, loading } = useContext(AccountContext);
  const navigate = useNavigate();
  const { showToast } = useToast();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-yellow-500">
        Loading your account...
      </div>
    );
  }

  const services = [
    { id: "withdraw", icon: ArrowDownCircle, label: "Withdraw" },
    { id: "transfer", icon: Send, label: "Transfer" },
    { id: "data", icon: Wifi, label: "Data" },
    { id: "airtime", icon: PhoneCall, label: "Airtime" },
    { id: "bills", icon: FileText, label: "Bills" },
    { id: "cards", icon: CreditCard, label: "Cards" },
    { id: "betting", icon: Gamepad2, label: "Betting" },
    { id: "loan", icon: Landmark, label: "Loan" },
    { id: "business", icon: Building2, label: "Business" },
    { id: "insurance", icon: ShieldCheck, label: "Insurance" },
    { id: "finance", icon: BarChart2, label: "Finance" },
    { id: "more", icon: MoreHorizontal, label: "More" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("account");
    showToast("success", "Signed out successfully ✅");
    setTimeout(() => navigate("/logout"), 800);
  };

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Desktop Sidebar ONLY */}
      <aside className="hidden lg:block w-64 bg-gradient-to-b from-yellow-700 to-yellow-800">
        <Sidebar />
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        {/* Top Navigation */}
        <TopNav />

        {/* Content */}
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-6"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-yellow-600 flex items-center justify-center">
                <User size={18} className="text-black" />
              </div>
              <div>
                <p className="text-xs text-yellow-500">Welcome back</p>
                <p className="text-sm font-semibold truncate max-w-[180px] sm:max-w-none">
                  {account?.full_name}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => changeView("accountdetails")}
                className="p-2 rounded-md bg-yellow-600 text-black"
              >
                <Settings size={16} />
              </button>
              <button
                onClick={handleLogout}
                className="text-xs text-yellow-500"
              >
                Logout
              </button>
            </div>
          </motion.div>

          {/* Balance */}
          <BalanceCard
            balance={account?.balance || 0}
            onAddMoney={() => navigate("/add-money")}
            onViewHistory={() => navigate("/transactionhistory")}
          />

          {/* Services */}
          <section className="mt-6">
            <Services services={services} />
          </section>

          {/* Support */}
          <section className="mt-6 bg-yellow-900/20 border border-yellow-700 rounded-lg p-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-600 rounded-md flex items-center justify-center">
                <MessageCircle size={18} className="text-black" />
              </div>
              <div>
                <p className="text-sm font-semibold">Need help?</p>
                <p className="text-xs text-yellow-400">
                  24/7 customer support
                </p>
              </div>
            </div>
            <button className="text-yellow-500 flex items-center gap-1 text-sm">
              Contact <ChevronRight size={14} />
            </button>
          </section>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default DashboardView;
