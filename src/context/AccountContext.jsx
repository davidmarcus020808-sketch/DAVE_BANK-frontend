import React, { createContext, useEffect, useState } from "react";
import api from "../api/axiosInstance";

export const AccountContext = createContext();

export const TRANSACTION_TYPES = {
  TRANSFER: "Transfer",
  BILL: "Bill Payment",
  AIRTIME: "Airtime Purchase",
  DATA: "Data Purchase",
  BETTING: "Betting",
  REWARD_POINTS: "Reward Points",
};

const POINTS_PER_TRANSACTION = 100;

export const AccountProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [notifications, setNotifications] = useState(() => {
    const stored = localStorage.getItem("notifications");
    return stored ? JSON.parse(stored) : [];
  });
  const [loading, setLoading] = useState(true);
  const [accountLoading, setAccountLoading] = useState(false);
  const [transactionsLoading, setTransactionsLoading] = useState(false);

  // Persist notifications
  useEffect(() => {
    localStorage.setItem("notifications", JSON.stringify(notifications));
  }, [notifications]);

  const addNotification = (message, type = "success", options = {}) => {
    const id = Date.now();
    const newNotif = {
      id,
      type,
      message,
      title: options.title || "Notification",
      time: options.time || new Date().toLocaleTimeString(),
      icon: options.icon || null,
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const markAllAsRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  const clearAllNotifications = () => setNotifications([]);

  // -----------------------
  // Normalize transactions
  // -----------------------
  const normalizeTransaction = (txn) => ({
    id: txn.id,
    reference: txn.reference,
    amount: txn.amount,
    type: txn.type || txn.transaction_type,
    provider: txn.provider || txn.account_name || null,
    recipient: txn.recipient || txn.phone || txn.beneficiary || null,
    planLabel: txn.planLabel || null,
    expiry: txn.expiry || null,
    category: txn.category || null,
    status: txn.status || "Successful",
    date: txn.date || txn.timestamp || new Date().toISOString(),
    points: txn.points || 0,
  });

  // -----------------------
  // Fetch account & transactions
  // -----------------------
  const fetchAccount = async () => {
    setAccountLoading(true);
    try {
      const res = await api.get("/account/");
      setAccount(res.data);
    } catch (err) {
      console.error("Account fetch error:", err.response?.data || err);
      addNotification(
        err.response?.data?.message || "Failed to load account",
        "error",
        { title: "Account Error", persistent: true }
      );
    } finally {
      setAccountLoading(false);
    }
  };

  const fetchTransactions = async () => {
    setTransactionsLoading(true);
    try {
      const res = await api.get("/transactions/");
      const data = res.data.transactions || res.data || [];
      const normalized = data.map(normalizeTransaction);
      const sorted = normalized.sort((a, b) => new Date(b.date) - new Date(a.date));
      setTransactions(sorted);
    } catch (err) {
      console.error("Transactions fetch error:", err.response?.data || err);
      addNotification(
        err.response?.data?.message || "Failed to load transactions",
        "error",
        { title: "Transaction Error", persistent: true }
      );
    } finally {
      setTransactionsLoading(false);
    }
  };

  // -----------------------
  // Login
  // -----------------------
  const login = async (credentials) => {
    try {
      const res = await api.post("/login/", credentials, { withCredentials: true });
      const access = res.data.access;
      localStorage.setItem("accessToken", access);
      api.defaults.headers.common["Authorization"] = `Bearer ${access}`;

      await Promise.all([fetchAccount(), fetchTransactions()]);
      addNotification("Login successful", "success", { title: "Welcome Back!" });
      return res.data;
    } catch (err) {
      console.error("Login error:", err.response?.data || err);
      addNotification(
        err.response?.data?.message || "Login failed",
        "error",
        { title: "Login Error", persistent: true }
      );
      throw err;
    }
  };

  // -----------------------
  // Add transaction
  // -----------------------
  const addTransaction = async (transactionData) => {
    if (!transactionData.type) transactionData.type = TRANSACTION_TYPES.TRANSFER;
    try {
      const res = await api.post("/transactions/", transactionData);
      if (res.data) {
        if (res.data.account) setAccount(res.data.account);

        const txn = normalizeTransaction(res.data.transaction || res.data);
        setTransactions((prev) => [txn, ...prev.filter((t) => t.id !== txn.id)]);

        const target = txn.recipient || txn.provider || "your account";
        addNotification(
          `${txn.type || "Transaction"} of ₦${txn.amount?.toLocaleString()} completed to ${target}`,
          "success",
          { title: `${txn.type || "Transaction"} Completed` }
        );

        return txn;
      }
    } catch (err) {
      console.error("Transaction error:", err.response?.data || err);
      addNotification(
        err.response?.data?.message || "Transaction failed",
        "error",
        { title: "Transaction Error", persistent: true }
      );
      throw err;
    }
  };

  // -----------------------
  // Update account
  // -----------------------
  const updateAccount = async (data, isImage = false) => {
    const formData = new FormData();
    if (isImage && data.profilePic) formData.append("profilePic", data.profilePic);
    else Object.entries(data).forEach(([k, v]) => formData.append(k, v));

    try {
      const res = await api.post("/account/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setAccount(res.data);
      addNotification("Profile updated successfully", "success", { title: "Profile Update" });
      return res.data;
    } catch (err) {
      console.error("Account update error:", err.response?.data || err);
      addNotification(
        err.response?.data?.message || "Update failed",
        "error",
        { title: "Profile Error", persistent: true }
      );
      throw err;
    }
  };

  // -----------------------
  // Logout
  // -----------------------
  const resetAccount = () => {
    setAccount(null);
    setTransactions([]);
    localStorage.removeItem("accessToken");
    api.defaults.headers.common["Authorization"] = null;

    addNotification("Logged out successfully", "success", { title: "Logout", persistent: true });
  };

  // -----------------------
  // Refresh account (wallet)
  // -----------------------
  const refreshAccount = async () => {
    await fetchAccount();
    await fetchTransactions();
  };

  // -----------------------
  // Init
  // -----------------------
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      if (token) api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      await Promise.all([fetchAccount(), fetchTransactions()]);
      setLoading(false);
    };
    init();
  }, []);

  return (
    <AccountContext.Provider
      value={{
        account,
        transactions,
        notifications,
        setNotifications,
        addNotification,
        markAllAsRead,
        clearAllNotifications,
        login,
        addTransaction,
        updateAccount,
        resetAccount,
        loading,
        accountLoading,
        transactionsLoading,
        fetchAccount,
        fetchTransactions,
        refreshAccount,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};
