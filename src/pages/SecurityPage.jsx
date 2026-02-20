// src/pages/SecurityPage.jsx
import React from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Lock,
  Fingerprint,
  KeyRound,
  Globe,
  ShieldAlert,
  Server,
} from "lucide-react";

const securityFeatures = [
  {
    icon: ShieldCheck,
    title: "Bank-Grade Encryption",
    description:
      "All data transferred between you and DAVE BANK is protected with 256-bit SSL encryption, the same level used by global banks.",
  },
  {
    icon: Fingerprint,
    title: "Two-Factor Authentication",
    description:
      "We use multi-factor authentication to ensure only you can access your account, even if your password is compromised.",
  },
  {
    icon: Lock,
    title: "Fraud Monitoring",
    description:
      "Our intelligent AI system monitors transactions 24/7 to detect and block suspicious activities in real time.",
  },
  {
    icon: KeyRound,
    title: "Secure Infrastructure",
    description:
      "Your data is stored on PCI-DSS compliant servers with full encryption at rest and advanced firewall protection.",
  },
  {
    icon: Server,
    title: "Regular Security Audits",
    description:
      "We partner with leading cybersecurity firms to perform frequent penetration tests and code reviews.",
  },
  {
    icon: ShieldAlert,
    title: "Customer Protection",
    description:
      "We guarantee your funds are safe and insured under DAVE BANK’s security coverage policies.",
  },
];

const SecurityPage = () => {
  return (
    <div className="min-h-screen bg-black text-yellow-400 flex flex-col items-center px-4 sm:px-6 md:px-12 py-12 sm:py-16">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl text-center mb-12 px-2 sm:px-0"
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-yellow-300">
          Your Security, Our Priority 🔒
        </h1>
        <p className="text-yellow-200/80 text-sm sm:text-base md:text-lg leading-relaxed">
          DAVE BANK was built with a security-first approach. Every transaction,
          login, and account action is protected by multiple layers of
          enterprise-grade security.
        </p>
      </motion.div>

      {/* Security Features Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl w-full">
        {securityFeatures.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white/5 backdrop-blur-lg border border-yellow-600/20 p-4 sm:p-6 rounded-3xl shadow-lg hover:border-yellow-400/40 transition"
          >
            <div className="bg-yellow-400/10 w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-2xl mb-3 sm:mb-4">
              <item.icon className="text-yellow-400 w-5 h-5 sm:w-7 sm:h-7" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2 text-yellow-300">
              {item.title}
            </h3>
            <p className="text-yellow-200/70 text-xs sm:text-sm md:text-sm leading-relaxed">
              {item.description}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Bottom Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-12 sm:mt-16 text-center max-w-2xl px-2 sm:px-0"
      >
        <Globe className="w-8 sm:w-10 h-8 sm:h-10 mx-auto mb-2 sm:mb-3 text-yellow-400" />
        <p className="text-yellow-300 font-medium text-base sm:text-lg mb-1 sm:mb-2">
          Compliant & Transparent
        </p>
        <p className="text-yellow-200/70 text-xs sm:text-sm md:text-sm">
          DAVE BANK complies with NDIC and CBN guidelines, maintaining full
          transparency with our customers and regulators.
        </p>
      </motion.div>
    </div>
  );
};

export default SecurityPage;
