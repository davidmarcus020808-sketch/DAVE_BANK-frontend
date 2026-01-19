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
  X,
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
    <div className="min-h-screen bg-black flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64
          bg-gradient-to-b from-yellow-700 to-yellow-800 text-black
          transform transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static
        `}
      >
        <Sidebar />
      </aside>

      {/* Main content */}
      <div className="fixed top-0 left-0 right-0 z-40 lg:left-64">
        <TopNav />
      </div>


        {/* Mobile menu button */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-yellow-600 text-black"
        >
          <Menu size={18} />
        </button>

        <main className="flex-1 pt-20 px-4 sm:px-6 lg:px-8 overflow-y-auto">
          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col sm:flex-row justify-between gap-4 mb-6"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-md bg-yellow-600 flex items-center justify-center">
                <User size={18} className="text-black" />
              </div>
              <div>
                <p className="text-xs text-yellow-500">Welcome back</p>
                <h2 className="text-base sm:text-lg font-semibold text-white">
                  {account?.full_name}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => changeView("accountdetails")}
                className="px-3 py-2 rounded-md bg-yellow-600 text-black"
              >
                <Settings size={16} />
              </button>
              <button
                onClick={handleLogout}
                className="text-sm text-yellow-500 hover:text-red-500"
              >
                Logout
              </button>
            </div>
          </motion.header>

          {/* Balance */}
          <BalanceCard
            balance={account?.balance || 0}
            onAddMoney={() => navigate("/add-money")}
            onViewHistory={() => navigate("/transactionhistory")}
          />

          {/* Services */}
          <div className="mt-6">
            <Services services={services} onServiceClick={handleServiceClick} />
          </div>

          {/* Support */}
          <div className="mt-6 bg-yellow-900/20 border border-yellow-700 rounded-lg p-4 flex flex-col sm:flex-row justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-600 rounded-md flex items-center justify-center">
                <MessageCircle size={18} className="text-black" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Need help?</p>
                <p className="text-xs text-yellow-400">
                  Contact our 24/7 support team
                </p>
              </div>
            </div>
            <button className="text-yellow-500 flex items-center gap-1 text-sm">
              Contact <ChevronRight size={14} />
            </button>
          </div>
        </main>

        {/* Footer (compact on mobile) */}
        <div className="px-3 py-2 sm:px-4 sm:py-5 text-[10px] sm:text-sm">
          <Footer />
        </div>
    </div>
  );
};

export default DashboardView;

