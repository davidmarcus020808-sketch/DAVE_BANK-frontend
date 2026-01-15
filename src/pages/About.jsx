// src/pages/About.jsx
import React from "react";
import { ArrowLeft, Info, ShieldCheck, CreditCard, Smartphone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-black text-yellow-50">
      {/* Content */}
      <div className="flex-1 px-6 py-8">
        {/* Header */}
        <div className="flex items-center mb-10">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-yellow-400 hover:text-yellow-300"
          >
            <ArrowLeft className="mr-2" /> Back
          </button>
          <h1 className="text-3xl font-bold ml-4 flex items-center gap-2">
            <Info /> About
          </h1>
        </div>

        {/* Page Cards */}
        <div className="space-y-8">
          {/* App Logo & Name */}
          <div className="flex flex-col items-center gap-4 w-full max-w-md md:max-w-2xl mx-auto">
            <div className="w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center text-black font-bold text-2xl">
              DB
            </div>
            <h2 className="text-2xl font-bold">DAVEBANK</h2>
            <p className="text-yellow-300">Version 1.0.0</p>
          </div>

          {/* Mission & Vision */}
          <div className="bg-[#111]/80 border border-yellow-800/40 rounded-2xl p-6 hover:shadow-[0_0_15px_rgba(255,215,0,0.3)] transition w-full max-w-md md:max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold mb-2">Our Mission & Vision</h3>
            <p className="text-yellow-200 mb-2">
              DAVEBANK is committed to providing secure, fast, and convenient digital banking services to help you manage your finances efficiently.
            </p>
            <p className="text-yellow-200">
              Our vision is to be the most trusted mobile banking platform, empowering users to take control of their money anytime, anywhere.
            </p>
          </div>

          {/* Key Features */}
          <div className="bg-[#111]/80 border border-yellow-800/40 rounded-2xl p-6 hover:shadow-[0_0_15px_rgba(255,215,0,0.3)] transition w-full max-w-md md:max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold mb-4">Key Features</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2"><Smartphone className="text-yellow-400" /> Mobile-first banking experience</li>
              <li className="flex items-center gap-2"><CreditCard className="text-yellow-400" /> Instant transfers and bill payments</li>
              <li className="flex items-center gap-2"><ShieldCheck className="text-yellow-400" /> Advanced security with 2FA and biometrics</li>
              <li className="flex items-center gap-2"><Info className="text-yellow-400" /> Transparent transaction history and notifications</li>
            </ul>
          </div>

          {/* Security Highlight */}
          <div className="bg-[#111]/80 border border-yellow-800/40 rounded-2xl p-6 hover:shadow-[0_0_15px_rgba(255,215,0,0.3)] transition w-full max-w-md md:max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold mb-2">Security First</h3>
            <p className="text-yellow-200">
              We use bank-grade encryption, two-factor authentication, and biometric security to protect your data and funds. Your security is our top priority.
            </p>
          </div>

          {/* Developer Info & Support */}
          <div className="bg-[#111]/80 border border-yellow-800/40 rounded-2xl p-6 hover:shadow-[0_0_15px_rgba(255,215,0,0.3)] transition w-full max-w-md md:max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold mb-2">Developer & Support</h3>
            <p className="text-yellow-200 mb-2">Developed by David Marcus.</p>
            <p className="text-yellow-200">
              For inquiries, feedback, or support, contact us at: <span className="text-yellow-400">support@davebank.com</span>
            </p>
          </div>

          {/* Terms & Privacy */}
          <div
            className="bg-[#111]/80 border border-yellow-800/40 rounded-2xl p-6 hover:shadow-[0_0_15px_rgba(255,215,0,0.3)] transition cursor-pointer w-full max-w-md md:max-w-2xl mx-auto"
            onClick={() => navigate("/terms")}
          >
            <h3 className="text-xl font-semibold">Terms & Privacy</h3>
            <p className="text-yellow-200">Read our terms of service and privacy policy.</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default About;
