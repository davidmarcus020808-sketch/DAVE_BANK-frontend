// src/components/Footer.jsx
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

    // Simulate successful subscription
    showToast("success", "You’ve subscribed successfully! 🎉");
    setEmail("");
  };

  return (
    <footer className="w-full bg-gradient-to-r from-black via-[#0a0a0a] to-black text-yellow-400 pt-6 pb-4 border-t border-yellow-500/20">
      <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
        {/* Branding */}
        <div>
          <h2 className="text-2xl font-semibold tracking-tight mb-2 text-yellow-300">
            DAVEBANK
          </h2>
          <p className="text-yellow-200/70 text-xs leading-relaxed mb-3">
            Your trusted partner in financial growth.
          </p>
          <div className="flex gap-3 mt-3">
            <a
              href="#"
              className="opacity-75 hover:opacity-100 transition"
            >
              <Facebook size={16} />
            </a>
            <a
              href="#"
              className="opacity-75 hover:opacity-100 transition"
            >
              <Twitter size={16} />
            </a>
            <a
              href="#"
              className="opacity-75 hover:opacity-100 transition"
            >
              <Instagram size={16} />
            </a>
            <a
              href="#"
              className="opacity-75 hover:opacity-100 transition"
            >
              <Linkedin size={16} />
            </a>
          </div>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-sm font-semibold mb-2 text-yellow-300">
            Contact Us
          </h3>
          <ul className="space-y-1 text-yellow-200/80">
            <li className="flex items-center gap-2">
              <Phone size={14} /> +1 (234) 567-890
            </li>
            <li className="flex items-center gap-2">
              <Mail size={14} /> support@davebank.com
            </li>
            <li>123 Finance St, Lagos, Nigeria</li>
          </ul>
          <a
            href="/contact"
            className="inline-block text-xs mt-2 text-yellow-300 hover:text-yellow-200 transition"
          >
            Contact Form →
          </a>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-sm font-semibold mb-2 text-yellow-300">
            Quick Links
          </h3>
          <ul className="space-y-1 text-yellow-200/80">
            <li>
              <a href="/about" className="hover:text-yellow-200 transition">
                About Us
              </a>
            </li>
            <li>
              <a href="/careers" className="hover:text-yellow-200 transition">
                Careers
              </a>
            </li>
            <li>
              <a href="/investors" className="hover:text-yellow-200 transition">
                Investor Relations
              </a>
            </li>
            <li>
              <a href="/privacy" className="hover:text-yellow-200 transition">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="/terms" className="hover:text-yellow-200 transition">
                Terms of Service
              </a>
            </li>
            <li>
              <a href="/faqs" className="hover:text-yellow-200 transition">
                FAQs
              </a>
            </li>
          </ul>
        </div>

        {/* Newsletter & Security */}
        <div>
          <h3 className="text-sm font-semibold mb-2 text-yellow-300">
            Stay Updated
          </h3>
          <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="p-2 rounded-md text-gray-900 text-xs focus:outline-none focus:ring-2 focus:ring-yellow-500 shadow-[0_0_10px_rgba(255,215,0,0.3)] focus:shadow-[0_0_15px_rgba(255,215,0,0.6)] transition-all duration-300"
            />
            <button
              type="submit"
              className="bg-yellow-400 text-black text-xs font-semibold py-2 rounded-md hover:bg-yellow-300 hover:shadow-[0_0_15px_rgba(255,215,0,0.8)] transition-all duration-300"
            >
              Subscribe
            </button>
          </form>

          <div className="mt-4 border-t border-yellow-500/20 pt-3">
            <p className="text-xs text-yellow-200/80">
              🔒 SSL Secured | Trusted Transactions
            </p>
            <p className="text-xs text-yellow-200/70 mt-1">
              🏆 Best Digital Bank 2025
            </p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-yellow-500/20 mt-6 pt-3 text-xs text-yellow-300/80 flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto px-8">
        <p>© {new Date().getFullYear()} DAVEBANK. All rights reserved.</p>
        <div className="flex items-center gap-4 mt-2 md:mt-0">
          <a href="/privacy" className="hover:text-yellow-200 transition">
            Privacy
          </a>
          <a href="/terms" className="hover:text-yellow-200 transition">
            Terms
          </a>
          <a
            href="#"
            className="flex items-center gap-1 hover:text-yellow-200 transition"
          >
            <Globe size={12} /> English
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
