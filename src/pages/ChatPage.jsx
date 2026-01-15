import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Headphones, Loader2, MessageCircle, ShieldCheck } from "lucide-react";

const LiveSupport = () => {
  const [chatLoaded, setChatLoaded] = useState(false);

  useEffect(() => {
    // Avoid adding multiple scripts
    if (!document.querySelector("script[src*='tawk.to']")) {
      window.Tawk_API = window.Tawk_API || {};
      window.Tawk_LoadStart = new Date();

      const s1 = document.createElement("script");
      s1.async = true;
      s1.src = "https://embed.tawk.to/690a0dde39bc2c194c807c51/1j97kcbk9";
      s1.charset = "UTF-8";
      s1.setAttribute("crossorigin", "*");
      document.body.appendChild(s1);

      s1.onload = () => {
        setChatLoaded(true);
        if (window.Tawk_API) window.Tawk_API.showWidget();
      };
    }

    return () => {
      if (window.Tawk_API) {
        try {
          window.Tawk_API.hideWidget();
          window.Tawk_API.destroy();
        } catch (e) {
          console.warn("Tawk cleanup error:", e);
        }
      }
      const tawkIframe = document.querySelector("iframe[src*='tawk.to']");
      if (tawkIframe) tawkIframe.remove();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-yellow-400 flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">

      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,215,0,0.06)_0%,transparent_80%)] pointer-events-none" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl w-full text-center mb-12"
      >
        <div className="flex justify-center mb-4">
          <div className="bg-yellow-500/20 p-6 rounded-full shadow-lg">
            <Headphones className="text-yellow-400 w-12 h-12 animate-bounce" />
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold text-yellow-400 mb-3 tracking-wide">
          DAVE BANK Live Support
        </h1>
        <p className="text-yellow-200/90 text-base md:text-lg leading-relaxed">
          Our expert support team is available 24/7 to assist with transactions, account issues, and banking inquiries. Click the chat icon at the bottom-right to start a conversation.
        </p>
      </motion.div>

      {/* Agent Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="bg-white/5 backdrop-blur-xl border border-yellow-600/30 rounded-3xl p-8 shadow-[0_0_25px_rgba(255,215,0,0.15)] max-w-md w-full flex flex-col items-center mb-12 transition-transform hover:scale-105"
      >
        <img
          src="https://api.dicebear.com/7.x/initials/svg?seed=Marcus+Agent&backgroundType=solid&radius=50"
          alt="Support Agent"
          className="w-28 h-28 rounded-full border-4 border-yellow-400 shadow-lg mb-4"
        />
        <h2 className="text-2xl font-semibold text-yellow-300 mb-1">Marcus</h2>
        <p className="text-yellow-200/80 text-sm mb-4">Senior Support Agent • DAVE BANK</p>
        <div className="flex items-center gap-2 text-yellow-400/90 text-sm mb-3">
          <ShieldCheck size={16} />
          <span>Verified Banking Support</span>
        </div>
        <p className="text-yellow-300/80 text-xs text-center">
          Marcus is ready to help you securely with any account-related inquiries or transactions.
        </p>
      </motion.div>

      {/* Chat Loader / Info */}
      {!chatLoaded ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <Loader2 className="w-8 h-8 animate-spin text-yellow-400" />
          <p className="text-yellow-200/80 text-sm">Initializing secure chat...</p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col items-center gap-2"
        >
          <MessageCircle className="text-yellow-400 w-7 h-7" />
          <p className="text-yellow-200/90 text-sm">
            Chat window ready. Click the chat icon to start chatting with Marcus.
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default LiveSupport;
