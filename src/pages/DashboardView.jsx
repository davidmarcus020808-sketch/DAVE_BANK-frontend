// src/pages/DashboardView.jsx
import React, { useContext, useState } from "react";
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
  Menu,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Services from "../components/Services";
import { AccountContext } from "../context/AccountContext";
import BalanceCard from "../components/BalanceCard";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import TopNav from "../components/TopNav";
import { useToast } from "../context/ToastContext";

const NAV_HEIGHT = 64; // must match TopNav height

const DashboardView = ({ changeView }) => {
  const { account, loading } = useContext(AccountContext);
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
    <div className="bg-black text-white min-h-screen">
      {/* Top Navigation (ALWAYS FIXED) */}
      <div className="fixed top-0 left-0 right-0 z-50 h-16 bg-black border-b border-yellow-700">
        <TopNav />
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed z-50 w-64 bg-gradient-to-b from-yellow-700 to-yellow-800
          top-16 bottom-0
          transform transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        <Sidebar />
      </aside>

      {/* Mobile Menu Button (inside TopNav zone) */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-[60] p-2 rounded-md bg-yellow-600 text-black"
      >
        <Menu size={18} />
      </button>

      {/* Main Content */}
      <main
        className="
          pt-20
          px-4 sm:px-6 lg:px-8
          lg:ml-64
          min-h-screen
        "
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-yellow-600 flex items-center justify-center">
              <User size={18} className="text-black" />
            </div>
            <div className="leading-tight">
              <p className="text-xs text-yellow-400">Welcome back</p>
              <p className="text-sm font-semibold truncate max-w-[160px] sm:max-w-none">
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
        <div className="mt-6">
          <Services services={services} />
        </div>

        {/* Support */}
        <div className="mt-6 bg-yellow-900/20 border border-yellow-700 rounded-lg p-4 flex items-center justify-between gap-4">
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
          <button className="text-yellow-500 text-sm flex items-center gap-1">
            Contact <ChevronRight size={14} />
          </button>
        </div>

        <Footer />
      </main>
    </div>
  );
};

export default DashboardView;
