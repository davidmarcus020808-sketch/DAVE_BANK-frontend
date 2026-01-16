import React, { useState } from "react";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  Globe,
} from "lucide-react";
import { useToast } from "../context/ToastContext";

const Footer = () => {
  const { showToast } = useToast();
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();

    if (!email.trim() || !email.includes("@")) {
      showToast("error", "Please enter a valid email address.");
      return;
    }

    showToast("success", "You’ve subscribed successfully! 🎉");
    setEmail("");
  };

  return (
    <footer className="w-full bg-gradient-to-r from-black via-[#0a0a0a] to-black text-yellow-400 border-t border-yellow-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 text-sm">
        {/* Branding */}
        <div className="flex flex-col gap-1 sm:gap-2">
          <h2 className="text-lg sm:text-2xl font-semibold tracking-tight text-yellow-300">
            DAVEBANK
          </h2>
          <p className="text-yellow-200/70 text-xs sm:text-sm leading-snug">
            Your trusted partner in financial growth.
          </p>
          <div className="flex gap-2 mt-1 sm:mt-2">
            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="opacity-75 hover:opacity-100 transition"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-semibold text-yellow-300">Contact Us</h3>
          <ul className="space-y-1 text-yellow-200/80 text-xs sm:text-sm">
            <li className="flex items-center gap-1"><Phone size={14} /> +1 (234) 567-890</li>
            <li className="flex items-center gap-1"><Mail size={14} /> support@davebank.com</li>
            <li className="text-xs sm:text-sm">123 Finance St, Lagos, Nigeria</li>
          </ul>
          <a
            href="/contact"
            className="text-xs sm:text-sm mt-1 text-yellow-300 hover:text-yellow-200 transition"
          >
            Contact Form →
          </a>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-semibold text-yellow-300">Quick Links</h3>
          <ul className="space-y-1 text-yellow-200/80 text-xs sm:text-sm">
            {[
              { name: "About Us", link: "/about" },
              { name: "Careers", link: "/careers" },
              { name: "Investor Relations", link: "/investors" },
              { name: "Privacy Policy", link: "/privacy" },
              { name: "Terms of Service", link: "/terms" },
              { name: "FAQs", link: "/faqs" },
            ].map((item) => (
              <li key={item.link}>
                <a href={item.link} className="hover:text-yellow-200 transition text-xs sm:text-sm">
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter & Security */}
        <div className="flex flex-col gap-1 sm:gap-2">
          <h3 className="text-sm font-semibold text-yellow-300">Stay Updated</h3>
          <form onSubmit={handleSubscribe} className="flex flex-col gap-1 sm:gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="p-1 sm:p-2 rounded-md text-gray-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 shadow-[0_0_5px_rgba(255,215,0,0.2)] transition-all duration-200"
            />
            <button
              type="submit"
              className="bg-yellow-400 text-black text-xs sm:text-sm font-semibold py-1 sm:py-2 rounded-md hover:bg-yellow-300 hover:shadow-[0_0_8px_rgba(255,215,0,0.5)] transition-all duration-200"
            >
              Subscribe
            </button>
          </form>

          <div className="mt-1 sm:mt-4 border-t border-yellow-500/20 pt-1 sm:pt-2 text-xs sm:text-sm text-yellow-200/70">
            <p>🔒 SSL Secured | Trusted Transactions</p>
            <p>🏆 Best Digital Bank 2025</p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-yellow-500/20 px-4 sm:px-6 lg:px-8 py-1 sm:py-2 text-xs sm:text-sm text-yellow-300/80 flex flex-col sm:flex-row justify-between items-center gap-1 sm:gap-0">
        <p>© {new Date().getFullYear()} DAVEBANK. All rights reserved.</p>
        <div className="flex items-center gap-2 sm:gap-4 mt-1 sm:mt-0">
          <a href="/privacy" className="hover:text-yellow-200 transition">Privacy</a>
          <a href="/terms" className="hover:text-yellow-200 transition">Terms</a>
          <a href="#" className="flex items-center gap-1 hover:text-yellow-200 transition">
            <Globe size={12} /> English
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
