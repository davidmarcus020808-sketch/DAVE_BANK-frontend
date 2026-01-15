// src/pages/AccountDetailsView.jsx
import React, { useState, useContext } from "react";
import { Shield, ChevronRight, Settings, Eye, EyeOff } from "lucide-react";
import { AccountContext } from "../context/AccountContext";

const AccountDetailsView = () => {
  const { account } = useContext(AccountContext); // ✅ use context
  const [showBalance, setShowBalance] = useState(true);

  // If you want interest from context/API later, you can add it here
  const interest = 0.09;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-4 flex flex-col items-center">
      {/* Header */}
      <div className="w-full max-w-md bg-white shadow-sm rounded-2xl p-4 relative">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">Hi, {account.name || "Loading..."}</h2>
            <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">
              {account.tier || "Tier 1"}
            </span>
          </div>
          <Settings size={20} className="text-gray-500" />
        </div>

        {/* Balance Section */}
        <div className="mt-4">
          <p className="text-sm text-gray-500 flex items-center">
            Total Balance
            <button
              onClick={() => setShowBalance(!showBalance)}
              className="ml-2 text-gray-600"
            >
              {showBalance ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>
          </p>
          <h1 className="text-3xl font-bold mt-1">
            ₦{showBalance ? (account.balance || 0).toFixed(2) : "••••"}
          </h1>
          <p className="text-xs text-green-500 mt-1">
            Interest Credited Today +₦{interest.toFixed(2)}
          </p>
        </div>

        {/* Verified Icon */}
        <div className="absolute top-5 right-16 bg-green-100 p-3 rounded-full">
          <Shield size={22} className="text-green-500" />
        </div>
      </div>

      {/* Safety Card */}
      <div className="w-full max-w-md mt-3">
        <div className="bg-gradient-to-r from-green-400 to-green-500 text-white rounded-xl p-3 flex justify-between items-center">
          <div>
            <p className="text-sm font-semibold">7 Safety Tips</p>
            <p className="text-xs text-green-100">
              Make your account more secure.
            </p>
          </div>
          <button className="bg-white text-green-600 font-semibold px-3 py-1 rounded-lg text-sm">
            View
          </button>
        </div>
      </div>

      {/* Account Options */}
      <div className="w-full max-w-md mt-4 space-y-3">
        <OptionItem icon="📜" title="Transaction History" subtitle="View past transactions" />
        <OptionItem icon="📊" title="Account Limits" subtitle="View your transaction limits" />
        <OptionItem icon="💳" title="Bank Card/Account" subtitle="Add payment option" />
        <OptionItem icon="🛡️" title="Security Center" subtitle="Protect your funds" />
        <OptionItem icon="☎️" title="Customer Service Center" subtitle="Contact support" />
      </div>
    </div>
  );
};

const OptionItem = ({ icon, title, subtitle }) => (
  <div className="bg-white shadow-sm rounded-xl p-3 flex items-center justify-between">
    <div className="flex items-center gap-3">
      <div className="text-2xl">{icon}</div>
      <div>
        <p className="font-semibold text-sm">{title}</p>
        <p className="text-xs text-gray-500">{subtitle}</p>
      </div>
    </div>
    <ChevronRight size={18} className="text-gray-400" />
  </div>
);

export default AccountDetailsView;
