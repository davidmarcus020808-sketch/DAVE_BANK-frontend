// --- unchanged imports ---
import React, { useContext, useState } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  Trash2,
  Mail,
  Smartphone,
  MessageSquare,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { AccountContext } from "../context/AccountContext";
import Footer from "../components/Footer";
import toast, { Toaster } from "react-hot-toast";
import CustomToast from "../components/CustomToast";
import ConfirmModal from "../components/ConfirmModal";

const NotificationsPage = () => {
  const { notifications, setNotifications } = useContext(AccountContext);

  const [settings, setSettings] = useState({
    push: true,
    email: true,
    sms: false,
  });

  const [showModal, setShowModal] = useState(false);

  // Toggle preference
  const toggleSetting = (key) =>
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, read: true }))
    );
  };

  // Clear all
  const clearAll = () => {
    setNotifications([]);
  };

  const handleSave = () => {
    toast.custom(
      <CustomToast
        type="success"
        message="Your notification preferences have been saved successfully!"
      />,
      { duration: 2500 }
    );
  };

  const confirmClearAll = () => {
    clearAll();
    setShowModal(false);

    toast.custom(
      <CustomToast
        type="success"
        message="All notifications cleared successfully!"
      />,
      { duration: 2500 }
    );
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#111] to-black text-yellow-50 px-6 sm:px-10 py-12 font-[Inter]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-yellow-800/30 pb-6 mb-8">
        <div>
          <h1 className="text-4xl font-bold text-yellow-300 flex items-center gap-3">
            <Bell size={28} className="animate-pulse text-yellow-400" />
            Notifications
          </h1>
          <p className="text-yellow-200/70 text-sm mt-1">
            Stay informed and in control — see updates, alerts, and offers all in one place.
          </p>
        </div>

        <div className="flex gap-3 mt-5 sm:mt-0">
          <button
            onClick={markAllAsRead}
            className="text-xs sm:text-sm bg-yellow-500 text-black font-semibold px-5 py-2 rounded-lg hover:bg-yellow-400 transition duration-200 shadow-[0_0_10px_rgba(255,215,0,0.2)]"
          >
            Mark all as read
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="text-xs sm:text-sm bg-red-600 text-white font-semibold px-5 py-2 rounded-lg hover:bg-red-500 transition flex items-center gap-2 shadow-[0_0_10px_rgba(255,0,0,0.2)]"
          >
            <Trash2 size={16} /> Clear all
          </button>
        </div>
      </div>

      {/* Notifications + Settings */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Notifications List */}
        <motion.div
          className="lg:col-span-2 space-y-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {notifications.length === 0 ? (
            <div className="text-center py-24 text-yellow-300/70">
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <Bell size={50} className="mx-auto mb-4 text-yellow-400/80" />
              </motion.div>
              <p className="text-lg font-medium">No notifications yet 🎉</p>
              <p className="text-yellow-200/60 text-sm">
                You’re all caught up! Check back later for new updates.
              </p>
            </div>
          ) : (
            notifications.map((n) => (
              <motion.div
                key={n.id}
                whileHover={{ scale: 1.02, y: -2 }}
                className={`flex items-start gap-4 p-5 rounded-2xl border backdrop-blur-xl transition-all duration-300 ${
                  n.read
                    ? "border-yellow-800/30 bg-yellow-950/10"
                    : "border-yellow-600/50 bg-yellow-950/30 shadow-[0_0_25px_rgba(255,215,0,0.1)]"
                }`}
              >
                {/* Icon */}
                <div className="p-3 rounded-xl bg-yellow-900/30 text-yellow-400">
                  <Bell size={18} />
                </div>

                {/* Info */}
                <div className="flex-1">
                  <h3 className="font-semibold text-yellow-100 text-sm sm:text-base">
                    {n.title || "Notification"}
                  </h3>

                  <p className="text-yellow-200/70 text-xs sm:text-sm mt-1">
                    {n.message}
                  </p>

                  <p className="text-yellow-400/60 text-xs mt-2">
                    {n.time || "Just now"}
                  </p>
                </div>

                {/* Unread Dot */}
                {!n.read && (
                  <motion.span
                    className="h-3 w-3 bg-yellow-400 rounded-full mt-2"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                  />
                )}
              </motion.div>
            ))
          )}
        </motion.div>

        {/* Settings Panel */}
        <motion.div
          className="bg-yellow-950/10 border border-yellow-800/40 rounded-2xl p-6 backdrop-blur-lg shadow-[0_0_20px_rgba(255,215,0,0.05)]"
          initial={{ x: 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <h2 className="text-xl font-semibold text-yellow-300 mb-4">
            Notification Preferences
          </h2>

          <p className="text-yellow-200/70 text-sm mb-6">
            Choose how and when you’d like to receive updates from DaveBank.
          </p>

          <div className="space-y-5">
            {[ 
              { key: "push", label: "App Push Notifications", icon: Smartphone },
              { key: "email", label: "Email Notifications", icon: Mail },
              { key: "sms", label: "SMS Notifications", icon: MessageSquare },
            ].map(({ key, label, icon: Icon }) => (
              <div
                key={key}
                className="flex items-center justify-between bg-yellow-900/10 border border-yellow-800/50 px-4 py-3 rounded-xl hover:border-yellow-700 transition"
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} className="text-yellow-400" />
                  <span className="text-sm text-yellow-100">{label}</span>
                </div>

                <button
                  onClick={() => toggleSetting(key)}
                  className="text-yellow-400 hover:text-yellow-300 transition"
                >
                  {settings[key] ? (
                    <ToggleRight size={28} className="text-yellow-400" />
                  ) : (
                    <ToggleLeft size={28} className="text-yellow-600" />
                  )}
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={handleSave}
            className="mt-6 w-full bg-yellow-500 text-black py-2 rounded-lg font-semibold hover:bg-yellow-400 transition shadow-[0_0_10px_rgba(255,215,0,0.2)]"
          >
            Save Preferences
          </button>
        </motion.div>
      </div>

      <Toaster position="top-right" />
      <div className="pt-10">
        <Footer />
      </div>

      {/* Confirm Modal */}
      <ConfirmModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={confirmClearAll}
        title="Clear All Notifications?"
        message="Are you sure you want to permanently delete all notifications? This action cannot be undone."
      />
    </motion.div>
  );
};

export default NotificationsPage;
