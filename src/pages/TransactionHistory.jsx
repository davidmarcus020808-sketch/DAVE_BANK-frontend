// src/pages/TransactionHistory.jsx
import React, { useContext, useMemo, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AccountContext, TRANSACTION_TYPES } from "../context/AccountContext";
import {
  ArrowLeft,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Search,
  Filter,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Receipt from "../components/Receipt";
import Footer from "../components/Footer";

const TransactionHistory = () => {
  const navigate = useNavigate();
  const { transactions = [] } = useContext(AccountContext);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All");
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const modalRef = useRef(null);

  // -------------------------------
  // Transaction Type Styles
  // -------------------------------
  const TYPE_STYLES = {
    [TRANSACTION_TYPES.TRANSFER]: {
      label: "Transfer",
      bg: "bg-red-600/20",
      color: "text-red-400",
      icon: <ArrowUpRight size={20} />,
    },
    Deposit: {
      label: "Deposit Received",
      bg: "bg-yellow-600/20",
      color: "text-yellow-400",
      icon: <ArrowDownLeft size={20} />,
    },
    [TRANSACTION_TYPES.AIRTIME]: {
      label: "Airtime Purchase",
      bg: "bg-blue-600/20",
      color: "text-blue-400",
      icon: <ArrowUpRight size={20} />,
    },
    [TRANSACTION_TYPES.DATA]: {
      label: "Data Purchase",
      bg: "bg-purple-600/20",
      color: "text-purple-400",
      icon: <ArrowUpRight size={20} />,
    },
    [TRANSACTION_TYPES.BILL]: {
      label: "Bill Payment",
      bg: "bg-green-600/20",
      color: "text-green-400",
      icon: <ArrowUpRight size={20} />,
    },
    [TRANSACTION_TYPES.BETTING]: {
      label: "Betting",
      bg: "bg-pink-600/20",
      color: "text-pink-400",
      icon: <ArrowUpRight size={20} />,
    },
  };

  // -------------------------------
  // Filter by Date
  // -------------------------------
  const filterByDate = (txDate) => {
    if (!txDate) return false;
    const date = new Date(txDate);
    if (isNaN(date)) return false;
    const now = new Date();

    if (dateFilter === "Today") return date.toDateString() === now.toDateString();

    if (dateFilter === "This Week") {
      const weekAgo = new Date(now);
      weekAgo.setDate(now.getDate() - 7);
      return date >= weekAgo;
    }

    if (dateFilter === "This Month") {
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }

    return true; // "All"
  };

  // -------------------------------
  // Filtered Transactions
  // -------------------------------
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      if (!tx) return false;
      const style = TYPE_STYLES[tx.type] || { label: tx.type };
      const typeMatch = typeFilter === "All" || style.label === typeFilter;
      const searchMatch =
        search.trim() === "" ||
        style.label.toLowerCase().includes(search.toLowerCase()) ||
        tx.recipient?.toLowerCase().includes(search.toLowerCase()) ||
        tx.phone?.includes(search) ||
        String(tx.amount)?.includes(search);
      return typeMatch && searchMatch && filterByDate(tx.date);
    });
  }, [transactions, search, typeFilter, dateFilter]);

  // -------------------------------
  // Group Transactions by Date
  // -------------------------------
  const groupedTransactions = useMemo(() => {
    const sorted = [...filteredTransactions].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
    const groups = {};

    sorted.forEach((tx) => {
      const dateKey = new Date(tx.date).toLocaleDateString();
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(tx);
    });

    // Sort each group newest first
    Object.keys(groups).forEach((key) => {
      groups[key].sort((a, b) => new Date(b.date) - new Date(a.date));
    });

    // Sort date keys newest first
    const sortedGroups = {};
    Object.keys(groups)
      .sort((a, b) => new Date(b) - new Date(a))
      .forEach((key) => {
        sortedGroups[key] = groups[key];
      });

    return sortedGroups;
  }, [filteredTransactions]);

  // -------------------------------
  // Format Date Headers
  // -------------------------------
  const formatDateHeader = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";

    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // -------------------------------
  // Modal Handlers
  // -------------------------------
  useEffect(() => {
    if (!selectedTransaction) return;

    const close = () => setSelectedTransaction(null);
    const escHandler = (e) => e.key === "Escape" && close();
    const clickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) setSelectedTransaction(null);
    };

    window.addEventListener("popstate", close);
    window.addEventListener("keydown", escHandler);
    document.addEventListener("mousedown", clickOutside);
    window.history.pushState(null, null, window.location.href);

    return () => {
      window.removeEventListener("popstate", close);
      window.removeEventListener("keydown", escHandler);
      document.removeEventListener("mousedown", clickOutside);
    };
  }, [selectedTransaction]);

  const handleTransactionClick = (tx) => {
    setSelectedTransaction({
      ...tx,
      reference: tx.id || `TX-${Date.now()}`,
      status: "Successful",
    });
  };

  // -------------------------------
  // JSX
  // -------------------------------
  return (
    <div className="min-h-screen bg-black text-yellow-400 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-700 to-yellow-500 px-6 py-4 flex items-center relative shadow-lg">
        <button
          onClick={() => navigate(-1)}
          className="absolute left-4 p-2 rounded-full hover:bg-yellow-400/20 transition"
        >
          <ArrowLeft size={22} />
        </button>
        <h1 className="flex-1 text-center font-semibold text-lg sm:text-xl text-black">
          Transaction History
        </h1>
      </div>

      {/* Filters */}
      <div className="sticky top-0 z-20 bg-black border-b border-yellow-600 shadow-sm p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-3 text-yellow-400/60" />
            <input
              type="text"
              placeholder="Search by name, amount, or account"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-yellow-600 rounded-xl pl-10 pr-3 py-2.5 text-sm bg-black text-yellow-300 outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 text-sm">
            <Filter size={16} className="text-yellow-400" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="border border-yellow-600 rounded-lg px-3 py-2 bg-black text-yellow-300 outline-none focus:ring-2 focus:ring-yellow-500"
            >
              <option>All</option>
              {Object.values(TYPE_STYLES).map((type) => (
                <option key={type.label}>{type.label}</option>
              ))}
            </select>

            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="border border-yellow-600 rounded-lg px-3 py-2 bg-black text-yellow-300 outline-none focus:ring-2 focus:ring-yellow-500"
            >
              <option>All</option>
              <option>Today</option>
              <option>This Week</option>
              <option>This Month</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="flex-1 p-4 overflow-y-auto">
        {filteredTransactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-yellow-400/70 mt-24">
            <Wallet size={48} className="mb-3 text-yellow-600/50" />
            <p className="font-medium">No matching transactions</p>
            <p className="text-sm text-yellow-500/60 mt-1">Try adjusting your filters or search</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedTransactions).map(([date, list]) => (
              <div key={date}>
                <h2 className="text-sm sm:text-base font-semibold text-yellow-500 mb-2">
                  {formatDateHeader(date)}
                </h2>

                <div className="space-y-3">
                  {list.map((tx) => {
                    const style = TYPE_STYLES[tx.type] || {
                      label: tx.type,
                      bg: "bg-yellow-600/20",
                      color: "text-yellow-400",
                      icon: <ArrowDownLeft size={20} />,
                    };
                    const isDeposit = tx.type === "Deposit";

                    return (
                      <motion.div
                        key={tx.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={() => handleTransactionClick(tx)}
                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-black border border-yellow-600 p-4 rounded-2xl shadow-md hover:shadow-lg cursor-pointer transition-all"
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`p-3 rounded-full ${style.bg} ${style.color}`}>
                            {style.icon}
                          </div>

                          <div>
                            <h3 className="font-semibold text-yellow-400 text-sm sm:text-base">
                              {style.label}
                            </h3>
                            <p className="text-yellow-300 text-sm">
                              {tx.recipient || tx.phone || "—"}
                            </p>
                            <span className="text-xs text-yellow-500/70">
                              {tx.date
                                ? new Date(tx.date).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    second: "2-digit",
                                    hour12: true,
                                  })
                                : "—"}
                            </span>

                            {tx.balanceAfter !== undefined && (
                              <p className="text-xs text-yellow-300 mt-1">
                                Balance after:{" "}
                                <span className="font-medium text-yellow-400">
                                  ₦{Number(tx.balanceAfter).toLocaleString()}
                                </span>
                              </p>
                            )}
                          </div>
                        </div>

                        <div
                          className={`text-base font-semibold mt-2 sm:mt-0 ${
                            isDeposit ? "text-yellow-400" : style.color
                          }`}
                        >
                          {isDeposit ? "+" : "−"}₦{Number(tx.amount).toLocaleString()}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Receipt Modal */}
      <AnimatePresence>
        {selectedTransaction && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-end sm:items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              ref={modalRef}
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 120, damping: 18 }}
              className="w-full max-w-md sm:max-w-lg md:max-w-xl bg-black rounded-t-3xl sm:rounded-2xl shadow-2xl border border-yellow-600 overflow-hidden mx-2"
            >
              <Receipt
                transaction={selectedTransaction}
                onHome={() => setSelectedTransaction(null)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default TransactionHistory;
