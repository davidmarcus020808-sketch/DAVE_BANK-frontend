import React, {
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
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
  Menu,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import Services from "../components/Services";
import BalanceCard from "../components/BalanceCard";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import TopNav from "../components/TopNav";

import { AccountContext } from "../context/AccountContext";
import { useToast } from "../context/ToastContext";

const DashboardView = ({ changeView }) => {
  const { account, loading } = useContext(AccountContext);
  const { showToast } = useToast();
  const navigate = useNavigate();

  /* ===============================
     UI STATE
  ================================ */
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hideHeader, setHideHeader] = useState(false);
  const lastScrollY = useRef(0);

  /* ===============================
     Hide mobile header on scroll
  ================================ */
  useEffect(() => {
    const onScroll = () => {
      if (window.innerWidth >= 768) return;

      const currentY = window.scrollY;
      const delta = currentY - lastScrollY.current;

      if (delta > 10 && currentY > 60) {
        setHideHeader(true);
      } else if (delta < -10) {
        setHideHeader(false);
      }

      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ===============================
     Lock scroll when sidebar open
  ================================ */
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "auto";
  }, [sidebarOpen]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-yellow-500">
        Loading your account...
      </div>
    );
  }

  /* ===============================
     Services
  ================================ */
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
    const routes = {
      airtime: "/airtime",
      data: "/data",
      transfer: "/transfer",
      bills: "/bills",
      betting: "/betting",
    };

    const comingSoon = [
      "withdraw",
      "cards",
      "loan",
      "business",
      "insurance",
      "finance",
      "more",
    ];

    if (window.innerWidth < 768) setSidebarOpen(false);

    if (routes[id]) return navigate(routes[id]);
    if (comingSoon.includes(id))
      return navigate("/coming-soon", {
        state: { feature: label },
      });

    changeView(id);
  };

  return (
    <div className="flex min-h-screen bg-black">
      {/* ================= Desktop Sidebar ================= */}
      <div className="hidden md:block fixed w-64 h-full bg-gradient-to-b from-yellow-700 to-yellow-800 z-20">
        <Sidebar />
      </div>

      {/* ================= Mobile Sidebar ================= */}
      <div
        className={`fixed inset-y-0 left-0 w-64 z-50 bg-gradient-to-b from-yellow-700 to-yellow-800 transform transition-transform duration-300 md:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-end p-4">
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded bg-yellow-600"
          >
            <X size={20} />
          </button>
        </div>
        <Sidebar />
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ================= Mobile Floating Header ================= */}
      <div
        className={`fixed top-3 left-0 right-0 z-50 md:hidden transition-all duration-300 ${
          hideHeader
            ? "-translate-y-16 opacity-0 scale-95"
            : "translate-y-0 opacity-100 scale-100"
        }`}
      >
        <div className="mx-4 flex items-center justify-between px-3 py-2 rounded-xl bg-black/60 backdrop-blur-md border border-yellow-700/40 shadow-lg">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg bg-yellow-600 text-black"
          >
            <Menu size={22} />
          </button>

          <div className="text-right -translate-x-[3px]">
            <p className="text-xs text-yellow-400">Welcome back,</p>
            <p className="text-sm font-semibold text-white">
              {account?.full_name}
            </p>
          </div>
        </div>
      </div>

      {/* ================= Main Content ================= */}
      <div className="flex-1 flex flex-col min-h-screen md:ml-64">
        <div className="hidden md:block">
          <TopNav />
        </div>

        <main className="flex-1 pt-24 md:pt-20 p-4 md:p-8 overflow-y-auto">
          <BalanceCard
            balance={account?.balance || 0}
            onAddMoney={() => navigate("/add-money")}
            onViewHistory={() =>
              navigate("/transactionhistory")
            }
          />

          <div className="mt-8">
            <Services
              services={services}
              onServiceClick={handleServiceClick}
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 bg-yellow-900/20 border border-yellow-700 rounded-xl p-5 flex justify-between items-center"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-600 rounded-lg flex items-center justify-center">
                <MessageCircle size={18} />
              </div>
              <div>
                <p className="text-white font-semibold">
                  Need help?
                </p>
                <p className="text-xs text-yellow-400">
                  Contact our support team
                </p>
              </div>
            </div>

            <button className="text-yellow-500 flex items-center gap-1">
              Contact <ChevronRight size={16} />
            </button>
          </motion.div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default DashboardView;
