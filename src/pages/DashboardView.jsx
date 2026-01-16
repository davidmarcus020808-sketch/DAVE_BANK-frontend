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

  const handleServiceClick = (id, label) => {
    const comingSoon = [
      "withdraw",
      "cards",
      "loan",
      "business",
      "insurance",
      "finance",
      "more",
    ];
    const directRoutes = {
      airtime: "/airtime",
      data: "/data",
      transfer: "/transfer",
      bills: "/bills",
      betting: "/betting",
    };

    if (directRoutes[id]) return navigate(directRoutes[id]);
    if (comingSoon.includes(id))
      return navigate("/coming-soon", { state: { feature: label } });

    changeView(id);
  };

  const handleLogout = () => {
    localStorage.removeItem("account");
    showToast("success", "Signed out successfully ✅");
    setTimeout(() => navigate("/logout"), 1000);
  };

  return (
    <div className="flex min-h-screen bg-black">
      {/* Sidebar */}
      <div className="hidden lg:block lg:w-64 lg:fixed lg:h-full bg-gradient-to-b from-yellow-700 to-yellow-800 text-black font-semibold">
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-64">
        <TopNav />

        <main className="flex-1 pt-20 px-4 sm:px-6 lg:px-8 overflow-y-auto">
          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-md bg-yellow-600 flex items-center justify-center shadow-md">
                <User size={18} className="text-black" />
              </div>
              <div>
                <p className="text-xs text-yellow-500">Welcome back</p>
                <h2 className="text-base sm:text-lg font-semibold text-white truncate max-w-[220px]">
                  {account?.full_name || "Loading..."}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => changeView("accountdetails")}
                className="px-3 py-2 rounded-md bg-yellow-600 text-black hover:bg-yellow-500 transition"
              >
                <Settings size={16} />
              </button>
              <button
                onClick={handleLogout}
                className="text-sm text-yellow-500 hover:text-red-500 transition"
              >
                Logout
              </button>
            </div>
          </motion.header>

          {/* Balance Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <BalanceCard
              balance={account?.balance || 0}
              onAddMoney={() => navigate("/add-money")}
              onViewHistory={() => navigate("/transactionhistory")}
            />
          </motion.div>

          {/* Services */}
          <div className="mt-6">
            <Services services={services} onServiceClick={handleServiceClick} />
          </div>

          {/* Support Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="bg-yellow-900/20 rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between border border-yellow-700 gap-4 mt-6"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-md bg-yellow-600 flex items-center justify-center text-black">
                <MessageCircle size={18} />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">
                  Need help?
                </div>
                <div className="text-xs text-yellow-400">
                  Contact our 24/7 support team
                </div>
              </div>
            </div>
            <button
              onClick={() => changeView("accountdetails")}
              className="text-yellow-500 font-semibold flex items-center gap-1 hover:text-yellow-300"
            >
              Contact <ChevronRight size={14} />
            </button>
          </motion.div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default DashboardView;
