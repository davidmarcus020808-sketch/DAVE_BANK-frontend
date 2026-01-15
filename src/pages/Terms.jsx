// src/pages/Terms.jsx
import React, { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { motion, AnimatePresence } from "framer-motion";


const FadeSection = ({ children, delay = 0 }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    if (inView) controls.start({ opacity: 1, y: 0 });
  }, [inView, controls]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={controls}
      transition={{ duration: 0.6, delay }}
      className="pb-10 border-b border-yellow-700/20"
    >
      {children}
    </motion.div>
  );
};

const Terms = () => {
  const navigate = useNavigate();

  const sections = [
    {
      title: "1. Introduction",
      text: `Welcome to DAVE BANK — the next generation of secure, digital banking built to empower your financial life. These Terms & Conditions ("Terms") govern your access and use of DAVE BANK’s mobile and web applications, transfers, cards, and digital wallet services.`,
    },
    {
      title: "2. Definitions",
      text: `"We", "Us", or "Our" means DAVE BANK. "You" refers to the customer or user. "Account" means any electronic wallet or account you open with us. "Services" include all digital products and features provided through DAVE BANK.`,
    },
    {
      title: "3. Eligibility",
      text: `You must be at least 18 years old, reside in Nigeria, and provide valid identification to register. DAVE BANK may reject or close accounts that fail verification or provide false information.`,
    },
    {
      title: "4. Know Your Customer (KYC)",
      text: `We comply with the Central Bank of Nigeria’s KYC and AML policies. During registration, we may request BVN, NIN, or any other valid identification. Accounts without full verification may have limited features.`,
    },
    {
      title: "5. Account Security",
      text: `Your PIN, password, and OTP are private. Never disclose them. DAVE BANK will never ask for your PIN or OTP via phone or email. Any loss due to disclosure of your credentials is your responsibility.`,
    },
    {
      title: "6. Transactions",
      text: `All transactions are processed in real time and are final once confirmed. Ensure all account numbers and recipient details are correct. DAVE BANK will not be liable for incorrect transfers caused by user error.`,
    },
    {
      title: "7. Fees and Limits",
      text: `Transaction fees, limits, and charges are displayed in-app and may vary by service type. We reserve the right to adjust limits or apply new fees with prior notice.`,
    },
    {
      title: "8. Account Suspension or Closure",
      text: `We may suspend or terminate your account for reasons including suspected fraud, AML violations, or breach of these Terms. You may also request closure at any time after clearing all outstanding transactions.`,
    },
    {
      title: "9. Data Protection and Privacy",
      text: `We collect, store, and process your data under Nigeria’s Data Protection Regulation (NDPR). DAVE BANK ensures all user information remains confidential and protected from unauthorized access.`,
    },
    {
      title: "10. Service Availability",
      text: `While DAVE BANK strives for 24/7 uptime, certain services may experience maintenance downtime. We’ll communicate significant outages when possible.`,
    },
    {
      title: "11. Third-Party Integrations",
      text: `Some DAVE BANK features depend on third-party providers for mobile top-up, betting, and bill payments. We are not responsible for failures caused by external partners, though we’ll assist in dispute resolution.`,
    },
    {
      title: "12. Interest and Rewards",
      text: `DAVE BANK may offer promotional interests, cashback, or rewards programs. These are subject to specific terms and may be modified or discontinued at any time.`,
    },
    {
      title: "13. Anti-Money Laundering (AML)",
      text: `We monitor all transactions to prevent money laundering, terrorism financing, or illegal use. Suspicious activity may lead to account freezing and reports to regulatory bodies.`,
    },
    {
      title: "14. Dispute Resolution",
      text: `All disputes shall first be reported to our support team via in-app chat or email. If unresolved, disputes will be governed by Nigerian law and settled under the jurisdiction of Lagos State courts.`,
    },
    {
      title: "15. Communication and Notices",
      text: `We may contact you through SMS, push notifications, or email. Notices are deemed received once sent to your registered contact details.`,
    },
    {
      title: "16. Updates to Terms",
      text: `We may revise these Terms occasionally. Continued use of DAVE BANK means you accept any updates. Always review our Terms to stay informed.`,
    },
    {
      title: "17. Intellectual Property",
      text: `All content, software, branding, and designs are property of DAVE BANK. You may not copy, modify, or reuse any materials without our written consent.`,
    },
    {
      title: "18. Governing Law",
      text: `These Terms are governed by the laws of the Federal Republic of Nigeria.`,
    },
    {
      title: "19. Contact Us",
      text: `📞 +234 913 642 1103  
📧 support@davebank.ng  
📍 Lagos, Nigeria`,
    },
  ];

  return (
    <div className="min-h-screen w-full bg-black text-yellow-50 overflow-y-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-20 bg-black/80 backdrop-blur-sm border-b border-yellow-900/40 py-6 px-8 flex items-center justify-between"
      >
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-yellow-400 hover:text-yellow-200 transition"
        >
          <ArrowLeft className="mr-2" size={20} />
          Back
        </button>

        <h1 className="text-2xl font-bold text-yellow-400 tracking-wide">
          Terms & Conditions
        </h1>
      </motion.div>

      {/* Hero Section */}
      <div className="text-center py-14 px-6">
        <h1 className="text-6xl font-extrabold text-yellow-400 drop-shadow-[0_0_30px_rgba(255,215,0,0.25)]">
          DAVE BANK
        </h1>
        <p className="text-yellow-300/70 text-sm mt-3">
          Effective Date: October 21, 2025 <br />
          Registered Office: Lagos, Nigeria
        </p>
      </div>

      {/* Full-Width Content */}
      <div className="w-full px-[8vw] md:px-[10vw] lg:px-[15vw] xl:px-[20vw] space-y-10 pb-24">
        {sections.map((section, i) => (
          <FadeSection key={i} delay={i * 0.05}>
            <h2 className="text-2xl md:text-3xl font-semibold text-yellow-300 mb-3">
              {section.title}
            </h2>
            <p className="text-yellow-100/80 text-lg leading-relaxed">
              {section.text}
            </p>
          </FadeSection>
        ))}
      </div>

      {/* Footer */}
      <footer className="text-center text-xs text-yellow-600/60 py-6 border-t border-yellow-900/40">
        © {new Date().getFullYear()} DAVE BANK. All Rights Reserved.
      </footer>
    </div>
  );
};

export default Terms;
