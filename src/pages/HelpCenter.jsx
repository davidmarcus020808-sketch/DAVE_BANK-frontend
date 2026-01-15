import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, ChevronRight, BookOpen, Users, ShieldCheck } from "lucide-react";
import Footer from "../components/Footer"; // import your footer

const faqs = [
  {
    question: "How do I reset my password?",
    answer: "Click on 'Forgot Password' on the login page and follow the instructions sent to your registered email."
  },
  {
    question: "How do I transfer money to another account?",
    answer: "Navigate to the 'Transfer' section in your dashboard, select the recipient, and complete the transfer securely."
  },
  {
    question: "Is my account secure?",
    answer: "Yes! DAVE BANK uses bank-grade encryption, two-factor authentication, and monitored servers to keep your data safe."
  },
];

const HELP_CENTER_LINK = "https://davebank.tawk.help/article/davebank";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15
    }
  }
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const HelpCenter = () => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleFAQ = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const goToHelpCenter = () => {
    window.location.href = HELP_CENTER_LINK;
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-yellow-400">
      <div className="flex-grow px-6 py-12 flex flex-col items-center justify-start relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,215,0,0.06)_0%,transparent_80%)] pointer-events-none" />

        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="max-w-4xl w-full text-center mb-12"
        >
          <motion.div variants={fadeInUp} className="flex justify-center mb-4">
            <div className="bg-yellow-500/20 p-6 rounded-full shadow-lg">
              <HelpCircle className="text-yellow-400 w-12 h-12 animate-bounce" />
            </div>
          </motion.div>

          <motion.h1 variants={fadeInUp} className="text-4xl md:text-5xl font-extrabold text-yellow-400 mb-3 tracking-wide">
            DAVE BANK Help Center
          </motion.h1>

          <motion.p variants={fadeInUp} className="text-yellow-200/90 text-base md:text-lg leading-relaxed mb-6">
            Browse articles, FAQs, and guides to help you manage your banking securely. Quick support is just a click away.
          </motion.p>

          {/* Help Center Button */}
          <motion.button
            variants={fadeInUp}
            onClick={goToHelpCenter}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-yellow-400 text-black font-semibold px-6 py-3 rounded-xl shadow-lg hover:bg-yellow-500 transition-colors"
          >
            Visit Full Help Center
          </motion.button>
        </motion.div>

        {/* Categories Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          {[{
            icon: BookOpen,
            title: "Account Guides",
            description: "Step-by-step instructions for all banking operations."
          },{
            icon: Users,
            title: "Customer Support",
            description: "Learn how to reach out to our agents for help."
          },{
            icon: ShieldCheck,
            title: "Security & Privacy",
            description: "Everything you need to know about keeping your account safe."
          }].map((cat, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(255,215,0,0.3)" }}
              className="bg-white/5 backdrop-blur-xl border border-yellow-600/30 rounded-2xl p-6 flex flex-col items-center text-center shadow-[0_0_20px_rgba(255,215,0,0.1)] cursor-pointer transition-all duration-300"
            >
              <cat.icon className="w-10 h-10 text-yellow-400 mb-3" />
              <h3 className="text-lg font-semibold text-yellow-300 mb-1">{cat.title}</h3>
              <p className="text-yellow-200/80 text-sm">{cat.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="max-w-4xl w-full mb-12"
        >
          <motion.h2 variants={fadeInUp} className="text-2xl font-bold text-yellow-400 mb-6 text-center">Frequently Asked Questions</motion.h2>
          <div className="flex flex-col gap-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(255,215,0,0.3)" }}
                className="bg-white/5 backdrop-blur-xl border border-yellow-600/20 rounded-2xl p-5 shadow-[0_0_15px_rgba(255,215,0,0.08)] transition-all duration-300"
              >
                <div className="flex items-center justify-between cursor-pointer">
                  <button
                    className="text-yellow-300 font-semibold text-left flex-1"
                    onClick={() => window.location.href = HELP_CENTER_LINK}
                  >
                    {faq.question}
                  </button>
                  <button
                    className="text-yellow-400"
                    onClick={() => toggleFAQ(index)}
                  >
                    <ChevronRight className={`w-5 h-5 transform transition-transform ${expandedIndex === index ? "rotate-90" : ""}`} />
                  </button>
                </div>

                <AnimatePresence>
                  {expandedIndex === index && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-yellow-200/80 mt-2 text-sm"
                    >
                      {faq.answer}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Footer tip */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-yellow-300/80 text-sm text-center max-w-md mb-6"
        >
          For instant help, click the chat icon at the bottom-right to connect with our live support team.
        </motion.div>
      </div>

      {/* Import Footer */}
      <Footer />
    </div>
  );
};

export default HelpCenter;
